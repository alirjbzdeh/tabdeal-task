import { describe, expect, it } from 'vitest'
import { idFromUrl, idsFromUrls, toArray } from '~/utils/api'

describe('toArray', () => {
  it('wraps a single object (API returns an object for one id)', () => {
    expect(toArray({ id: 1 })).toEqual([{ id: 1 }])
  })

  it('returns arrays unchanged', () => {
    const list = [{ id: 1 }, { id: 2 }]
    expect(toArray(list)).toBe(list)
  })

  it('returns [] for null and undefined', () => {
    expect(toArray(null)).toEqual([])
    expect(toArray(undefined)).toEqual([])
  })
})

describe('idFromUrl', () => {
  it('reads the id at the end of a resource URL', () => {
    expect(idFromUrl('https://rickandmortyapi.com/api/episode/28')).toBe(28)
    expect(idFromUrl('https://rickandmortyapi.com/api/location/3/')).toBe(3)
  })

  it('returns null for an empty URL ("unknown" location)', () => {
    expect(idFromUrl('')).toBeNull()
    expect(idFromUrl(null)).toBeNull()
  })

  it('returns null when there is no numeric id', () => {
    expect(idFromUrl('https://rickandmortyapi.com/api/location')).toBeNull()
  })
})

describe('idsFromUrls', () => {
  it('keeps valid ids, drops empty ones and duplicates', () => {
    const base = 'https://rickandmortyapi.com/api/location/'
    expect(idsFromUrls([`${base}1`, '', `${base}3`, `${base}1`])).toEqual([1, 3])
  })
})
