export type CharacterStatus = 'Alive' | 'Dead' | 'unknown'

export interface ResourceRef {
  name: string
  url: string
}

export interface Character {
  id: number
  name: string
  status: CharacterStatus
  species: string
  type: string
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown'
  origin: ResourceRef
  location: ResourceRef
  image: string
  episode: string[]
  url: string
  created: string
}

export interface Episode {
  id: number
  name: string
  air_date: string
  episode: string
  characters: string[]
  url: string
  created: string
}

export interface Location {
  id: number
  name: string
  type: string
  dimension: string
  residents: string[]
  url: string
  created: string
}

export interface PageInfo {
  count: number
  pages: number
  next: string | null
  prev: string | null
}

export interface Paginated<T> {
  info: PageInfo
  results: T[]
}
