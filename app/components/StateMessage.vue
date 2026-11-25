<!-- Empty / error message block. The title is a real heading so it shows up in the outline. -->
<script setup lang="ts">
withDefaults(defineProps<{ title: string; text?: string; level?: 1 | 2 }>(), {
  text: undefined,
  level: 2,
})
</script>

<template>
  <div class="flex flex-col items-center gap-3 py-24 text-center">
    <component :is="`h${level}`" class="text-xl font-bold">{{ title }}</component>
    <p v-if="text" class="max-w-md text-muted">{{ text }}</p>
    <slot />
  </div>
</template>
