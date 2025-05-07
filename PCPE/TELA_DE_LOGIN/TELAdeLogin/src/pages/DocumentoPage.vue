<template>
  <q-page>
    <div class="q-pa-md">
      <q-card>
        <q-card-section>
          <div class="text-h5">Tipo de documento</div>
        </q-card-section>

        <q-card-section>
          <q-input filled dense placeholder="Pesquisar" v-model="search" />
        </q-card-section>

        <q-table
          :rows="documentos"
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
              @click="openAddDialog"
            />
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td align="center" class="q-pa-none">
              <div style="display: flex; align-items: center; justify-content: center; gap: 6px;">
                <!-- Botão de Editar -->
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
                <!-- Botão de Ativar/Desativar -->
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

    <!-- Janela Flutuante para Adicionar Documento -->
    <q-dialog v-model="addDialog">
      <q-card style="max-width: 600px;">
        <q-card-section>
          <div class="text-h6">Novo Tipo de Documento</div>
        </q-card-section>

        <q-card-section>
          <q-input
            filled
            label="Descrição"
            v-model="novoDocumento.descricao"
            class="q-mb-md"
          />
          <q-select
            filled
            label="Órgão Relacionado"
            v-model="novoDocumento.orgao"
            :options="orgaos"
            class="q-mb-md"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" @click="closeAddDialog" />
          <q-btn flat label="Adicionar" color="primary" @click="adicionarDocumento" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Janela Flutuante para Editar Documento -->
    <q-dialog v-model="editDialog">
      <q-card style="max-width: 600px;">
        <q-card-section>
          <div class="text-h6">Editar Tipo de Documento</div>
        </q-card-section>

        <q-card-section>
          <q-input
            filled
            label="Descrição"
            v-model="editDocumento.descricao"
            class="q-mb-md"
          />
          <q-select
            filled
            label="Órgão Relacionado"
            v-model="editDocumento.orgao"
            :options="orgaos"
            class="q-mb-md"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" @click="closeEditDialog" />
          <q-btn flat label="Salvar" color="primary" @click="salvarDocumento" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const search = ref('')
const documentos = ref([
  { id: 1, descricao: 'GGPPC', orgao: 'Secretaria de Defesa Social - GAB/SDS', status: 'Ativo' },
  { id: 2, descricao: 'ANEXO PESPCPE', orgao: 'Polícia Civil - PCPE', status: 'Ativo' },
  { id: 3, descricao: 'Ato', orgao: 'Polícia Civil - GAB/PCPE', status: 'Ativo' },
  { id: 4, descricao: 'Decreto', orgao: 'Poder Executivo Estadual', status: 'Ativo' },
  { id: 5, descricao: 'EDITAL', orgao: 'Secretaria de Administração - SAD', status: 'Ativo' },
  { id: 6, descricao: 'EMENDA DA CONSTITUIÇÃO', orgao: 'EMENDA DA CONSTITUIÇÃO', status: 'Ativo' }
])

const columns = [
  { name: 'descricao', label: 'Descrição', align: 'left', field: 'descricao' },
  { name: 'orgao', label: 'Órgão Relacionado', align: 'left', field: 'orgao' },
  { name: 'status', label: 'Status', align: 'left', field: 'status' },
  { name: 'actions', label: 'Ações', align: 'center' }
]

const addDialog = ref(false)
const editDialog = ref(false)
const novoDocumento = ref({
  descricao: '',
  orgao: ''
})
const editDocumento = ref({
  id: null,
  descricao: '',
  orgao: ''
})

const orgaos = ref([
  'Secretaria de Defesa Social - GAB/SDS',
  'Polícia Civil - PCPE',
  'Polícia Civil - GAB/PCPE',
  'Poder Executivo Estadual',
  'Secretaria de Administração - SAD',
  'EMENDA DA CONSTITUIÇÃO'
])

function openAddDialog() {
  addDialog.value = true
}

function closeAddDialog() {
  addDialog.value = false
  novoDocumento.value = { descricao: '', orgao: '' } // Limpa o formulário
}

function adicionarDocumento() {
  if (!novoDocumento.value.descricao || !novoDocumento.value.orgao) {
    alert('Por favor, preencha todos os campos.')
    return
  }

  // Adiciona o novo documento à lista
  documentos.value.push({
    id: documentos.value.length + 1,
    descricao: novoDocumento.value.descricao,
    orgao: novoDocumento.value.orgao,
    status: 'Ativo'
  })

  closeAddDialog()
  alert('Novo tipo de documento adicionado com sucesso!')
}

function openEditDialog(documento) {
  editDocumento.value = { ...documento } // Copia os dados do documento para edição
  editDialog.value = true
}

function closeEditDialog() {
  editDialog.value = false
  editDocumento.value = { id: null, descricao: '', orgao: '' } // Limpa o formulário
}

function salvarDocumento() {
  const index = documentos.value.findIndex(d => d.id === editDocumento.value.id)
  if (index !== -1) {
    documentos.value[index] = { ...editDocumento.value } // Atualiza o documento na lista
  }
  closeEditDialog()
  alert('Documento atualizado com sucesso!')
}

function toggleDocumentoStatus(documento) {
  const confirmToggle = confirm(
    `Tem certeza de que deseja ${documento.status === 'Ativo' ? 'desativar' : 'ativar'} o documento "${documento.descricao}"?`
  )
  if (confirmToggle) {
    const index = documentos.value.findIndex(d => d.id === documento.id)
    if (index !== -1) {
      documentos.value[index].status = documentos.value[index].status === 'Ativo' ? 'Inativo' : 'Ativo'
    }
  }
}
</script>
