// ===== File-Level Documentation =====
//
// main.ts
// -----------------------------------
// Entry point for StudyDock flashcard app.
// - Sets up Vue app, Pinia, plugins, and global components.
// - Ensures flashcard data is loaded from localForage before mounting the app (offline-first, Ghana-optimized).
//
// Dependencies: Vue 3, Pinia, localforage, Tailwind CSS, Toastification, FontAwesome

import { createApp } from 'vue'
import { createPinia } from 'pinia'
// ===== [New Feature] START =====
// Removed pinia-plugin-persistedstate to avoid conflicts with localForage
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// ===== [New Feature] END =====
import App from './App.vue'
import router from './router'
import './style.css'
import { FontAwesomeIcon } from './plugins/fontawesome.ts'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Toast, { toastOptions } from './plugins/toast.ts'
import 'vue-toastification/dist/index.css'

// Import Vercel Analytics for pageview/event tracking
import { inject } from "@vercel/analytics"

// Import base components
import AppButton from './components/base/AppButton.vue'
import AppForm from './components/base/AppForm.vue'
import AppInput from './components/base/AppInput.vue'
import ErrorBoundary from './components/system/ErrorBoundary.vue'
import LoadingSpinner from './components/base/LoadingSpinner.vue'
import OfflineIndicator from './components/base/OfflineIndicator.vue'

// ===== [New Feature] START =====
// Import the flashcard Pinia store and ensure data is loaded before mounting the app
import { useFlashStorage } from './stores/useFlashStorage'
// ===== [New Feature] END =====

// ===== Main Logic =====
async function bootstrap() {
  // Create Vue application
  const app = createApp(App)

  // Configure Pinia (no persistedstate plugin)
  const pinia = createPinia()
  // ===== [New Feature] START =====
  // Do NOT use piniaPluginPersistedstate here, to avoid conflicts with localForage
  // pinia.use(piniaPluginPersistedstate)
  // ===== [New Feature] END =====

  // Use plugins
  app.use(pinia)
  app.use(router)

  // Register base components globally
  app.component('AppButton', AppButton)
  app.component('AppForm', AppForm)
  app.component('AppInput', AppInput)
  app.component('ErrorBoundary', ErrorBoundary)
  app.component('LoadingSpinner', LoadingSpinner)
  app.component('OfflineIndicator', OfflineIndicator)
  app.component('font-awesome-icon', FontAwesomeIcon)
  app.use(Toast, toastOptions)

  // Initialize Vercel Analytics (tracks pageviews automatically)
  inject();

  // ===== [New Feature] START =====
  // Ensure flashcard data is loaded from localForage before mounting the app
  const flashStorage = useFlashStorage()
  await flashStorage.loadFromStorage()
  // ===== [New Feature] END =====

  // Mount the app (only after data is loaded)
  app.mount('#app')
}

// ===== [New Feature] START =====
// Run the bootstrap function to start the app
bootstrap()
// ===== [New Feature] END =====