<script setup lang="ts">
import { ref } from 'vue'
import { useCardStore } from '../stores/cardStore'

const cardStore = useCardStore()

const form = ref({
  title: '',
  urgency: 5,
  important: 5,
  effort: '',
  owner: '',
  reach: 0,
  impact: 1,
  confidence: 50,
  effortMonths: 1
})

const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

const validateForm = () => {
  errors.value = {}

  if (!form.value.title.trim()) {
    errors.value.title = 'Title is required'
  }
  if (!form.value.owner.trim()) {
    errors.value.owner = 'Owner is required'
  }
  if (!form.value.effort.trim()) {
    errors.value.effort = 'Effort is required'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    await cardStore.addCard({
      title: form.value.title,
      urgency: form.value.urgency,
      important: form.value.important,
      effort: form.value.effort,
      owner: form.value.owner,
      reach: form.value.reach,
      impact: form.value.impact,
      confidence: form.value.confidence,
      effortMonths: form.value.effortMonths
    })

    // Reset form on success
    form.value = {
      title: '',
      urgency: 5,
      important: 5,
      effort: '',
      owner: '',
      reach: 0,
      impact: 1,
      confidence: 50,
      effortMonths: 1
    }
  } catch (err) {
    // Error handling is done in the store
    console.error('Failed to add card:', err)
  } finally {
    isSubmitting.value = false
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
          Effort
        </label>
        <input
          id="effort"
          v-model="form.effort"
          type="text"
          placeholder="e.g., 2 hours, 3 days, 1 week"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
        <p v-if="errors.effort" class="text-red-500 text-xs mt-1">{{ errors.effort }}</p>
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

      <!-- RICE Framework Section -->
      <div class="border-t pt-4 mt-4">
        <h4 class="text-sm font-semibold text-gray-900 mb-3">RICE Prioritization</h4>
        
        <!-- Reach -->
        <div>
          <label for="reach" class="block text-sm font-medium text-gray-700 mb-1">
            Reach (Customer Leads): {{ form.reach }}
          </label>
          <input
            id="reach"
            v-model.number="form.reach"
            type="number"
            min="0"
            placeholder="Number of customer leads"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <!-- Impact -->
        <div class="mt-3">
          <label for="impact" class="block text-sm font-medium text-gray-700 mb-1">
            Impact: {{ form.impact }}
          </label>
          <select
            id="impact"
            v-model.number="form.impact"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="3">3 - Massive Impact</option>
            <option value="2">2 - High Impact</option>
            <option value="1">1 - Medium Impact</option>
            <option value="0.5">0.5 - Low Impact</option>
            <option value="0.25">0.25 - Minimal Impact</option>
          </select>
        </div>

        <!-- Confidence -->
        <div class="mt-3">
          <label for="confidence" class="block text-sm font-medium text-gray-700 mb-1">
            Confidence: {{ form.confidence }}% 
            <span class="text-xs text-gray-600">
              ({{ form.confidence <= 50 ? 'Low' : form.confidence <= 80 ? 'Medium' : 'High' }})
            </span>
          </label>
          <input
            id="confidence"
            v-model.number="form.confidence"
            type="range"
            min="0"
            max="100"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        <!-- Effort (Person-Months) -->
        <div class="mt-3">
          <label for="effortMonths" class="block text-sm font-medium text-gray-700 mb-1">
            Effort (Person-Months): {{ form.effortMonths }}
          </label>
          <input
            id="effortMonths"
            v-model.number="form.effortMonths"
            type="number"
            min="0.1"
            step="0.1"
            placeholder="Number of person-months"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
      >
        {{ isSubmitting ? 'Adding...' : 'Add Card' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
input[type="range"] {
  accent-color: #2563eb;
}
</style>
