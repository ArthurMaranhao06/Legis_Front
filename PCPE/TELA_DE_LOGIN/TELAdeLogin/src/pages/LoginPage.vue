<template>
  <q-page class="flex flex-center bg-login">
    <q-card class="q-pa-lg login-card">

      <!-- Cabeçalho com logo e nome -->
      <div class="row items-center q-mb-md">
        <q-avatar size="40px">
          <img src="/icons/PCPEtransparente.png" />
        </q-avatar>
        <div class="q-ml-sm text-subtitle1 text-weight-bold">LEGIS-PCPE</div>
      </div>

      <!-- Formulário -->
      <q-form @submit="login" greedy>

        <!-- Campo Usuário -->
        <q-input
          filled
          v-model="email"
          label="Usuário"
          :rules="[val => !!val || 'Campo Obrigatório!']"
          class="q-mb-sm"
          input-class="text-weight-bold text-caption"
        >
          <template v-slot:append>
            <span class="text-caption text-weight-bold">@policiacivil.pe.gov.br</span>
          </template>
        </q-input>

        <!-- Campo Senha -->
        <q-input
          filled
          v-model="password"
          label="Senha"
          type="password"
          :rules="[val => !!val || 'Campo Obrigatório!']"
          class="q-mb-md"
        >
          <template v-slot:append>
            <q-icon name="visibility_off" />
          </template>
        </q-input>

        <!-- Checkbox CAPTCHA -->
        <q-checkbox
          v-model="captchaChecked"
          label="Não sou um robô"
          class="q-mb-md"
        />

        <!-- Botão ENTRAR -->
        <q-btn
          label="ENTRAR"
          type="submit"
          class="full-width bg-black text-white"
          :disable="!captchaChecked"
        />
      </q-form>

      <!-- Rodapé -->
      <div class="text-caption text-center q-mt-md">
        2021 - Desenvolvido pela UNISA/DTI/PCPE
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const captchaChecked = ref(false)
const router = useRouter()

function login() {
  if (email.value && password.value && captchaChecked.value) {
    console.log('Tentando login com:', email.value, password.value)
    router.push('/home') // Redireciona para a rota "/home"
  } else {
    console.log('Preencha todos os campos corretamente.')
  }
}
</script>

<style scoped>
.bg-login {
  background-image: url('/Public/icons/PCPEtransparente.png'); /* ou um gradiente se preferir */
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  backdrop-filter: blur(8px);
}

.login-card {
  background: rgba(255, 255, 255, 0.8); /* Transparente */
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
</style>
