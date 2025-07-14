<!--
  FlashDeckList.vue
  -----------------------------------
  Displays a list of study decks for the user.
  - Loads decks from Pinia store (useFlashStorage.ts).
  - Handles loading, error, and empty states.
  - Mobile-first, offline-first, Ghana-optimized.
  - Now supports adding, editing, and deleting decks via modals and inline forms.
  - Deck card (except buttons) is now clickable to view flashcards.
  - <!-- ===== [New Feature] START ===== --> "Study" button now launches StudyFlashcardModal for that deck.
  - <!-- ===== [New Feature] START ===== --> Study modal now loads cards from global store, not deck.cards.


<template>
 
  <!-- ===== FlashDeck List Container ===== -->
  <div class="flashdeck-list-wrapper">
    <!-- ===== List Header ===== -->
    <div class="list-header mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">Your Study Decks</h2>
        <p class="text-gray-600">
          {{ isLoading ? 'Loading decks...' : (flashDecks.length + ' ' + (flashDecks.length === 1 ? 'deck' : 'decks') + ' available') }}
        </p>
      </div>
     <!-- ===== [New Feature] START ===== -->
      <button
        @click="showAddDeckModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-2 sm:mt-0"
        aria-label="Add new subject"
      >
        + Add Subject
      </button>
      <!-- ===== [New Feature] END ===== -->
    </div>

    <!-- ===== Loading State ===== -->
    <div v-if="isLoading" class="text-center py-8 text-blue-700 font-medium">
      Loading your decks, please wait...
    </div>

    <!-- ===== Error State ===== -->
    <div v-if="error" class="text-center py-8 text-red-600 font-medium">
      {{ error }}
      <button @click="reload" class="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
        Try Again
      </button>
    </div>

    <!-- ===== FlashDecks Grid ===== -->
    <div
      v-if="!isLoading && !error && flashDecks.length > 0"
      class="flashdeck-grid grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    >
      <!-- Loop through flashdecks and render each deck with inline edit/delete -->
      <div
        v-for="deck in flashDecks"
        :key="deck.id"
        class="flashdeck-item bg-white rounded-lg shadow p-4 flex flex-col gap-2 relative"
      >
        <!-- ===== [New Feature] START: Inline Edit Deck ===== -->
        <form v-if="editingDeckId === deck.id" @submit.prevent="saveEditDeck(deck.id)" class="flex flex-col gap-2">
          <input
            v-model="editDeckTitle"
            type="text"
            class="border rounded px-2 py-2 text-base"
            placeholder="Deck Title"
            required
            minlength="2"
            maxlength="32"
            :aria-label="'Edit title for ' + deck.title"
          />
          <textarea
            v-model="editDeckDescription"
            class="border rounded px-2 py-2 text-base"
            placeholder="Description (optional)"
            maxlength="80"
            :aria-label="'Edit description for ' + deck.title"
          ></textarea>
          <div class="flex gap-2 mt-2">
            <button type="submit" class="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex-1">
              Save
            </button>
            <button type="button" @click="cancelEditDeck" class="px-3 py-2 bg-gray-300 text-gray-700 rounded flex-1">
              Cancel
            </button>
          </div>
        </form>
        <!-- ===== [New Feature] END: Inline Edit Deck ===== -->

        <!-- Normal display if not editing -->
        <div v-else>
          <!-- ===== [New Feature] START: Clickable Deck Card ===== -->
          <div
            class="mb-2 cursor-pointer select-none rounded transition hover:bg-blue-50 active:bg-blue-100"
            @click="handleDeckSelect(deck.id)"
            tabindex="0"
            @keydown.enter="handleDeckSelect(deck.id)"
            @keydown.space.prevent="handleDeckSelect(deck.id)"
            role="button"
            aria-label="Open deck"
          > 
        
            <div class="font-semibold text-lg text-gray-800">{{ deck.title }}</div>
            <div class="text-gray-600 text-base truncate">{{ deck.description }}</div>
            <div class="text-xs text-gray-400 mt-1">
              {{ deck.cardCount }} {{ deck.cardCount === 1 ? 'card' : 'cards' }}
            </div>
          </div>
          <div class="flex gap-2 mt-2">
            <!-- Edit Button -->
            <button
              @click.stop="startEditDeck(deck)"
              class="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex-1"
              aria-label="Edit deck"
            >
              Edit
            </button>
            <!-- Delete Button -->
            <button
              @click.stop="openDeleteDeckModal(deck.id)"
              class="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex-1"
              aria-label="Delete deck"
            >
              Delete
            </button>
            <!-- ===== [New Feature] START: Study Button launches StudyFlashcardModal ===== -->
            <button
              @click.stop="openStudyModal(deck)"
              class="px-3 py-2 bg-blue-600 text-white rounded flex-1 hover:bg-blue-700 transition-colors"
              aria-label="Study deck"
            >
              Study
            </button>
            <!-- ===== [New Feature] END: Study Button launches StudyFlashcardModal ===== -->
          </div>
          <!-- ===== [New Feature] END: Clickable Deck Card ===== -->
        </div>
      </div>
    </div>

    <!-- ===== Empty State (when no decks) ===== -->
    <div v-if="!isLoading && !error && flashDecks.length === 0" class="empty-state text-center py-12">
      <div class="mb-4">
        <svg class="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-700 mb-2">No study decks yet</h3>
      <p class="text-gray-500 mb-4">Create your first deck to start studying!</p>
      <button
        @click="showAddDeckModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        aria-label="Create deck"
      >
        Create Deck
      </button>
    </div>

    <!-- ===== [New Feature] START ===== -->
    <!-- AddDeckModal: Only shown when showAddDeckModal is true -->
    <AddDeckModal
      v-if="showAddDeckModal"
      @add="handleAddDeck"
      @cancel="showAddDeckModal = false"
    />
    <!-- ===== [New Feature] END ===== -->

    <!-- ===== [New Feature] START: ConfirmDeleteDeckModal ===== -->
    <ConfirmDeleteDeckModal
      v-if="showDeleteDeckModal"
      @confirm="confirmDeleteDeck"
      @cancel="cancelDeleteDeck"
    />
    <!-- ===== [New Feature] END ===== -->

    <!-- ===== [New Feature] START: StudyFlashcardModal Integration ===== -->
    <StudyFlashcardModal
      v-if="showStudyModal"
      :cards="studyCards"
      @close="closeStudyModal"
    />
    <!-- ===== [New Feature] END: StudyFlashcardModal Integration ===== -->
  </div>
