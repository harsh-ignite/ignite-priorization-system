<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const showError = ref(false)

const handleSubmit = async () => {
  showError.value = false

  const success = await authStore.login(username.value, password.value)

  if (!success) {
    showError.value = true
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleSubmit()
  }
}
</script>

<template>
  <Dialog :open="!authStore.isAuthenticated" :modal="true">
    <DialogContent class="sm:max-w-md" :can-close="false">
      <DialogHeader>
        <DialogTitle class="text-2xl">Welcome to Ignite</DialogTitle>
        <DialogDescription>
          Please enter your credentials to continue
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4 mt-4">
        <div class="space-y-2">
          <Label for="username">Username</Label>
          <Input
            id="username"
            v-model="username"
            type="text"
            placeholder="Enter username"
            :disabled="authStore.isLoggingIn"
            @keydown="handleKeydown"
            autocomplete="username"
          />
        </div>

        <div class="space-y-2">
          <Label for="password">Password</Label>
          <Input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter password"
            :disabled="authStore.isLoggingIn"
            @keydown="handleKeydown"
            autocomplete="current-password"
          />
        </div>

        <div v-if="showError || authStore.error" class="text-sm text-red-600">
          {{ authStore.error || 'Invalid username or password' }}
        </div>

        <Button
          type="submit"
          class="w-full"
          :disabled="authStore.isLoggingIn || !username || !password"
        >
          {{ authStore.isLoggingIn ? 'Logging in...' : 'Login' }}
        </Button>
      </form>
    </DialogContent>
  </Dialog>
</template>
