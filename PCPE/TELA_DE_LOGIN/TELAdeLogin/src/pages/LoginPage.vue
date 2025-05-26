<template>
  <q-page class="flex flex-center bg-login">
    <q-card class="q-pa-lg login-card">
      <!-- Cabeçalho com logo e nome -->
      <div class="row items-center q-mb-md">
        <q-avatar size="40px">
          <img src="/icons/PCPEtransparente.png" />
        </q-avatar>
        <div class="q-ml-sm text-subtitle1 text-weight-bold text-black">LEGIS-PCPE</div>
      </div>

      <!-- Formulário -->
      <q-form @submit="login" greedy>
        <!-- Campo Usuário -->
        <q-input
          filled
          v-model="email"
          label="Usuário"
          :rules="[(val) => !!val || 'Campo Obrigatório!']"
          class="q-mb-sm"
          input-class="text-weight-bold text-caption text-black"
        >
          <template v-slot:label>
            <span class="text-black">Usuário</span>
          </template>
          <template v-slot:append>
            <span class="text-caption text-weight-bold text-black">@policiacivil.pe.gov.br</span>
          </template>
        </q-input>

        <!-- Campo Senha -->
        <q-input
          filled
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          label="Senha"
          :rules="[(val) => !!val || 'Campo Obrigatório!']"
          class="q-mb-md"
          input-class="text-black"
        >
          <template v-slot:label>
            <span class="text-black">Senha</span>
          </template>
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility' : 'visibility_off'"
              class="cursor-pointer text-black"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>

        <!-- Checkbox CAPTCHA -->
        <q-checkbox v-model="captchaChecked" label="Não sou um robô" class="q-mb-md custom-captcha">
          <template v-slot:label>
            <span class="text-black">Não sou um robô</span>
          </template>
        </q-checkbox>

        <!-- Botão ENTRAR -->
        <q-btn
          label="ENTRAR"
          type="submit"
          class="full-width bg-black text-white"
          :disable="!captchaChecked"
        />
      </q-form>

      <!-- Rodapé -->
      <div class="text-caption text-center q-mt-md text-black">
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
const showPassword = ref(false)
const router = useRouter()

async function login() {
  if (email.value && password.value && captchaChecked.value) {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.value.includes('@') ? email.value : email.value + '@policiacivil.pe.gov.br',
          password: password.value,
        }),
      })
      const data = await response.json()
      if (response.ok && data.success) {
        router.push('/home')
      } else {
        alert(data.message || 'Usuário ou senha inválidos')
      }
    } catch (err) {
      alert(`Erro ao conectar ao servidor: ${err.message}`)
    }
  } else {
    alert('Preencha todos os campos corretamente.')
  }
}
</script>

<style scoped>
.bg-login {
  background-image: url('/Public/icons/PCPEtransparente.png');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  backdrop-filter: blur(8px);
}

.login-card {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* Força o texto a permanecer preto no modo escuro */
.text-black {
  color: black !important;
}

.login-card {
  background: white !important;
}

/* Estilos personalizados para o CAPTCHA */
.custom-captcha .q-checkbox__control {
  background-color: white !important;
  border-color: black !important;
}

.custom-captcha .q-checkbox__label {
  color: black !important;
}

.custom-captcha .q-checkbox__control--checked::before {
  color: black !important;
}
</style>
