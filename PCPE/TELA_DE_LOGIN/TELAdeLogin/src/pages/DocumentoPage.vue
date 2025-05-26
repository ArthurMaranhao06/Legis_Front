<template>
  <q-page>
    <div class="q-pa-md">
      <q-card>
        <q-card-section>
          <div class="text-h5">Tipo de Documento</div>
        </q-card-section>

        <q-card-section>
          <q-input
            filled
            dense
            placeholder="Pesquisar"
            v-model="search"
            @update:model-value="filterRows"
            class="q-mb-sm"
          />
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
          :rows="filteredDocumentos"
          :columns="columns"
          row-key="id"
          flat
          dense
          separator="horizontal"
        >
          <template v-slot:top-right>
            <q-btn icon="add" color="primary" class="q-px-sm" @click="openAddDialog">
              <div class="q-ml-xs">Adicionar</div>
            </q-btn>
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
                  @click="openEditDialog(props.row)"
                />
                <q-btn
                  flat
                  dense
                  round
                  :icon="props.row.status === 'Ativo' ? 'remove' : 'add'"
                  :style="{
                    backgroundColor: props.row.status === 'Ativo' ? 'red' : 'blue',
                    color: 'white',
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }"
                  @click="toggleDocumentoStatus(props.row)"
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
            v-for="option in filterOptions"
            :key="option.value"
            v-model="selectedStatusFilters"
            :val="option.value"
            :label="option.label"
            dense
          />
        </q-expansion-item>

        <q-expansion-item label="Órgão Relacionado" expand-separator dense>
          <q-checkbox
            v-for="orgao in orgaos"
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

    <!-- Dialog para Adicionar -->
    <q-dialog v-model="addDialogOpen" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Adicionar Tipo de Documento</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="newDocumento.descricao"
            label="Descrição"
            dense
            filled
            class="q-mb-md"
          />
          <q-select
            v-model="newDocumento.orgao"
            :options="orgaos"
            label="Órgão Relacionado"
            dense
            filled
            class="q-mb-md"
          />
          <q-select
            v-model="newDocumento.status"
            :options="['Ativo', 'Inativo']"
            label="Status"
            dense
            filled
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Salvar" color="primary" @click="saveNewDocumento" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog para Editar -->
    <q-dialog v-model="editDialogOpen" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Editar Tipo de Documento</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="editingDocumento.descricao"
            label="Descrição"
            dense
            filled
            class="q-mb-md"
          />
          <q-select
            v-model="editingDocumento.orgao"
            :options="orgaos"
            label="Órgão Relacionado"
            dense
            filled
            class="q-mb-md"
          />
          <q-select
            v-model="editingDocumento.status"
            :options="['Ativo', 'Inativo']"
            label="Status"
            dense
            filled
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Salvar" color="primary" @click="saveEditedDocumento" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Notificações -->
    <q-dialog v-model="confirmDialogOpen" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="help" color="primary" text-color="white" />
          <span class="q-ml-sm">Você tem certeza que deseja alterar o status deste documento?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Confirmar"
            color="primary"
            @click="confirmStatusChange"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Dark, useQuasar } from 'quasar'

const q = useQuasar()
const search = ref('')
const documentos = ref([
  { id: 1, descricao: 'GGPPC', orgao: 'Secretaria de Defesa Social - GAB/SDS', status: 'Ativo' },
  { id: 2, descricao: 'ANEXO PESPCPE', orgao: 'Polícia Civil - PCPE', status: 'Ativo' },
  { id: 3, descricao: 'Ato', orgao: 'Polícia Civil - GAB/PCPE', status: 'Ativo' },
  { id: 4, descricao: 'Decreto', orgao: 'Poder Executivo Estadual', status: 'Ativo' },
  { id: 5, descricao: 'EDITAL', orgao: 'Secretaria de Administração - SAD', status: 'Ativo' },
  { id: 6, descricao: 'EMENDA DA CONSTITUIÇÃO', orgao: 'EMENDA DA CONSTITUIÇÃO', status: 'Ativo' },
])

