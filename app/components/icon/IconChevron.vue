<script setup lang="ts">
defineProps<{ double?: boolean }>()
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="double">
      <path d="m11 17-5-5 5-5" />
      <path d="m18 17-5-5 5-5" />
    </template>
    <path v-else d="m15 18-6-6 6-6" />
  </svg>
</template>
