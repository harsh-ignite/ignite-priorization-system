<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCardStore, calculateRICEScore } from '../stores/cardStore'
import DeleteCardAlert from './DeleteCardAlert.vue'

const cardStore = useCardStore()

const editForm = ref({
  title: '',
  urgency: 5,
  important: 5,
  effort: 5,
  owner: '',
  reach: 0,
  impact: 1,
  confidence: 50,
  effortMonths: 1
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
      owner: newCard.owner,
      reach: newCard.reach,
      impact: newCard.impact,
      confidence: newCard.confidence,
      effortMonths: newCard.effortMonths
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
      owner: editForm.value.owner,
      reach: editForm.value.reach,
      impact: editForm.value.impact,
      confidence: editForm.value.confidence,
      effortMonths: editForm.value.effortMonths
    })
    isEditing.value = false
  }
}

const showDeleteAlert = ref(false)

const handleDeleteConfirm = () => {
  if (cardStore.selectedCard) {
    const cardId = cardStore.selectedCard.id
    cardStore.deleteCard(cardId)
  }
}

const handleDeleteCancel = () => {
  showDeleteAlert.value = false
}

const handleDelete = () => {
  showDeleteAlert.value = true
}

const handleCancel = () => {
  if (cardStore.selectedCard) {
    editForm.value = {
      title: cardStore.selectedCard.title,
      urgency: cardStore.selectedCard.urgency,
      important: cardStore.selectedCard.important,
      effort: cardStore.selectedCard.effort,
      owner: cardStore.selectedCard.owner,
      reach: cardStore.selectedCard.reach,
      impact: cardStore.selectedCard.impact,
      confidence: cardStore.selectedCard.confidence,
      effortMonths: cardStore.selectedCard.effortMonths
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

        <!-- RICE Framework Section -->
        <div class="border-t pt-4 mt-4">
          <h4 class="text-sm font-semibold text-gray-900 mb-3">RICE Score</h4>
          
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3">
            <p class="text-xs font-semibold text-purple-600 uppercase">RICE Score</p>
            <p class="text-3xl font-bold text-purple-700 mt-1">{{ calculateRICEScore(cardStore.selectedCard).toFixed(2) }}</p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <p class="text-xs font-semibold text-gray-600 uppercase">Reach</p>
              <p class="text-lg font-bold text-gray-900 mt-1">{{ cardStore.selectedCard.reach }}</p>
              <p class="text-xs text-gray-600">leads</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-600 uppercase">Impact</p>
              <p class="text-lg font-bold text-gray-900 mt-1">{{ cardStore.selectedCard.impact }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-600 uppercase">Confidence</p>
              <p class="text-lg font-bold text-gray-900 mt-1">{{ cardStore.selectedCard.confidence }}%</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-600 uppercase">Effort</p>
              <p class="text-lg font-bold text-gray-900 mt-1">{{ cardStore.selectedCard.effortMonths }}</p>
              <p class="text-xs text-gray-600">months</p>
            </div>
          </div>
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

        <!-- RICE Framework Section -->
        <div class="border-t pt-4 mt-4">
          <h4 class="text-sm font-semibold text-gray-900 mb-3">RICE Prioritization</h4>
          
          <!-- Reach -->
          <div>
            <label for="edit-reach" class="block text-sm font-medium text-gray-700 mb-1">
              Reach (Customer Leads): {{ editForm.reach }}
            </label>
            <input
              id="edit-reach"
              v-model.number="editForm.reach"
              type="number"
              min="0"
              placeholder="Number of customer leads"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <!-- Impact -->
          <div class="mt-3">
            <label for="edit-impact" class="block text-sm font-medium text-gray-700 mb-1">
              Impact: {{ editForm.impact }}
            </label>
            <select
              id="edit-impact"
              v-model.number="editForm.impact"
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
            <label for="edit-confidence" class="block text-sm font-medium text-gray-700 mb-1">
              Confidence: {{ editForm.confidence }}% 
              <span class="text-xs text-gray-600">
                ({{ editForm.confidence <= 50 ? 'Low' : editForm.confidence <= 80 ? 'Medium' : 'High' }})
              </span>
            </label>
            <input
              id="edit-confidence"
              v-model.number="editForm.confidence"
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
            <label for="edit-effortMonths" class="block text-sm font-medium text-gray-700 mb-1">
              Effort (Person-Months): {{ editForm.effortMonths }}
            </label>
            <input
              id="edit-effortMonths"
              v-model.number="editForm.effortMonths"
              type="number"
              min="0.1"
              step="0.1"
              placeholder="Number of person-months"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
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
        <DeleteCardAlert
          v-model:open="showDeleteAlert"
          title="Delete card?"
          description="This will permanently delete this card. This action cannot be undone."
          @confirm="handleDeleteConfirm"
          @cancel="handleDeleteCancel"
        >
          <template #trigger>
            <button
              @click="handleDelete"
              class="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 text-sm"
            >
              Delete
            </button>
          </template>
        </DeleteCardAlert>
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
