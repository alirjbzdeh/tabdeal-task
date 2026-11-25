<!--
  Episode / location card: bold title, a cyan line and a gray line.
  The sr-only labels tell screen reader users what the two lines are ("Type: Planet").
-->
<script setup lang="ts">
defineProps<{
  title: string
  accent: string
  accentLabel: string
  meta: string
  metaLabel: string
  /** Machine-readable date for `meta`; renders it in a <time>. */
  datetime?: string
}>()
</script>

<template>
  <article class="flex h-full flex-col gap-4 rounded-2xl bg-card p-4">
    <h3 class="text-xl leading-6 font-bold">{{ title }}</h3>
    <p class="leading-[1.2] font-medium text-info">
      <span class="sr-only">{{ accentLabel }}: </span>{{ accent }}
    </p>
    <p class="leading-[1.2] text-muted">
      <span class="sr-only">{{ metaLabel }}: </span>
      <time v-if="datetime" :datetime="datetime">{{ meta }}</time>
      <template v-else>{{ meta }}</template>
    </p>
  </article>
</template>
