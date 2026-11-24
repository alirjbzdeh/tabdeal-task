import type { MaybeRefOrGetter } from 'vue'
import type { Character, Paginated } from '~/types/api'

const EMPTY: Paginated<Character> = {
  info: { count: 0, pages: 0, next: null, prev: null },
  results: [],
}

/**
 * Character list for a page, optionally filtered by name. Runs on the server (SSR)
 * and refetches when `name` or `page` change.
 * The API answers "no matches" (or a page past the end) with a 404, so that becomes an empty list.
 */
export function useCharacters(name: MaybeRefOrGetter<string>, page: MaybeRefOrGetter<number>) {
  const { apiBase } = useRuntimeConfig().public

  return useAsyncData(
    () => `characters:${toValue(name)}:${toValue(page)}`,
    async () => {
      try {
        return await $fetch<Paginated<Character>>('/character', {
          baseURL: apiBase,
          query: { page: toValue(page), name: toValue(name) || undefined },
          // The API rate-limits (429). Retry a few times before giving up.
          retry: 3,
          retryDelay: 500,
        })
      } catch (error) {
        if (isNotFound(error)) return EMPTY
        if (import.meta.server) console.error('[useCharacters]', error)
        throw error
      }
    },
    {
      // Only keep what the grid needs in the SSR payload (smaller HTML).
      transform: ({ info, results }) => ({
        info,
        results: results.map(({ id, name, status, species, image }) => ({
          id,
          name,
          status,
          species,
          image,
        })),
      }),
    },
  )
}
