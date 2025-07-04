<!--
  ConfirmDeleteModal.vue
  -----------------------------------
  Minimal, mobile-first modal for confirming flashcard deletion.
  - Emits 'confirm' if user agrees, 'cancel' if dismissed.
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
        Delete Flashcard?
      </h2>
      <!-- Modal Body -->
      <p class="text-gray-700 mb-4 text-center">
        Are you sure you want to delete this flashcard?
      </p>
      <!-- Modal Actions -->
      <div class="flex flex-col gap-3">
        <button
          @click="emitConfirm"
          class="w-full py-3 rounded bg-red-600 text-white font-bold text-base hover:bg-red-700 transition"
          aria-label="Confirm delete"
        >
          Yes, Delete
        </button>
        <button
          @click="emitCancel"
          class="w-full py-3 rounded bg-gray-200 text-gray-800 font-bold text-base hover:bg-gray-300 transition"
          aria-label="Cancel delete"
        >
          Cancel
        </button>
      </div>
      <!-- Ghana offline note -->
      <p class="text-xs text-gray-500 mt-4 text-center">
        If you are offline, changes will be saved when you reconnect.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// ===== File-Level Documentation =====
// ConfirmDeleteModal.vue: Modal for confirming flashcard deletion.
// Emits 'confirm' or 'cancel' to parent component.

import { defineEmits } from 'vue'

/**
 * Emits:
 * - confirm: User confirmed deletion
 * - cancel: User cancelled deletion
 */
const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

/**
 * Emit confirm event to parent.
 */
function emitConfirm() {
  emit('confirm')
}

/**
 * Emit cancel event to parent.
 */
function emitCancel() {
  emit('cancel')
}
</script>

<style scoped>
/* ===== Modal-specific styles ===== */
/* All sizing and spacing handled by Tailwind for mobile-first workflow */
</style>