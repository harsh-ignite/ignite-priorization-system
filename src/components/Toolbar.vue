<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-vue-next'

const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
}
</script>

<template>
  <div class="h-16 bg-black border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
    <div class="flex items-center gap-3">
      <img src="/logo.png" alt="Ignite Solutions" class="h-10 w-50 object-contain" />
      <h1 class="text-2xl font-bold text-white">Ignite Prioritization System</h1>
    </div>

    <div class="flex items-center gap-4">
      <span class="text-sm text-gray-300">{{ authStore.username }}</span>
      <Button
        variant="outline"
        size="sm"
        @click="handleLogout"
        class="bg-white/10 text-white border-white/20 hover:bg-white/20"
      >
        <LogOut class="size-4" />
        Logout
      </Button>
    </div>
  </div>
</template>

<style scoped>
</style>
