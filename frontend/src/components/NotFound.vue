<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-1">Page Not Found</h1>
      <p class="text-neutral-500 mb-6">There's nothing here...</p>
      <RouterLink
        to="/home"
        class="px-3 py-2 rounded-lg font-semibold dark:bg-neutral-100 dark:text-neutral-900 bg-neutral-900 text-neutral-100 disabled:opacity-50"
      >
        <i class="pi pi-home mr-2" />
        Home
      </RouterLink>
    </div>
  </div>
</template>