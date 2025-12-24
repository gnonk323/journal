<script lang="ts">
import { defineComponent } from 'vue';
import { formatDateLong } from '../lib/utils';
import JournalListBase from '../components/JournalListBase.vue';
import { IJournalEntriesByDayResponse } from '../types/Entry';
import { getTodayEntriesService } from '../services/entries';

export default defineComponent({
  name: "Today",
  components: { JournalListBase },
  data() {
    return {
      data: null as IJournalEntriesByDayResponse | null,
      loading: false,
    }
  },
  computed: {
    dateString() {
      return formatDateLong(new Date())
    }
  },
  methods: {
    async getTodayEntries() {
      this.loading = true
      try {
        const data = await getTodayEntriesService()
        this.data = data
      } catch (error: any) {
        console.error("Error while loading today's entries", error)
      } finally {
        this.loading = false
      }
    },
    removeEntry(id: string) {
      if (this.data) {
        this.data.entries = this.data.entries.filter(e => e._id !== id)
      }
    },
  },
  mounted() {
    this.getTodayEntries()
  },
})
</script>

<template>
  <JournalListBase
    title="Today's Journal Entries"
    :date-string="dateString"
    :entries="data?.entries"
    :loading="loading"
    :show-new-entry-button="true"
    @delete-entry="removeEntry"
  />
</template>