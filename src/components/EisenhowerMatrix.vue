<script setup lang="ts">
import { useCardStore, calculateRICEScore } from '../stores/cardStore'
import type { Card } from '../stores/cardStore'

const cardStore = useCardStore()

const getQuadrant = (urgency: number, important: number) => {
  const isUrgent = urgency >= 6
  const isImportant = important >= 6
  
  if (isImportant && isUrgent) return 'Do First'
  if (isImportant && !isUrgent) return 'Schedule'
  if (!isImportant && isUrgent) return 'Delegate'
  return 'Eliminate'
}

const getQuadrantCards = (quadrant: string): Card[] => {
  return cardStore.cards.filter(card => {
    return getQuadrant(card.urgency, card.important) === quadrant
  })
}

interface Quadrant {
  name: string
  color: string
  borderColor: string
  textColor: string
  bgCard: string
}

const quadrants: Quadrant[] = [
  { name: 'Do First', color: 'bg-red-50', borderColor: 'border-red-300', textColor: 'text-red-900', bgCard: 'bg-red-100' },
  { name: 'Schedule', color: 'bg-blue-50', borderColor: 'border-blue-300', textColor: 'text-blue-900', bgCard: 'bg-blue-100' },
  { name: 'Delegate', color: 'bg-yellow-50', borderColor: 'border-yellow-300', textColor: 'text-yellow-900', bgCard: 'bg-yellow-100' },
  { name: 'Eliminate', color: 'bg-green-50', borderColor: 'border-green-300', textColor: 'text-green-900', bgCard: 'bg-green-100' }
]

const handleCardClick = (cardId: string) => {
  cardStore.selectCard(cardId)
}
</script>

