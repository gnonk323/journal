<script lang="ts">
import { defineComponent, PropType } from 'vue';
import JournalEntryCard from './JournalEntryCard.vue';
import { IJournalEntry } from '../types/Entry';

export default defineComponent({
  name: "JournalListView",
  components: { JournalEntryCard },
  props: {
    title: { type: String, default: "Journal Entries" },
    dateString: { type: String, required: false },
    entries: { type: Array as PropType<IJournalEntry[]>, default: () => [] },
    today: { type: Boolean, default: false }
  },
  emits: ['delete-entry'],
  data() {
    return { order: true };
  },
  computed: {
    sortedEntries() {
      const list = [...this.entries];
      return this.order
        ? list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        : list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
  }
});
</script>

<template>
  <div class="max-w-4xl w-full mx-auto p-6 space-y-4">
    <div class="mb-8 flex items-start justify-between md:flex-row flex-col-reverse gap-4">
      <div>
        <h1 class="text-3xl font-bold">{{ title }}</h1>
        <p v-if="dateString" class="text-sm text-neutral-500">{{ dateString }}</p>
      </div>
      <div class="flex items-center gap-2">
        <RouterLink
          to="/calendar"
          class="rounded-lg p-3 flex items-center justify-center border dark:border-neutral-500 border-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          <i class="pi pi-calendar" />
        </RouterLink>
        <RouterLink
          to="/home"
          class="rounded-lg p-3 flex items-center justify-center border dark:border-neutral-500 border-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          <i class="pi pi-home" />
        </RouterLink>
      </div>
    </div>

    <RouterLink
      v-if="today"
      to="/home"
      class="px-3 py-2 rounded-lg dark:bg-neutral-100 dark:text-neutral-900 bg-neutral-900 text-neutral-100 disabled:opacity-50 flex items-center gap-3 justify-center mb-8"
    >
      <i class="pi pi-pencil" />
      {{ sortedEntries.length > 0 ? "Make another entry" : "Make an entry" }}
    </RouterLink>

    <div v-if="sortedEntries.length > 1">
      <button @click="order = !order" class="text-sm hover:text-current dark:text-neutral-500 text-neutral-400 flex items-center gap-2">
        <i :class="order ? 'pi pi-arrow-up' : 'pi pi-arrow-down'" />
        Sort
      </button>
    </div>
    <div v-if="sortedEntries.length > 0" class="space-y-4">
      <JournalEntryCard
        v-for="entry in sortedEntries"
        :key="entry._id"
        :entry="entry"
        @deleted="$emit('delete-entry', $event)"
      />
    </div>
    <div v-else class="text-center text-neutral-500">
      <p v-if="today">No journal entries yet today. Write about your day!</p>
      <p v-else>No journal entries for this date :(</p>
    </div>
  </div>
</template>