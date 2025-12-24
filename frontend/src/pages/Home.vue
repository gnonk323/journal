<script lang="ts">
import { defineComponent, nextTick } from 'vue'
import { createEntryService, getTodayEntriesService } from '../services/entries'
import { formatDateLong } from '../lib/utils'
import { IJournalEntriesByDayResponse } from '../types/Entry';
import { logoutService } from '../services/auth';
import router from '../router';

export default defineComponent({
  name: "Home",
  data() {
    return {
      content: "",
      tags: [] as string[],
      addingTag: false,
      error: null as string | null,
      loading: false,
      submitted: false,
      todayEntries: null as IJournalEntriesByDayResponse | null,
      showPopup: false,
    }
  },
  computed: {
    wordCount(): number {
      return this.content.trim() === ""
        ? 0
        : this.content.trim().split(/\s+/).length
    },
    dateString() {
      return formatDateLong(new Date())
    }
  },
  methods: {
    toggleAddingTag() {
      this.addingTag = !this.addingTag
    },
    addTag(event: KeyboardEvent) {
      const input = event.target as HTMLInputElement
      const value = input.value.trim()
      if (value && !this.tags.includes(value)) {
        this.tags.push(value)
      }
      input.value = ""
      this.addingTag = false
    },
    removeTag(toRemove: string) {
      this.tags = this.tags.filter(tag => tag !== toRemove)
    },
    async saveEntry() {
      this.loading = true
      if (!this.content) return
      try {
        await createEntryService({ content: this.content, tags: this.tags })
        this.content = ""
        this.tags = []
        this.submitted = true
      } catch (error: any) {
        console.error("Error while creating journal entry", error)
        if (error.response && error.response.data) {
          this.error = error.response.data.error || error.message
        } else {
          this.error = error.message || String(error)
        }
      } finally {
        this.loading = false
      }
    },
    async getTodayEntries() {
      try {
        const data = await getTodayEntriesService()
        this.todayEntries = data
      } catch (error: any) {
        console.error("Error while loading today's entries", error)
        if (error.response && error.response.data) {
          this.error = error.response.data.error || error.message
        } else {
          this.error = error.message || String(error)
        }
      }
    },
    async logout() {
      try {
        await logoutService()
        router.push("/")
      } catch (error) {
        console.error("Error while logging out", error)
      }
    }
  },
  watch: {
    addingTag(value: boolean) {
      if (value) {
        nextTick(() => {
          (this.$refs.tagInput as HTMLInputElement | undefined)?.focus()
        })
      }
    },
    todayEntries() {
      if (this.todayEntries && this.todayEntries?.count > 0) {
        this.showPopup = true
      }
    }
  },
  mounted() {
    this.getTodayEntries()
  },
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div
      v-if="showPopup"
      class="fixed md:flex hidden top-10 left-1/2 -translate-x-1/2 dark:bg-neutral-100 dark:text-neutral-900 bg-neutral-900 text-neutral-100 font-semibold rounded-full p-2 text-sm items-center gap-4"
    >
      <button
        @click="showPopup=false"
        class="rounded-full dark:hover:bg-neutral-200 hover:bg-neutral-800 px-2 py-0.5"
      >
        <i class="pi pi-times text-xs" />
      </button>
      <p class="whitespace-nowrap">Nice job! You've made {{ todayEntries?.count }} journal entr{{ todayEntries?.count === 1 ? "y" : "ies" }} today.</p>
      <RouterLink
        to="/days/today"
        class="rounded-full dark:hover:bg-neutral-200 hover:bg-neutral-800 px-2 py-0.5"
      >
        <i class="pi pi-arrow-right text-xs" />
      </RouterLink>
    </div>
    <div v-if="submitted" class="p-6">
      <div class="mb-8 space-y-1 text-center">
        <h1 class="text-3xl font-bold">Journal entry saved!</h1>
        <p class="text-neutral-500">{{ dateString }}</p>
      </div>
      <div class="space-y-3">
        <RouterLink
          to="/calendar"
          class="px-3 py-2 rounded-lg border dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900 bg-neutral-900 text-neutral-100 w-full flex items-center justify-between gap-2"
        >
          Go to calendar
          <i class="pi pi-calendar" />
        </RouterLink>
        <RouterLink
          to="/days/today"
          class="px-3 py-2 rounded-lg border dark:border-neutral-500 border-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 w-full flex items-center justify-between gap-2"
        >
          Read today's entries
          <i class="pi pi-bars" />
        </RouterLink>
        <button
          class="px-3 py-2 rounded-lg border dark:border-neutral-500 border-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 w-full flex items-center justify-between gap-2"
          @click="submitted=false"
        >
          Make another entry
          <i class="pi pi-pencil" />
        </button>
      </div>
    </div>
    <div v-else class="max-w-4xl w-full p-6">
      <div class="mb-8 flex items-start justify-between md:flex-row flex-col-reverse gap-4">
        <div>
          <h1 class="text-3xl font-bold text-left mb-2">{{ dateString }}</h1>
          <p class="text-neutral-500">{{ `${!todayEntries || todayEntries?.count === 0 ? "No" : todayEntries.count} entries today.` }} Write something!</p>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="logout"
            class="rounded-lg p-3 flex items-center justify-center border dark:border-neutral-500 border-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <i class="pi pi-lock" />
          </button>
          <RouterLink
            to="/days/today"
            class="rounded-lg p-3 flex items-center justify-center border dark:border-neutral-500 border-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <i class="pi pi-bars" />
          </RouterLink>
          <RouterLink
            to="/calendar"
            class="rounded-lg p-3 flex items-center justify-center border dark:border-neutral-500 border-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <i class="pi pi-calendar" />
          </RouterLink>
        </div>
      </div>
      <form @submit.prevent="saveEntry">
        <div class="relative w-full mb-4">
          <textarea
            class="dark:bg-neutral-700 bg-neutral-50 border dark:border-neutral-600 border-neutral-200 w-full rounded-lg focus:outline-none p-4 resize-none mb-4 h-64 shadow-lg"
            placeholder="Start typing..."
            v-model="content"
          />
          <span class="absolute bottom-8 right-4 text-neutral-400 jetbrains-mono">
            {{ wordCount }}
          </span>
        </div>
        <div class="flex items-end justify-between">
          <div class="text-sm">
            <div class="flex items-center gap-2 text-neutral-500 mb-2">
              <i class="pi pi-tags" />
              <p>Tags</p>
            </div>
            <div class="flex items-center gap-2">
              <div v-for="tag in tags" class="flex items-center gap-2 rounded-full px-3 py-1 dark:bg-neutral-700 border dark:border-neutral-600 border-neutral-300 bg-neutral-100">
                {{ tag }}
                <button type="button" @click="removeTag(tag)">
                  <i class="pi pi-times text-xs text-neutral-400" />
                </button>
              </div>
              <div v-if="addingTag" class="rounded-full border border-dashed dark:border-neutral-600 border-neutral-300 dark:text-neutral-400 px-3 py-1 flex items-center gap-2">
                <input
                  ref="tagInput"
                  @keydown.enter="addTag"
                  class="w-20 focus:outline-0"
                />
                <button type="button" @click="toggleAddingTag">
                  <i class="pi pi-times text-xs text-neutral-400" />
                </button>
              </div>
              <button v-else
                class="rounded-full border border-dashed dark:border-neutral-600 dark:text-neutral-500 border-neutral-400 text-neutral-400 h-7 w-7 flex items-center justify-center dark:hover:bg-neutral-500/25 hover:bg-neutral-300/25"
                type="button"
                @click="toggleAddingTag"
              >
                <i class="pi pi-plus" />
              </button>
            </div>
          </div>
          <button
            class="px-3 py-2 rounded-lg font-semibold dark:bg-neutral-100 dark:text-neutral-900 bg-neutral-900 text-neutral-100 disabled:opacity-50"
            type="submit"
            :disabled="content.length < 100 || loading"
          >
            {{loading ? "Saving..." : "Save"}}
          </button>
        </div>
      </form>
      <div v-if="error" class="mt-8 p-4 rounded-lg border border-rose-600 bg-rose-600/20 text-rose-600 font-semibold flex items-center justify-between">
        <p>Error - {{ error }}</p>
        <button
          @click="error=null"
          class="py-1 px-2 rounded-lg hover:bg-rose-600/10"
        >
          <i class="pi pi-times" />
        </button>
      </div>
    </div>
  </div>
</template>
