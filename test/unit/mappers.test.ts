import { describe, expect, it } from 'vitest'
import type { Character, Episode, Location } from '#shared/types/api'
import {
  locationIdsOf,
  toCharacterDetail,
  toCharacterListItem,
  toCharacterPage,
} from '#shared/utils/mappers'

const base = 'https://rickandmortyapi.com/api'

const character: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth (C-137)', url: `${base}/location/1` },
  location: { name: 'Citadel of Ricks', url: `${base}/location/3` },
  image: `${base}/character/avatar/1.jpeg`,
  episode: [`${base}/episode/1`, `${base}/episode/2`],
  url: `${base}/character/1`,
  created: '2017-11-04T18:48:46.250Z',
}

const location = (id: number, name: string): Location => ({
  id,
  name,
  type: 'Planet',
  dimension: 'Dimension C-137',
  residents: [],
  url: `${base}/location/${id}`,
  created: '',
})

const episode = (id: number): Episode => ({
  id,
  name: `Episode ${id}`,
  air_date: 'December 2, 2013',
  episode: `S01E0${id}`,
  characters: [],
  url: `${base}/episode/${id}`,
  created: '',
})

describe('toCharacterListItem / toCharacterPage', () => {
  it('keeps only what a card needs', () => {
    expect(toCharacterListItem(character)).toEqual({
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      image: character.image,
    })
    const info = { count: 1, pages: 1, next: null, prev: null }
    expect(toCharacterPage({ info, results: [character] }).results[0]).not.toHaveProperty('episode')
  })
})

describe('locationIdsOf', () => {
  it('returns origin then location, without duplicates or unknowns', () => {
    expect(locationIdsOf(character)).toEqual([1, 3])
    expect(
      locationIdsOf({ origin: character.origin, location: { name: 'unknown', url: '' } }),
    ).toEqual([1])
    expect(locationIdsOf({ origin: character.origin, location: character.origin })).toEqual([1])
  })
})

describe('toCharacterDetail', () => {
  it('orders locations origin first, whatever order the API used', () => {
    const detail = toCharacterDetail(
      character,
      [episode(1), episode(2)],
      [location(3, 'Citadel of Ricks'), location(1, 'Earth (C-137)')],
    )
    expect(detail.locations.map((l) => l.name)).toEqual(['Earth (C-137)', 'Citadel of Ricks'])
    expect(detail.episodes).toEqual([
      { id: 1, name: 'Episode 1', episode: 'S01E01', air_date: 'December 2, 2013' },
      { id: 2, name: 'Episode 2', episode: 'S01E02', air_date: 'December 2, 2013' },
    ])
    expect(detail.character).not.toHaveProperty('episode')
  })
})
