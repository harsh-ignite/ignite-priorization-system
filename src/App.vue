<script setup lang="ts">
import { useAuthStore } from './stores/authStore'
import LoginDialog from './components/LoginDialog.vue'
import Toolbar from './components/Toolbar.vue'
import CardForm from './components/CardForm.vue'
import EisenhowerMatrix from './components/EisenhowerMatrix.vue'
import CardDetailsPanel from './components/CardDetailsPanel.vue'

const authStore = useAuthStore()
</script>

<template>
  <!-- Login Dialog -->
  <LoginDialog />

  <!-- Main App (only shown when authenticated) -->
  <div v-if="authStore.isAuthenticated" class="h-screen flex flex-col bg-gray-100">
    <!-- Toolbar -->
    <Toolbar />

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left Sidebar -->
      <div class="w-80 bg-white border-r border-gray-200 flex flex-col">
        <CardForm />
      </div>

      <!-- Center - Eisenhower Matrix -->
      <EisenhowerMatrix />

      <!-- Right Panel -->
      <CardDetailsPanel />
    </div>
  </div>
</template>

<style scoped>
</style>
