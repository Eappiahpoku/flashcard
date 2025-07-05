<!--
  ProgressView.vue
  -----------------------------------
  Progress tracking for flashcard study sessions.
  - Mobile-first, offline-first, Ghana-optimized.
  - Shows overall study statistics from all decks combined.
  - Displays total cards studied, accuracy rate, and streak counters.
  - Uses localStorage review data from QuickStudyView for offline functionality.
  - Tracks learning progress and performance metrics.
  - Works completely offline using cached study data.
  - No dependencies on external APIs.
-->

<template>
  <!-- ===== Main Container ===== -->
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- ===== Header with StudyDock Logo and App Name ===== -->
    <header class="flex items-center justify-between px-4 py-3 bg-blue-600 text-white shadow-md">
      <!-- StudyDock Logo on the left -->
      <div class="flex items-center">
        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
        </svg>
      </div>
      <!-- App Name on the right -->
      <span class="text-lg font-bold tracking-wide">Progress</span>
    </header>

    <!-- ===== Loading State ===== -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p class="text-gray-600">Loading your progress...</p>
      </div>
    </div>

    <!-- ===== Progress Dashboard ===== -->
    <div v-else class="flex-1 p-4 space-y-6">
      <!-- ===== Overview Cards ===== -->
      <div class="grid grid-cols-2 gap-4">
        <!-- Total Cards Studied -->
        <div class="bg-white rounded-lg shadow-lg p-4 text-center">
          <div class="text-2xl font-bold text-blue-600 mb-1">
            {{ totalCardsStudied }}
          </div>
          <div class="text-sm text-gray-600">
            Cards Studied
          </div>
        </div>

        <!-- Accuracy Rate -->
        <div class="bg-white rounded-lg shadow-lg p-4 text-center">
          <div class="text-2xl font-bold text-green-600 mb-1">
            {{ accuracyRate }}%
          </div>
          <div class="text-sm text-gray-600">
            Accuracy Rate
          </div>
        </div>

        <!-- Current Streak -->
        <div class="bg-white rounded-lg shadow-lg p-4 text-center">
          <div class="text-2xl font-bold text-orange-600 mb-1">
            {{ currentStreak }}
          </div>
          <div class="text-sm text-gray-600">
            Current Streak
          </div>
        </div>

        <!-- Best Streak -->
        <div class="bg-white rounded-lg shadow-lg p-4 text-center">
          <div class="text-2xl font-bold text-purple-600 mb-1">
            {{ bestStreak }}
          </div>
          <div class="text-sm text-gray-600">
            Best Streak
          </div>
        </div>
      </div>

      <!-- ===== Detailed Statistics ===== -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Study Statistics</h2>
        
        <div class="space-y-4">
          <!-- Total Study Sessions -->
          <div class="flex justify-between items-center">
            <span class="text-gray-700">Study Sessions</span>
            <span class="font-semibold text-gray-900">{{ totalSessions }}</span>
          </div>

          <!-- Total Correct Answers -->
          <div class="flex justify-between items-center">
            <span class="text-gray-700">Correct Answers</span>
            <span class="font-semibold text-green-600">{{ totalCorrect }}</span>
          </div>

          <!-- Total Wrong Answers -->
          <div class="flex justify-between items-center">
            <span class="text-gray-700">Wrong Answers</span>
            <span class="font-semibold text-red-600">{{ totalWrong }}</span>
          </div>

          <!-- Cards Needing Review -->
          <div class="flex justify-between items-center">
            <span class="text-gray-700">Cards Need Review</span>
            <span class="font-semibold text-orange-600">{{ cardsNeedingReview }}</span>
          </div>

          <!-- Last Study Session -->
          <div class="flex justify-between items-center">
            <span class="text-gray-700">Last Studied</span>
            <span class="font-semibold text-gray-900">{{ lastStudyDate }}</span>
          </div>
        </div>
      </div>

      <!-- ===== Progress Visualization ===== -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Performance Breakdown</h2>
        
        <!-- Accuracy Progress Bar -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium text-gray-700">Overall Accuracy</span>
            <span class="text-sm font-medium text-gray-900">{{ accuracyRate }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div 
              class="h-3 rounded-full transition-all duration-300"
              :class="getAccuracyColorClass(accuracyRate)"
              :style="{ width: `${accuracyRate}%` }"
            ></div>
          </div>
        </div>

        <!-- Study Progress -->
        <div class="grid grid-cols-2 gap-4">
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <div class="text-lg font-bold text-green-700">{{ totalCorrect }}</div>
            <div class="text-sm text-green-600">Correct</div>
          </div>
          <div class="text-center p-4 bg-red-50 rounded-lg">
            <div class="text-lg font-bold text-red-700">{{ totalWrong }}</div>
            <div class="text-sm text-red-600">Wrong</div>
          </div>
        </div>
      </div>

      <!-- ===== Achievements Section ===== -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Achievements</h2>
        
        <div class="grid grid-cols-2 gap-4">
          <!-- First Study Achievement -->
          <div class="flex items-center p-3 bg-blue-50 rounded-lg">
            <div class="text-2xl mr-3">📚</div>
            <div>
              <div class="font-semibold text-blue-800">First Study</div>
              <div class="text-xs text-blue-600">Started learning</div>
            </div>
          </div>

          <!-- 50 Cards Achievement -->
          <div 
            class="flex items-center p-3 rounded-lg"
            :class="totalCardsStudied >= 50 ? 'bg-green-50' : 'bg-gray-50'"
          >
            <div class="text-2xl mr-3">{{ totalCardsStudied >= 50 ? '🎯' : '🔒' }}</div>
            <div>
              <div 
                class="font-semibold"
                :class="totalCardsStudied >= 50 ? 'text-green-800' : 'text-gray-500'"
              >
                Study Hero
              </div>
              <div 
                class="text-xs"
                :class="totalCardsStudied >= 50 ? 'text-green-600' : 'text-gray-400'"
              >
                Study 50 cards
              </div>
            </div>
          </div>

          <!-- High Accuracy Achievement -->
          <div 
            class="flex items-center p-3 rounded-lg"
            :class="accuracyRate >= 80 ? 'bg-yellow-50' : 'bg-gray-50'"
          >
            <div class="text-2xl mr-3">{{ accuracyRate >= 80 ? '⭐' : '🔒' }}</div>
            <div>
              <div 
                class="font-semibold"
                :class="accuracyRate >= 80 ? 'text-yellow-800' : 'text-gray-500'"
              >
                Accuracy Star
              </div>
              <div 
                class="text-xs"
                :class="accuracyRate >= 80 ? 'text-yellow-600' : 'text-gray-400'"
              >
                80% accuracy
              </div>
            </div>
          </div>

          <!-- Streak Achievement -->
          <div 
            class="flex items-center p-3 rounded-lg"
            :class="bestStreak >= 10 ? 'bg-purple-50' : 'bg-gray-50'"
          >
            <div class="text-2xl mr-3">{{ bestStreak >= 10 ? '🔥' : '🔒' }}</div>
            <div>
              <div 
                class="font-semibold"
                :class="bestStreak >= 10 ? 'text-purple-800' : 'text-gray-500'"
              >
                Streak Master
              </div>
              <div 
                class="text-xs"
                :class="bestStreak >= 10 ? 'text-purple-600' : 'text-gray-400'"
              >
                10 day streak
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== Action Buttons ===== -->
      <div class="space-y-3">
        <button
          @click="goToQuickStudy"
          class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition"
          aria-label="Start studying"
        >
          Continue Studying
        </button>

        <button
          v-if="cardsNeedingReview > 0"
          @click="goToReviewMode"
          class="w-full px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold text-lg shadow hover:bg-orange-700 transition"
          aria-label="Review difficult cards"
        >
          Review {{ cardsNeedingReview }} Cards
        </button>

        <button
          @click="goHome"
          class="w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold text-lg shadow hover:bg-gray-300 transition"
          aria-label="Go to home"
        >
          Back to Home
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ===== File-Level Documentation =====
// ProgressView.vue: Progress tracking and statistics for flashcard study.
// Loads study data from localStorage to show offline progress metrics.
// Displays overall statistics from all decks combined.

// ===== Imports =====
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'


// ===== Types & Interfaces =====
/**
 * Progress statistics interface for tracking study performance.
 */
interface ProgressStats {
  totalCardsStudied: number
  totalCorrect: number
  totalWrong: number
  totalSessions: number
  currentStreak: number
  bestStreak: number
  lastStudyDate: string
  cardsNeedingReview: number
}

/**
 * Review data interface from localStorage.
 */
interface ReviewData {
  wrongCount: number
  lastReviewDate: number
  lastCorrectDate: number | null
}

// ===== Main Logic =====
const router = useRouter()



/**
 * Loading state for data calculation.
 */
const isLoading = ref(true)

/**
 * Progress statistics data.
 */
const progressStats = ref<ProgressStats>({
  totalCardsStudied: 0,
  totalCorrect: 0,
  totalWrong: 0,
  totalSessions: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastStudyDate: 'Never',
  cardsNeedingReview: 0
})

// ===== Computed Properties =====
/**
 * Total cards that have been studied.
 */
const totalCardsStudied = computed(() => progressStats.value.totalCardsStudied)

/**
 * Total correct answers across all sessions.
 */
const totalCorrect = computed(() => progressStats.value.totalCorrect)

/**
 * Total wrong answers across all sessions.
 */
const totalWrong = computed(() => progressStats.value.totalWrong)

/**
 * Total study sessions completed.
 */
const totalSessions = computed(() => progressStats.value.totalSessions)

/**
 * Current study streak.
 */
const currentStreak = computed(() => progressStats.value.currentStreak)

/**
 * Best study streak achieved.
 */
const bestStreak = computed(() => progressStats.value.bestStreak)

/**
 * Last study session date formatted.
 */
const lastStudyDate = computed(() => progressStats.value.lastStudyDate)

/**
 * Number of cards that need review.
 */
const cardsNeedingReview = computed(() => progressStats.value.cardsNeedingReview)

/**
 * Overall accuracy rate as percentage.
 */
const accuracyRate = computed(() => {
  const total = totalCorrect.value + totalWrong.value
  if (total === 0) return 0
  return Math.round((totalCorrect.value / total) * 100)
})

// ===== Helper Functions =====
/**
 * Get color class for accuracy progress bar based on percentage.
 */
function getAccuracyColorClass(rate: number): string {
  if (rate >= 90) return 'bg-green-500'
  if (rate >= 80) return 'bg-green-400'
  if (rate >= 70) return 'bg-yellow-500'
  if (rate >= 60) return 'bg-orange-500'
  return 'bg-red-500'
}

/**
 * Format date for display.
 */
function formatDate(timestamp: number): string {
  if (!timestamp) return 'Never'
  
  const date = new Date(timestamp)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  
  return date.toLocaleDateString()
}

/**
 * Calculate streak from study history.
 */
function calculateStreak(): { current: number; best: number } {
  try {
    // Get study history from localStorage
    const studyHistory = JSON.parse(localStorage.getItem('studyHistory') || '[]')
    
    if (studyHistory.length === 0) {
      return { current: 0, best: 0 }
    }
    
    // Sort by date (most recent first)
    studyHistory.sort((a: any, b: any) => b.date - a.date)
    
    let currentStreak = 0
    let bestStreak = 0
    let tempStreak = 0
    
    // Calculate current streak from today backwards
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (let i = 0; i < studyHistory.length; i++) {
      const studyDate = new Date(studyHistory[i].date)
      studyDate.setHours(0, 0, 0, 0)
      
      const expectedDate = new Date(today)
      expectedDate.setDate(today.getDate() - i)
      
      if (studyDate.getTime() === expectedDate.getTime()) {
        currentStreak++
        tempStreak++
        bestStreak = Math.max(bestStreak, tempStreak)
      } else {
        if (i === 0) currentStreak = 0 // Streak broken if today is missing
        tempStreak = 0
      }
    }
    
    return { current: currentStreak, best: bestStreak }
  } catch (error) {
    console.error('Error calculating streak:', error)
    return { current: 0, best: 0 }
  }
}

/**
 * Load and calculate progress statistics from localStorage.
 */
function loadProgressStats() {
  isLoading.value = true
  
  try {
    // Get review data from localStorage (saved by QuickStudyView)
    const reviewData: Record<string, ReviewData> = JSON.parse(localStorage.getItem('reviewCards') || '{}')
    
    // Get study history for streaks and sessions
    const studyHistory = JSON.parse(localStorage.getItem('studyHistory') || '[]')
    
    // Calculate basic stats from review data
    let totalCorrect = 0
    let totalWrong = 0
    let cardsStudied = 0
    let cardsNeedingReview = 0
    let lastStudyTimestamp = 0
    
    // Process each card's review data
    for (const cardId in reviewData) {
      const cardData = reviewData[cardId]
      cardsStudied++
      
      // Count wrong answers
      totalWrong += cardData.wrongCount || 0
      
      // Estimate correct answers (cards that were reviewed but have low wrong count)
      if (cardData.lastCorrectDate) {
        totalCorrect += Math.max(1, 5 - (cardData.wrongCount || 0))
      }
      
      // Check if card needs review (wrong recently, not correct recently)
      const timeSinceLastCorrect = Date.now() - (cardData.lastCorrectDate || 0)
      const shouldReview = cardData.wrongCount > 0 && timeSinceLastCorrect > 24 * 60 * 60 * 1000
      if (shouldReview) {
        cardsNeedingReview++
      }
      
      // Track last study date
      lastStudyTimestamp = Math.max(lastStudyTimestamp, cardData.lastReviewDate || 0)
    }
    
    // Calculate streaks
    const streaks = calculateStreak()
    
    // Update progress stats
    progressStats.value = {
      totalCardsStudied: cardsStudied,
      totalCorrect: totalCorrect,
      totalWrong: totalWrong,
      totalSessions: studyHistory.length,
      currentStreak: streaks.current,
      bestStreak: streaks.best,
      lastStudyDate: formatDate(lastStudyTimestamp),
      cardsNeedingReview: cardsNeedingReview
    }
    
  } catch (error) {
    console.error('Error loading progress stats:', error)
    // Set default values on error
    progressStats.value = {
      totalCardsStudied: 0,
      totalCorrect: 0,
      totalWrong: 0,
      totalSessions: 0,
      currentStreak: 0,
      bestStreak: 0,
      lastStudyDate: 'Never',
      cardsNeedingReview: 0
    }
  }
  
  isLoading.value = false
}

// ===== Navigation Functions =====
/**
 * Navigate to Quick Study view.
 */
function goToQuickStudy() {
  router.push({ name: 'quick-study' })
}

/**
 * Navigate to Review Mode view.
 */
function goToReviewMode() {
  router.push({ name: 'review-mode' })
}

/**
 * Navigate back to home.
 */
function goHome() {
  router.push({ name: 'home' })
}

// ===== Lifecycle =====
onMounted(() => {
  loadProgressStats()
})
</script>

<!--
  All styling is via Tailwind utility classes in the template.
  No <style> block needed per StudyDock guidelines.
-->