<script setup lang="ts">
definePageMeta({
  validate: (route) => /^[1-9]\d*$/.test(String(route.params.id)),
})

const route = useRoute()
const id = computed(() => Number(route.params.id))
const { t } = useI18n()
const { date, number } = useFormat()

const { data, error, refresh } = await useCharacterDetail(id)
const apiError = useApiError(error)

if (data.value === null) {
  throw createError({ statusCode: 404, statusMessage: 'Character not found', fatal: true })
}
if (import.meta.server && apiError.value) {
  setResponseStatus(useRequestEvent()!, 503)
}

const character = computed(() => data.value?.character)
const episodes = computed(() => data.value?.episodes ?? [])
const locations = computed(() => data.value?.locations ?? [])

function airDate(value: string) {
  const iso = airDateToIso(value)
  return { iso, label: iso ? date(iso) : value }
}

useSeoMeta({
  title: () => character.value?.name ?? apiError.value?.title,
  description: () =>
    character.value
      ? describeCharacter(character.value, episodes.value.length, { t, number })
      : undefined,
  ogTitle: () => character.value?.name,
  ogImage: () => character.value?.image,
})
</script>

<template>
  <div>
    <AppHeader />
    <main id="main">
      <component
        :is="character ? 'article' : 'div'"
        :aria-labelledby="character ? 'character-name' : undefined"
      >
        <HeroBand>
          <CharacterHero v-if="character" :character="character" :episodes="episodes" />
          <div v-else class="h-8" />
        </HeroBand>

        <div class="container-page py-8 md:py-16">
          <ApiErrorMessage v-if="apiError" :error="apiError" @retry="refresh()" />

          <div v-else-if="character" class="flex flex-col gap-12 md:gap-16">
            <section aria-labelledby="episodes-heading">
              <SectionHeading id="episodes-heading" :title="$t('character.episodes')">
                <IconEpisodes class="h-4 w-5" />
              </SectionHeading>
              <ul v-if="episodes.length" class="card-grid mt-6">
                <li v-for="episode in episodes" :key="episode.id">
                  <InfoCard
                    :title="episode.name"
                    :accent="formatEpisodeCode(episode.episode)"
                    :accent-label="$t('character.episodeCode')"
                    :meta="airDate(episode.air_date).label"
                    :meta-label="$t('character.aired')"
                    :datetime="airDate(episode.air_date).iso"
                  />
                </li>
              </ul>
              <p v-else class="mt-6 text-muted">{{ $t('character.noEpisodes') }}</p>
            </section>

            <section aria-labelledby="locations-heading">
              <SectionHeading id="locations-heading" :title="$t('character.locations')">
                <IconPin class="h-5 w-4" />
              </SectionHeading>
              <ul v-if="locations.length" class="card-grid mt-6">
                <li v-for="location in locations" :key="location.id">
                  <InfoCard
                    :title="location.name"
                    :accent="orUnknown(location.type, $t('character.unknownType'))"
                    :accent-label="$t('character.locationType')"
                    :meta="orUnknown(location.dimension, $t('character.unknown'))"
                    :meta-label="$t('character.dimension')"
                  />
                </li>
              </ul>
              <p v-else class="mt-6 text-muted">{{ $t('character.noLocations') }}</p>
            </section>
          </div>
        </div>
      </component>
    </main>
  </div>
</template>
