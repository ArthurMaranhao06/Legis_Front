<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Cabeçalho -->
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title> LEGIS-PCPE </q-toolbar-title>
        <div>Quasar v{{ $q.version }}</div>
        <q-btn
          flat
          dense
          round
          icon="brightness_6"
          aria-label="Alternar Modo Escuro"
          @click="toggleDarkMode"
        />
      </q-toolbar>
    </q-header>

    <!-- Barra Lateral -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label class="text-subtitle2 q-pa-md"> Arthur Jordão Tenório Maranhão </q-item-label>
        <q-item-label header> UNISA </q-item-label>

        <q-item-label class="text-grey q-ml-sm"> Administração: </q-item-label>
        <q-item clickable @click="goToNormas">
          <q-item-section avatar>
            <q-icon name="description" />
          </q-item-section>
          <q-item-section> Normas </q-item-section>
        </q-item>

        <q-item-label class="text-grey q-ml-sm"> Padronização: </q-item-label>
        <q-item clickable @click="goToOrgaos">
          <q-item-section avatar>
            <q-icon name="business" />
          </q-item-section>
          <q-item-section> Órgãos </q-item-section>
        </q-item>

        <q-item clickable @click="goToDocumento">
          <q-item-section avatar>
            <q-icon name="folder" />
          </q-item-section>
          <q-item-section> Tipo de Documento </q-item-section>
        </q-item>

        <q-item clickable @click="confirmLogout">
          <q-item-section avatar>
            <q-icon name="exit_to_app" />
          </q-item-section>
          <q-item-section> Sair </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Diálogo de Confirmação -->
    <q-dialog v-model="logoutDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirmar Saída</div>
        </q-card-section>

        <q-card-section> Tem certeza de que deseja sair? </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" @click="logoutDialog = false" />
          <q-btn flat label="Sair" color="negative" @click="logout" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Conteúdo Principal -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Dark } from 'quasar' // Importa o sistema de temas do Quasar

const leftDrawerOpen = ref(false)
const logoutDialog = ref(false)
const router = useRouter()

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function confirmLogout() {
  logoutDialog.value = true
}

function logout() {
  logoutDialog.value = false
  router.push('/') // Redireciona para a rota "/"
}

function goToNormas() {
  router.push('/normas') // Redireciona para a rota "/normas"
}

function goToOrgaos() {
  router.push('/orgaos') // Redireciona para a rota "/orgaos"
}

function goToDocumento() {
  router.push('/documento') // Redireciona para a rota "/documento"
}

// Função para alternar o modo escuro
function toggleDarkMode() {
  Dark.set(!Dark.isActive)
}
</script>
