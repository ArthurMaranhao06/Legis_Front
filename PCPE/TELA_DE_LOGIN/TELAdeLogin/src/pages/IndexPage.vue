<template>
  <q-page class="flex flex-center column">
    <h1>Comunicação Front-Back</h1>

    <!-- Exibir mensagem do backend -->
    <q-card class="q-pa-md q-mb-md">
      <q-card-section>
        <div v-if="backendMessage">{{ backendMessage }}</div>
        <q-btn label="Buscar Mensagem" @click="fetchMessage" color="primary" :loading="loading" />
      </q-card-section>
    </q-card>

    <!-- Formulário para enviar dados -->
    <q-card class="q-pa-md">
      <q-card-section>
        <q-form @submit="createUser">
          <q-input
            v-model="userForm.name"
            label="Nome"
            filled
            :rules="[(val) => !!val || 'Campo obrigatório']"
          />

          <q-input
            v-model="userForm.email"
            label="E-mail"
            filled
            type="email"
            :rules="[
              (val) => !!val || 'Campo obrigatório',
              (val) => /.+@.+\..+/.test(val) || 'E-mail inválido',
            ]"
          />

          <q-btn
            label="Criar Usuário"
            type="submit"
            color="positive"
            class="q-mt-md"
            :loading="submitting"
          />
        </q-form>

        <!-- Exibir usuário criado -->
        <div v-if="newUser" class="q-mt-md">
          <q-banner rounded class="bg-green-1">
            Usuário criado com sucesso! ID: {{ newUser.id }}
          </q-banner>
          <pre>{{ newUser }}</pre>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()

    const backendMessage = ref('')
    const loading = ref(false)
    const submitting = ref(false)
    const newUser = ref(null)

    const userForm = ref({
      name: '',
      email: '',
    })

    // Buscar mensagem do backend
    const fetchMessage = async () => {
      loading.value = true
      try {
        const response = await fetch('http://localhost:3000/api/hello')

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`)
        }

        const data = await response.json()
        backendMessage.value = data.message
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: `Falha ao buscar mensagem: ${error.message}`,
        })
      } finally {
        loading.value = false
      }
    }

    // Criar novo usuário
    const createUser = async () => {
      submitting.value = true
      try {
        const response = await fetch('http://localhost:3000/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userForm.value),
        })

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`)
        }

        const data = await response.json()
        newUser.value = data

        $q.notify({
          type: 'positive',
          message: 'Usuário criado com sucesso!',
        })

        // Limpa o formulário
        userForm.value = { name: '', email: '' }
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: `Falha ao criar usuário: ${error.message}`,
        })
      } finally {
        submitting.value = false
      }
    }

    return {
      backendMessage,
      loading,
      userForm,
      submitting,
      newUser,
      fetchMessage,
      createUser,
    }
  },
}
</script>
