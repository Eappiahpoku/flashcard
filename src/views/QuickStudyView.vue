<!--
  QuickStudyView.vue
  -----------------------------------
  Mixed study session from all decks - lets users study flashcards from all their decks at once.
  - Mobile-first, offline-first, Ghana-optimized.
  - Loads all flashcards from all decks in the Pinia store.
  - Shows term first, then reveals definition on tap/click.
  - User marks correct/wrong with round icons, then advances to next card.
  - <!-- ===== [New Feature] START ===== --> Now saves wrong cards to localStorage for ReviewModeView.
  - Works completely offline using cached flashcards.
  - No dependencies on external APIs.
-->

<template>
  <!-- ===== Main Container ===== -->
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- ===== Header with StudyDock Logo and App Name ===== -->
    <header class="flex items-center justify-between px-4 py-3 bg-primary text-white shadow-md">
      <!-- StudyDock Logo on the left -->
      <div class="flex items-center">
        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
        </svg>
      </div>
      <!-- App Name on the right -->
      <span class="text-lg font-bold tracking-wide">Quick Study</span>
    </header>

    <!-- ===== Loading State ===== -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p class="text-gray-600">Loading your flashcards...</p>
      </div>
    </div>

    <!-- ===== Empty State (No Cards) ===== -->
    <div v-else-if="allCards.length === 0" class="flex-1 flex items-center justify-center p-4">
      <div class="text-center max-w-sm">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
        <h3 class="text-lg font-semibold text-gray-700 mb-2">No flashcards available</h3>
        <p class="text-gray-500 mb-4">Create some decks and add flashcards to start studying!</p>
        <button
          @click="goHome"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          aria-label="Go to home"
        >
          Go to Home
        </button>
      </div>
    </div>

    <!-- ===== Study Session Complete ===== -->
    <div v-else-if="isComplete" class="flex-1 flex items-center justify-center p-4">
      <div class="text-center max-w-sm bg-white rounded-lg shadow-lg p-6">
        <div class="text-3xl mb-4">🎉</div>
        <h2 class="text-2xl font-bold text-primary mb-4">Study Complete!</h2>
        <div class="mb-2 text-lg text-gray-700">
          Correct: <span class="text-green-600 font-bold">{{ correctCount }}</span>
        </div>
        <div class="mb-6 text-lg text-gray-700">
          Wrong: <span class="text-red-600 font-bold">{{ wrongCount }}</span>
        </div>
        <div class="flex flex-col gap-3">
          <button
            @click="restartSession"
            class="px-6 py-3 bg-primary text-white rounded-lg font-semibold text-lg shadow hover:bg-primary-hover transition"
            aria-label="Study again"
          >
            Study Again
          </button>
          <button
            @click="goHome"
            class="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold text-lg shadow hover:bg-gray-300 transition"
            aria-label="Go to home"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>

    <!-- ===== Active Study Session ===== -->
    <div v-else class="flex-1 flex flex-col">
      <!-- ===== Progress Indicator ===== -->
      <div class="bg-white shadow-sm px-4 py-3">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-500">
            Card {{ currentIndex + 1 }} of {{ allCards.length }}
          </span>
          <span class="text-sm text-gray-500">
            {{ correctCount }} <span class="text-green-600 font-bold">✔</span>
            /
            {{ wrongCount }} <span class="text-red-600 font-bold">✘</span>
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-primary h-2 rounded-full transition-all duration-300"
            :style="{ width: `${(currentIndex / allCards.length) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- ===== Flashcard Display ===== -->
      <div class="flex-1 flex items-center justify-center p-4">
        <div class="w-full max-w-md">
          <!-- ===== Show Term (tap to reveal definition) ===== -->
          <div
            v-if="!showDefinition"
            class="bg-white rounded-lg shadow-lg p-6 text-center cursor-pointer transition-transform active:scale-95"
            @click="revealDefinition"
            tabindex="0"
            @keydown.enter="revealDefinition"
            @keydown.space.prevent="revealDefinition"
            role="button"
            aria-label="Show definition"
          >
            <div class="text-xl font-bold text-gray-900 mb-6">
              {{ currentCard.term }}
            </div>
            <div class="text-gray-500 text-base">
              Tap to show definition
            </div>
            <div class="mt-4 text-xs text-gray-400">
              From: {{ getDeckName(currentCard.deckId) }}
            </div>
          </div>

          <!-- ===== Show Definition with Round Answer Buttons ===== -->
          <div v-else class="bg-white rounded-lg shadow-lg p-6 text-center">
            <div class="text-xl font-bold text-gray-900 mb-4">
              {{ currentCard.term }}
            </div>
            <div class="bg-blue-50 rounded-lg p-4 mb-6">
              <div class="text-blue-700 text-lg font-medium">
                {{ currentCard.definition }}
              </div>
            </div>
            <div class="text-xs text-gray-400 mb-6">
              From: {{ getDeckName(currentCard.deckId) }}
            </div>
            
            <!-- ===== Round Correct/Wrong Buttons ===== -->
            <div class="flex gap-8 justify-center">
              <button
                @click="markCorrect"
                class="w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
                aria-label="Mark correct"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                @click="markWrong"
                class="w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
                aria-label="Mark wrong"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== Quick Actions ===== -->
      <div class="bg-white border-t border-gray-200 p-4">
        <div class="flex gap-3">
          <button
            @click="goHome"
            class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition"
            aria-label="Exit study session"
          >
            Exit
          </button>
          <button
            @click="shuffleCards"
            class="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition"
            aria-label="Shuffle cards"
          >
            Shuffle
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ===== File-Level Documentation =====
// QuickStudyView.vue: Mixed study session from all decks.
// Loads all flashcards from all decks in Pinia store for offline study.
// <!-- ===== [New Feature] START ===== --> Now saves wrong cards to localStorage for ReviewModeView.

