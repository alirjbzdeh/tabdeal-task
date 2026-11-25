import type { MaybeRefOrGetter } from 'vue'
import type { Character, Paginated } from '~/types/api'

const EMPTY: Paginated<Character> = {
  info: { count: 0, pages: 0, next: null, prev: null },
  results: [],
}

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
