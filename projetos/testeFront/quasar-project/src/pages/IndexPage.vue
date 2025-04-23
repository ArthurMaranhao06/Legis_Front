<template>
  <q-page class="flex flex-center bg-grey-3">
    <q-card class="q-pa-lg shadow-4" style="width: 900px; max-width: 100%;">
      <!-- Cabeçalho com logo e título -->
      <q-card-section class="row items-center">
        <q-img
          src="public/icons/PCPE1.png"
          alt="Logo PCPE"
          width="40px"
          height="40px"
          class="q-mr-sm"
          
        />
        <div class="text-subtitle1 text-bold">LEGIS-PCPE</div>
      </q-card-section>


      <q-separator />

      <!-- Formulário de login -->
      <q-card-section>
        <q-input
          v-model="username"
          filled
          dense
          label="Usuário"
          :error="showErrors && !username"
          error-message="Campo Obrigatório!"
          class="q-mb-md"
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
          <template v-slot:append>
            <span class="text-grey">@policiacivil.pe.gov.br</span>
          </template>
        </q-input>

        <q-input
          v-model="password"
          filled
          dense
          label="Senha"
          :type="showPassword ? 'text' : 'password'"
          :error="showErrors && !password"
          error-message="Campo Obrigatório!"
          class="q-mb-md"
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>

        <!-- Simulação do reCAPTCHA -->
        <div class="q-mb-md">
          <q-banner class="bg-grey-2 text-black" dense>
            <q-checkbox v-model="captcha" label="Não sou um robô" />
            <q-img
              src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
              style="width: 60px"
              class="float-right"
            />
          </q-banner>
        </div>

        <!-- Botão de login -->
        <q-btn
          label="ENTRAR"
          color="black"
          text-color="white"
          unelevated
          class="full-width"
          @click="handleLogin"
        />
      </q-card-section>

      <!-- Rodapé -->
      <q-card-section class="text-center text-caption text-grey">
      </q-card-section>
    </q-card>
  </q-page>
</template>
        

<script setup>
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const captcha = ref(false)
const showErrors = ref(false)

function handleLogin() {
  if (!username.value || !password.value) {
    showErrors.value = true
    return
  }
  // Aqui você colocaria a lógica para login real (API)
  alert('Login enviado com sucesso!')
}
</script>
