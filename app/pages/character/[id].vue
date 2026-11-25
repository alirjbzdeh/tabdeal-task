<script setup lang="ts">
// Anything that isn't a positive integer is a 404 straight away (no API call).
definePageMeta({
  validate: (route) => /^[1-9]\d*$/.test(String(route.params.id)),
})

const route = useRoute()
const id = computed(() => Number(route.params.id))

const { data, error, refresh } = await useCharacterDetail(id)

if (data.value === null) {
  throw createError({ statusCode: 404, statusMessage: 'Character not found', fatal: true })
}
// Don't answer 200 for a failed render (keeps it out of caches and search results).
if (import.meta.server && error.value) {
  setResponseStatus(useRequestEvent()!, 503)
}

const character = computed(() => data.value?.character)
const episodes = computed(() => data.value?.episodes ?? [])
const locations = computed(() => data.value?.locations ?? [])

useSeoMeta({
  title: () => character.value?.name ?? 'Character',
  description: () =>
    character.value ? describeCharacter(character.value, episodes.value.length) : undefined,
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
        <StateMessage
          v-if="error || !character"
          title="Something went wrong"
          text="We couldn't load this character. Please try again."
        >
          <button
            type="button"
            class="mt-2 h-12 rounded bg-accent px-6 font-medium text-on-accent hover:brightness-110"
            @click="refresh()"
          >
            Try again
          </button>
        </StateMessage>

        <div v-else class="flex flex-col gap-12 md:gap-16">
          <section aria-labelledby="episodes-heading">
            <SectionHeading id="episodes-heading" title="Episodes">
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
                  accent-label="Episode"
                  :meta="episode.air_date"
                  meta-label="Aired"
                  :datetime="airDateToIso(episode.air_date)"
                />
              </li>
            </ul>
            <p v-else class="mt-6 text-muted">No episodes listed.</p>
          </section>

          <section aria-labelledby="locations-heading">
            <SectionHeading id="locations-heading" title="Locations">
              <IconPin class="h-5 w-4" />
            </SectionHeading>
            <ul
              v-if="locations.length"
              class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              <li v-for="location in locations" :key="location.id">
                <InfoCard
                  :title="location.name"
                  :accent="orUnknown(location.type, 'Unknown type')"
                  accent-label="Type"
                  :meta="location.dimension || 'unknown'"
                  meta-label="Dimension"
                />
              </li>
            </ul>
            <p v-else class="mt-6 text-muted">Origin and location are unknown.</p>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>
