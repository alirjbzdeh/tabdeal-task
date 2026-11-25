<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const { t } = useI18n()
const { number } = useFormat()

const name = computed(() => {
  const raw = route.query.name
  return String((Array.isArray(raw) ? raw[0] : raw) ?? '').trim()
})
const page = computed(() => parsePage(route.query.page))

const { data, status, error, refresh } = await useCharacters(name, page)
const apiError = useApiError(error)

if (import.meta.server && apiError.value) {
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

const pageLink = (p: number) => localePath({ path: '/', query: queryFor(p) })

function onSearch(value: string) {
  router.replace(localePath({ path: '/', query: queryFor(1, value) }))
}

const results = useTemplateRef('results')
watch(page, () => {
  const el = results.value
  if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: 'start' })
})

const title = computed(() => {
  if (name.value) return t('home.titleSearch', { name: name.value })
  return page.value > 1 ? t('home.titlePage', { page: number(page.value) }) : t('home.title')
})

useSeoMeta({ title })
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
      <h1 class="sr-only">{{ $t('home.heading') }}</h1>
      <p class="sr-only" aria-live="polite">
        <template v-if="!isLoading && !apiError">
          {{ $t('home.count', { count: number(totalCount) }, totalCount) }}
        </template>
      </p>

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

      <ul
        v-else-if="isLoading"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        aria-busy="true"
        :aria-label="$t('home.loading')"
      >
        <li v-for="i in 20" :key="i"><CharacterCardSkeleton /></li>
      </ul>

      <StateMessage
        v-else-if="!characters.length"
        :title="name ? $t('home.noResults', { name }) : $t('home.emptyPage')"
        :text="name ? $t('home.noResultsHint') : undefined"
      >
        <NuxtLink
          :to="localePath('/')"
          class="mt-2 rounded font-medium text-accent underline-offset-4 hover:underline"
        >
          {{ name ? $t('home.clearSearch') : $t('home.firstPage') }}
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
