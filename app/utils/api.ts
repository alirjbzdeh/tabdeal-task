/**
 * The API returns an object (not an array) when you ask for a single id,
 * e.g. `/episode/1` vs `/episode/1,2`. This always gives back an array.
 */
export function toArray<T>(value: T | T[] | null | undefined): T[] {
  if (value == null) return []
  return Array.isArray(value) ? value : [value]
}

/** Gets the numeric id from a resource URL like `.../episode/28`. Returns null for "" or bad input. */
export function idFromUrl(url: string | null | undefined): number | null {
  if (!url) return null
  const match = /\/(\d+)\/?$/.exec(url)
  return match ? Number(match[1]) : null
}

/** Unique, valid ids from a list of resource URLs. */
export function idsFromUrls(urls: readonly string[]): number[] {
  const ids = urls.map(idFromUrl).filter((id): id is number => id !== null)
  return [...new Set(ids)]
}

/** True when an `$fetch` error is an HTTP 404. */
export function isNotFound(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    ((error as { statusCode?: number }).statusCode === 404 ||
      (error as { status?: number }).status === 404)
  )
}

export type ApiErrorKind =
  | 'aborted'
  | 'badRequest'
  | 'notFound'
  | 'rateLimited'
  | 'server'
  | 'network'
  | 'timeout'
  | 'unknown'

function statusOf(error: object): number | undefined {
  const { statusCode, status, response } = error as {
    statusCode?: number
    status?: number
    response?: { status?: number }
  }
  return statusCode ?? status ?? response?.status
}

/**
 * Sorts an error from `$fetch` / `useAsyncData` into a kind we have a message for.
 * Works on the raw FetchError and on the NuxtError it becomes after SSR (which keeps the
 * status code and the message, but not the error class).
 */
export function classifyApiError(error: unknown): ApiErrorKind {
  if (!error || typeof error !== 'object') return 'unknown'

  const status = statusOf(error)
  const { name = '', message = '' } = error as { name?: string; message?: string }
  const cause = (error as { cause?: { name?: string } }).cause

  // Timeouts and cancels arrive as aborts (no HTTP status). Check them before the status:
  // Nuxt reports a failed request without a response as a 500.
  if (name === 'TimeoutError' || cause?.name === 'TimeoutError' || /timed? ?out/i.test(message)) {
    return 'timeout'
  }
  if (name === 'AbortError' || cause?.name === 'AbortError' || /\baborted\b/i.test(message)) {
    return 'aborted'
  }
  if (/<no response>|fetch failed|failed to fetch|network/i.test(message)) return 'network'

  if (status === 404) return 'notFound'
  if (status === 429) return 'rateLimited'
  if (status !== undefined && status >= 400 && status < 500) return 'badRequest'
  if (status !== undefined && status >= 500) return 'server'
  return 'unknown'
}
