<!--
  FlashCard.vue
  -----------------------------------
  Displays a single flashcard.
  - Receives flashcard data as a prop from parent (FlashCardList).
  - No hardcoded/static content; all data is dynamic.
  - Mobile-first, offline-first, Ghana-optimized.
  - StudyDock Coding Protocol: All props are required and type-checked.
-->

<template>
  <!-- ===== FlashCard Container ===== -->
  <div
    class="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between h-full min-h-[220px] transition-transform duration-150 hover:scale-[1.02] active:scale-95"
    :aria-label="`Flashcard: ${flashcard.term}`"
  >
    <!-- ===== Card Header (Edit/Delete) ===== -->
    <div class="flex items-center justify-end gap-4 mb-2">
      <!-- Edit Button (placeholder, no action yet) -->
      <button class="flex items-center gap-1 text-blue-600 hover:underline text-sm" aria-label="Edit card">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h2v2h2v-2h2v-2h-2v-2h-2v2h-2v2z"/>
        </svg>
        Edit
      </button>
      <!-- Delete Button (placeholder, no action yet) -->
      <button class="flex items-center gap-1 text-red-600 hover:underline text-sm" aria-label="Delete card">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        Delete
      </button>
    </div>

    <!-- ===== Card Content ===== -->
    <div class="flex-1">
      <!-- Term -->
      <div class="mb-2">
        <span class="block text-base font-semibold text-blue-900">Term</span>
        <span class="block text-2xl font-bold text-gray-900">{{ flashcard.term }}</span>
      </div>
      <!-- Definition -->
      <div class="mb-2">
        <span class="block text-base font-semibold text-blue-900">Definition</span>
        <span class="block text-gray-700 text-lg">{{ flashcard.definition }}</span>
      </div>
    </div>

    <!-- ===== Card Footer (Deck Name) ===== -->
    <div class="mt-4 text-xs text-gray-500 font-medium uppercase tracking-wide">
      {{ flashcard.deckName }}
    </div>
  </div>
</template>

<script setup lang="ts">
// ===== File-Level Documentation =====
// This component displays a single flashcard using dynamic data only.

/**
 * Props for FlashCard
 * - flashcard: object with id, term, definition, deckName
 */
 defineProps<{
  flashcard: {
    id: string
    term: string
    definition: string
    deckName: string
  }
}>() 
</script>


<!--
  All styling is via Tailwind utility classes for maintainability and mobile-first workflow.
  No @apply or custom CSS unless absolutely necessary.
-->