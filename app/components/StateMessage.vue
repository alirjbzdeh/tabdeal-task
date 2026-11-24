<!-- Empty / error message block. -->
<script setup lang="ts">
defineProps<{ title: string; text?: string }>()
</script>

<template>
  <div class="flex flex-col items-center gap-3 py-24 text-center">
    <p class="text-xl font-bold">{{ title }}</p>
    <p v-if="text" class="max-w-md text-muted">{{ text }}</p>
    <slot />
  </div>
</template>
