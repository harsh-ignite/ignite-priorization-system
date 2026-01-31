<script setup lang="ts">
import { useCardStore } from '../stores/cardStore'

const cardStore = useCardStore()

const getQuadrant = (urgency: number, important: number) => {
  const isUrgent = urgency >= 6
  const isImportant = important >= 6
  
  if (isImportant && isUrgent) return 'Do First'
  if (isImportant && !isUrgent) return 'Schedule'
  if (!isImportant && isUrgent) return 'Delegate'
  return 'Eliminate'
}

const getQuadrantColor = (urgency: number, important: number) => {
  const quadrant = getQuadrant(urgency, important)
  const colors: Record<string, string> = {
    'Do First': 'bg-red-100 border-red-300',
    'Schedule': 'bg-blue-100 border-blue-300',
    'Delegate': 'bg-yellow-100 border-yellow-300',
    'Eliminate': 'bg-green-100 border-green-300'
  }
  return colors[quadrant] || 'bg-gray-100 border-gray-300'
}

const handleSelectCard = (cardId: string) => {
  cardStore.selectCard(cardId)
}
</script>

<template>
  <div class="flex-1 overflow-y-auto">
    <div v-if="cardStore.cards.length === 0" class="p-4 text-center text-gray-500">
      <p>No cards yet. Create one using the form below.</p>
    </div>
    
    <div v-else class="p-4 space-y-2">
      <div
        v-for="card in cardStore.cards"
        :key="card.id"
        @click="handleSelectCard(card.id)"
        :class="[
          'p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md',
          getQuadrantColor(card.urgency, card.important),
          cardStore.selectedCardId === card.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
        ]"
      >
        <h4 class="font-semibold text-gray-900 text-sm truncate">{{ card.title }}</h4>
        <p class="text-xs text-gray-600 mt-1">{{ getQuadrant(card.urgency, card.important) }}</p>
        <div class="flex justify-between items-center mt-2 text-xs text-gray-600">
          <span>U: {{ card.urgency }}</span>
          <span>I: {{ card.important }}</span>
          <span>E: {{ card.effort }}</span>
        </div>
        <p class="text-xs text-gray-700 mt-1">Owner: {{ card.owner }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
