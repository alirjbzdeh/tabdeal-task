import type { Character, Episode, Location, Paginated } from '#shared/types/api'
import type { CharacterDetail, CharacterPage } from '#shared/types/models'
import {
  EMPTY_PAGE,
  locationIdsOf,
  toCharacterDetail,
  toCharacterPage,
} from '#shared/utils/mappers'
import { idsFromUrls, toArray } from '#shared/utils/resources'

const HOUR = 60 * 60

function isNotFound(error: unknown) {
  return (error as { statusCode?: number })?.statusCode === 404
}

function batch<T>(resource: string, ids: number[]): Promise<T[]> {
  if (!ids.length) return Promise.resolve([])
  return fetchUpstream<T | T[]>(`/${resource}/${ids.join(',')}`).then(toArray)
}

export const getCharacterPage = defineCachedFunction(
  async (name: string, page: number): Promise<CharacterPage> => {
    try {
      const data = await fetchUpstream<Paginated<Character>>('/character', {
        page,
        name: name || undefined,
      })
      return toCharacterPage(data)
    } catch (error) {
      if (isNotFound(error)) return EMPTY_PAGE
      throw error
    }
  },
  {
    name: 'character-page',
    maxAge: HOUR,
    swr: true,
    getKey: (name: string, page: number) => `${name.toLowerCase()}:${page}`,
  },
)

export const getCharacterDetail = defineCachedFunction(
  async (id: number): Promise<CharacterDetail | null> => {
    let character: Character
    try {
      character = await fetchUpstream<Character>(`/character/${id}`)
    } catch (error) {
      if (isNotFound(error)) return null
      throw error
    }
    const [episodes, locations] = await Promise.all([
      batch<Episode>('episode', idsFromUrls(character.episode)),
      batch<Location>('location', locationIdsOf(character)),
    ])
    return toCharacterDetail(character, episodes, locations)
  },
  {
    name: 'character-detail',
    maxAge: 24 * HOUR,
    swr: true,
    getKey: (id: number) => String(id),
  },
)
