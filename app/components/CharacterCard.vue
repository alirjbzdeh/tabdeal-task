<script setup lang="ts">
import type { CharacterListItem } from '#shared/types/models'

defineProps<{
  character: CharacterListItem
  eager?: boolean
  priority?: boolean
}>()

const localePath = useLocalePath()
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
    <StatusLine :character="character" class="mt-2" />
  </article>
</template>
