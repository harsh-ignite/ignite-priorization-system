import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Card {
  id: string
  title: string
  urgency: number // 1-10
  important: number // 1-10
  effort: number // 1-10
  owner: string
  createdAt: Date
  // RICE Framework fields
  reach: number // number of customer leads
  impact: number // 3, 2, 1, 0.5, 0.25
  confidence: number // 0-100 percentage
  effortMonths: number // person-months
}
export function calculateRICEScore(card: Card): number {
  // Formula: (Reach * Impact * Confidence) / Effort
  if (card.effortMonths === 0) return 0
  return (card.reach * card.impact * (card.confidence / 100)) / card.effortMonths
}

export const useCardStore = defineStore('card', () => {
  const cards = ref<Card[]>([])
  const selectedCardId = ref<string | null>(null)

  const selectedCard = computed(() => {
    return cards.value.find(card => card.id === selectedCardId.value)
  })

  const addCard = (card: Omit<Card, 'id' | 'createdAt'>) => {
    const newCard: Card = {
      ...card,
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    }
    cards.value.unshift(newCard)
    return newCard
  }

  const updateCard = (id: string, updates: Partial<Omit<Card, 'id' | 'createdAt'>>) => {
    const cardIndex = cards.value.findIndex(c => c.id === id)
    if (cardIndex !== -1) {
      cards.value[cardIndex] = {
        ...cards.value[cardIndex],
        ...updates
      } as Card
    }
  }

  const deleteCard = (id: string) => {
    cards.value = cards.value.filter(c => c.id !== id)
    if (selectedCardId.value === id) {
      selectedCardId.value = null
    }
  }

  const selectCard = (id: string) => {
    selectedCardId.value = id
  }

  const clearSelection = () => {
    selectedCardId.value = null
  }

  return {
    cards,
    selectedCardId,
    selectedCard,
    addCard,
    updateCard,
    deleteCard,
    selectCard,
    clearSelection
  }
},
  {
    persist: true, // Enable persistence for this store
  })
