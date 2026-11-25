export const MAX_SEARCH_LENGTH = 100

function first(value: unknown): unknown {
  return Array.isArray(value) ? value[0] : value
}

export function parsePage(value: unknown): number {
  const page = Number.parseInt(String(first(value) ?? ''), 10)
  return Number.isFinite(page) && page > 0 ? page : 1
}

export function parseName(value: unknown): string {
  return String(first(value) ?? '')
    .trim()
    .slice(0, MAX_SEARCH_LENGTH)
}
