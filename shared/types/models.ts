import type { Character, Episode, Location, PageInfo } from './api'

export type CharacterListItem = Pick<Character, 'id' | 'name' | 'status' | 'species' | 'image'>

export interface CharacterPage {
  info: PageInfo
  results: CharacterListItem[]
}

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
