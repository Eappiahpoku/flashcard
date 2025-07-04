<!--
  AddDeckModal.vue
  -----------------------------------
  Minimal, mobile-first modal for creating a new subject (deck).
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
        Create New Subject
      </h2>
      <!-- Modal Body -->
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-3">
        <label for="deck-title" class="text-sm font-medium text-gray-700">Subject Name</label>
        <input
          id="deck-title"
          v-model="title"
          type="text"
          class="border rounded px-3 py-3 text-base"
          placeholder="e.g. Biology Basics"
          required
          minlength="2"
          maxlength="32"
          :aria-label="'Subject name'"
        />
        <label for="deck-desc" class="text-sm font-medium text-gray-700">Description (optional)</label>
        <textarea
          id="deck-desc"
          v-model="description"
          class="border rounded px-3 py-3 text-base"
          placeholder="Short description"
          maxlength="80"
          :aria-label="'Subject description'"
        ></textarea>
        <div class="flex flex-col gap-2 mt-2">
          <button
            type="submit"
            class="w-full py-3 rounded bg-blue-600 text-white font-bold text-base hover:bg-blue-700 transition"
            aria-label="Create subject"
          >
            Create Subject
          </button>
          <button
            type="button"
            @click="emitCancel"
            class="w-full py-3 rounded bg-gray-200 text-gray-800 font-bold text-base hover:bg-gray-300 transition"
            aria-label="Cancel"
          >
            Cancel
          </button>
        </div>
      </form>
      <!-- Ghana offline note -->
      <p class="text-xs text-gray-500 mt-4 text-center">
        If you are offline, your new subject will be saved when you reconnect.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// ===== File-Level Documentation =====
// AddDeckModal.vue: Modal for creating a new subject (deck).
// Emits 'add' with deck data or 'cancel' to parent component.

import { ref } from 'vue'

/**
 * Emits:
 * - add: User submitted new deck { title, description }
 * - cancel: User cancelled modal
 */
const emit = defineEmits<{
  (e: 'add', payload: { title: string; description: string }): void
  (e: 'cancel'): void
}>()

// ===== Main Logic =====
// State for form fields
const title = ref('')
const description = ref('')

/**
 * Handles form submission.
 * Emits 'add' event with deck data.
 */
function handleSubmit() {
  // Minimal validation (already enforced by input)
  emit('add', { title: title.value.trim(), description: description.value.trim() })
  // Optionally clear fields after submit
  title.value = ''
  description.value = ''
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