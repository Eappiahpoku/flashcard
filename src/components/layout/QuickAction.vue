<!--
  QuickAction.vue
  -----------------------------------
  Displays quick action buttons for navigation to key study features.
  - Mobile-first, offline-first, Ghana-optimized.
  - Each button navigates to a different view using Vue Router.
  - Touch targets are large for mobile usability.
-->

<template>
  <!-- ===== Static Quick Actions ===== -->
  <div class="max-w-4xl mx-auto mt-12 pt-8 border-t border-gray-200">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
      <!-- ===== [New Feature] START: Add router navigation to each button ===== -->

      <!-- Quick Study -->
      <button
        class="p-4 rounded-lg border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-colors group min-h-[48px]"
        @click="goToQuickStudy"
        aria-label="Go to Quick Study"
      >
        <div class="text-primary group-hover:text-primary-dark mb-2">
          <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <span class="text-sm font-medium text-gray-700">Quick Study</span>
      </button>

      <!-- Review Mode -->
      <button
        class="p-4 rounded-lg border border-gray-200 hover:border-secondary/30 hover:bg-secondary/5 transition-colors group min-h-[48px]"
        @click="goToReviewMode"
        aria-label="Go to Review Mode"
      >
        <div class="text-secondary group-hover:text-secondary-dark mb-2">
          <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        </div>
        <span class="text-sm font-medium text-gray-700">Review Mode</span>
      </button>

      <!-- Progress -->
      <button
        class="p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors group min-h-[48px]"
        @click="goToProgress"
        aria-label="Go to Progress"
      >
        <div class="text-green-600 group-hover:text-green-700 mb-2">
          <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
        <span class="text-sm font-medium text-gray-700">Progress</span>
      </button>
      <!-- ===== [New Feature] END ===== -->
    </div>
  </div>
</template>

<script setup lang="ts">
// ===== File-Level Documentation =====
// QuickAction.vue: Navigates to Quick Study, Review Mode, and Progress views using Vue Router.

import { useRouter } from 'vue-router'

// ===== Main Logic =====
/**
 * Router instance for navigation.
 */
const router = useRouter()

/**
 * Navigates to the Quick Study view.
 */
function goToQuickStudy() {
  router.push({ name: 'quick-study' })
}

/**
 * Navigates to the Review Mode view.
 */
function goToReviewMode() {
  router.push({ name: 'review-mode' })
}

/**
 * Navigates to the Progress view.
 */
function goToProgress() {
  router.push({ name: 'progress' })
}
</script>