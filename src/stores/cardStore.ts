import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

// Database row type (snake_case)
type DbCard = Database['public']['Tables']['cards']['Row']
type DbCardInsert = Database['public']['Tables']['cards']['Insert']
type DbCardUpdate = Database['public']['Tables']['cards']['Update']

// Application Card interface (camelCase)
export interface Card {
  id: string
  title: string
  urgency: number // 1-10
  important: number // 1-10
  effort: string
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

// Helper function to transform database row to Card object
function dbRowToCard(row: DbCard): Card {
  return {
    id: row.id,
    title: row.title,
    urgency: row.urgency,
    important: row.important,
    effort: row.effort,
    owner: row.owner,
    createdAt: new Date(row.created_at),
    reach: row.reach,
    impact: row.impact,
    confidence: row.confidence,
    effortMonths: row.effort_months
  }
}

// Helper function to transform Card to database insert format
function cardToDbInsert(card: Omit<Card, 'id' | 'createdAt'>): Omit<DbCardInsert, 'id' | 'created_at'> {
  return {
    title: card.title,
    urgency: card.urgency,
    important: card.important,
    effort: card.effort,
    owner: card.owner,
    reach: card.reach,
    impact: card.impact,
    confidence: card.confidence,
    effort_months: card.effortMonths
  }
}

// Helper function to transform Card updates to database update format
function cardToDbUpdate(updates: Partial<Omit<Card, 'id' | 'createdAt'>>): DbCardUpdate {
  const dbUpdate: DbCardUpdate = {}

  if (updates.title !== undefined) dbUpdate.title = updates.title
  if (updates.urgency !== undefined) dbUpdate.urgency = updates.urgency
  if (updates.important !== undefined) dbUpdate.important = updates.important
  if (updates.effort !== undefined) dbUpdate.effort = updates.effort
  if (updates.owner !== undefined) dbUpdate.owner = updates.owner
  if (updates.reach !== undefined) dbUpdate.reach = updates.reach
  if (updates.impact !== undefined) dbUpdate.impact = updates.impact
  if (updates.confidence !== undefined) dbUpdate.confidence = updates.confidence
  if (updates.effortMonths !== undefined) dbUpdate.effort_months = updates.effortMonths

  return dbUpdate
}

export const useCardStore = defineStore('card', () => {
  const cards = ref<Card[]>([])
  const selectedCardId = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const selectedCard = computed(() => {
    return cards.value.find(card => card.id === selectedCardId.value)
  })

  // Fetch all cards from Supabase
  const fetchCards = async () => {
    isLoading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        console.error('Error fetching cards:', fetchError)
        error.value = 'Failed to load cards. Please try again.'
        throw fetchError
      }

      if (data) {
        cards.value = data.map(dbRowToCard)
      }
    } catch (err) {
      console.error('Error in fetchCards:', err)
      error.value = 'Failed to load cards. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  // Add a new card to Supabase
  const addCard = async (card: Omit<Card, 'id' | 'createdAt'>) => {
    error.value = null

    try {
      const dbCard = cardToDbInsert(card)
      const { data, error: insertError } = await supabase
        .from('cards')
        .insert(dbCard)
        .select()
        .single()

      if (insertError) {
        console.error('Error adding card:', insertError)
        error.value = 'Failed to add card. Please try again.'
        throw insertError
      }

      if (data) {
        const newCard = dbRowToCard(data)
        cards.value.unshift(newCard)
        return newCard
      }
    } catch (err) {
      console.error('Error in addCard:', err)
      error.value = 'Failed to add card. Please try again.'
      throw err
    }
  }

  // Update an existing card in Supabase
  const updateCard = async (id: string, updates: Partial<Omit<Card, 'id' | 'createdAt'>>) => {
    error.value = null

    try {
      const dbUpdates = cardToDbUpdate(updates)
      const { data, error: updateError } = await supabase
        .from('cards')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating card:', updateError)
        error.value = 'Failed to update card. Please try again.'
        throw updateError
      }

      if (data) {
        const updatedCard = dbRowToCard(data)
        const cardIndex = cards.value.findIndex(c => c.id === id)
        if (cardIndex !== -1) {
          cards.value[cardIndex] = updatedCard
        }
      }
    } catch (err) {
      console.error('Error in updateCard:', err)
      error.value = 'Failed to update card. Please try again.'
      throw err
    }
  }

  // Delete a card from Supabase
  const deleteCard = async (id: string) => {
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('cards')
        .delete()
        .eq('id', id)

      if (deleteError) {
        console.error('Error deleting card:', deleteError)
        error.value = 'Failed to delete card. Please try again.'
        throw deleteError
      }

      // Remove from local state
      cards.value = cards.value.filter(c => c.id !== id)
      if (selectedCardId.value === id) {
        selectedCardId.value = null
      }
    } catch (err) {
      console.error('Error in deleteCard:', err)
      error.value = 'Failed to delete card. Please try again.'
      throw err
    }
  }

  // Selection actions remain synchronous (no DB interaction)
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
    isLoading,
    error,
    fetchCards,
    addCard,
    updateCard,
    deleteCard,
    selectCard,
    clearSelection
  }
})
