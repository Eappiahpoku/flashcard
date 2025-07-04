<!--
  FlashDeck.vue
  -----------------------------------
  Displays a single study deck card.
  - Emits an event with deckId when clicked.
  - StudyDock Coding Protocol: All props are required and type-checked.
-->

<template>
  <!-- ===== FlashDeck Card Container ===== -->
  <div
    class="
      bg-white rounded-xl shadow-md hover:shadow-lg 
      border border-gray-100 
      p-6 cursor-pointer 
      transform hover:scale-105 hover:border-primary/20
      transition-all duration-200
      min-h-[8rem]
      min-w-[3rem]
    "
    @click="handleDeckClick"
    @keydown.enter="handleDeckClick"
    @keydown.space.prevent="handleDeckClick"
    role="button"
    tabindex="0"
    :aria-label="`Open ${props.deck.title} deck with ${props.deck.cardCount} cards`"
  >
    <!-- ===== Deck Header ===== -->
    <div class="flex items-start justify-between mb-4">
      <!-- Deck Title and Card Count -->
      <div class="flex-1">
        <h3 class="font-semibold text-gray-800 text-lg mb-1">
          {{ props.deck.title }}
        </h3>
        <p class="text-sm text-gray-500">
          {{ props.deck.cardCount }} {{ props.deck.cardCount === 1 ? 'card' : 'cards' }}
        </p>
      </div>
      <!-- ===== Subject Icon ===== -->
      <div class="
        w-10 h-10 rounded-lg bg-gradient-to-br 
        from-primary/10 to-secondary/10 
        flex items-center justify-center ml-3
      ">
        <!-- Dynamic Icon based on subject -->
        <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getSubjectIcon(props.deck.subject)"></path>
        </svg>
      </div>
    </div>

    <!-- ===== Progress Bar ===== -->  
    <div class="mt-3">
      <div class="flex justify-between items-center mb-1">
        <span class="text-xs font-medium text-gray-600">Progress</span>
        <span class="text-xs text-gray-500">{{ props.deck.progress }}%</span>
      </div>
      <!-- Progress Bar -->
      <div class="w-full bg-gray-200 rounded-full h-1.5">
        <div 
          class="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full transition-all duration-300"
          :style="{ width: `${props.deck.progress}%` }"
          :aria-label="`${props.deck.progress}% progress`"
        ></div>
      </div>
      <!-- Progress Text for Accessibility -->
      <p class="text-xs text-gray-400 mt-1 text-right">
        {{ props.deck.progress }}% studied
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// ===== File-Level Documentation =====
/**
 * FlashDeck.vue
 * -----------------------------------
 * Displays a single study deck card.
 * - Receives deck data as a prop from parent.
 * - Emits 'select' event with deckId when clicked.
 */

// ===== Types & Interfaces =====
interface FlashDeckData {
  id: string
  title: string
  subject: 'biology' | 'chemistry' | 'physics' | 'math' | 'history' | 'geography' | 'english' | 'general'
  cardCount: number
  progress: number // Percentage from 0-100
  lastStudied?: string // Optional: when last studied
}

// ===== Props =====
const props = defineProps<{
  deck: FlashDeckData
}>()

// ===== Emits =====
const emit = defineEmits<{
  (e: 'select', deckId: string): void
}>()

// ===== Helper Functions =====
/**
 * Get SVG path for subject icon
 * Returns different icon paths based on subject type
 */
function getSubjectIcon(subject: FlashDeckData['subject']): string {
  const icons = {
    biology: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    chemistry: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
    physics: "M13 10V3L4 14h7v7l9-11h-7z",
    math: "M7 21a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7zM7 3a4 4 0 00-4 4v10a4 4 0 004 4h10a4 4 0 004-4V7a4 4 0 00-4-4H7z",
    history: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    geography: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    english: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z",
    general: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
  }
  return icons[subject] || icons.general
}

// ===== Event Handlers =====
/**
 * Handles deck click and emits the selected deckId to the parent component.
 * Added console logs for debugging.
 */
function handleDeckClick(): void {
  console.log('🎯 DECK CLICKED!')
  console.log('📦 Deck ID:', props.deck.id)
  console.log('📚 Deck Title:', props.deck.title)
  console.log('📋 Deck Data:', props.deck)
  
  // Emit the select event to parent
  emit('select', props.deck.id)
  console.log('✅ Emitted select event with ID:', props.deck.id)
}
</script>

<style scoped>
/* ===== Component-specific styles ===== */

/**
 * FlashDeck card with mobile-first hover effects
 * Touch-friendly interactions for Ghanaian mobile users
 */
.cursor-pointer:active {
  /* Touch feedback for mobile users */
  transform: scale(0.98);
}

/**
 * Accessibility improvements
 * Ensure keyboard navigation works properly
 */
.cursor-pointer:focus {
  /* High contrast focus ring for accessibility */
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}

/**
 * Progress bar animation
 * Smooth progress updates when data changes
 */
.bg-gradient-to-r {
  /* Smooth width transitions for progress updates */
  transition: width 0.5s ease-in-out;
}

/**
 * Mobile-specific adjustments
 * Optimize for touch devices and smaller screens
 */
@media (max-width: 768px) {
  .min-h-\[8rem\] {
    /* Slightly smaller height on mobile for more cards per screen */
    min-height: 7rem;
  }
  
  .p-6 {
    /* Reduce padding on mobile for more content space */
    padding: 1rem;
  }
}

/**
 * Reduce motion for accessibility
 * Respect user's motion preferences
 */
@media (prefers-reduced-motion: reduce) {
  .transform,
  .transition-all {
    /* Disable animations for users who prefer reduced motion */
    transform: none !important;
    transition: none !important;
  }
}
</style>