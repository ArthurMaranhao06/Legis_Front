<template>
  <q-layout view="lHh Lpr lFf">

    <!-- TOPO -->
    <q-header elevated class="bg-dark text-white">
      <q-toolbar>
        <q-btn flat dense icon="menu" @click="drawer = !drawer" />
        <q-avatar>
          <img src="/icons/PCPE1.png" />
        </q-avatar>
        <q-toolbar-title>
          LEGIS-PCPE<br />
          <span class="text-caption">Polícia Civil de Pernambuco</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- MENU LATERAL -->
    <q-drawer v-model="drawer" show-if-above bordered class="bg-grey-1">
      <q-list>
        <q-item-label header>Administração:</q-item-label>
        <q-item clickable v-ripple>
          <q-item-section>Normas</q-item-section>
        </q-item>

        <q-item-label header>Padronização:</q-item-label>
        <q-expansion-item icon="apartment" label="Órgãos">
          <q-item clickable v-ripple>
            <q-item-section>Órgão 1</q-item-section>
          </q-item>
        </q-expansion-item>

        <q-item clickable v-ripple>
          <q-item-section>Tipo de Documento</q-item-section>
        </q-item>

        <q-separator />

        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>Sair</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- CONTEÚDO DA PÁGINA -->
    <q-page-container>
      <q-page class="flex flex-center">
        <div class="text-center">
          <!-- Imagem centralizada -->
          <img src="public/icons/PCPE1.png" alt="Logo" style="width: 150px; height: auto;" />

          <!-- Texto abaixo da imagem -->
          <p class="text-h6 q-mt-md">Polícia Civil de Pernambuco!</p>
        </div>
      </q-page>
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
const drawer = ref(true)
</script>
