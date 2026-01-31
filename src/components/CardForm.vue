<script setup lang="ts">
import { ref } from 'vue'
import { useCardStore } from '../stores/cardStore'

const cardStore = useCardStore()

const form = ref({
  title: '',
  urgency: 5,
  important: 5,
  effort: 5,
  owner: ''
})

const errors = ref<Record<string, string>>({})

const validateForm = () => {
  errors.value = {}
  
  if (!form.value.title.trim()) {
    errors.value.title = 'Title is required'
  }
  if (!form.value.owner.trim()) {
    errors.value.owner = 'Owner is required'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (!validateForm()) return
  
  cardStore.addCard({
    title: form.value.title,
    urgency: form.value.urgency,
    important: form.value.important,
    effort: form.value.effort,
    owner: form.value.owner
  })
  
  // Reset form
  form.value = {
    title: '',
    urgency: 5,
    important: 5,
    effort: 5,
    owner: ''
  }
}

const getUrgencyLabel = (value: number) => {
  return value >= 6 ? 'High' : 'Low'
}

const getImportanceLabel = (value: number) => {
  return value >= 6 ? 'High' : 'Low'
}
</script>

<template>
  <div class="p-4 bg-gray-50 border-t border-gray-200">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Create New Card</h3>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Title -->
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          placeholder="Enter task title"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
        <p v-if="errors.title" class="text-red-500 text-xs mt-1">{{ errors.title }}</p>
      </div>

      <!-- Urgency -->
      <div>
        <label for="urgency" class="block text-sm font-medium text-gray-700 mb-1">
          Urgency: {{ form.urgency }} ({{ getUrgencyLabel(form.urgency) }})
        </label>
        <input
          id="urgency"
          v-model.number="form.urgency"
          type="range"
          min="1"
          max="10"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low (1)</span>
          <span>High (10)</span>
        </div>
      </div>

      <!-- Important -->
      <div>
        <label for="important" class="block text-sm font-medium text-gray-700 mb-1">
          Importance: {{ form.important }} ({{ getImportanceLabel(form.important) }})
        </label>
        <input
          id="important"
          v-model.number="form.important"
          type="range"
          min="1"
          max="10"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low (1)</span>
          <span>High (10)</span>
        </div>
      </div>

      <!-- Effort -->
      <div>
        <label for="effort" class="block text-sm font-medium text-gray-700 mb-1">
          Effort: {{ form.effort }}
        </label>
        <input
          id="effort"
          v-model.number="form.effort"
          type="range"
          min="1"
          max="10"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low (1)</span>
          <span>High (10)</span>
        </div>
      </div>

      <!-- Owner -->
      <div>
        <label for="owner" class="block text-sm font-medium text-gray-700 mb-1">
          Owner
        </label>
        <input
          id="owner"
          v-model="form.owner"
          type="text"
          placeholder="Enter owner name"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
        <p v-if="errors.owner" class="text-red-500 text-xs mt-1">{{ errors.owner }}</p>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
      >
        Add Card
      </button>
    </form>
  </div>
</template>

<style scoped>
input[type="range"] {
  accent-color: #2563eb;
}
</style>
