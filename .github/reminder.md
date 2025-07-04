# Things to take note of before starting

## Forgetting to write "setup" in `script` tags

`<script setup lang="ts"></script>`

### Todo-list

- [x] Create Flash**Deck**.vue
- [x] Create Flash**DeckList**.vue
- [x]Create Flash**DeckView**.vue
- [x] Create Flash**Card**.vue
- [x] Create Flash**CardList**.vue
- [x] Create Flash**CardView**.vue

#### Data Management

- Store locally in **localforage**
- **List** items from Store
- **Add** items to Store
- **Edit** items to Store
- **Delete** items at Store
- Create a **composable** file to move data to **localForage**- In your composable file make sure you seed local forage with some information. This helps you with the list of items from the Store which you have to see in the `homeview.vue`
The items from the store will become the array that fill your NoteCard which is looped in your notelist which is then displayed in your noteview.vue and finally you have to see the list of items from localforage in your homeview.vue. - This ends the task list items from localforage.
When you seed the items go and check that they are in local forage from the browser dev tool before moving on.
