<script setup lang="ts">
import type { Character } from '~/types/api'

const props = defineProps<{
  character: Pick<Character, 'id' | 'name' | 'status' | 'species' | 'image'>
  /** Above the fold on some screen: load right away instead of lazily. */
  eager?: boolean
  /** The likely LCP image: fetch it before anything else. */
  priority?: boolean
}>()

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
    <!-- Decorative here: the name right below already says who it is (no double read-out). -->
    <NuxtImg
      :src="character.image"
      alt=""
      width="300"
      height="300"
      :loading="eager || priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : 'auto'"
      class="aspect-square w-full rounded-lg bg-placeholder object-cover"
    />
    <h2 class="mt-4 truncate text-xl leading-6 font-bold">
      <!-- The ::after overlay makes the whole card clickable with one link. -->
      <NuxtLink
        :to="`/character/${character.id}`"
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
