import type { MaybeRefOrGetter } from 'vue'
import type { CharacterPage } from '#shared/types/models'

export function useCharacters(name: MaybeRefOrGetter<string>, page: MaybeRefOrGetter<number>) {
  const api = useApi()

  return useAsyncData(
    () => `characters:${toValue(name)}:${toValue(page)}`,
    (_nuxtApp, { signal }) =>
      api<CharacterPage>('/characters', {
        query: { name: toValue(name) || undefined, page: toValue(page) },
        signal,
      }),
    { timeout: API_TIMEOUT },
  )
}
