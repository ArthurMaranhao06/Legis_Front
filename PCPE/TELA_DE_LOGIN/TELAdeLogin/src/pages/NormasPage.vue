<template>
  <q-page>
    <div class="q-pa-md">
      <q-card>
        <q-card-section>
          <div class="text-h5">Normas</div>
        </q-card-section>

        <q-card-section>
          <q-input
            filled
            dense
            placeholder="Pesquisar"
            v-model="search"
            @update:model-value="filterRows"
            class="q-mb-sm"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn
            flat
            dense
            round
            icon="filter_alt"
            :label="filterLabel"
            :style="{ color: isDarkMode ? 'white' : 'black' }"
            @click="toggleFilterDrawer"
          />
        </q-card-section>

        <q-table
          :rows="filteredRows"
          :columns="columns"
          row-key="id"
          flat
          dense
          separator="horizontal"
        >
          <template v-slot:top-right>
            <q-btn icon="add" color="primary" label="Adicionar" @click="openAddNormDialog" />
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td align="center" class="q-pa-none">
              <div style="display: flex; align-items: center; justify-content: center; gap: 6px">
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  :style="{
                    backgroundColor: 'orange',
                    color: 'white',
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }"
                  @click="editNorm(props.row)"
                />
                <q-btn
                  flat
                  dense
                  round
                  icon="delete"
                  :style="{
                    backgroundColor: 'red',
                    color: 'white',
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }"
                  @click="deleteNorm(props.row)"
                />
                <q-btn
                  flat
                  dense
                  round
                  icon="picture_as_pdf"
                  :style="{
                    backgroundColor: 'blue',
                    color: 'white',
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }"
                  @click="viewPdf(props.row)"
                  :disabled="!props.row.pdfUrl"
                />
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card>
    </div>

    <!-- Drawer para Filtros -->
    <q-drawer v-model="filterDrawerOpen" side="right" bordered overlay>
      <q-list>
        <q-item-label class="text-h6 q-pa-md">Filtros</q-item-label>

        <q-expansion-item label="Status" expand-separator dense default-opened>
          <q-checkbox
            v-for="option in statusFilterOptions"
            :key="option.value"
            v-model="selectedStatusFilters"
            :val="option.value"
            :label="option.label"
            dense
          />
        </q-expansion-item>

        <q-expansion-item label="Tipo de Documento" expand-separator dense>
          <q-checkbox
            v-for="type in documentTypes"
            :key="type"
            v-model="selectedTypeFilters"
            :val="type"
            :label="type"
            dense
          />
        </q-expansion-item>

        <q-expansion-item label="Órgão Emissor" expand-separator dense>
          <q-checkbox
            v-for="orgao in orgaoOptions"
            :key="orgao"
            v-model="selectedOrgaoFilters"
            :val="orgao"
            :label="orgao"
            dense
          />
        </q-expansion-item>

        <q-item>
          <q-btn
            flat
            label="Aplicar Filtros"
            color="primary"
            @click="applyFilters"
            class="q-mt-md full-width"
          />
        </q-item>
        <q-item>
          <q-btn
            flat
            label="Remover Filtros"
            color="negative"
            @click="clearFilters"
            class="q-mt-md full-width"
          />
        </q-item>
        <q-item>
          <q-btn
            flat
            label="Fechar"
            color="primary"
            @click="toggleFilterDrawer"
            class="q-mt-md full-width"
          />
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Diálogo para Adicionar/Editar Norma -->
    <q-dialog v-model="addNormDialog">
      <q-card style="min-width: 600px">
        <q-card-section>
          <div class="text-h6">{{ isEditing ? 'Editar' : 'Adicionar' }} Norma</div>
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-select
                v-model="newNorm.orgao"
                :options="orgaoOptions"
                label="Órgão Emissor *"
                filled
                dense
                use-input
                input-debounce="0"
                class="q-mb-sm"
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>

            <div class="col-md-6 col-12">
              <q-select
                v-model="newNorm.tipo"
                :options="documentTypes"
                label="Tipo de Documento *"
                filled
                dense
                class="q-mb-sm"
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>

            <div class="col-md-6 col-12">
              <q-input
                v-model="newNorm.numero"
                label="Número *"
                filled
                dense
                class="q-mb-sm"
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>

            <div class="col-md-6 col-12">
              <q-input
                v-model="newNorm.data"
                label="Data *"
                type="date"
                filled
                dense
                class="q-mb-sm"
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>

            <div class="col-md-6 col-12">
              <q-select
                v-model="newNorm.status"
                :options="statusFilterOptions"
                option-value="value"
                option-label="label"
                label="Status *"
                filled
                dense
                class="q-mb-sm"
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="newNorm.ementa"
                label="Ementa *"
                type="textarea"
                filled
                dense
                class="q-mb-sm"
                :rules="[(val) => !!val || 'Campo obrigatório']"
                autogrow
              />
            </div>

            <div class="col-12">
              <q-file
                v-model="pdfFile"
                label="Arquivo PDF"
                filled
                dense
                accept=".pdf"
                :hint="
                  isEditing && newNorm.pdfUrl
                    ? 'PDF já anexado. Carregue novo para substituir.'
                    : 'Máximo 10MB'
                "
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
                <template v-slot:append v-if="pdfFile">
                  <q-icon name="close" @click.stop="pdfFile = null" class="cursor-pointer" />
                </template>
              </q-file>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" @click="cancelDialog" />
          <q-btn
            flat
            :label="isEditing ? 'Salvar' : 'Adicionar'"
            color="primary"
            @click="addNorm"
            :disabled="!isFormValid"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Diálogo de Confirmação para Exclusão -->
    <q-dialog v-model="confirmDialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">Tem certeza que deseja excluir esta norma?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Excluir" color="negative" @click="confirmDelete" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Diálogo para Visualização de PDF -->
    <q-dialog v-model="pdfViewDialog" full-width>
      <q-card style="width: 90vw; max-height: 90vh">
        <q-card-section>
          <div class="row items-center justify-between">
            <div class="text-h6">Visualizar Documento</div>
            <q-btn flat round icon="close" v-close-popup />
          </div>
        </q-card-section>

        <q-card-section v-if="currentNorm">
          <div class="q-mb-md">
            <div class="text-subtitle1 q-mb-xs">
              {{ currentNorm.tipo }} {{ currentNorm.numero }}
            </div>
            <div class="text-subtitle2 q-mb-md">
              {{ currentNorm.orgao }} - {{ formatDate(currentNorm.data) }}
            </div>
            <q-badge :color="getStatusColor(currentNorm.status)" class="q-mr-sm">
              {{ currentNorm.status }}
            </q-badge>
          </div>

          <div class="text-body1 q-mb-lg">{{ currentNorm.ementa }}</div>

          <div class="pdf-container" style="height: 60vh; overflow: auto; border: 1px solid #ddd">
            <div v-if="currentNorm.pdfUrl" class="flex flex-center" style="height: 100%">
              <q-img
                src="/api/placeholder/600/800"
                style="max-height: 100%; max-width: 100%"
                alt="Visualização do PDF"
              >
                <div class="absolute-full flex flex-center column">
                  <q-icon name="picture_as_pdf" size="4rem" color="primary" />
                  <div class="text-subtitle1 q-mt-sm text-center">
                    {{ currentNorm.tipo }} {{ currentNorm.numero }} - Visualização do documento
                  </div>
                </div>
              </q-img>
            </div>
            <div v-else class="flex flex-center column" style="height: 100%">
              <q-icon name="warning" size="4rem" color="warning" />
              <div class="text-subtitle1 q-mt-sm text-center">
                Nenhum PDF anexado a este documento.
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Fechar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Baixar"
            color="positive"
            icon="download"
            @click="downloadPdf"
            :disabled="!currentNorm || !currentNorm.pdfUrl"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Dark, Notify } from 'quasar'

