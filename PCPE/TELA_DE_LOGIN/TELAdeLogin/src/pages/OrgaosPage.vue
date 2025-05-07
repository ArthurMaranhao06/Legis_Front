<template>
  <q-page>
    <div class="q-pa-md">
      <q-card>
        <q-card-section>
          <div class="text-h5">Órgãos</div>
        </q-card-section>

        <q-card-section>
          <q-input filled dense placeholder="Pesquisar" v-model="search" />
        </q-card-section>

        <q-table
          :rows="orgaos"
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
              round
              @click="openAddOrgaoDialog"
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
        </q-table>
      </q-card>
    </div>

    <!-- Diálogo para Adicionar Órgão -->
    <q-dialog v-model="addOrgaoDialog">
      <q-card style="min-width: 400px;">
        <q-card-section>
          <div class="text-h6">Novo Órgão</div>
        </q-card-section>

        <q-card-section>
          <q-input
            filled
            label="Descrição"
            v-model="newOrgao.descricao"
            class="q-mt-sm"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" @click="closeAddOrgaoDialog" />
          <q-btn flat label="Adicionar" color="primary" @click="addOrgao" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Diálogo para Editar Órgão -->
    <q-dialog v-model="editOrgaoDialog">
      <q-card style="min-width: 400px;">
        <q-card-section>
          <div class="text-h6">Editar Órgão</div>
        </q-card-section>

        <q-card-section>
          <q-input
            filled
            label="Descrição"
            v-model="editOrgao.descricao"
            class="q-mt-sm"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" @click="closeEditOrgaoDialog" />
          <q-btn flat label="Salvar" color="primary" @click="saveOrgao" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const search = ref('')
const orgaos = ref([]) // Lista de órgãos
const addOrgaoDialog = ref(false) // Controle do diálogo de adicionar
const editOrgaoDialog = ref(false) // Controle do diálogo de edição
const newOrgao = ref({ descricao: '' }) // Novo órgão
const editOrgao = ref({ id: null, descricao: '' }) // Órgão em edição
const columns = [
  { name: 'descricao', label: 'Descrição', align: 'left', field: 'descricao' },
  { name: 'status', label: 'Status', align: 'left', field: 'status' },
  { name: 'actions', label: 'Ações', align: 'center' }
]

// Função para carregar os órgãos
async function loadOrgaos() {
  try {
    const response = await fetch('/icons/orgaos.json') // Caminho relativo ao diretório public
    orgaos.value = await response.json()
  } catch (error) {
    console.error('Erro ao carregar os órgãos:', error)
  }
}

// Funções para abrir e fechar o diálogo de adicionar
function openAddOrgaoDialog() {
  addOrgaoDialog.value = true
}

function closeAddOrgaoDialog() {
  addOrgaoDialog.value = false
  newOrgao.value = { descricao: '' } // Limpa o formulário
}

// Função para adicionar um novo órgão
function addOrgao() {
  if (newOrgao.value.descricao.trim() === '') {
    alert('A descrição do órgão é obrigatória.')
    return
  }

  // Adiciona o novo órgão à lista
  orgaos.value.push({
    id: orgaos.value.length + 1, // Gera um ID simples
    descricao: newOrgao.value.descricao,
    status: 'Ativo'
  })

  closeAddOrgaoDialog()
}

// Funções para abrir e fechar o diálogo de edição
function openEditOrgaoDialog(orgao) {
  editOrgao.value = { ...orgao } // Copia os dados do órgão para edição
  editOrgaoDialog.value = true
}

function closeEditOrgaoDialog() {
  editOrgaoDialog.value = false
  editOrgao.value = { id: null, descricao: '' } // Limpa o formulário
}

// Função para salvar as alterações no órgão
function saveOrgao() {
  const index = orgaos.value.findIndex(o => o.id === editOrgao.value.id)
  if (index !== -1) {
    orgaos.value[index] = { ...editOrgao.value } // Atualiza o órgão na lista
  }
  closeEditOrgaoDialog()
}

// Função para alternar o status do órgão
function toggleOrgaoStatus(orgao) {
  const confirmToggle = confirm(
    `Tem certeza de que deseja ${orgao.status === 'Ativo' ? 'desativar' : 'ativar'} o órgão "${orgao.descricao}"?`
  )
  if (confirmToggle) {
    const index = orgaos.value.findIndex(o => o.id === orgao.id)
    if (index !== -1) {
      orgaos.value[index].status = orgaos.value[index].status === 'Ativo' ? 'Inativo' : 'Ativo'
    }
  }
}

// Carrega os órgãos ao montar o componente
onMounted(() => {
  loadOrgaos()
})
</script>
