<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const name = computed(() => {
  const raw = route.query.name
  return String((Array.isArray(raw) ? raw[0] : raw) ?? '').trim()
})
const page = computed(() => parsePage(route.query.page))

const { data, status, error, refresh } = await useCharacters(name, page)

// Don't answer 200 for a failed render (keeps it out of caches and search results).
if (import.meta.server && error.value) {
  setResponseStatus(useRequestEvent()!, 503)
}

const characters = computed(() => data.value?.results ?? [])
const totalPages = computed(() => data.value?.info.pages ?? 0)
const totalCount = computed(() => data.value?.info.count ?? 0)
const isLoading = computed(() => status.value === 'pending')

function queryFor(nextPage: number, nextName = name.value) {
  return {
    ...(nextName ? { name: nextName } : {}),
    ...(nextPage > 1 ? { page: String(nextPage) } : {}),
  }
}

const pageLink = (p: number) => ({ path: '/', query: queryFor(p) })

function onSearch(value: string) {
  router.replace({ path: '/', query: queryFor(1, value) })
}

// Pagination keeps the same path, so Nuxt won't scroll for us. Bring the grid back into view.
const results = useTemplateRef('results')
watch(page, () => {
  const el = results.value
  if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: 'start' })
})

const title = computed(() => {
  if (!name.value) return page.value > 1 ? `Characters, page ${page.value}` : 'Characters'
  return `Search: ${name.value}`
})

useSeoMeta({
  title,
  description: 'Browse and search every Rick and Morty character, their episodes and locations.',
})
</script>

<template>
  <div>
    <AppHeader />
    <HeroBand>
      <div class="pt-3 pb-6 md:pt-7">
        <SearchBar :model-value="name" @search="onSearch" />
      </div>
    </HeroBand>

    <main id="main" ref="results" class="container-page scroll-mt-4 py-8 md:py-16">
      <h1 class="sr-only">Rick and Morty characters</h1>
      <p class="sr-only" aria-live="polite">
        <template v-if="!isLoading">
          {{ totalCount }} {{ totalCount === 1 ? 'character' : 'characters' }} found
        </template>
      </p>

      <StateMessage
        v-if="error"
        title="Something went wrong"
        text="We couldn't load the characters. Please try again."
      >
        <button
          type="button"
          class="mt-2 h-12 rounded bg-accent px-6 font-medium text-on-accent hover:brightness-110"
          @click="refresh()"
        >
          Try again
        </button>
      </StateMessage>

      <ul
        v-else-if="isLoading"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        aria-busy="true"
        aria-label="Loading characters"
      >
        <li v-for="i in 20" :key="i"><CharacterCardSkeleton /></li>
      </ul>

      <StateMessage
        v-else-if="!characters.length"
        :title="name ? `No characters found for “${name}”` : 'Nothing on this page'"
        :text="name ? 'Check the spelling or try another name.' : undefined"
      >
        <NuxtLink
          to="/"
          class="mt-2 rounded font-medium text-accent underline-offset-4 hover:underline"
        >
          {{ name ? 'Clear search' : 'Go to the first page' }}
        </NuxtLink>
      </StateMessage>

      <template v-else>
        <ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <li v-for="(character, index) in characters" :key="character.id">
            <CharacterCard :character="character" :eager="index < 4" :priority="index === 0" />
          </li>
        </ul>
        <AppPagination :page="page" :total="totalPages" :to="pageLink" class="mt-6" />
      </template>
    </main>
  </div>
</template>
