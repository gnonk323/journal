<script lang="ts">
import { defineComponent } from 'vue';
import JournalListBase from '../components/JournalListBase.vue';
import { IJournalEntriesByDayResponse } from '../types/Entry';
import { getEntriesByDateService } from '../services/entries';
import { formatDateLong, parseLocalDate } from '../lib/utils';

export default defineComponent({
  name: "DateView",
  components: { JournalListBase },
  props: {
    date: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      data: null as IJournalEntriesByDayResponse | null,
      loading: false,
    }
  },
  computed: {
    formattedDate() {
      return formatDateLong(parseLocalDate(this.date))
    }
  },
  methods: {
    async fetchEntries() {
      this.loading = true
      try {
        const data = await getEntriesByDateService(this.date)
        this.data = data
      } catch (error) {
        console.error("Error loading entries for date", error)
      } finally {
        this.loading = false
      }
    },
    removeEntry(id: string) {
      if (this.data) {
        this.data.entries = this.data.entries.filter(e => e._id !== id)
      }
    }
  },
  mounted() {
    this.fetchEntries()
  }
})
</script>

<template>
  <JournalListBase
    :title="formattedDate"
    :entries="data?.entries"
    :loading="loading"
    :show-new-entry-button="false"
    @delete-entry="removeEntry"
  />
</template>