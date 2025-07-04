<!--
  ConfirmDeleteDeckModal.vue
  -----------------------------------
  Minimal, mobile-first modal for confirming deck deletion.
  - Ghana-optimized: simple English, large touch targets, clear recovery steps.
  - No dependencies, works offline.
  - StudyDock Coding Protocol: Minimal code, clear comments, mobile-first.
-->

<template>
  <!-- ===== Modal Overlay ===== -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
    @click.self="emitCancel"
    aria-modal="true"
    role="dialog"
  >
    <!-- ===== Modal Content ===== -->
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs mx-2">
      <!-- Modal Title -->
      <h2 class="text-lg font-bold text-gray-900 mb-2 text-center">
        Delete Deck?
      </h2>
      <!-- Modal Body -->
      <p class="text-base text-gray-700 mb-4 text-center">
        Are you sure you want to delete this deck? <br />
        <span class="font-semibold text-red-600">All flashcards in this deck will also be deleted.</span>
      </p>
      <div class="flex flex-col gap-2 mt-2">
        <button
          @click="emitConfirm"
          class="w-full py-3 rounded bg-red-600 text-white font-bold text-base hover:bg-red-700 transition"
          aria-label="Confirm delete deck"
        >
          Yes, Delete Deck
        </button>
        <button
          @click="emitCancel"
          class="w-full py-3 rounded bg-gray-200 text-gray-800 font-bold text-base hover:bg-gray-300 transition"
          aria-label="Cancel"
        >
          Cancel
        </button>
      </div>
      <!-- Ghana offline note -->
      <p class="text-xs text-gray-500 mt-4 text-center">
        If you are offline, this change will be saved when you reconnect.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// ===== File-Level Documentation =====
// ConfirmDeleteDeckModal.vue: Modal for confirming deck deletion.
// Emits 'confirm' or 'cancel' to parent component.

import { defineEmits } from 'vue'

/**
 * Emits:
 * - confirm: User confirmed deletion
 * - cancel: User cancelled modal
 */
const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

/**
 * Emits confirm event to parent.
 */
function emitConfirm() {
  emit('confirm')
}

/**
 * Emits cancel event to parent.
 */
function emitCancel() {
  emit('cancel')
}
</script>

<!--
  All styling via Tailwind utility classes for maintainability and mobile-first workflow.
-->