<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <h2 class="flex items-center gap-2 text-xl leading-7 font-medium md:text-2xl">
    <span class="grid size-6 shrink-0 place-items-center text-accent" aria-hidden="true">
      <slot />
    </span>
    {{ title }}
  </h2>
</template>