<template>
  <div class="flex-1 flex flex-col h-full bg-white p-6">
    <!-- Title -->
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Eisenhower Matrix</h2>
    
    <!-- Matrix Grid -->
    <div class="flex-1 grid grid-cols-2 gap-4 min-h-0">
      <!-- Do First (Important & Urgent) -->
      <div :class="['border-2 rounded-lg p-4 overflow-hidden flex flex-col', quadrants[0]?.color, quadrants[0]?.borderColor]">
        <h3 :class="['text-lg font-bold mb-3', quadrants[0]?.textColor]">
          Do First
        </h3>
        <p class="text-xs text-gray-600 mb-3">Important & Urgent</p>
        <div class="flex-1 overflow-y-auto space-y-2">
          <div
            v-for="card in getQuadrantCards('Do First')"
            :key="card.id"
            @click="handleCardClick(card.id)"
            :class="[
              'p-2 rounded cursor-pointer transition-all duration-200 hover:shadow-md',
              quadrants[0]?.bgCard,
              cardStore.selectedCardId === card.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
            ]"
          >
            <div class="flex justify-between items-start gap-1">
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-gray-900 truncate">{{ card.title }}</p>
                <p class="text-xs text-gray-600">{{ card.owner }}</p>
              </div>
              <div class="text-right flex-shrink-0">
                <p class="text-xs font-bold text-purple-700">{{ calculateRICEScore(card).toFixed(1) }}</p>
              </div>
            </div>
          </div>
          <div v-if="getQuadrantCards('Do First').length === 0" class="text-xs text-gray-400 text-center py-4">
            No tasks
          </div>
        </div>
      </div>

      <!-- Schedule (Important & Not Urgent) -->
      <div :class="['border-2 rounded-lg p-4 overflow-hidden flex flex-col', quadrants[1]?.color, quadrants[1]?.borderColor]">
        <h3 :class="['text-lg font-bold mb-3', quadrants[1]?.textColor]">
          Schedule
        </h3>
        <p class="text-xs text-gray-600 mb-3">Important & Not Urgent</p>
        <div class="flex-1 overflow-y-auto space-y-2">
          <div
            v-for="card in getQuadrantCards('Schedule')"
            :key="card.id"
            @click="handleCardClick(card.id)"
            :class="[
              'p-2 rounded cursor-pointer transition-all duration-200 hover:shadow-md',
              quadrants[1]?.bgCard,
              cardStore.selectedCardId === card.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
            ]"
          >
            <div class="flex justify-between items-start gap-1">
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-gray-900 truncate">{{ card.title }}</p>
                <p class="text-xs text-gray-600">{{ card.owner }}</p>
              </div>
              <div class="text-right flex-shrink-0">
                <p class="text-xs font-bold text-purple-700">{{ calculateRICEScore(card).toFixed(1) }}</p>
              </div>
            </div>
          </div>
          <div v-if="getQuadrantCards('Schedule').length === 0" class="text-xs text-gray-400 text-center py-4">
            No tasks
          </div>
        </div>
      </div>

      <!-- Delegate (Not Important & Urgent) -->
      <div :class="['border-2 rounded-lg p-4 overflow-hidden flex flex-col', quadrants[2]?.color, quadrants[2]?.borderColor]">
        <h3 :class="['text-lg font-bold mb-3', quadrants[2]?.textColor]">
          Delegate
        </h3>
        <p class="text-xs text-gray-600 mb-3">Not Important & Urgent</p>
        <div class="flex-1 overflow-y-auto space-y-2">
          <div
            v-for="card in getQuadrantCards('Delegate')"
            :key="card.id"
            @click="handleCardClick(card.id)"
            :class="[
              'p-2 rounded cursor-pointer transition-all duration-200 hover:shadow-md',
              quadrants[2]?.bgCard,
              cardStore.selectedCardId === card.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
            ]"
          >
            <div class="flex justify-between items-start gap-1">
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-gray-900 truncate">{{ card.title }}</p>
                <p class="text-xs text-gray-600">{{ card.owner }}</p>
              </div>
              <div class="text-right flex-shrink-0">
                <p class="text-xs font-bold text-purple-700">{{ calculateRICEScore(card).toFixed(1) }}</p>
              </div>
            </div>
          </div>
          <div v-if="getQuadrantCards('Delegate').length === 0" class="text-xs text-gray-400 text-center py-4">
            No tasks
          </div>
        </div>
      </div>

      <!-- Eliminate (Not Important & Not Urgent) -->
      <div :class="['border-2 rounded-lg p-4 overflow-hidden flex flex-col', quadrants[3]?.color, quadrants[3]?.borderColor]">
        <h3 :class="['text-lg font-bold mb-3', quadrants[3]?.textColor]">
          Eliminate
        </h3>
        <p class="text-xs text-gray-600 mb-3">Not Important & Not Urgent</p>
        <div class="flex-1 overflow-y-auto space-y-2">
          <div
            v-for="card in getQuadrantCards('Eliminate')"
            :key="card.id"
            @click="handleCardClick(card.id)"
            :class="[
              'p-2 rounded cursor-pointer transition-all duration-200 hover:shadow-md',
              quadrants[3]?.bgCard,
              cardStore.selectedCardId === card.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
            ]"
          >
            <div class="flex justify-between items-start gap-1">
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-gray-900 truncate">{{ card.title }}</p>
                <p class="text-xs text-gray-600">{{ card.owner }}</p>
              </div>
              <div class="text-right flex-shrink-0">
                <p class="text-xs font-bold text-purple-700">{{ calculateRICEScore(card).toFixed(1) }}</p>
              </div>
            </div>
          </div>
          <div v-if="getQuadrantCards('Eliminate').length === 0" class="text-xs text-gray-400 text-center py-4">
            No tasks
          </div>
        </div>
      </div>
    </div>

    <!-- Axis Labels -->
    <div class="mt-4 flex justify-between text-sm text-gray-600">
      <div class="flex-1 text-center">
        <p class="font-semibold">← More Urgent | Less Urgent →</p>
      </div>
    </div>
    <div class="flex justify-between text-sm text-gray-600 mt-2">
      <div class="text-center">
        <p class="font-semibold">↑ More Important</p>
      </div>
      <div class="text-center">
        <p class="font-semibold">Less Important ↓</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
