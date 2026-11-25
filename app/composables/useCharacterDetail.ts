import type { MaybeRefOrGetter } from 'vue'
import type { CharacterDetail } from '#shared/types/models'

export function useCharacterDetail(id: MaybeRefOrGetter<number>) {
  const api = useApi()

  return useAsyncData<CharacterDetail | null>(
    () => `character:${toValue(id)}`,
    async (_nuxtApp, { signal }) => {
      try {
        return await api<CharacterDetail>(`/characters/${toValue(id)}`, { signal })
      } catch (error) {
        if (isNotFound(error)) return null
        throw error
      }
    },
    { timeout: API_TIMEOUT },
  )
}
