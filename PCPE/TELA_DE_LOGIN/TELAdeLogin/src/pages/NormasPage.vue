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
            @input="filterRows"
            class="q-mb-sm"
          />
          <q-btn
            flat
            dense
            round
            icon="filter_alt"
            label="Filtro"
            color="primary"
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
            <q-btn
              icon="add"
              color="primary"
              label="Adicionar"
              @click="openAddNormDialog"
            />
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td align="center" class="q-pa-none">
              <div style="display: flex; align-items: center; justify-content: center; gap: 6px;">
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
                />
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card>
    </div>

    <q-drawer
      v-model="filterDrawerOpen"
      side="right"
      bordered
      overlay
    >
      <q-list>
        <q-item-label class="text-h6 q-pa-md">Filtros</q-item-label>

        <q-expansion-item
          label="Status"
          expand-separator
          dense
          default-opened
        >
          <q-checkbox
            v-for="option in filterOptions"
            :key="option.value"
            v-model="selectedStatusFilters"
            :val="option.value"
            :label="option.label"
            dense
          />
        </q-expansion-item>

        <q-expansion-item
          label="Tipo de Documento"
          expand-separator
          dense
        >
          <q-checkbox
            v-for="type in documentTypes"
            :key="type"
            v-model="selectedTypeFilters"
            :val="type"
            :label="type"
            dense
          />
        </q-expansion-item>

        <q-expansion-item
          label="Órgão Emissor"
          expand-separator
          dense
        >
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

    <q-dialog v-model="addNormDialog">
      <q-card style="min-width: 600px;">
        <q-card-section>
          <div class="text-h6">Nova Norma</div>
        </q-card-section>

        <q-card-section>
          <q-form>
            <q-select
              filled
              label="Órgão Emissor *"
              :options="orgaoOptions"
              v-model="newNorm.orgao"
              class="q-mt-sm"
            />
            <q-select
              filled
              label="Tipo de Documento *"
              :options="documentTypes"
              v-model="newNorm.type"
              class="q-mt-sm"
            />
            <q-input
              filled
              label="Número *"
              v-model="newNorm.number"
              class="q-mt-sm"
            />
            <q-input
              filled
              label="Data *"
              v-model="newNorm.date"
              type="date"
              class="q-mt-sm"
            />
            <q-checkbox
              v-model="newNorm.internal"
              label="Norma interna"
              class="q-mt-sm"
            />
            <q-checkbox
              v-model="newNorm.public"
              label="Publicar"
              class="q-mt-sm"
            />
            <q-input
              filled
              label="Ementa *"
              type="textarea"
              v-model="newNorm.ementa"
              class="q-mt-sm"
            />
            <q-uploader
              label="PDF da Norma *"
              v-model="newNorm.pdf"
              class="q-mt-sm"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" @click="closeAddNormDialog" />
          <q-btn flat label="Adicionar" color="primary" @click="addNorm" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const search = ref('')
const selectedStatusFilters = ref([])
const selectedTypeFilters = ref([])
const selectedOrgaoFilters = ref([])
const filterDrawerOpen = ref(false)
const addNormDialog = ref(false)
const rows = ref([])
const filteredRows = ref([])
const newNorm = ref({
  orgao: '',
  type: '',
  number: '',
  date: '',
  internal: false,
  public: false,
  ementa: '',
  pdf: null
})
const columns = [
  { name: 'orgao', label: 'Órgão', align: 'left', field: 'orgao' },
  { name: 'tipo', label: 'Tipo de Documento', align: 'left', field: 'tipo' },
  { name: 'numero', label: 'Número', align: 'left', field: 'numero' },
  { name: 'data', label: 'Data', align: 'left', field: 'data' },
  { name: 'ementa', label: 'Ementa', align: 'left', field: 'ementa' },
  { name: 'status', label: 'Status', align: 'left', field: 'status' },
  { name: 'actions', label: 'Ações', align: 'center' }
]

const documentTypes = ['Portaria', 'Decreto', 'Resolução']
const orgaoOptions = [
  'Secretaria de Defesa Social - GAB/SDS',
  'Órgãos em conjunto',
  'Poder Executivo Estadual',
  'Outro'
]

const filterOptions = [
  { label: 'Publicado', value: 'Publicado' },
  { label: 'Rascunho', value: 'Rascunho' }
]

function applyFilters() {
  filteredRows.value = rows.value.filter(row => {
    const matchesStatus =
      selectedStatusFilters.value.length === 0 ||
      selectedStatusFilters.value.includes(row.status)
    const matchesType =
      selectedTypeFilters.value.length === 0 ||
      selectedTypeFilters.value.includes(row.tipo)
    const matchesOrgao =
      selectedOrgaoFilters.value.length === 0 ||
      selectedOrgaoFilters.value.includes(row.orgao)

    return matchesStatus && matchesType && matchesOrgao
  })
}

function clearFilters() {
  selectedStatusFilters.value = []
  selectedTypeFilters.value = []
  selectedOrgaoFilters.value = []
  search.value = ''
  filteredRows.value = rows.value
}

function toggleFilterDrawer() {
  filterDrawerOpen.value = !filterDrawerOpen.value
}

function openAddNormDialog() {
  addNormDialog.value = true
}

function closeAddNormDialog() {
  addNormDialog.value = false
}

function addNorm() {
  rows.value.push({
    orgao: newNorm.value.orgao || 'Órgão não especificado',
    tipo: newNorm.value.type,
    numero: newNorm.value.number,
    data: newNorm.value.date,
    ementa: newNorm.value.ementa,
    status: newNorm.value.public ? 'Publicado' : 'Rascunho',
    pdf: newNorm.value.pdf
  })

  applyFilters()

  newNorm.value = {
    orgao: '',
    type: '',
    number: '',
    date: '',
    internal: false,
    public: false,
    ementa: '',
    pdf: null
  }

  closeAddNormDialog()
}

function editNorm(norm) {
  console.log('Editar norma:', norm)
}

function deleteNorm(norm) {
  console.log('Excluir norma:', norm)
}

function viewPdf(norm) {
  if (norm.pdf && norm.pdf.trim() !== '') {
    window.open(norm.pdf, '_blank')
  } else {
    alert('Sem PDF anexado')
  }
}

onMounted(async () => {
  try {
    const response = await fetch('/icons/mock.json')
    rows.value = await response.json()
    filteredRows.value = rows.value
  } catch (error) {
    console.error('Erro ao carregar os dados:', error)
  }
})
</script>
