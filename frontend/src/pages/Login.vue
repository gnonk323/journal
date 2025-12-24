<script lang="ts">
import { defineComponent } from 'vue';
import { loginService, checkAuth } from '../services/auth';
import router from '../router';

export default defineComponent({
  name: "Login",
  data() {
    return {
      password: "",
      loading: false,
      error: null as string | null
    }
  },
  methods: {
    async login() {
      this.loading = true
      this.error = null
      try {
        await loginService(this.password)
        router.push("/home")
      } catch (error: any) {
        console.error("Error logging in", error)
        if (error.response && error.response.data) {
          this.error = error.response.data.error || error.message
        } else {
          this.error = error.message || String(error)
        }
      } finally {
        this.loading = false
      }
    },
    async redirectIfAuthenticated() {
      if (await checkAuth()) {
        router.push("/home")
      }
    }
  },
  mounted() {
    this.redirectIfAuthenticated()
  },
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="max-w-xl w-full p-6">
      <div class="rounded-lg p-8 shadow-lg border dark:bg-neutral-800 dark:border-neutral-700 bg-neutral-50 border-neutral-300 space-y-6">
        <div class="flex items-center gap-8">
          <i class="pi pi-lock text-3xl dark:text-neutral-600 text-neutral-400" />
          <input
            v-model="password"
            type="password"
            placeholder="PASSWORD"
            class="w-full dark:bg-neutral-700 bg-neutral-200 p-3 rounded-lg text-xl focus:outline-0 jetbrains-mono"
            @keydown.enter="login"
          />
        </div>
        <div v-if="error" class="p-2 rounded-lg border border-rose-600 bg-rose-600/30 text-rose-600 font-bold">
          <p class="text-center">{{error}}</p>
        </div>
      </div>
    </div>
  </div>
</template>