// ===== File-Level Documentation =====
//
// useFlashStorage.ts
// -----------------------------------
// Pinia store for StudyDock flashcard app.
// - Manages study decks and flashcards.
// - Designed for mobile-first, offline-first Ghanaian context.
// - Now uses localForage for offline storage and sync logic.
// - Only saves and loads the decks and cards arrays (no versioning, no extra structure).
//
// Usage: Import this store in your components to access decks and cards.
//
// Dependencies: Pinia, Vue 3, TypeScript, localforage

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import localforage from 'localforage' // ===== [New Feature] START =====

/* ===== Types & Interfaces ===== */

/**
 * Represents a study deck (e.g., "Biology", "Math")
 */
export interface FlashDeck {
  id: string
  title: string
  subject: 'biology' | 'chemistry' | 'physics' | 'math' | 'history' | 'geography' | 'english' | 'general'
  cardCount: number
  description?: string
  createdAt: number // ===== [New Feature] START =====
  progress: number // Percentage from 0-100
  lastStudied?: string // Optional: ISO date string
}

/**
 * Represents a single flashcard (term/definition)
 */
export interface FlashCard {
  id: string
  term: string
  definition: string
  deckId: string // Reference to parent deck
}

/* ===== Constants & Config ===== */

// Keys for localForage storage
const STORAGE_KEYS = {
  decks: 'studydock-decks',
  cards: 'studydock-cards'
}

/* ===== Store Definition ===== */

/**
 * Pinia store for flashcard decks and cards.
 * - Holds state for decks and cards.
 * - Provides actions for adding/removing/editing decks/cards.
 * - Provides getters for filtered data.
 * - Persists data to localForage for offline support.
 * - Only saves and loads the decks and cards arrays (no versioning, no extra structure).
 */
