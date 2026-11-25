import type { MaybeRefOrGetter } from 'vue'
import type { Character, Episode, Location } from '~/types/api'

export type CharacterSummary = Pick<
  Character,
  'id' | 'name' | 'status' | 'species' | 'type' | 'gender' | 'origin' | 'location' | 'image'
>
export type EpisodeSummary = Pick<Episode, 'id' | 'name' | 'episode' | 'air_date'>
export type LocationSummary = Pick<Location, 'id' | 'name' | 'type' | 'dimension'>

export interface CharacterDetail {
  character: CharacterSummary
  episodes: EpisodeSummary[]
  locations: LocationSummary[]
}

export function useCharacterDetail(id: MaybeRefOrGetter<number>) {
  const api = useApi()

  return useAsyncData<CharacterDetail | null>(
    () => `character:${toValue(id)}`,
    async (_nuxtApp, { signal }) => {
      try {
        const character = await api<Character>(`/character/${toValue(id)}`, { signal })

        const episodeIds = idsFromUrls(character.episode)
        const locationIds = idsFromUrls([character.origin.url, character.location.url])

        const [episodes, locations] = await Promise.all([
          episodeIds.length
            ? api<Episode | Episode[]>(`/episode/${episodeIds.join(',')}`, { signal })
            : ([] as Episode[]),
          locationIds.length
            ? api<Location | Location[]>(`/location/${locationIds.join(',')}`, { signal })
            : ([] as Location[]),
        ])

        const locationsById = new Map(toArray(locations).map((l) => [l.id, l]))

        return {
          character: {
            id: character.id,
            name: character.name,
            status: character.status,
            species: character.species,
            type: character.type,
            gender: character.gender,
            origin: character.origin,
            location: character.location,
            image: character.image,
          },
          episodes: toArray(episodes).map(({ id, name, episode, air_date }) => ({
            id,
            name,
            episode,
            air_date,
          })),
          locations: locationIds
            .map((locationId) => locationsById.get(locationId))
            .filter((l): l is Location => !!l)
            .map(({ id, name, type, dimension }) => ({ id, name, type, dimension })),
        }
      } catch (error) {
        if (isNotFound(error)) return null
        if (import.meta.server) console.error('[useCharacterDetail]', error)
        throw error
      }
    },
    { timeout: API_TIMEOUT },
  )
}
