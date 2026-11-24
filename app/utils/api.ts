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