export const useFlashStorage = defineStore('flashStorage', () => {
  // ===== State =====

  // List of all decks (default static data, will be replaced by localForage if available)
  const decks = ref<FlashDeck[]>([
    
  ])

  // List of all cards (default static data, will be replaced by localForage if available)
  const cards = ref<FlashCard[]>([
   
  ])

  // ===== [New Feature] START =====
  // Loading state for offline data
  const isLoading = ref(true)
  const error = ref<string | null>(null)
  // ===== [New Feature] END =====

  // ===== Getters =====

  /**
   * Get all decks
   */
  const allDecks = computed(() => decks.value)

  /**
   * Get all cards
   */
  const allCards = computed(() => cards.value)

  /**
   * Get cards for a specific deck
   * @param deckId - The ID of the deck
   * @returns Array of FlashCard
   */
  function getCardsByDeck(deckId: string): FlashCard[] {
    return cards.value.filter(card => card.deckId === deckId)
  }

  /**
   * Get the actual card count for a deck (computed dynamically)
   * This ensures the count is always accurate
   * @param deckId - The ID of the deck
   * @returns Number of cards in the deck
   */
  function getActualCardCount(deckId: string): number {
    return cards.value.filter(card => card.deckId === deckId).length
  }

  // ===== Helper Functions =====

  /**
   * Save decks and cards to localForage for offline persistence.
   * Only saves the decks and cards arrays (no versioning, no extra structure).
   */
  async function saveToStorage() {
    try {
      await localforage.setItem(STORAGE_KEYS.decks, JSON.parse(JSON.stringify(decks.value)))
      await localforage.setItem(STORAGE_KEYS.cards, JSON.parse(JSON.stringify(cards.value)))
    } catch (e) {
      // Simple error handling for Ghanaian users
      error.value = 'Could not save your flashcards. Try again later.'
    }
  }

  /**
   * Load decks and cards from localForage on app startup.
   * If no data is found, keep the default static data.
   * Only loads the decks and cards arrays (no versioning, no extra structure).
   * This function should be called in main.ts before app mount for best results.
   */
  async function loadFromStorage() {
    isLoading.value = true
    error.value = null
    try {
      // Only load the decks and cards arrays, ignore any extra structure
      const storedDecks = await localforage.getItem<FlashDeck[]>(STORAGE_KEYS.decks)
      const storedCards = await localforage.getItem<FlashCard[]>(STORAGE_KEYS.cards)
      if (Array.isArray(storedDecks)) {
        decks.value = storedDecks
      }
      if (Array.isArray(storedCards)) {
        cards.value = storedCards
      }
    } catch (e) {
      error.value = 'Could not load your flashcards. Working with default data.'
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Utility to clear all StudyDock flashcard data from localForage.
   * Use this if you want to reset storage or remove old/incorrect data.
   */
  async function clearFlashcardStorage() {
    try {
      await localforage.removeItem(STORAGE_KEYS.decks)
      await localforage.removeItem(STORAGE_KEYS.cards)
      // Optionally clear any other old keys you know about
    } catch (e) {
      error.value = 'Could not clear flashcard storage.'
    }
  }

  // ===== Actions =====

  /**
   * Add a new deck
   * @param deck - FlashDeck object
   */
  function addDeck(deck: FlashDeck) {
    decks.value.push(deck)
    saveToStorage()
  }

  /**
   * Add a new card
   * @param card - FlashCard object
   */
  function addCard(card: FlashCard) {
    cards.value.push(card)
    // Update the card count for the deck automatically
    const deck = decks.value.find(d => d.id === card.deckId)
    if (deck) {
      deck.cardCount = getActualCardCount(card.deckId)
    }
    saveToStorage()
  }

  /**
   * Remove a deck and its cards
   * @param deckId - ID of the deck to remove
   */
  function removeDeck(deckId: string) {
    decks.value = decks.value.filter(deck => deck.id !== deckId)
    cards.value = cards.value.filter(card => card.deckId !== deckId)
    saveToStorage()
  }

  /**
   * Remove a card by ID
   * @param cardId - ID of the card to remove
   */
  function removeCard(cardId: string) {
    const cardToRemove = cards.value.find(card => card.id === cardId)
    if (cardToRemove) {
      cards.value = cards.value.filter(card => card.id !== cardId)
      const deck = decks.value.find(d => d.id === cardToRemove.deckId)
      if (deck) {
        deck.cardCount = getActualCardCount(cardToRemove.deckId)
      }
      saveToStorage()
    }
  }

  // ===== [New Feature] START =====
  /**
   * Edit an existing card by ID.
   * @param updatedCard - FlashCard object with updated fields (must include id)
   * - Finds the card by id and updates its fields.
   * - If deckId changes, updates card counts for both old and new decks.
   * - Saves changes to localForage.
   */
  function editCard(updatedCard: FlashCard) {
    // Find the index of the card to update
    const index = cards.value.findIndex(card => card.id === updatedCard.id)
    if (index !== -1) {
      const oldDeckId = cards.value[index].deckId
      // Update the card in place
      cards.value[index] = { ...updatedCard }
      // If the card was moved to a different deck, update card counts for both decks
      if (oldDeckId !== updatedCard.deckId) {
        const oldDeck = decks.value.find(d => d.id === oldDeckId)
        if (oldDeck) oldDeck.cardCount = getActualCardCount(oldDeckId)
        const newDeck = decks.value.find(d => d.id === updatedCard.deckId)
        if (newDeck) newDeck.cardCount = getActualCardCount(updatedCard.deckId)
      } else {
        // Otherwise, just update the card count for the current deck
        const deck = decks.value.find(d => d.id === updatedCard.deckId)
        if (deck) deck.cardCount = getActualCardCount(updatedCard.deckId)
      }
      saveToStorage()
    }
  }
  // ===== [New Feature] END =====

  // ===== [New Feature] START =====
  // Watch for changes to decks and cards and auto-save (for direct mutations)
  watch(decks, saveToStorage, { deep: true })
  watch(cards, saveToStorage, { deep: true })

  // NOTE: Do NOT call loadFromStorage here with onMounted.
  // Instead, call loadFromStorage() in main.ts before mounting the app.
  // This ensures data is loaded BEFORE the UI renders, preventing data loss on refresh.
  // ===== [New Feature] END =====

  // ===== Return Store API =====

  return {
    // State
    decks,
    cards,
    isLoading, // For UI loading states
    error,     // For UI error states

    // Getters
    allDecks,
    allCards,
    getCardsByDeck,
    getActualCardCount,

    // Actions
    addDeck,
    addCard,
    removeDeck,
    removeCard,
    editCard, // ===== [New Feature] START =====

    // Persistence
    loadFromStorage,
    saveToStorage,
    clearFlashcardStorage // Utility for clearing storage
  }
})

/* ===== End of File ===== */