const filteredDocumentos = ref([...documentos.value])
const columns = [
  { name: 'descricao', label: 'Descrição', align: 'left', field: 'descricao' },
  { name: 'orgao', label: 'Órgão Relacionado', align: 'left', field: 'orgao' },
  { name: 'status', label: 'Status', align: 'left', field: 'status' },
  { name: 'actions', label: 'Ações', align: 'center' },
]

const filterDrawerOpen = ref(false)
const selectedStatusFilters = ref([])
const selectedOrgaoFilters = ref([])
const filterOptions = [
  { label: 'Ativo', value: 'Ativo' },
  { label: 'Inativo', value: 'Inativo' },
]
const orgaos = ref([
  'Secretaria de Defesa Social - GAB/SDS',
  'Polícia Civil - PCPE',
  'Polícia Civil - GAB/PCPE',
  'Poder Executivo Estadual',
  'Secretaria de Administração - SAD',
  'EMENDA DA CONSTITUIÇÃO',
])

const addDialogOpen = ref(false)
const editDialogOpen = ref(false)
const confirmDialogOpen = ref(false)
const newDocumento = ref({
  descricao: '',
  orgao: '',
  status: 'Ativo',
})
const editingDocumento = ref({})
const documentoToToggle = ref(null)

const isDarkMode = computed(() => Dark.isActive)
const filterLabel = computed(() => 'Filtro')

// Função para aplicar todos os filtros e pesquisa
function filterRows() {
  const searchTerm = search.value.trim().toLowerCase()
  filteredDocumentos.value = documentos.value.filter((doc) => {
    const matchesSearch = !searchTerm || doc.descricao.toLowerCase().includes(searchTerm)
    const matchesStatus =
      selectedStatusFilters.value.length === 0 || selectedStatusFilters.value.includes(doc.status)
    const matchesOrgao =
      selectedOrgaoFilters.value.length === 0 || selectedOrgaoFilters.value.includes(doc.orgao)
    return matchesSearch && matchesStatus && matchesOrgao
  })
}

function applyFilters() {
  filterRows()
  if (filterDrawerOpen.value) {
    toggleFilterDrawer()
  }
}

function clearFilters() {
  selectedStatusFilters.value = []
  selectedOrgaoFilters.value = []
  search.value = ''
  filterRows()
}

function toggleFilterDrawer() {
  filterDrawerOpen.value = !filterDrawerOpen.value
}

function openAddDialog() {
  newDocumento.value = {
    descricao: '',
    orgao: orgaos.value[0],
    status: 'Ativo',
  }
  addDialogOpen.value = true
}

function openEditDialog(documento) {
  editingDocumento.value = { ...documento }
  editDialogOpen.value = true
}

function saveNewDocumento() {
  const nextId = Math.max(...documentos.value.map((doc) => doc.id)) + 1
  const doc = {
    id: nextId,
    descricao: newDocumento.value.descricao,
    orgao: newDocumento.value.orgao,
    status: newDocumento.value.status,
  }
  documentos.value.push(doc)
  filterRows()
  q.notify({
    color: 'positive',
    message: 'Documento adicionado com sucesso!',
    position: 'top',
    timeout: 2000,
  })
}

function saveEditedDocumento() {
  const index = documentos.value.findIndex((doc) => doc.id === editingDocumento.value.id)
  if (index !== -1) {
    documentos.value[index] = { ...editingDocumento.value }
    filterRows()
    q.notify({
      color: 'positive',
      message: 'Documento atualizado com sucesso!',
      position: 'top',
      timeout: 2000,
    })
  }
}

function toggleDocumentoStatus(documento) {
  documentoToToggle.value = documento
  confirmDialogOpen.value = true
}

function confirmStatusChange() {
  const index = documentos.value.findIndex((doc) => doc.id === documentoToToggle.value.id)
  if (index !== -1) {
    documentos.value[index].status =
      documentos.value[index].status === 'Ativo' ? 'Inativo' : 'Ativo'
    filterRows()
    q.notify({
      color: 'positive',
      message: `Status alterado para ${documentos.value[index].status}!`,
      position: 'top',
      timeout: 2000,
    })
  }
  documentoToToggle.value = null
}
</script>
