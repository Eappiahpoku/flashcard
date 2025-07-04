# 📄 Product Requirements Document (PRD)

Project Title: Smart Flashcard App
Version: 1.0
Owner: [Your Name]
Date: 2025-07-01

1. Overview
The Smart Flashcard App is a web-based tool that allows users to create, organize, and review flashcards to improve memory retention. Users can create subject categories, build decks with term-definition pairs, and test themselves in quiz mode.

2. Goals & Objectives
Let users create flashcard decks by subject.

Allow users to add, save, and edit flashcards easily.

Provide a self-testing mode to reinforce learning.

Make the interface intuitive and responsive across devices.

- User Flow
mermaid
Copy
Edit
flowchart TD

A[User enters URL] --> B[Landing Page]

B --> C[Click "Add Subject"]
C --> D[Show "Add Flashcard" Button]
D --> E[Click "Add Flashcard"]

E --> F[Prompt: Name the Deck]
F --> G[Create Flashcards]

G --> H[Input Term and Definition]
H --> I{Add another flashcard?}

I -- Yes --> H
I -- No --> J[Save Deck]

J --> K[Replay Flashcards (Quiz Mode)]
K --> L[Show Term Only]
L --> M[User Clicks to Reveal Definition]

M --> N[Show Correct / Wrong Buttons]
N --> O{More Cards in Deck?}

O -- Yes --> L
O -- No --> P[End of Deck Session]
4. Core Features
4.1 Landing Page
Minimal design.

Add Subject button as CTA.

4.2 Deck Creation
Prompt user to name deck.

Flashcards created with term + definition.

Add multiple flashcards to a deck.

Ability to edit/delete cards before saving.

Save deck locally (initial version).

4.3 Flashcard Quiz Mode
Show term only.

On click, reveal definition.

User selects ✅ Correct or ❌ Wrong.

System loops through deck.

Optional: Show quiz score at the end.

   Pages & Components
Page/Component Description
LandingPage.vue Entry point, "Add Subject" button
DeckCreator.vue Input for naming deck & adding flashcards
FlashcardForm.vue Form for term/definition pair
DeckList.vue Lists all created decks
FlashcardQuiz.vue Plays flashcards in quiz mode
Card.vue Displays individual term/definition card
ResultScreen.vue Shows summary after quiz

1. Non-Functional Requirements
Responsive Design (mobile-first)

Fast Load Time (under 1 second per route)

Accessible UI (readable font sizes, color contrast)

Local Storage (initial version, no login needed)

- Technical Stack
Frontend Framework: Vue.js 3

Styling: Tailwind CSS

State Management: Pinia or Composition API

Data Storage: LocalStorage (initial), move to Firebase or Supabase later

Version Control: Git + GitHub

- Future Features (Optional)
User authentication (sign in to save decks across devices)

Image/audio support in flashcards

Progress tracking dashboard

Smart spaced repetition algorithm

- Milestones & Timeline
Milestone Target Date
Basic wireframes Day 1
Setup Vue app & routes Day 2
Flashcard deck creation Day 3
Flashcard quiz mode Day 4
Local storage integration Day 5
Styling & testing Day 6
Launch MVP Day 7
