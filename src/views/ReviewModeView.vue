<!--
  ReviewModeView.vue
  -----------------------------------
  Review mode that shows only cards the user got wrong in previous study sessions.
  - Mobile-first, offline-first, Ghana-optimized.
  - Loads only previously incorrect flashcards from the Pinia store.
  - Shows term first, then reveals definition on tap/click.
  - User marks correct/wrong with round icons, then advances to next card.
  - Tracks which cards need more review based on performance.
  - Works completely offline using cached review data.
  - No dependencies on external APIs.
-->

<template>
  <!-- ===== Main Container ===== -->
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- ===== Header with StudyDock Logo and App Name ===== -->
    <header class="flex items-center justify-between px-4 py-3 bg-secondary text-white shadow-md">
      <!-- StudyDock Logo on the left -->
      <div class="flex items-center">
        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
        </svg>
      </div>
      <!-- App Name on the right -->
      <span class="text-lg font-bold tracking-wide">Review Mode</span>
    </header>

    <!-- ===== Loading State ===== -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p class="text-gray-600">Loading cards to review...</p>
      </div>
    </div>

    <!-- ===== Empty State (No Cards to Review) ===== -->
    <div v-else-if="reviewCards.length === 0" class="flex-1 flex items-center justify-center p-4">
      <div class="text-center max-w-sm">
        <svg class="w-16 h-16 mx-auto text-green-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Great work! No cards to review</h3>
        <p class="text-gray-500 mb-4">You haven't gotten any cards wrong recently. Keep studying to add more cards here!</p>
        <div class="flex flex-col gap-3">
          <button
            @click="goToQuickStudy"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
            aria-label="Go to Quick Study"
          >
            Quick Study
          </button>
          <button
            @click="goHome"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            aria-label="Go to home"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>

    <!-- ===== Review Session Complete ===== -->
    <div v-else-if="isComplete" class="flex-1 flex items-center justify-center p-4">
      <div class="text-center max-w-sm bg-white rounded-lg shadow-lg p-6">
        <div class="text-3xl mb-4">📚</div>
        <h2 class="text-2xl font-bold text-secondary mb-4">Review Complete!</h2>
        <div class="mb-2 text-lg text-gray-700">
          Improved: <span class="text-green-600 font-bold">{{ correctCount }}</span>
        </div>
        <div class="mb-6 text-lg text-gray-700">
          Need More Review: <span class="text-red-600 font-bold">{{ wrongCount }}</span>
        </div>
        <div class="flex flex-col gap-3">
          <button
            @click="restartSession"
            class="px-6 py-3 bg-secondary text-white rounded-lg font-semibold text-lg shadow hover:bg-secondary-hover transition"
            aria-label="Review again"
          >
            Review Again
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

    <!-- ===== Active Review Session ===== -->
    <div v-else class="flex-1 flex flex-col">
      <!-- ===== Progress Indicator ===== -->
      <div class="bg-white shadow-sm px-4 py-3">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-500">
            Card {{ currentIndex + 1 }} of {{ reviewCards.length }}
          </span>
          <span class="text-sm text-gray-500">
            {{ correctCount }} <span class="text-green-600 font-bold">✔</span>
            /
            {{ wrongCount }} <span class="text-red-600 font-bold">✘</span>
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-secondary h-2 rounded-full transition-all duration-300"
            :style="{ width: `${(currentIndex / reviewCards.length) * 100}%` }"
          ></div>
        </div>
        <!-- Review indicator -->
        <div class="flex items-center mt-2">
          <svg class="w-4 h-4 text-orange-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-xs text-orange-600 font-medium">Review Mode - Previously Incorrect Cards</span>
        </div>
      </div>

      <!-- ===== Flashcard Display ===== -->
      <div class="flex-1 flex items-center justify-center p-4">
        <div class="w-full max-w-md">
          <!-- ===== Show Term (tap to reveal definition) ===== -->
          <div
            v-if="!showDefinition"
            class="bg-white rounded-lg shadow-lg p-6 text-center cursor-pointer transition-transform active:scale-95 border-l-4 border-orange-400"
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
            <div class="mt-2 text-xs text-orange-600 font-medium">
              Wrong {{ currentCard.wrongCount }} time{{ currentCard.wrongCount > 1 ? 's' : '' }}
            </div>
          </div>

          <!-- ===== Show Definition with Round Answer Buttons ===== -->
          <div v-else class="bg-white rounded-lg shadow-lg p-6 text-center border-l-4 border-orange-400">
            <div class="text-xl font-bold text-gray-900 mb-4">
              {{ currentCard.term }}
            </div>
            <div class="bg-blue-50 rounded-lg p-4 mb-6">
              <div class="text-blue-700 text-lg font-medium">
                {{ currentCard.definition }}
              </div>
            </div>
            <div class="text-xs text-gray-400 mb-4">
              From: {{ getDeckName(currentCard.deckId) }}
            </div>
            <div class="text-xs text-orange-600 font-medium mb-6">
              Wrong {{ currentCard.wrongCount }} time{{ currentCard.wrongCount > 1 ? 's' : '' }}
            </div>
            
            <!-- ===== Round Correct/Wrong Buttons ===== -->
            <div class="flex gap-8 justify-center">
              <button
                @click="markCorrect"
                class="w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
                aria-label="Mark correct - remove from review"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                @click="markWrong"
                class="w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
                aria-label="Mark wrong - keep in review"
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
            aria-label="Exit review session"
          >
            Exit
          </button>
          <button
            @click="shuffleCards"
            class="flex-1 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-medium hover:bg-orange-200 transition"
            aria-label="Shuffle review cards"
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
// ReviewModeView.vue: Review session for previously incorrect cards.
// Loads only flashcards that the user has gotten wrong in previous study sessions.
// Tracks review performance and updates offline review data.

