<!--
  StudyFlashcardModal.vue
  -----------------------------------
  Fullscreen modal for studying flashcards in a deck.
  - Mobile-first, offline-first, Ghana-optimized.
  - Shows term first, then reveals definition on tap/click.
  - User marks correct/wrong with icons, then advances to next card.
  - Closes when deck is complete.
  - All styling via Tailwind utility classes.
-->

<template>
  <!-- ===== Fullscreen Modal Overlay ===== -->
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
    <!-- ===== Card Container ===== -->
    <div class="relative w-full max-w-md mx-auto bg-white rounded-StudyDock shadow-lg p-4 flex flex-col items-center min-h-[70vh]">
      <!-- ===== Close Button ===== -->
      <button
        @click="close"
        class="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
        aria-label="Close study session"
      >
        &times;
      </button>

      <!-- ===== Progress Indicator ===== -->
      <!-- ===== [New Feature] START: Shift progress indicator left for better spacing ===== -->
      <div class="w-full flex items-center mb-4">
        <span class="text-xs text-gray-500">
          Card {{ currentIndex + 1 }} of {{ cards.length }}
        </span>
        <span class="ml-auto mr-10 text-xs text-gray-500">
          {{ correctCount }} <span class="text-green-600 font-bold">✔</span>
          /
          {{ wrongCount }} <span class="text-red-600 font-bold">✘</span>
        </span>
      </div>
      <!-- ===== [New Feature] END ===== -->

      <!-- ===== Flashcard Display ===== -->
      <div
        class="flex-1 w-full flex flex-col justify-center items-center"
        @click="revealDefinition"
        v-if="!showDefinition"
        tabindex="0"
        role="button"
        aria-label="Show definition"
      >
        <div class="text-center text-2xl font-bold text-gray-900 select-none">
          {{ currentCard.term }}
        </div>
        <div class="mt-8 w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
          <span class="text-gray-400 text-lg">Tap to show definition</span>
        </div>
      </div>

      <div
        class="flex-1 w-full flex flex-col justify-center items-center"
        v-else
      >
        <div class="text-center text-2xl font-bold text-gray-900 select-none">
          {{ currentCard.term }}
        </div>
        <div class="mt-8 w-full h-32 bg-blue-50 rounded-lg flex items-center justify-center transition-all duration-300">
          <span class="text-blue-700 text-xl font-semibold">{{ currentCard.definition }}</span>
        </div>
        <!-- ===== Correct/Wrong Buttons ===== -->
        <div class="flex gap-8 mt-8 ml-6">
          <button
            @click="markCorrect"
            class="btn-touch bg-green-500 hover:bg-green-600 text-white rounded-full p-4 text-3xl shadow transition"
            aria-label="Mark correct"
          >
            <!-- Check icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <button
            @click="markWrong"
            class="btn-touch bg-red-500 hover:bg-red-600 text-white rounded-full p-4 text-3xl shadow transition"
            aria-label="Mark wrong"
          >
            <!-- X icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- ===== Deck Complete State ===== -->
      <div v-if="isComplete" class="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-95 rounded-StudyDock z-10">
        <div class="text-2xl font-bold text-primary mb-4">Deck Complete!</div>
        <div class="mb-2 text-lg text-gray-700">
          Correct: <span class="text-green-600 font-bold">{{ correctCount }}</span>
        </div>
        <div class="mb-6 text-lg text-gray-700">
          Wrong: <span class="text-red-600 font-bold">{{ wrongCount }}</span>
        </div>
        <button
          @click="close"
          class="px-6 py-3 bg-primary text-white rounded-lg font-semibold text-lg shadow hover:bg-primary-hover transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ===== File-Level Documentation =====
// StudyFlashcardModal.vue: Fullscreen modal for studying flashcards in a deck.
// - Shows term, reveals definition on tap, lets user mark correct/wrong, advances to next card.

// ===== Types & Interfaces =====
/**
 * Flashcard type for study session.
 */
interface Flashcard {
  id: string
  term: string
  definition: string
}

// ===== Props =====
/**
 * Props:
 * - cards: Flashcard[] (the deck's flashcards)
 * - onClose: function to close modal
 */
const props = defineProps<{
  cards: Flashcard[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

// ===== Main Logic =====
import { ref, computed } from 'vue'

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
 * Whether the deck is complete.
 */
const isComplete = computed(() => currentIndex.value >= props.cards.length)

/**
 * The current flashcard.
 */
const currentCard = computed(() => props.cards[currentIndex.value] || { term: '', definition: '' })

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
 */
function markCorrect() {
  if (!isComplete.value) {
    correctCount.value++
    nextCard()
  }
}

/**
 * Mark the current card as wrong and move to next.
 */
function markWrong() {
  if (!isComplete.value) {
    wrongCount.value++
    nextCard()
  }
}

/**
 * Advance to the next card, or finish if done.
 */
function nextCard() {
  showDefinition.value = false
  currentIndex.value++
}

/**
 * Close the study modal.
 */
function close() {
  emit('close')
}
</script>

<!--
  All styling is via Tailwind utility classes in the template.
  No <style> block needed per StudyDock guidelines.
-->