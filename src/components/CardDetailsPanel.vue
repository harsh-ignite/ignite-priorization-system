<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCardStore } from '../stores/cardStore'

const cardStore = useCardStore()

const editForm = ref({
  title: '',
  urgency: 5,
  important: 5,
  effort: 5,
  owner: ''
})

const isEditing = ref(false)
const errors = ref<Record<string, string>>({})

watch(() => cardStore.selectedCard, (newCard) => {
  if (newCard) {
    editForm.value = {
      title: newCard.title,
      urgency: newCard.urgency,
      important: newCard.important,
      effort: newCard.effort,
      owner: newCard.owner
    }
    isEditing.value = false
  }
}, { deep: true })

const validateForm = () => {
  errors.value = {}
  
  if (!editForm.value.title.trim()) {
    errors.value.title = 'Title is required'
  }
  if (!editForm.value.owner.trim()) {
    errors.value.owner = 'Owner is required'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSave = () => {
  if (!validateForm()) return
  
  if (cardStore.selectedCard) {
    cardStore.updateCard(cardStore.selectedCard.id, {
      title: editForm.value.title,
      urgency: editForm.value.urgency,
      important: editForm.value.important,
      effort: editForm.value.effort,
      owner: editForm.value.owner
    })
    isEditing.value = false
  }
}

const handleDelete = () => {
  if (cardStore.selectedCard && confirm('Are you sure you want to delete this card?')) {
    const cardId = cardStore.selectedCard.id
    cardStore.deleteCard(cardId)
  }
}

const handleCancel = () => {
  if (cardStore.selectedCard) {
    editForm.value = {
      title: cardStore.selectedCard.title,
      urgency: cardStore.selectedCard.urgency,
      important: cardStore.selectedCard.important,
      effort: cardStore.selectedCard.effort,
      owner: cardStore.selectedCard.owner
    }
  }
  isEditing.value = false
}

const getUrgencyLabel = (value: number) => {
  return value >= 6 ? 'High' : 'Low'
}

const getImportanceLabel = (value: number) => {
  return value >= 6 ? 'High' : 'Low'
}

const getQuadrant = (urgency: number, important: number) => {
  const isUrgent = urgency >= 6
  const isImportant = important >= 6
  
  if (isImportant && isUrgent) return 'Do First'
  if (isImportant && !isUrgent) return 'Schedule'
  if (!isImportant && isUrgent) return 'Delegate'
  return 'Eliminate'
}
</script>

<template>
  <div class="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 bg-gray-50">
      <h2 class="text-lg font-bold text-gray-900">Card Details</h2>
    </div>

    <!-- Content -->
    <div v-if="!cardStore.selectedCard" class="flex-1 flex items-center justify-center text-gray-500">
      <p>Select a card to view details</p>
    </div>

    <div v-else class="flex-1 overflow-y-auto p-4">
      <!-- View Mode -->
      <div v-if="!isEditing" class="space-y-4">
        <div>
          <p class="text-xs font-semibold text-gray-600 uppercase">Title</p>
          <p class="text-lg font-semibold text-gray-900 mt-1">{{ cardStore.selectedCard.title }}</p>
        </div>

        <div>
          <p class="text-xs font-semibold text-gray-600 uppercase">Quadrant</p>
          <p class="text-sm font-semibold text-gray-900 mt-1">
            {{ getQuadrant(cardStore.selectedCard.urgency, cardStore.selectedCard.important) }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs font-semibold text-gray-600 uppercase">Urgency</p>
            <p class="text-2xl font-bold text-blue-600 mt-1">{{ cardStore.selectedCard.urgency }}</p>
            <p class="text-xs text-gray-600">{{ getUrgencyLabel(cardStore.selectedCard.urgency) }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-600 uppercase">Importance</p>
            <p class="text-2xl font-bold text-red-600 mt-1">{{ cardStore.selectedCard.important }}</p>
            <p class="text-xs text-gray-600">{{ getImportanceLabel(cardStore.selectedCard.important) }}</p>
          </div>
        </div>

        <div>
          <p class="text-xs font-semibold text-gray-600 uppercase">Effort</p>
          <p class="text-2xl font-bold text-green-600 mt-1">{{ cardStore.selectedCard.effort }}</p>
        </div>

        <div>
          <p class="text-xs font-semibold text-gray-600 uppercase">Owner</p>
          <p class="text-sm font-semibold text-gray-900 mt-1">{{ cardStore.selectedCard.owner }}</p>
        </div>

        <div>
          <p class="text-xs font-semibold text-gray-600 uppercase">Created</p>
          <p class="text-xs text-gray-600 mt-1">{{ new Date(cardStore.selectedCard.createdAt).toLocaleDateString() }}</p>
        </div>
      </div>

      <!-- Edit Mode -->
      <form v-else @submit.prevent="handleSave" class="space-y-4">
        <div>
          <label for="edit-title" class="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="edit-title"
            v-model="editForm.title"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <p v-if="errors.title" class="text-red-500 text-xs mt-1">{{ errors.title }}</p>
        </div>

        <div>
          <label for="edit-urgency" class="block text-sm font-medium text-gray-700 mb-1">
            Urgency: {{ editForm.urgency }} ({{ getUrgencyLabel(editForm.urgency) }})
          </label>
          <input
            id="edit-urgency"
            v-model.number="editForm.urgency"
            type="range"
            min="1"
            max="10"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label for="edit-important" class="block text-sm font-medium text-gray-700 mb-1">
            Importance: {{ editForm.important }} ({{ getImportanceLabel(editForm.important) }})
          </label>
          <input
            id="edit-important"
            v-model.number="editForm.important"
            type="range"
            min="1"
            max="10"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label for="edit-effort" class="block text-sm font-medium text-gray-700 mb-1">
            Effort: {{ editForm.effort }}
          </label>
          <input
            id="edit-effort"
            v-model.number="editForm.effort"
            type="range"
            min="1"
            max="10"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label for="edit-owner" class="block text-sm font-medium text-gray-700 mb-1">
            Owner
          </label>
          <input
            id="edit-owner"
            v-model="editForm.owner"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <p v-if="errors.owner" class="text-red-500 text-xs mt-1">{{ errors.owner }}</p>
        </div>
      </form>
    </div>

    <!-- Footer Actions -->
    <div v-if="cardStore.selectedCard" class="p-4 border-t border-gray-200 bg-gray-50 space-y-2">
      <div v-if="!isEditing" class="flex gap-2">
        <button
          @click="isEditing = true"
          class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 text-sm"
        >
          Edit
        </button>
        <button
          @click="handleDelete"
          class="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 text-sm"
        >
          Delete
        </button>
      </div>
      <div v-else class="flex gap-2">
        <button
          @click="handleSave"
          class="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 text-sm"
        >
          Save
        </button>
        <button
          @click="handleCancel"
          class="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="range"] {
  accent-color: #2563eb;
}
</style>
