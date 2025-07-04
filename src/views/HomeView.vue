<!--
  HomeView.vue
  StudyDock Ghana - Home page
  - Shows header, hero, deck list, quick actions
  - Adds "Add New Subject" button and static modal (sst)
  - Adds "Add Flashcard" modal after saving a new deck (sst)
  - Allows user to add multiple flashcards before closing modal (sst)
  - All code is mobile-first and well-commented for learning
-->

<template>
  <!-- ===== Main Home Page Layout ===== -->
  <HeroSection />
  <AppHeader />
  <FlashDeckView />
  <QuickAction />

 
</template>

<script setup lang="ts">
// ===== Imports =====

import HeroSection from '@/components/layout/HeroSection.vue'
import FlashDeckView from './FlashDeckView.vue'
import QuickAction from '@/components/layout/QuickAction.vue'



/**
 * Controls the visibility of the Add Flashcard modal
 * flashcardTerm and flashcardDefinition hold the input values (sst, not used yet)
 * lastDeckName stores the name of the last created deck for display
 */




</script>

<!--
  All styling is mobile-first using Tailwind CSS utility classes.
  Both modals are accessible and touch-friendly (min 48x48px targets).
  This is a static (sst) implementation: no saving to storage yet.
  User can add as many flashcards as they want before clicking "Done".
-->