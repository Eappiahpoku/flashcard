<!--
  filepath: c:\Users\Edward Appiah Poku\Desktop\projectplayground\flashcard\src\components\layout\FlashCardList.vue

  FlashCardList.vue
  -----------------------------------
  Displays a list of flashcards for the selected deck.
  - Loads cards from Pinia store (useFlashStorage).
  - Accepts deckId as a prop to filter cards.
  - Handles empty state.
  - Mobile-first, offline-first, Ghana-optimized.
  - StudyDock Coding Protocol: All props are required and type-checked.
  - Now supports editing and deleting flashcards inline.
  - Now uses ConfirmDeleteModal for safe card deletion.
-->

<template>
  <!-- ===== FlashCard List Container ===== -->
  <div class="flashcard-list-wrapper">
    <!-- ===== List Header ===== -->
    <div class="list-header mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">
        <!-- Show deck name if available -->
        {{ deckTitle ? deckTitle : 'Your Flashcards' }}
      </h2>
      <p class="text-gray-600">
        {{ filteredCards.length }} {{ filteredCards.length === 1 ? 'card' : 'cards' }} available
      </p>
    </div>

    <!-- ===== [New Feature] START ===== -->
    <!-- Only show one of: flashcard grid OR empty state, never both -->
    <template v-if="filteredCards.length > 0">
      <!-- ===== Flashcards Grid ===== -->
      <div
        class="flashcard-grid grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      >
        <!-- Loop through filtered cards and render FlashCard component for each -->
        <div
          v-for="flashcard in filteredCards"
          :key="flashcard.id"
          class="flashcard-item bg-white rounded-lg shadow p-4 flex flex-col gap-2 relative"
        >
          <!-- Inline edit form if this card is being edited -->
          <form v-if="editingId === flashcard.id" @submit.prevent="saveEdit(flashcard.id)" class="flex flex-col gap-2">
            <input
              v-model="editTerm"
              type="text"
              class="border rounded px-2 py-2 text-base"
              placeholder="Term"
              required
              :aria-label="'Edit term for ' + flashcard.term"
            />
            <textarea
              v-model="editDefinition"
              class="border rounded px-2 py-2 text-base"
              placeholder="Definition"
              required
              :aria-label="'Edit definition for ' + flashcard.term"
            ></textarea>
            <div class="flex gap-2 mt-2">
              <button type="submit" class="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex-1">
                Save
              </button>
              <button type="button" @click="cancelEdit" class="px-3 py-2 bg-gray-300 text-gray-700 rounded flex-1">
                Cancel
              </button>
            </div>
          </form>
          <!-- Normal display if not editing -->
          <div v-else>
            <div class="mb-2">
              <div class="font-semibold text-lg text-gray-800">{{ flashcard.term }}</div>
              <div class="text-gray-600 text-base">{{ flashcard.definition }}</div>
            </div>
            <div class="flex gap-2 mt-2">
              <!-- Edit Button -->
              <button
                @click="startEdit(flashcard)"
                class="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex-1"
                aria-label="Edit flashcard"
              >
                Edit
              </button>
              <!-- Delete Button -->
              <button
                @click="openDeleteModal(flashcard.id)"
                class="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex-1"
                aria-label="Delete flashcard"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <!-- ===== Empty State (when no flashcards) ===== -->
      <div class="empty-state text-center py-12">
        <div class="mb-4">
          <svg class="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-700 mb-2">No flashcards yet</h3>
        <p class="text-gray-500 mb-4">Create your first flashcard to get started studying!</p>
        <button  @click="showAddModal = true" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Create Flashcard
        </button>
      </div>
        <!-- AddCardModal: Shown when showAddModal is true -->
    <AddCardModal
      v-if="showAddModal"
      :deckId="deckId"
      @close="showAddModal = false"
      @added="handleCardAdded"
    />
    </template>
    <!-- ===== [New Feature] END ===== -->

    <!-- ===== [New Feature] START ===== -->
    <!-- ConfirmDeleteModal: Only shown when a delete is requested -->
    <ConfirmDeleteModal
      v-if="showDeleteModal"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
    <!-- ===== [New Feature] END ===== -->
  </div>
</template>

