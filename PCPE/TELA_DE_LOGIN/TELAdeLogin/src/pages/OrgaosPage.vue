<template>
  <q-page>
    <div class="q-pa-md">
      <q-card>
        <q-card-section>
          <div class="text-h5">Órgãos</div>
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
          :rows="filteredOrgaos"
          :columns="columns"
          row-key="id"
          flat
          dense
          separator="horizontal"
        >
          <template v-slot:top-right>
            <q-btn icon="add" color="primary" class="q-px-sm" @click="openAddOrgaoDialog">
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
                  @click="openEditOrgaoDialog(props.row)"
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
                  @click="toggleOrgaoStatus(props.row)"
                />
              </div>
            </q-td>
          </template>
          <template v-slot:no-data>
            <div class="full-width row flex-center q-gutter-sm">
              <q-icon name="warning" size="2em" color="warning" />
              <span>No data available</span>
            </div>
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

    <!-- Diálogo para Adicionar/Editar Órgão -->
    <q-dialog v-model="orgaoDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ isEditing ? 'Editar Órgão' : 'Novo Órgão' }}</div>
        </q-card-section>

        <q-card-section>
          <q-input
            filled
            label="Descrição"
            v-model="currentOrgao.descricao"
            class="q-mb-md"
            :rules="[(val) => !!val.trim() || 'A descrição é obrigatória']"
          />
          <q-select
            v-model="currentOrgao.status"
            :options="['Ativo', 'Inativo']"
            label="Status"
            filled
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Salvar" color="primary" @click="saveOrgao" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Diálogo de Confirmação -->
    <q-dialog v-model="confirmDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="help" color="primary" text-color="white" />
          <span class="q-ml-sm">Você tem certeza que deseja alterar o status deste órgão?</span>
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
import { ref, computed, onMounted } from 'vue'
import { Dark, useQuasar } from 'quasar'

const q = useQuasar()
const search = ref('')
const selectedStatusFilters = ref([])
const filterDrawerOpen = ref(false)
const orgaoDialog = ref(false)
const confirmDialog = ref(false)
const isEditing = ref(false)
const orgaoToToggle = ref(null)

const defaultOrgaos = [
  { id: 1, descricao: 'Secretaria de Defesa Social - GAB/SDS', status: 'Ativo' },
  { id: 2, descricao: 'Polícia Civil - PCPE', status: 'Ativo' },
  { id: 3, descricao: 'Polícia Civil - GAB/PCPE', status: 'Ativo' },
  { id: 4, descricao: 'Poder Executivo Estadual', status: 'Ativo' },
  { id: 5, descricao: 'Secretaria de Administração - SAD', status: 'Ativo' },
]

const orgaos = ref([...defaultOrgaos])
const filteredOrgaos = ref([...defaultOrgaos])
const currentOrgao = ref({ id: null, descricao: '', status: 'Ativo' })

const columns = [
  { name: 'descricao', label: 'Descrição', align: 'left', field: 'descricao' },
  { name: 'status', label: 'Status', align: 'left', field: 'status' },
  { name: 'actions', label: 'Ações', align: 'center', field: 'actions' },
]

const filterOptions = [
  { label: 'Ativo', value: 'Ativo' },
  { label: 'Inativo', value: 'Inativo' },
]

const isDarkMode = computed(() => Dark.isActive)
const filterLabel = computed(() => 'Filtro')

// Função para carregar os órgãos
async function loadOrgaos() {
  try {
    const response = await fetch('/api/orgaos')
    if (response.ok) {
      orgaos.value = await response.json()
    } else {
      orgaos.value = [...defaultOrgaos]
      q.notify({
        color: 'warning',
        message: 'Usando dados de exemplo. API indisponível.',
        position: 'top',
        timeout: 2000,
      })
    }
  } catch (error) {
    console.error('Erro ao carregar os órgãos:', error)
    orgaos.value = [...defaultOrgaos]
  } finally {
    filterRows()
  }
}

// Função para aplicar todos os filtros e pesquisa (igual NormasPage)
function filterRows() {
  const searchTerm = search.value.trim().toLowerCase()
  filteredOrgaos.value = orgaos.value.filter((orgao) => {
    const matchesSearch = !searchTerm || orgao.descricao.toLowerCase().includes(searchTerm)
    const matchesStatus =
      selectedStatusFilters.value.length === 0 || selectedStatusFilters.value.includes(orgao.status)
    return matchesSearch && matchesStatus
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
  search.value = ''
  filterRows()
}

function toggleFilterDrawer() {
  filterDrawerOpen.value = !filterDrawerOpen.value
}

function openAddOrgaoDialog() {
  isEditing.value = false
  currentOrgao.value = { id: null, descricao: '', status: 'Ativo' }
  orgaoDialog.value = true
}

function openEditOrgaoDialog(orgao) {
  isEditing.value = true
  currentOrgao.value = { ...orgao }
  orgaoDialog.value = true
}

function saveOrgao() {
  if (!currentOrgao.value.descricao.trim()) {
    q.notify({
      color: 'negative',
      message: 'A descrição do órgão é obrigatória.',
      position: 'top',
      timeout: 2000,
    })
    return
  }

  if (isEditing.value) {
    const index = orgaos.value.findIndex((o) => o.id === currentOrgao.value.id)
    if (index !== -1) {
      orgaos.value[index] = { ...currentOrgao.value }
      q.notify({
        color: 'positive',
        message: 'Órgão atualizado com sucesso!',
        position: 'top',
        timeout: 2000,
      })
    }
  } else {
    const nextId = Math.max(0, ...orgaos.value.map((o) => o.id)) + 1
    const newOrgao = {
      id: nextId,
      descricao: currentOrgao.value.descricao,
      status: currentOrgao.value.status,
    }
    orgaos.value.push(newOrgao)
    q.notify({
      color: 'positive',
      message: 'Órgão adicionado com sucesso!',
      position: 'top',
      timeout: 2000,
    })
  }

  orgaoDialog.value = false
  filterRows()
}

function toggleOrgaoStatus(orgao) {
  orgaoToToggle.value = orgao
  confirmDialog.value = true
}

function confirmStatusChange() {
  const index = orgaos.value.findIndex((o) => o.id === orgaoToToggle.value.id)
  if (index !== -1) {
    const novoStatus = orgaos.value[index].status === 'Ativo' ? 'Inativo' : 'Ativo'
    orgaos.value[index].status = novoStatus
    q.notify({
      color: 'positive',
      message: `Status alterado para ${novoStatus}!`,
      position: 'top',
      timeout: 2000,
    })
    filterRows()
  }
  orgaoToToggle.value = null
}

onMounted(() => {
  loadOrgaos()
})
</script>
