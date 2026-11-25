import { describe, expect, it } from 'vitest'
import { idFromUrl, idsFromUrls, toArray } from '#shared/utils/resources'
import { classifyApiError, isNotFound } from '~/utils/api'

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

describe('isNotFound', () => {
  it('detects 404 errors from $fetch', () => {
    expect(isNotFound({ statusCode: 404 })).toBe(true)
    expect(isNotFound({ status: 404 })).toBe(true)
  })

  it('ignores other errors', () => {
    expect(isNotFound({ statusCode: 500 })).toBe(false)
    expect(isNotFound(new Error('network'))).toBe(false)
    expect(isNotFound(null)).toBe(false)
  })
})

describe('classifyApiError', () => {
  const httpError = (status: number) =>
    Object.assign(new Error(`[GET] "/character": ${status}`), { statusCode: status })

  it('maps HTTP statuses to a kind', () => {
    expect(classifyApiError(httpError(400))).toBe('badRequest')
    expect(classifyApiError(httpError(404))).toBe('notFound')
    expect(classifyApiError(httpError(429))).toBe('rateLimited')
    expect(classifyApiError(httpError(500))).toBe('server')
    expect(classifyApiError(httpError(503))).toBe('server')
    expect(classifyApiError(httpError(502))).toBe('server')
    expect(classifyApiError(httpError(504))).toBe('timeout')
    expect(classifyApiError({ response: { status: 429 } })).toBe('rateLimited')
  })

  it('spots timeouts, cancels and network failures (no HTTP status)', () => {
    const timeout = new DOMException('signal timed out', 'TimeoutError')
    expect(classifyApiError(timeout)).toBe('timeout')
    expect(classifyApiError({ message: 'x', cause: { name: 'TimeoutError' } })).toBe('timeout')

    const abort = new DOMException('AsyncData request cancelled by deduplication', 'AbortError')
    expect(classifyApiError(abort)).toBe('aborted')

    const offline = { statusCode: 500, message: '[GET] "/character": <no response> fetch failed' }
    expect(classifyApiError(offline)).toBe('network')
  })

  it('falls back to unknown', () => {
    expect(classifyApiError(new Error('boom'))).toBe('unknown')
    expect(classifyApiError(null)).toBe('unknown')
    expect(classifyApiError('nope')).toBe('unknown')
  })
})