const search = ref('')
const selectedStatusFilters = ref([])
const selectedTypeFilters = ref([])
const selectedOrgaoFilters = ref([])
const filterDrawerOpen = ref(false)
const addNormDialog = ref(false)
const confirmDialog = ref(false)
const pdfViewDialog = ref(false)
const isEditing = ref(false)
const editingNormId = ref(null)
const normToDelete = ref(null)
const currentNorm = ref(null)
const pdfFile = ref(null)

const rows = ref([])
const filteredRows = ref([])
const columns = [
  { name: 'orgao', label: 'Órgão', align: 'left', field: 'orgao' },
  { name: 'tipo', label: 'Tipo de Documento', align: 'left', field: 'tipo' },
  { name: 'numero', label: 'Número', align: 'left', field: 'numero' },
  { name: 'data', label: 'Data', align: 'left', field: 'data', format: (val) => formatDate(val) },
  { name: 'ementa', label: 'Ementa', align: 'left', field: 'ementa' },
  {
    name: 'status',
    label: 'Status',
    align: 'left',
    field: 'status',
    format: (val) => val,
  },
  { name: 'actions', label: 'Ações', align: 'center' },
]

const documentTypes = [
  'Portaria',
  'Decreto',
  'Resolução',
  'Instrução Normativa',
  'Ofício',
  'Memorando',
  'Circular',
]

