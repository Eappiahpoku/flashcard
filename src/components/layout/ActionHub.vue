<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
    <!-- Desktop View -->
    <div class="hidden md:flex justify-center items-center h-16 max-w-7xl mx-auto px-4">
      <div class="flex space-x-8 items-center">
        <router-link to="/" class="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
          <font-awesome-icon icon="fa-solid fa-home" class="text-xl" />
          <span>Home</span>
        </router-link>

        <button @click="handleNewReceipt" class="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
          <font-awesome-icon icon="fa-solid fa-plus-circle" class="text-xl" />
          <span>New Receipt</span>
        </button>

        <button @click="shareWhatsApp" class="flex items-center space-x-2 text-green-600 hover:text-green-700">
          <font-awesome-icon icon="fa-brands fa-whatsapp" class="text-xl" />
          <span>Share WhatsApp</span>
        </button>

        <button @click="downloadPDF" class="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
          <font-awesome-icon icon="fa-solid fa-download" class="text-xl" />
          <span>Download PDF</span>
        </button>
      </div>
    </div>

    <!-- Mobile View -->
    <div class="md:hidden flex justify-around items-center h-16">
      <router-link to="/" class="text-primary-600 hover:text-primary-700">
        <font-awesome-icon icon="fa-solid fa-home" class="text-2xl" />
      </router-link>

      <button @click="handleNewReceipt" class="text-primary-600 hover:text-primary-700">
        <font-awesome-icon icon="fa-solid fa-plus-circle" class="text-2xl" />
      </button>

      <button @click="shareWhatsApp" class="text-green-600 hover:text-green-700">
        <font-awesome-icon icon="fa-brands fa-whatsapp" class="text-2xl" />
      </button>

      <button @click="downloadPDF" class="text-primary-600 hover:text-primary-700">
        <font-awesome-icon icon="fa-solid fa-download" class="text-2xl" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">


// Added new invoice handling with page refresh functionality.
import { useRouter } from 'vue-router'
// ===== [New Feature] START =====
/**
 * Props for ActionHub.
 * - invoice: The invoice data (optional for flexibility)
 * - companyLogo: The company logo (optional for flexibility)
 */
withDefaults(
  defineProps<{
    form?: any
    companyLogo?: string | null
  }>(),
  {
    form: undefined,
    companyLogo: null
  }
)

const emit = defineEmits<{
  (e: 'download-pdf'): void
  (e: 'share-whatsapp'): void
}>()
// ===== [New Feature] END =====

// ===== [New Feature] START =====
/**
 * Emits WhatsApp share event to parent.
 */
function shareWhatsApp() {
  console.log('[ActionHub] WhatsApp button clicked, emitting share-whatsapp event')
  emit('share-whatsapp')
}

/**
 * Emits PDF download event to parent.
 */
function downloadPDF() {
  console.log('[ActionHub] Download PDF button clicked, emitting download-pdf event')
  emit('download-pdf')
}
// ===== [New Feature] END =====



// ===== Constants & Config =====
const router = useRouter()


async function handleNewReceipt() {
  try {
    // First, navigate to /new-invoice
    await router.push('/new-receipt')

    // Then refresh the page
    window.location.reload()

    console.log('[ActionHub] Navigated to /new-invoice and refreshed page')
  } catch (error) {
    console.error('[ActionHub] Navigation error:', error)
  }
}






</script>