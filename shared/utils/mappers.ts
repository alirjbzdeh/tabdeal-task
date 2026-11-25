import type { Character, Episode, Location, Paginated } from '../types/api'
import type { CharacterDetail, CharacterListItem, CharacterPage } from '../types/models'
import { idsFromUrls } from './resources'

export const EMPTY_PAGE: CharacterPage = {
  info: { count: 0, pages: 0, next: null, prev: null },
  results: [],
}

export function toCharacterListItem({
  id,
  name,
  status,
  species,
  image,
}: Character): CharacterListItem {
  return { id, name, status, species, image }
}

export function toCharacterPage({ info, results }: Paginated<Character>): CharacterPage {
  return { info, results: results.map(toCharacterListItem) }
}

export function locationIdsOf(character: Pick<Character, 'origin' | 'location'>): number[] {
  return idsFromUrls([character.origin.url, character.location.url])
}

export function toCharacterDetail(
  character: Character,
  episodes: readonly Episode[],
  locations: readonly Location[],
): CharacterDetail {
  const locationsById = new Map(locations.map((location) => [location.id, location]))
  const { id, name, status, species, type, gender, origin, location, image } = character

  return {
    character: { id, name, status, species, type, gender, origin, location, image },
    episodes: episodes.map(({ id, name, episode, air_date }) => ({ id, name, episode, air_date })),
    locations: locationIdsOf(character)
      .map((locationId) => locationsById.get(locationId))
      .filter((l): l is Location => l !== undefined)
      .map(({ id, name, type, dimension }) => ({ id, name, type, dimension })),
  }
}