const orgaoOptions = [
  'Secretaria de Defesa Social - GAB/SDS',
  'Órgãos em conjunto',
  'Poder Executivo Estadual',
  'Secretaria de Administração',
  'Secretaria de Educação',
  'Secretaria de Saúde',
  'Outro',
]

const statusFilterOptions = [
  { label: 'Publicado', value: 'Publicado' },
  { label: 'Rascunho', value: 'Rascunho' },
  { label: 'Em Revisão', value: 'Em Revisão' },
  { label: 'Arquivado', value: 'Arquivado' },
]

const newNorm = ref({
  orgao: '',
  tipo: '',
  numero: '',
  data: '',
  ementa: '',
  status: '',
  pdfUrl: null,
})

// Computed para verificar se o modo escuro está ativo
const isDarkMode = computed(() => Dark.isActive)

// Label do botão de filtro
const filterLabel = computed(() => 'Filtro')

// Computed para validar o formulário
const isFormValid = computed(() => {
  return (
    newNorm.value.orgao &&
    newNorm.value.tipo &&
    newNorm.value.numero &&
    newNorm.value.data &&
    newNorm.value.status &&
    newNorm.value.ementa
  )
})

// Função para formatar datas
function formatDate(dateString) {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) throw new Error('Data inválida')
    return date.toLocaleDateString('pt-BR')
  } catch (error) {
    console.error(error)
    return 'Data inválida'
  }
}

// Função para obter cor baseado no status
function getStatusColor(status) {
  switch (status) {
    case 'Publicado':
      return 'positive'
    case 'Rascunho':
      return 'warning'
    case 'Em Revisão':
      return 'info'
    case 'Arquivado':
      return 'grey'
    default:
      return 'primary'
  }
}

// Função para filtrar linhas com base na barra de pesquisa
function filterRows() {
  const searchTerm = search.value.trim().toLowerCase()

  filteredRows.value = rows.value.filter((row) => {
    // Filtros laterais
    const matchesStatus =
      selectedStatusFilters.value.length === 0 || selectedStatusFilters.value.includes(row.status)
    const matchesType =
      selectedTypeFilters.value.length === 0 || selectedTypeFilters.value.includes(row.tipo)
    const matchesOrgao =
      selectedOrgaoFilters.value.length === 0 || selectedOrgaoFilters.value.includes(row.orgao)

    // Filtro de pesquisa
    const matchesSearch =
      !searchTerm ||
      row.orgao.toLowerCase().includes(searchTerm) ||
      row.tipo.toLowerCase().includes(searchTerm) ||
      row.numero.toLowerCase().includes(searchTerm) ||
      row.ementa.toLowerCase().includes(searchTerm) ||
      (row.status && row.status.toLowerCase().includes(searchTerm))

    return matchesStatus && matchesType && matchesOrgao && matchesSearch
  })
}

// Sempre use filterRows para aplicar filtros
function applyFilters() {
  filterRows()
}

function clearFilters() {
  selectedStatusFilters.value = []
  selectedTypeFilters.value = []
  selectedOrgaoFilters.value = []
  search.value = ''
  filteredRows.value = [...rows.value]
}

function toggleFilterDrawer() {
  filterDrawerOpen.value = !filterDrawerOpen.value
}

function openAddNormDialog() {
  isEditing.value = false
  resetNewNorm()
  addNormDialog.value = true
}

