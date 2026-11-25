<script setup lang="ts">
import type { Character } from '~/types/api'

const props = defineProps<{
  character: Pick<Character, 'id' | 'name' | 'status' | 'species' | 'image'>
  eager?: boolean
  priority?: boolean
}>()

const localePath = useLocalePath()

const dotClass = computed(
  () =>
    ({ success: 'bg-success', danger: 'bg-danger', unknown: 'bg-muted' })[
      statusTone(props.character.status)
    ],
)
</script>

<template>
  <article
    class="relative rounded-2xl border border-transparent p-4 transition-colors focus-within:border-line hover:border-line"
  >
    <NuxtImg
      :src="character.image"
      :alt="$t('character.portrait', { name: character.name })"
      width="300"
      height="300"
      :loading="eager || priority ? 'eager' : 'lazy'"
      :fetchpriority="eager || priority ? 'high' : 'auto'"
      :preload="priority ? { fetchPriority: 'high' } : false"
      class="aspect-square w-full rounded-lg bg-placeholder object-cover"
    />
    <h2 class="mt-4 truncate text-xl leading-6 font-bold">
      <NuxtLink
        :to="localePath(`/character/${character.id}`)"
        class="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none"
      >
        {{ character.name }}
      </NuxtLink>
    </h2>
    <p class="mt-2 flex items-center gap-2 leading-5">
      <span class="size-3 shrink-0 rounded-full" :class="dotClass" aria-hidden="true" />
      <span class="truncate">{{ formatStatusLine(character) }}</span>
    </p>
  </article>
</template>
