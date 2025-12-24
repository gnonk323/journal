<script lang="ts">
import { defineComponent } from 'vue';
import { IJournalEntry } from '../types/Entry';
import { deleteEntryService } from '../services/entries';

export default defineComponent({
  name: 'JournalEntryCard',
  emits: ['deleted'],
  data() {
    return {
      deleteLoading: false,
    }
  },
  props: {
    entry: {
      type: Object as () => IJournalEntry,
      required: true,
    },
  },
  methods: {
    async deleteEntry(id: string) {
      this.deleteLoading = true
      try {
        await deleteEntryService(id)
        this.$emit('deleted', id)
      } catch (error: any) {
        console.error("Error deleting journal entry", error)
      } finally {
        this.deleteLoading = false
      }
    }
  },
})
</script>

<template>
  <div class="rounded-lg p-4 border dark:border-neutral-600 border-neutral-300">
    <div class="flex items-center justify-between text-sm dark:text-neutral-500 text-neutral-400 mb-2">
      <p>{{ new Date(entry.createdAt).toLocaleTimeString() }}</p>
      <button
        class="hover:text-rose-600"
        @click="deleteEntry(entry._id)"
      >
        <i class="pi pi-trash" />
      </button>
    </div>
    <p class="wrap-break-word">{{ entry.content }}</p>
    <div
      v-if="entry.tags.length > 0"
      class="flex flex-wrap gap-2 mt-3"
    >
      <div
        v-for="tag in entry.tags"
        class="flex items-center gap-2 rounded-full px-3 py-0.5 border dark:border-neutral-600 border-neutral-300 text-sm"
      >
        {{ tag }}
      </div>
    </div>
  </div>
</template>