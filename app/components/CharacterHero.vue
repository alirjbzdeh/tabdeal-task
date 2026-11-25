<!-- Top of the detail page: portrait, name, status line, a short description and key facts. -->
<script setup lang="ts">
import type { CharacterSummary, EpisodeSummary } from '~/composables/useCharacterDetail'

const props = defineProps<{
  character: CharacterSummary
  episodes: EpisodeSummary[]
}>()

const dotClass = computed(
  () =>
    ({ success: 'bg-success', danger: 'bg-danger', unknown: 'bg-muted' })[
      statusTone(props.character.status)
    ],
)

const { t } = useI18n()
const { number } = useFormat()

const description = computed(() =>
  describeCharacter(props.character, props.episodes.length, { t, number }),
)

const facts = computed(() => {
  const { species, type, gender, origin, location } = props.character
  const first = props.episodes[0]
  const unknown = t('character.unknown')
  return [
    { label: t('character.species'), value: orUnknown(species, unknown) },
    ...(type ? [{ label: t('character.type'), value: type }] : []),
    { label: t('character.gender'), value: t(`character.genders.${gender}`) },
    { label: t('character.origin'), value: orUnknown(origin.name, unknown) },
    { label: t('character.lastLocation'), value: orUnknown(location.name, unknown) },
    ...(first
      ? [
          {
            label: t('character.firstSeen'),
            value: `${first.name} (${formatEpisodeCode(first.episode)})`,
          },
        ]
      : []),
  ]
})
</script>

<template>
  <section
    aria-labelledby="character-name"
    class="flex flex-col gap-6 pt-3 pb-8 md:flex-row md:items-center md:gap-12 md:pt-16 md:pb-16"
  >
    <!-- The LCP element on this page: load it first. -->
    <NuxtImg
      :src="character.image"
      :alt="character.name"
      width="240"
      height="240"
      loading="eager"
      fetchpriority="high"
      class="size-45 shrink-0 rounded-lg bg-placeholder object-cover md:size-60"
    />
    <div class="min-w-0">
      <h1 id="character-name" class="text-2xl leading-tight font-medium md:text-display">
        {{ character.name }}
      </h1>
      <p class="mt-2 flex items-center gap-2 leading-5">
        <span class="size-3 shrink-0 rounded-full" :class="dotClass" aria-hidden="true" />
        <span class="sr-only">{{ $t('character.status') }}:</span>
        {{ formatStatusLine(character) }}
      </p>
      <p class="mt-4 max-w-2xl leading-relaxed text-foreground-soft">{{ description }}</p>
      <dl class="mt-5 grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:flex sm:flex-wrap">
        <div v-for="fact in facts" :key="fact.label" class="min-w-0">
          <dt class="text-muted">{{ fact.label }}</dt>
          <dd class="mt-0.5 font-medium">{{ fact.value }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>