// ===== Imports =====
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFlashStorage } from '@/stores/useFlashStorage'
import { storeToRefs } from 'pinia'

// ===== Types & Interfaces =====
/**
 * Flashcard type for study session.
 */
interface StudyCard {
  id: string
  term: string
  definition: string
  deckId: string
}

// ===== Main Logic =====
const router = useRouter()
const flashStorage = useFlashStorage()
const { decks, cards } = storeToRefs(flashStorage)

/**
 * Loading state for initial data fetch.
 */
const isLoading = ref(true)

/**
 * Index of the current flashcard being studied.
 */
const currentIndex = ref(0)

/**
 * Whether the definition is currently shown.
 */
const showDefinition = ref(false)

/**
 * Track correct and wrong counts.
 */
const correctCount = ref(0)
const wrongCount = ref(0)

/**
 * All flashcards from all decks, shuffled for mixed study.
 */
const allCards = ref<StudyCard[]>([])

/**
 * Whether the study session is complete.
 */
const isComplete = computed(() => currentIndex.value >= allCards.value.length)

/**
 * The current flashcard being studied.
 */
const currentCard = computed(() => allCards.value[currentIndex.value] || { id: '', term: '', definition: '', deckId: '' })

// ===== [New Feature] START: Review Data Management =====
/**
 * Save review data to localStorage for ReviewModeView to use.
 * @param cardId - The ID of the card
 * @param wasCorrect - Whether the card was answered correctly
 */
function saveReviewData(cardId: string, wasCorrect: boolean) {
  try {
    // Get existing review data from localStorage
    const reviewData = JSON.parse(localStorage.getItem('reviewCards') || '{}')
    
    // Initialize card data if it doesn't exist
    if (!reviewData[cardId]) {
      reviewData[cardId] = {
        wrongCount: 0,
        lastReviewDate: 0,
        lastCorrectDate: null
      }
    }
    
    // Update review data based on answer
    reviewData[cardId].lastReviewDate = Date.now()
    
    if (wasCorrect) {
      // Mark when it was last answered correctly
      reviewData[cardId].lastCorrectDate = Date.now()
    } else {
      // Increment wrong count for review tracking
      reviewData[cardId].wrongCount = (reviewData[cardId].wrongCount || 0) + 1
    }
    
    // Save back to localStorage
    localStorage.setItem('reviewCards', JSON.stringify(reviewData))
  } catch (error) {
    console.error('Error saving review data:', error)
  }
}
// ===== [New Feature] END =====

/**
 * Load all flashcards from all decks and shuffle them.
 */
function loadAllCards() {
  isLoading.value = true
  
  // Get all cards from the store and format them for study
  const formattedCards: StudyCard[] = cards.value.map(card => ({
    id: card.id,
    term: card.term,
    definition: card.definition,
    deckId: card.deckId
  }))
  
  // Shuffle the cards for mixed study
  allCards.value = shuffleArray(formattedCards)
  
  isLoading.value = false
}

/**
 * Shuffle an array using Fisher-Yates algorithm.
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Get deck name by deck ID.
 */
function getDeckName(deckId: string): string {
  const deck = decks.value.find(d => d.id === deckId)
  return deck ? deck.title : 'Unknown Deck'
}

/**
 * Reveal the definition (when user taps/clicks the card).
 */
function revealDefinition() {
  if (!showDefinition.value && !isComplete.value) {
    showDefinition.value = true
  }
}

/**
 * Mark the current card as correct and move to next.
 * <!-- ===== [New Feature] START ===== --> Now saves correct answers to localStorage.
 */
function markCorrect() {
  if (!isComplete.value) {
    correctCount.value++
    // Save that this card was answered correctly
    saveReviewData(currentCard.value.id, true)
    nextCard()
  }
}

/**
 * Mark the current card as wrong and move to next.
 * <!-- ===== [New Feature] START ===== --> Now saves wrong answers to localStorage for ReviewModeView.
 */
function markWrong() {
  if (!isComplete.value) {
    wrongCount.value++
    // Save that this card was answered incorrectly for review
    saveReviewData(currentCard.value.id, false)
    nextCard()
  }
}

/**
 * Advance to the next card.
 */
function nextCard() {
  showDefinition.value = false
  currentIndex.value++
}

/**
 * Restart the study session with shuffled cards.
 */
function restartSession() {
  currentIndex.value = 0
  correctCount.value = 0
  wrongCount.value = 0
  showDefinition.value = false
  allCards.value = shuffleArray(allCards.value)
}

/**
 * Shuffle the current deck of cards.
 */
function shuffleCards() {
  // Keep current progress but shuffle remaining cards
  const remainingCards = allCards.value.slice(currentIndex.value)
  const shuffledRemaining = shuffleArray(remainingCards)
  allCards.value = [
    ...allCards.value.slice(0, currentIndex.value),
    ...shuffledRemaining
  ]
}

/**
 * Navigate back to home.
 */
function goHome() {
  router.push({ name: 'home' })
}

// ===== Lifecycle =====
onMounted(() => {
  loadAllCards()
})
</script>

<!--
  All styling is via Tailwind utility classes in the template.
  No <style> block needed per StudyDock guidelines.
-->