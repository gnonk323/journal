<script lang="ts">
import { defineComponent } from 'vue'
import { IJournalEntriesResponse } from '../types/Entry'
import { getMonthEntriesService } from '../services/entries'

export default defineComponent({
  name: "Calendar",
  data() {
    return {
      currentDate: new Date(),
      monthData: null as IJournalEntriesResponse | null,
      loading: false,
      error: null as string | null,
      daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    }
  },
  computed: {
    calendarDays() {
      const year = this.currentDate.getFullYear()
      const month = this.currentDate.getMonth()
      const firstDayOfMonth = new Date(year, month, 1).getDay()
      const daysInMonth = new Date(year, month + 1, 0).getDate()
      
      const days = []
      // start padding
      for (let i = 0; i < firstDayOfMonth; i++) {
        days.push({ day: null, dateStr: null, hasEntry: false })
      }
      // month days
      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
        const entryData = this.monthData?.days.find((day: any) => day.date === dateStr)
        days.push({
          day: d,
          dateStr: dateStr,
          hasEntry: !!entryData,
          count: entryData?.count || 0
        })
      }
      // end padding
      const totalSlotsFilled = days.length
      const remainingSlots = (7 - (totalSlotsFilled % 7)) % 7
      for (let j = 0; j < remainingSlots; j++) {
        days.push({ day: null, dateStr: null, hasEntry: false })
      }

      return days
    },
    displayMonth() {
      return this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
    }
  },
  methods: {
    async getMonthData(month: number, year: number) {
      this.loading = true
      this.error = null
      try {
        const data = await getMonthEntriesService(month, year)
        this.monthData = data
      } catch (error: any) {
        this.error = error.message || "Error"
      } finally {
        this.loading = false
      }
    },
    changeMonth(step: number) {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + step, 1)
      this.getMonthData(this.currentDate.getMonth() + 1, this.currentDate.getFullYear())
    }
  },
  mounted() {
    this.getMonthData(this.currentDate.getMonth() + 1, this.currentDate.getFullYear())
  },
})
</script>

<template>
  <div class="w-full max-w-4xl mx-auto p-6">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">{{ displayMonth }}</h1>
      </div>
      <div class="flex items-center gap-2">
        <button 
          @click="changeMonth(-1)" 
          class="rounded-lg p-3 flex items-center justify-center border dark:border-neutral-500 border-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          <i class="pi pi-chevron-left" />
        </button>
        <button 
          @click="changeMonth(1)" 
          class="rounded-lg p-3 flex items-center justify-center border dark:border-neutral-500 border-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          <i class="pi pi-chevron-right" />
        </button>
        <br />
        <RouterLink
          to="/home"
          class="rounded-lg p-3 flex items-center justify-center border dark:border-neutral-500 border-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          <i class="pi pi-home" />
        </RouterLink>
      </div>
    </div>

    <div v-if="loading" class="text-center py-10 text-neutral-500">
      <i class="pi pi-spinner animate-spin" />
    </div>
    
    <div v-else-if="error" class="p-4 rounded-lg border border-rose-600 bg-rose-600/20 text-rose-600 font-semibold flex items-center justify-between">
      <p>Error - {{ error }}</p>
      <button
        @click="error=null"
        class="py-1 px-2 rounded-lg hover:bg-rose-600/10"
      >
        <i class="pi pi-times" />
      </button>
    </div>

    <div v-else class="dark:bg-neutral-700 bg-neutral-50 border dark:border-neutral-600 border-neutral-200 rounded-lg overflow-hidden shadow-lg">
      <div class="grid grid-cols-7">
        <div 
          v-for="day in daysOfWeek" 
          :key="day" 
          class="p-3 text-center text-sm font-semibold dark:bg-neutral-800 bg-neutral-100 dark:border-neutral-600 border-neutral-200 border-b"
        >
          {{ day }}
        </div>

        <div 
          v-for="(day, index) in calendarDays" 
          :key="index"
          class="min-h-25 p-3 dark:border-neutral-600 border-neutral-200 border-r border-b transition-colors"
          :class="[
            day.day ? 'dark:bg-neutral-700 bg-white hover:bg-neutral-50 dark:hover:bg-neutral-600/50' : 'dark:bg-neutral-800/50 bg-neutral-100/50',
          ]"
        >
          <div v-if="day.day" class="flex flex-col h-full">
            <span class="text-sm mb-2">
              {{ day.day }}
            </span>
            
            <div v-if="day.hasEntry" class="mt-auto">
              <RouterLink
                :to="`/days/${day.dateStr}`"
                class="text-xs inline-block px-2 py-1 rounded dark:bg-neutral-100 dark:text-neutral-900 bg-neutral-900 text-neutral-100 font-semibold hover:opacity-80"
              >
                {{ day.count }} {{ day.count === 1 ? 'entry' : 'entries' }}
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>