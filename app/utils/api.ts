export function toArray<T>(value: T | T[] | null | undefined): T[] {
  if (value == null) return []
  return Array.isArray(value) ? value : [value]
}

export function idFromUrl(url: string | null | undefined): number | null {
  if (!url) return null
  const match = /\/(\d+)\/?$/.exec(url)
  return match ? Number(match[1]) : null
}

export function idsFromUrls(urls: readonly string[]): number[] {
  const ids = urls.map(idFromUrl).filter((id): id is number => id !== null)
  return [...new Set(ids)]
}

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

export function classifyApiError(error: unknown): ApiErrorKind {
  if (!error || typeof error !== 'object') return 'unknown'

  const status = statusOf(error)
  const { name = '', message = '' } = error as { name?: string; message?: string }
  const cause = (error as { cause?: { name?: string } }).cause

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
