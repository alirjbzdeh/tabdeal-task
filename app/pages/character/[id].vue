<script setup lang="ts">
// Anything that isn't a positive integer is a 404 straight away (no API call).
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
// Don't answer 200 for a failed render (keeps it out of caches and search results).
if (import.meta.server && apiError.value) {
  setResponseStatus(useRequestEvent()!, 503)
}

const character = computed(() => data.value?.character)
const episodes = computed(() => data.value?.episodes ?? [])
const locations = computed(() => data.value?.locations ?? [])

/** Air date in the active language ("December 2, 2013", or the Persian calendar on /fa). */
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
      <HeroBand>
        <CharacterHero v-if="character" :character="character" :episodes="episodes" />
        <div v-else class="h-8" />
      </HeroBand>

      <div class="container-page py-8 md:py-16">
        <!-- A message that matches what went wrong (rate limit, timeout, offline...). -->
        <StateMessage v-if="apiError" :title="apiError.title" :text="apiError.message">
          <button
            v-if="apiError.canRetry"
            type="button"
            class="mt-2 h-12 rounded bg-accent px-6 font-medium text-on-accent hover:brightness-110"
            @click="refresh()"
          >
            {{ $t('errors.retry') }}
          </button>
        </StateMessage>

        <div v-else-if="character" class="flex flex-col gap-12 md:gap-16">
          <section aria-labelledby="episodes-heading">
            <SectionHeading id="episodes-heading" :title="$t('character.episodes')">
              <IconEpisodes class="h-4 w-5" />
            </SectionHeading>
            <ul
              v-if="episodes.length"
              class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
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
            <ul
              v-if="locations.length"
              class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
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
    </main>
  </div>
</template>