</template>

<script setup lang="ts">
// ===== File-Level Documentation =====
// Displays a list of study decks for the user.
// Now supports adding, editing, and deleting decks via modals and inline forms.
// Deck card (except buttons) is now clickable to view flashcards.
// <!-- ===== [New Feature] START ===== --> "Study" button now launches StudyFlashcardModal for that deck
// <!-- ===== [New Feature] START ===== --> Study modal now loads cards from global store, not deck.cards

// ===== Component Imports =====
import AddDeckModal from '@/components/modals/AddDeckModal.vue'
import ConfirmDeleteDeckModal from '@/components/modals/ConfirmDeleteDeckModal.vue'
import StudyFlashcardModal from '@/components/modals/StudyFlashcardModal.vue'

import { useFlashStorage } from '@/stores/useFlashStorage'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

/**
 * We use Pinia's storeToRefs to get reactive references to the decks array.
 * This ensures the UI updates automatically when the store changes.
 */
const flashStorage = useFlashStorage()
const { decks: flashDecks, cards: allCards } = storeToRefs(flashStorage) // <-- [New Feature] get all cards

// ===== Router for Navigation =====
const router = useRouter()

// Simulate loading and error states for demonstration (replace with real logic if needed)
const isLoading = ref(false)
const error = ref('')

// ===== [New Feature] START: AddDeckModal State =====
const showAddDeckModal = ref(false)

// ===== [New Feature] START: Inline Edit State =====
const editingDeckId = ref<string | null>(null)
const editDeckTitle = ref('')
const editDeckDescription = ref('')

// ===== [New Feature] START: Delete Modal State =====
const showDeleteDeckModal = ref(false)
const deckIdToDelete = ref<string | null>(null)

// ===== [New Feature] START: Study Modal State =====
/**
 * Controls the visibility of the StudyFlashcardModal.
 */
const showStudyModal = ref(false)
/**
 * Holds the flashcards for the currently studied deck.
 */
const studyCards = ref<{ id: string; term: string; definition: string }[]>([])

/**
 * Opens the StudyFlashcardModal for the selected deck.
 * @param deck - The deck object
 */
function openStudyModal(deck: any) {
  // ===== [New Feature] START: Get cards from global store by deckId =====
  // This assumes your Pinia store has a `cards` array with a `deckId` property on each card.
  studyCards.value = Array.isArray(allCards.value)
    ? allCards.value
        .filter((c: any) => c.deckId === deck.id)
        .map((c: any) => ({
          id: c.id,
          term: c.term,
          definition: c.definition
        }))
    : []
  showStudyModal.value = true
  // ===== [New Feature] END =====
}

