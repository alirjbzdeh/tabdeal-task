<script setup lang="ts">
import type { Character } from '#shared/types/api'

const props = defineProps<{
  character: Pick<Character, 'status' | 'species'>
  label?: string
}>()

const DOT_CLASS = { success: 'bg-success', danger: 'bg-danger', unknown: 'bg-muted' } as const

const dotClass = computed(() => DOT_CLASS[statusTone(props.character.status)])
</script>

<template>
  <p class="flex items-center gap-2 leading-5">
    <span class="size-3 shrink-0 rounded-full" :class="dotClass" aria-hidden="true" />
    <span v-if="label" class="sr-only">{{ `${label}: ` }}</span>
    <span class="truncate">{{ formatStatusLine(character) }}</span>
  </p>
</template>
