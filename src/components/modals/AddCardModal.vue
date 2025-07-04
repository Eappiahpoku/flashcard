<!--
  filepath: c:\Users\Edward Appiah Poku\Desktop\projectplayground\flashcard\src\components\modals\AddCardModal.vue

  AddCardModal.vue
  -----------------------------------
  Modal dialog for adding a new flashcard to a deck.
  - Mobile-first, Ghana-optimized.
  - Handles form input, validation, and emits events for parent to handle storage.
-->

<template>
  <!-- ===== Modal Overlay ===== -->
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <!-- ===== Modal Container ===== -->
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-2 p-6 relative">
      <!-- ===== Modal Header ===== -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-900">Add New Flashcard</h3>
        <!-- Close Button -->
        <button
          class="text-gray-400 hover:text-gray-700 rounded-full p-2 btn-touch"
          aria-label="Close"
          type="button"
          @click="handleClose"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <!-- ===== Modal Body ===== -->
      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <!-- Term Field -->
        <div>
          <label for="term" class="block text-sm font-medium text-gray-700 mb-1">Term</label>
          <input
            id="term"
            v-model="term"
            type="text"
            class="block w-full px-3 py-3 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 text-base bg-white shadow-sm"
            placeholder="Enter term (e.g. Photosynthesis)"
            required
            :class="{ 'border-red-500': error && !term }"
          />
        </div>
        <!-- Definition Field -->
        <div>
          <label for="definition" class="block text-sm font-medium text-gray-700 mb-1">Definition</label>
          <textarea
            id="definition"
            v-model="definition"
            rows="3"
            class="block w-full px-3 py-3 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 text-base bg-white shadow-sm resize-none"
            placeholder="Enter definition"
            required
            :class="{ 'border-red-500': error && !definition }"
          ></textarea>
        </div>
        <!-- Error Message -->
        <p v-if="error" class="text-xs text-red-600 mt-1">{{ error }}</p>
        <!-- ===== Modal Actions ===== -->
        <div class="flex justify-end gap-2 mt-2">
          <button
            type="button"
            class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium btn-touch"
            @click="handleClose"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium btn-touch"
          >
            Add Card
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// ===== File-Level Documentation =====
// This modal allows the user to add a new flashcard to a deck.
// Emits 'close' when closed, and 'added' with card data when submitted.

// ===== Types & Interfaces =====
/**
 * Props for AddCardModal
 * - deckId: string (required) - the ID of the deck to add the card to
 */
const props = defineProps<{
  deckId: string
}>()

// ===== Emits =====
/**
 * Emits:
 * - 'close': when the modal is closed/cancelled
 * - 'added': when a new card is submitted (payload: { term, definition, deckId })
 */
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'added', payload: { term: string; definition: string; deckId: string }): void
}>()

// ===== Main Logic =====
import { ref } from 'vue'

// Form state
const term = ref('')
const definition = ref('')
const error = ref('')

/**
 * Handles closing the modal and resets form state.
 */
function handleClose() {
  term.value = ''
  definition.value = ''
  error.value = ''
  emit('close')
}

/**
 * Handles form submission.
 * Validates input and emits 'added' event with new card data.
 */
function handleSubmit() {
  // Simple validation: both fields required
  if (!term.value.trim() || !definition.value.trim()) {
    error.value = 'Both term and definition are required.'
    return
  }
  // Emit the new card data to parent
  emit('added', {
    term: term.value.trim(),
    definition: definition.value.trim(),
    deckId: props.deckId
  })
  // Reset form and close modal
  term.value = ''
  definition.value = ''
  error.value = ''
  emit('close')
}
</script>