/**
 * Closes the StudyFlashcardModal.
 */
function closeStudyModal() {
  showStudyModal.value = false
  studyCards.value = []
}

// ===== Existing logic for add/edit/delete/reload/deck select remains unchanged =====

/**
 * Handles the 'add' event from AddDeckModal.
 * Adds the new deck to the store and closes the modal.
 * @param payload - { title: string, description: string }
 */
function handleAddDeck(payload: { title: string; description: string }) {
  const newId = `deck-${Date.now()}-${Math.floor(Math.random() * 10000)}`
  flashStorage.addDeck({
    id: newId,
    title: payload.title,
    subject: 'general',
    cardCount: 0,
    description: payload.description,
    createdAt: Date.now(),
    progress: 0
  })
  showAddDeckModal.value = false
}

/**
 * Start editing a deck.
 * @param deck - The deck to edit
 */
function startEditDeck(deck: { id: string; title: string; description?: string }) {
  editingDeckId.value = deck.id
  editDeckTitle.value = deck.title
  editDeckDescription.value = deck.description || ''
}

/**
 * Cancel editing a deck.
 */
function cancelEditDeck() {
  editingDeckId.value = null
  editDeckTitle.value = ''
  editDeckDescription.value = ''
}

/**
 * Save the edited deck.
 * @param deckId - The ID of the deck being edited
 */
function saveEditDeck(deckId: string) {
  const original = flashDecks.value.find(deck => deck.id === deckId)
  if (!original) return
  // Update the deck in the store (assumes addDeck and editCard are both available)
  flashStorage.removeDeck(deckId)
  flashStorage.addDeck({
    ...original,
    title: editDeckTitle.value,
    description: editDeckDescription.value,
    // Keep all other properties unchanged
  })
  cancelEditDeck()
}

/**
 * Open the delete confirmation modal for a specific deck.
 * @param deckId - The ID of the deck to delete
 */
function openDeleteDeckModal(deckId: string) {
  deckIdToDelete.value = deckId
  showDeleteDeckModal.value = true
}

/**
 * Cancel delete: close modal and clear state.
 */
function cancelDeleteDeck() {
  showDeleteDeckModal.value = false
  deckIdToDelete.value = null
}

/**
 * Confirm delete: remove the deck and close modal.
 */
function confirmDeleteDeck() {
  if (deckIdToDelete.value) {
    flashStorage.removeDeck(deckIdToDelete.value)
    // If we were editing this deck, cancel edit mode
    if (editingDeckId.value === deckIdToDelete.value) cancelEditDeck()
  }
  showDeleteDeckModal.value = false
  deckIdToDelete.value = null
}

/**
 * Reloads the deck list.
 * In a real app, this would re-fetch from storage or server.
 * Here, it just resets error/loading for demonstration.
 */
function reload() {
  isLoading.value = false
  error.value = ''
}



/**
 * Handle when a deck is selected.
 * This receives the deckId from the FlashDeck component.
 * Now includes actual navigation logic!
 */
function handleDeckSelect(deckId: string) {
  try {
    router.push({
      name: 'deck-study',
      params: { deckId: deckId }
    })
  } catch (navigationError) {
    // Navigation error handling
    // (You may want to show a user-friendly error message here)
  }
}
</script>

<style scoped>
/* ===== Component-specific styles ===== */

/**
 * FlashDeck List wrapper with responsive design
 */
.flashdeck-list-wrapper {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

/**
 * Responsive grid layout
 */
.flashdeck-grid {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

/**
 * Individual flashdeck item styling
 */
.flashdeck-item {
  animation: fadeInUp 0.3s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.flashdeck-item:nth-child(1) { animation-delay: 0.1s; }
.flashdeck-item:nth-child(2) { animation-delay: 0.2s; }
.flashdeck-item:nth-child(3) { animation-delay: 0.3s; }
.flashdeck-item:nth-child(4) { animation-delay: 0.4s; }
.flashdeck-item:nth-child(5) { animation-delay: 0.5s; }
.flashdeck-item:nth-child(6) { animation-delay: 0.6s; }

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .flashdeck-list-wrapper {
    padding: 0.5rem;
  }
  .flashdeck-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .list-header {
    margin-bottom: 1rem;
  }
}

.empty-state {
  background-color: #f9fafb;
  border-radius: 0.5rem;
  border: 2px dashed #d1d5db;
}

@media (prefers-reduced-motion: reduce) {
  .flashdeck-item {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>