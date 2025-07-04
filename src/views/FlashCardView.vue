<!--
  filepath: c:\Users\Edward Appiah Poku\Desktop\projectplayground\flashcard\src\views\FlashCardView.vue

  FlashCardView.vue
  -----------------------------------
  Displays the flashcard management page for a selected deck.
  - Shows a header, add button, and the FlashCardList for the current deck.
  - Passes the required deckId prop to FlashCardList.
  - Handles add modal and adding new cards.
  - Mobile-first, offline-first, Ghana-optimized.
-->

<template>
  <!-- ===== FlashCard View Container ===== -->
  <div class="flashcard-view-wrapper">
    <!-- ===== Page Header with Add Button ===== -->
    <div class="page-header flex items-center justify-between mb-6 px-4">
      <!-- Page Title -->
      <div class="title-section">
        <h1 class="text-3xl font-bold text-gray-900 mb-1">Flashcards</h1>
        <p class="text-gray-600 text-sm">Study and manage your flashcard collection</p>
      </div>
      <!-- Add New FlashCard Button -->
      <button 
        @click="showAddModal = true"
        class="add-flashcard-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 min-h-[48px]"
        aria-label="Add new flashcard"
      >
        <!-- Plus Icon (SVG) -->
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        <!-- Button Text - Hidden on mobile for space -->
        <span class="hidden sm:inline">Add New</span>
        <!-- Mobile-only text -->
        <span class="sm:hidden">Add</span>
      </button>
    </div>

    <!-- ===== [New Feature] START ===== -->
    <!-- AddCardModal: Shown when showAddModal is true -->
    <AddCardModal
      v-if="showAddModal"
      :deckId="deckId"
      @close="showAddModal = false"
      @added="handleCardAdded"
    />
    <!-- ===== [New Feature] END ===== -->

    <!-- ===== FlashCard List Component ===== -->
    <FlashCardList :deckId="deckId" />
  </div>
</template>

<script setup lang="ts">
// ===== File-Level Documentation =====
// This file displays the flashcard list for a selected deck.
// It passes the required deckId prop to FlashCardList.
// Handles add modal and adding new cards.

// ===== Component Imports =====
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import FlashCardList from '@/components/layout/FlashCardList.vue'
import AddCardModal from '@/components/modals/AddCardModal.vue'
import { useFlashStorage } from '@/stores/useFlashStorage' // <-- Import Pinia store

// ===== [New Feature] START =====
// Get the deckId from the route params (dynamic, not static)
const route = useRoute()
const deckId = route.params.deckId as string

// Modal state for AddCardModal
const showAddModal = ref(false)

// Pinia store for flashcards
const flashStorage = useFlashStorage()

/**
 * Handles the 'added' event from AddCardModal.
 * Adds the new card to the store and closes the modal.
 * @param payload - { term: string, definition: string, deckId: string }
 */
function handleCardAdded(payload: { term: string; definition: string; deckId: string }) {
  // ===== [New Feature] START =====
  // Generate a unique ID for the new card (timestamp + random for simplicity)
  const newId = `card-${Date.now()}-${Math.floor(Math.random() * 10000)}`
  // Add the new card to the store (assumes addCard exists in Pinia store)
  flashStorage.addCard({
    id: newId,
    term: payload.term,
    definition: payload.definition,
    deckId: payload.deckId
  })
  showAddModal.value = false
  // ===== [New Feature] END =====
}
</script>

<style scoped>
/**
 * Main wrapper for the flashcard view page
 * Provides consistent spacing and layout structure
 */
.flashcard-view-wrapper {
  min-height: 100vh;
  padding: 1rem;
  background-color: #f9fafb;
}

/**
 * Page header styling
 * Contains title and add button with responsive design
 */
.page-header {
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
}

/**
 * Add button hover and active states
 * Enhanced interaction feedback for better UX
 */
.add-flashcard-btn:active {
  transform: scale(0.98);
}

.add-flashcard-btn:focus {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}

/**
 * Mobile-specific adjustments
 * Optimize layout for smaller screens
 */
@media (max-width: 768px) {
  .flashcard-view-wrapper {
    padding: 0.5rem;
  }
  .page-header {
    gap: 1rem;
  }
  .title-section h1 {
    font-size: 1.875rem;
  }
  .add-flashcard-btn {
    min-width: 48px;
    padding: 0.75rem 1rem;
  }
}

/**
 * Desktop enhancements
 * Better spacing and hover effects for larger screens
 */
@media (min-width: 1024px) {
  .flashcard-view-wrapper {
    padding: 2rem;
  }
  .page-header {
    margin-bottom: 2rem;
  }
}
</style>