<script setup lang="ts">
// ===== File-Level Documentation =====
// This file uses Pinia store for card data and filters by deckId prop.
// Now supports editing and deleting flashcards inline.
// Now uses ConfirmDeleteModal for safe card deletion.

import { ref, computed } from 'vue'
import { useFlashStorage } from '@/stores/useFlashStorage'
// ===== [New Feature] START =====
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal.vue'
// ===== [New Feature] END =====
import AddCardModal from '@/components/modals/AddCardModal.vue'

// Modal state for AddCardModal
const showAddModal = ref(false)

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

/**
 * Props for FlashCardList
 * - deckId: string (required) - the ID of the deck whose cards to show
 * - This prop MUST be provided by the parent component (e.g., FlashCardView.vue)
 */
const props = defineProps<{
  deckId: string
}>()

// ===== Main Logic =====
// Use Pinia store for cards and decks
const flashStorage = useFlashStorage()

/**
 * Get all cards for the selected deck using the store's getter.
 * This is reactive and updates if the store changes.
 */
const filteredCards = computed(() => {
  // Defensive: If deckId is missing, return empty array
  if (!props.deckId) return []
  // Use the store's getter to filter cards by deckId
  return flashStorage.getCardsByDeck(props.deckId)
})

/**
 * Get the deck title for display in the header.
 */
const deckTitle = computed(() => {
  const deck = flashStorage.decks.find(d => d.id === props.deckId)
  return deck ? deck.title : ''
})

/* ===== [New Feature] START =====
   Inline editing state and logic for flashcards.
   - Only one card can be edited at a time.
   - editTerm and editDefinition hold the current edit values.
*/
const editingId = ref<string | null>(null)
const editTerm = ref('')
const editDefinition = ref('')

// ===== [New Feature] START =====
// State for delete modal
const showDeleteModal = ref(false)
const cardIdToDelete = ref<string | null>(null)

/**
 * Open the delete confirmation modal for a specific card.
 * @param cardId - The ID of the card to delete
 */
function openDeleteModal(cardId: string) {
  cardIdToDelete.value = cardId
  showDeleteModal.value = true
}

/**
 * Cancel delete: close modal and clear state.
 */
function cancelDelete() {
  showDeleteModal.value = false
  cardIdToDelete.value = null
}

/**
 * Confirm delete: remove the card and close modal.
 */
function confirmDelete() {
  if (cardIdToDelete.value) {
    flashStorage.removeCard(cardIdToDelete.value)
    // If we were editing this card, cancel edit mode
    if (editingId.value === cardIdToDelete.value) cancelEdit()
  }
  showDeleteModal.value = false
  cardIdToDelete.value = null
}
// ===== [New Feature] END =====

/**
 * Start editing a flashcard.
 * @param flashcard - The card to edit
 */
function startEdit(flashcard: { id: string; term: string; definition: string }) {
  editingId.value = flashcard.id
  editTerm.value = flashcard.term
  editDefinition.value = flashcard.definition
}

/**
 * Cancel editing.
 */
function cancelEdit() {
  editingId.value = null
  editTerm.value = ''
  editDefinition.value = ''
}

/**
 * Save the edited card.
 * @param cardId - The ID of the card being edited
 */
function saveEdit(cardId: string) {
  // Find the original card
  const original = filteredCards.value.find(card => card.id === cardId)
  if (!original) return
  // Call the store's editCard action
  flashStorage.editCard({
    ...original,
    term: editTerm.value,
    definition: editDefinition.value
  })
  cancelEdit()
}
</script>

<style scoped>
/* ===== Component-specific styles ===== */

.flashcard-list-wrapper {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.flashcard-grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.flashcard-item {
  animation: fadeInUp 0.3s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.flashcard-item:nth-child(1) { animation-delay: 0.1s; }
.flashcard-item:nth-child(2) { animation-delay: 0.2s; }
.flashcard-item:nth-child(3) { animation-delay: 0.3s; }
.flashcard-item:nth-child(4) { animation-delay: 0.4s; }
.flashcard-item:nth-child(5) { animation-delay: 0.5s; }
.flashcard-item:nth-child(6) { animation-delay: 0.6s; }

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .flashcard-list-wrapper {
    padding: 0.5rem;
  }
  .flashcard-grid {
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
</style>