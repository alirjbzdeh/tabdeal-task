import type { MaybeRefOrGetter } from 'vue'
import type { Character, Paginated } from '~/types/api'

const EMPTY: Paginated<Character> = {
  info: { count: 0, pages: 0, next: null, prev: null },
  results: [],
}

/**
 * Character list for a page, optionally filtered by name. Runs on the server (SSR)
 * and refetches when `name` or `page` change. The previous request is cancelled when they
 * change (typing a new search, clicking the next page) or the page is left.
 * The API answers "no matches" (or a page past the end) with a 404, so that becomes an empty list.
 */
export function useCharacters(name: MaybeRefOrGetter<string>, page: MaybeRefOrGetter<number>) {
  const api = useApi()

  return useAsyncData(
    () => `characters:${toValue(name)}:${toValue(page)}`,
    async (_nuxtApp, { signal }) => {
      try {
        return await api<Paginated<Character>>('/character', {
          query: { page: toValue(page), name: toValue(name) || undefined },
          signal,
        })
      } catch (error) {
        if (isNotFound(error)) return EMPTY
        if (import.meta.server) console.error('[useCharacters]', error)
        throw error
      }
    },
    {
      timeout: API_TIMEOUT,
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
