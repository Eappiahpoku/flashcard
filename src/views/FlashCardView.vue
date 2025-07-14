<!--
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
    <!-- ===== [New Feature] START: Responsive Header Layout ===== -->
    <!-- Desktop: Horizontal layout with centered title -->
    <!-- Mobile: Vertical stack (Title → Back → Add) -->
    <div class="page-header mb-6 px-4">
      
      <!-- ===== Desktop Layout: Hidden on mobile (md:flex) ===== -->
      <div class="hidden md:flex items-center justify-between relative">
        <!-- Back Button on the far left -->
        <div class="flex items-center gap-4">
          <BackButton />
        </div>
        
        <!-- Centered Title Section -->
        <div class="title-section absolute left-1/2 transform -translate-x-1/2 text-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-1">Flashcards</h1>
          <p class="text-gray-600 text-sm">Study and manage your flashcard collection</p>
        </div>
        
        <!-- Add Button on the far right -->
        <button 
          @click="showAddModal = true"
          class="add-flashcard-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 min-h-[48px]"
          aria-label="Add new flashcard"
        >
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span class="hidden sm:inline">Add New</span>
          <span class="sm:hidden">Add</span>
        </button>
      </div>

      <!-- ===== Mobile Layout: Vertical stack (flex md:hidden) ===== -->
      <div class="flex flex-col space-y-4 md:hidden">
        <!-- 1. Title Section at the top -->
        <div class="title-section text-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-1">Flashcards</h1>
          <p class="text-gray-600 text-sm">Study and manage your flashcard collection</p>
        </div>
        
        <!-- 2. Back Button below title -->
        <div class="flex justify-center">
          <BackButton />
        </div>
        
        <!-- 3. Add Button below back button -->
        <div class="flex justify-center">
          <button 
            @click="showAddModal = true"
            class="add-flashcard-btn bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 min-h-[48px] w-full max-w-sm"
            aria-label="Add new flashcard"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>Add New</span>
          </button>
        </div>
      </div>
    </div>
    <!-- ===== [New Feature] END: Responsive Header Layout ===== -->

    <!-- ===== AddCardModal: Shown when showAddModal is true ===== -->
    <AddCardModal
      v-if="showAddModal"
      :deckId="deckId"
      @close="showAddModal = false"
      @added="handleCardAdded"
    />

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
import BackButton from '@/components/layout/button/BackButton.vue'

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
 * ===== [New Feature] START: Responsive layout support =====
 * Now supports both horizontal (desktop) and vertical (mobile) layouts
 */
.page-header {
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
}
/* ===== [New Feature] END: Responsive layout support ===== */

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
 * ===== [New Feature] START: Mobile vertical layout styles =====
 */
@media (max-width: 768px) {
  .flashcard-view-wrapper {
    padding: 0.5rem;
  }
  
  .title-section h1 {
    font-size: 1.875rem; /* Slightly smaller on mobile */
  }
  
  /* Full-width button on mobile for easier touch targets */
  .add-flashcard-btn {
    justify-content: center;
    width: 100%;
    max-width: 24rem; /* Prevent too wide on larger phones */
  }
}
/* ===== [New Feature] END: Mobile vertical layout styles ===== */

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