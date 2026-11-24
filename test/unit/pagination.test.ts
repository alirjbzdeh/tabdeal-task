import { describe, expect, it } from 'vitest'
import { getVisiblePages, parsePage } from '~/utils/pagination'

describe('getVisiblePages', () => {
  it('returns nothing when there is 0 or 1 page', () => {
    expect(getVisiblePages(1, 0)).toEqual([])
    expect(getVisiblePages(1, 1)).toEqual([])
  })

  it('shows every page when there are 5 or fewer', () => {
    expect(getVisiblePages(1, 3)).toEqual([1, 2, 3])
    expect(getVisiblePages(4, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('matches the design on page 1: 1 2 3 4 5 …', () => {
    expect(getVisiblePages(1, 42)).toEqual([1, 2, 3, 4, 5, 'ellipsis-end'])
  })

  it('centers the current page in the middle', () => {
    expect(getVisiblePages(20, 42)).toEqual(['ellipsis-start', 18, 19, 20, 21, 22, 'ellipsis-end'])
  })

  it('pins the window to the end on the last pages', () => {
    expect(getVisiblePages(42, 42)).toEqual(['ellipsis-start', 38, 39, 40, 41, 42])
    expect(getVisiblePages(41, 42)).toEqual(['ellipsis-start', 38, 39, 40, 41, 42])
  })

  it('clamps out-of-range pages', () => {
    expect(getVisiblePages(0, 42)).toEqual(getVisiblePages(1, 42))
    expect(getVisiblePages(999, 42)).toEqual(getVisiblePages(42, 42))
  })

  it('always includes the current page, with no duplicates', () => {
    for (let page = 1; page <= 12; page++) {
      const numbers = getVisiblePages(page, 12).filter((p) => typeof p === 'number')
      expect(numbers).toContain(page)
      expect(new Set(numbers).size).toBe(numbers.length)
    }
  })
})

describe('parsePage', () => {
  it('reads a valid page number', () => {
    expect(parsePage('3')).toBe(3)
    expect(parsePage(['7', '8'])).toBe(7)
  })

  it('falls back to 1 for missing or invalid values', () => {
    expect(parsePage(undefined)).toBe(1)
    expect(parsePage('abc')).toBe(1)
    expect(parsePage('0')).toBe(1)
    expect(parsePage('-2')).toBe(1)
  })
})