// ===== Imports =====
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFlashStorage } from '@/stores/useFlashStorage'
import { storeToRefs } from 'pinia'

// ===== Types & Interfaces =====
/**
 * Review card type that includes wrong count for tracking.
 */
interface ReviewCard {
  id: string
  term: string
  definition: string
  deckId: string
  wrongCount: number
  lastReviewDate: number
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
 * Index of the current flashcard being reviewed.
 */
const currentIndex = ref(0)

/**
 * Whether the definition is currently shown.
 */
const showDefinition = ref(false)

/**
 * Track correct and wrong counts for this review session.
 */
const correctCount = ref(0)
const wrongCount = ref(0)

/**
 * Cards that need review (previously answered incorrectly).
 */
const reviewCards = ref<ReviewCard[]>([])

/**
 * Whether the review session is complete.
 */
const isComplete = computed(() => currentIndex.value >= reviewCards.value.length)

/**
 * The current flashcard being reviewed.
 */
const currentCard = computed(() => reviewCards.value[currentIndex.value] || { 
  id: '', 
  term: '', 
  definition: '', 
  deckId: '', 
  wrongCount: 0, 
  lastReviewDate: 0 
})

/**
 * Load cards that need review from offline storage.
 */
function loadReviewCards() {
  isLoading.value = true
  
  try {
    // Get review data from localStorage (offline storage)
    const reviewData = JSON.parse(localStorage.getItem('reviewCards') || '{}')
    
    // Filter cards that exist in current decks and have been marked wrong
    const cardsToReview: ReviewCard[] = []
    
    for (const cardId in reviewData) {
      const reviewInfo = reviewData[cardId]
      const card = cards.value.find(c => c.id === cardId)
      
      // Only include cards that:
      // 1. Still exist in the current decks
      // 2. Have been answered wrong at least once
      // 3. Haven't been correctly answered recently (last 24 hours)
      if (card && reviewInfo.wrongCount > 0) {
        const timeSinceLastCorrect = Date.now() - (reviewInfo.lastCorrectDate || 0)
        const shouldReview = timeSinceLastCorrect > 24 * 60 * 60 * 1000 || !reviewInfo.lastCorrectDate
        
        if (shouldReview) {
          cardsToReview.push({
            id: card.id,
            term: card.term,
            definition: card.definition,
            deckId: card.deckId,
            wrongCount: reviewInfo.wrongCount,
            lastReviewDate: reviewInfo.lastReviewDate || 0
          })
        }
      }
    }
    
    // Sort by wrong count (most wrong first) and then by last review date
    cardsToReview.sort((a, b) => {
      if (a.wrongCount !== b.wrongCount) {
        return b.wrongCount - a.wrongCount
      }
      return a.lastReviewDate - b.lastReviewDate
    })
    
    reviewCards.value = cardsToReview
  } catch (error) {
    console.error('Error loading review cards:', error)
    reviewCards.value = []
  }
  
  isLoading.value = false
}

/**
 * Save review data to offline storage.
 */
function saveReviewData(cardId: string, wasCorrect: boolean) {
  try {
    const reviewData = JSON.parse(localStorage.getItem('reviewCards') || '{}')
    
    if (!reviewData[cardId]) {
      reviewData[cardId] = {
        wrongCount: 0,
        lastReviewDate: 0,
        lastCorrectDate: null
      }
    }
    
    reviewData[cardId].lastReviewDate = Date.now()
    
    if (wasCorrect) {
      reviewData[cardId].lastCorrectDate = Date.now()
      // Don't reset wrong count, just mark when it was last correct
    } else {
      reviewData[cardId].wrongCount = (reviewData[cardId].wrongCount || 0) + 1
    }
    
    localStorage.setItem('reviewCards', JSON.stringify(reviewData))
  } catch (error) {
    console.error('Error saving review data:', error)
  }
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
 * Remove from review queue if answered correctly.
 */
function markCorrect() {
  if (!isComplete.value) {
    correctCount.value++
    saveReviewData(currentCard.value.id, true)
    nextCard()
  }
}

/**
 * Mark the current card as wrong and move to next.
 * Keep in review queue for future sessions.
 */
function markWrong() {
  if (!isComplete.value) {
    wrongCount.value++
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
 * Restart the review session with shuffled cards.
 */
function restartSession() {
  currentIndex.value = 0
  correctCount.value = 0
  wrongCount.value = 0
  showDefinition.value = false
  reviewCards.value = shuffleArray(reviewCards.value)
}

/**
 * Shuffle the current review cards.
 */
function shuffleCards() {
  // Keep current progress but shuffle remaining cards
  const remainingCards = reviewCards.value.slice(currentIndex.value)
  const shuffledRemaining = shuffleArray(remainingCards)
  reviewCards.value = [
    ...reviewCards.value.slice(0, currentIndex.value),
    ...shuffledRemaining
  ]
}

/**
 * Navigate back to home.
 */
function goHome() {
  router.push({ name: 'home' })
}

/**
 * Navigate to Quick Study.
 */
function goToQuickStudy() {
  router.push({ name: 'quick-study' })
}

// ===== Lifecycle =====
onMounted(() => {
  loadReviewCards()
})
</script>

<!--
  All styling is via Tailwind utility classes in the template.
  No <style> block needed per StudyDock guidelines.
-->