function addNorm() {
  // Simular upload de PDF
  const hasPdf = !!pdfFile.value
  const pdfUrlValue = hasPdf
    ? URL.createObjectURL(pdfFile.value)
    : isEditing.value
      ? newNorm.value.pdfUrl
      : null

  if (isEditing.value) {
    // Atualizar norma existente
    const index = rows.value.findIndex((row) => row.id === editingNormId.value)
    if (index !== -1) {
      rows.value[index] = {
        ...newNorm.value,
        id: editingNormId.value,
        pdfUrl: pdfUrlValue,
      }

      Notify.create({
        message: 'Norma atualizada com sucesso',
        color: 'positive',
        position: 'top',
        icon: 'check_circle',
      })
    }
    isEditing.value = false
    editingNormId.value = null
  } else {
    // Adicionar nova norma
    const newId = rows.value.length > 0 ? Math.max(...rows.value.map((r) => r.id)) + 1 : 1

    rows.value.push({
      ...newNorm.value,
      id: newId,
      pdfUrl: pdfUrlValue,
    })

    Notify.create({
      message: 'Norma adicionada com sucesso',
      color: 'positive',
      position: 'top',
      icon: 'check_circle',
    })
  }

  filteredRows.value = [...rows.value]
  applyFilters()
  addNormDialog.value = false
  pdfFile.value = null
  resetNewNorm()
}

function resetNewNorm() {
  newNorm.value = {
    orgao: '',
    tipo: '',
    numero: '',
    data: '',
    ementa: '',
    status: '',
    pdfUrl: null,
  }
  pdfFile.value = null
}

function cancelDialog() {
  addNormDialog.value = false
  isEditing.value = false
  editingNormId.value = null
  resetNewNorm()
}

function confirmDelete() {
  if (normToDelete.value) {
    // Remover a norma da lista
    const index = rows.value.findIndex((row) => row.id === normToDelete.value.id)
    if (index !== -1) {
      rows.value.splice(index, 1)
      filteredRows.value = [...rows.value]
      applyFilters()

      Notify.create({
        message: 'Norma excluída com sucesso',
        color: 'info',
        position: 'top',
        icon: 'delete',
      })
    }
    normToDelete.value = null
  }
}

function downloadPdf() {
  if (currentNorm.value && currentNorm.value.pdfUrl) {
    // Em um ambiente real, isso seria um link de download para o arquivo
    // Aqui apenas simulamos a ação
    Notify.create({
      message: `Iniciando download do documento: ${currentNorm.value.tipo} ${currentNorm.value.numero}`,
      color: 'positive',
      position: 'top',
      icon: 'download',
    })
  }
}

// Funções para as ações da tabela
function editNorm(row) {
  // Preencher o objeto de nova norma com os dados da norma a ser editada
  newNorm.value = { ...row }
  editingNormId.value = row.id
  isEditing.value = true
  addNormDialog.value = true
}

function deleteNorm(row) {
  // Mostrar diálogo de confirmação
  confirmDialog.value = true
  normToDelete.value = row
}

function viewPdf(row) {
  pdfViewDialog.value = true
  currentNorm.value = row
}

// Inicializar os dados quando o componente for montado
onMounted(() => {
  // Inicializar com dados de exemplo
  rows.value = [
    {
      id: 1,
      orgao: 'Secretaria de Defesa Social - GAB/SDS',
      tipo: 'Portaria',
      numero: '001/2023',
      data: '2023-01-15',
      ementa:
        'Estabelece procedimentos para organização e funcionamento do Sistema de Segurança Pública Estadual.',
      status: 'Publicado',
      pdfUrl: '/sample-pdf-1.pdf', // Em um ambiente real, seria uma URL para o PDF
    },
    {
      id: 2,
      orgao: 'Poder Executivo Estadual',
      tipo: 'Decreto',
      numero: '48.123',
      data: '2023-03-22',
      ementa:
        'Dispõe sobre a reestruturação administrativa do poder executivo estadual e dá outras providências.',
      status: 'Publicado',
      pdfUrl: '/sample-pdf-2.pdf',
    },
    {
      id: 3,
      orgao: 'Órgãos em conjunto',
      tipo: 'Resolução',
      numero: '012/2023',
      data: '2023-04-10',
      ementa:
        'Regulamenta o uso de equipamentos e sistemas compartilhados entre diferentes órgãos da administração pública estadual.',
      status: 'Rascunho',
      pdfUrl: null,
    },
  ]

  // Inicializar filteredRows com todas as linhas
  filteredRows.value = [...rows.value]
})
</script>

<style scoped>
.pdf-container {
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style>
