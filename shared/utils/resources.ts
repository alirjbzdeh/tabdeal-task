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
