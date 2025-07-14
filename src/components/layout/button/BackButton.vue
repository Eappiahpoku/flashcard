<!--
  BackButton.vue
  -----------------------------------
  Minimal, mobile-first back button for StudyDock apps.
  - Uses Vue Router to navigate back.
  - Large touch target (min 48x48px) for Ghanaian mobile users.
  - Simple, clear label for digital literacy.
  - All styling via Tailwind utility classes (no <style> block).
  - No props required.
-->

<template>
  <!-- ===== [New Feature] START ===== -->
  <!--
    Back button sits above the page title.
    - Large touch area for mobile.
    - Uses router.back() for navigation.
    - Simple arrow and "Back" text.
  -->
  <button
    type="button"
    @click="goBack"
    class="flex items-center justify-center text-center gap-2 ml-2 mt-2 px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium text-gray-800 shadow-sm min-h-[48px] min-w-[48px] active:scale-95 transition w-full md:w-auto"
    aria-label="Go back"
  >
    <!-- Left arrow icon (SVG, accessible) -->
    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" text-center/>
    </svg>
    <!-- Text label: always visible for clarity -->
    <span>Back</span>
  </button>
  <!-- ===== [New Feature] END ===== -->
</template>

<script setup lang="ts">
// ===== File-Level Documentation =====
// BackButton.vue: Simple reusable back button for navigation.
// - Uses Vue Router's history to go back one page.
// - No props or emits needed.

// ===== Component Imports =====
import { useRouter } from 'vue-router'

// ===== Main Logic =====
/**
 * Navigates back one step in the browser history.
 * - Uses Vue Router's back() for SPA navigation.
 * - If no history, falls back to root ('/').
 */
const router = useRouter()

// Define goBack as a function in <script setup> scope so it's available to the template
function goBack(): void {
  // Try to go back in history; fallback to home if not possible
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>