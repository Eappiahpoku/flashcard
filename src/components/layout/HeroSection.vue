<!--
  HeroSection.vue
  -----------------------------------
  Displays the welcome section and the "Add New Subject" button.
  - When the button is clicked, opens the AddDeckModal.
  - Modal closes on @close or after deck is added.
  - Emits 'refresh-decks' to parent after adding a deck.
  - Mobile-first, offline-first, Ghana-optimized.
-->

<template>
  <div class="max-w-4xl mx-auto mb-8">
    <div class="text-center mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
        Welcome to Your Study Space
      </h1>
      <p class="text-gray-600 text-sm md:text-base max-w-md mx-auto">
        Create flashcard decks, study efficiently, and track your progress. Perfect for students preparing for exams.
      </p>
    </div>

    <div class="flex justify-center mb-8">
      <button 
        class="
          inline-flex items-center space-x-3 
          bg-primary hover:bg-primary-hover 
          text-white font-semibold 
          px-6 py-4 rounded-lg 
          shadow-lg hover:shadow-xl 
          transform hover:scale-105 
          transition-all duration-200 
          min-h-[3rem] min-w-[12rem]
          focus:outline-none focus:ring-4 focus:ring-primary/20
        "
        aria-label="Create a new flashcard deck"
        @click="showAddDeckModal = true"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        <span>Add New Subject</span>
      </button>
    </div>
  </div>

  <AddDeckModal
    v-if="showAddDeckModal"
    @close="handleCloseModal"
    @deck-added="handleDeckAdded"
  />
</template>

<script setup lang="ts">
// ===== File-Level Documentation =====
/**
 * HeroSection.vue
 * -----------------------------------
 * Displays the welcome section and the "Add New Subject" button.
 * Handles showing and hiding the AddDeckModal.
 * Emits 'refresh-decks' to parent after adding a deck.
 */

// ===== Imports =====
import { ref } from 'vue'
import AddDeckModal from '@/components/modals/AddDeckModal.vue'

// ===== Emits =====
/**
 * Emits:
 * - refresh-decks: when a new deck is added, to trigger deck list refresh in parent
 */
const emit = defineEmits<{
  (e: 'refresh-decks'): void
}>()

// ===== State =====
/**
 * Controls visibility of the AddDeckModal.
 */
const showAddDeckModal = ref(false)

// ===== Event Handlers =====
/**
 * Handles closing the AddDeckModal.
 * Sets modal visibility to false.
 */
function handleCloseModal() {
  showAddDeckModal.value = false
}

/**
 * Handles successful deck addition.
 * Closes the modal and emits 'refresh-decks' to parent.
 */
function handleDeckAdded(/* newDeck */) {
  showAddDeckModal.value = false
  emit('refresh-decks')
  // Optionally: show a toast or success message here
}
</script>