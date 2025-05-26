// frontend/src/pages/ExemploPage.vue
<template>
  <q-page padding>
    <q-btn label="Buscar Mensagem" @click="buscarMensagem" />
    <q-btn label="Enviar Nome" @click="enviarNome" class="q-ml-sm" />

    <div class="q-mt-md">
      <p><strong>Resposta:</strong> {{ resposta }}</p>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const resposta = ref('')

const API_URL = 'http://localhost:3000/api'

const buscarMensagem = async () => {
  const res = await axios.get(`${API_URL}/mensagem`)
  resposta.value = res.data.mensagem
}

const enviarNome = async () => {
  const res = await axios.post(`${API_URL}/usuario`, { nome: 'Arthur' })
  resposta.value = res.data.mensagem
}
</script>
