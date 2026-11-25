<script setup lang="ts">
defineProps<{
  title: string
  accent: string
  accentLabel: string
  meta: string
  metaLabel: string
  datetime?: string
}>()
</script>

<template>
  <article class="flex h-full flex-col gap-4 rounded-2xl bg-card p-4">
    <h3 class="text-xl leading-6 font-bold">{{ title }}</h3>
    <p class="leading-compact font-medium text-info">
      <span class="sr-only">{{ accentLabel }}: </span>{{ accent }}
    </p>
    <p class="leading-compact text-muted">
      <span class="sr-only">{{ metaLabel }}: </span>
      <time v-if="datetime" :datetime="datetime">{{ meta }}</time>
      <template v-else>{{ meta }}</template>
    </p>
  </article>
</template>
