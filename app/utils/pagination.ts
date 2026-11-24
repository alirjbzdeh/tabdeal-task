export type PageItem = number | 'ellipsis-start' | 'ellipsis-end'

/**
 * Page numbers to show, as in the design: `1 2 3 4 5 …`.
 * Shows a window of up to `size` pages around the current one, with an ellipsis
 * on the side(s) where more pages exist.
 */
export function getVisiblePages(current: number, total: number, size = 5): PageItem[] {
  if (total <= 1) return []
  const page = Math.min(Math.max(1, Math.trunc(current)), total)
  const count = Math.min(size, total)

  let start = Math.max(1, page - Math.floor(count / 2))
  const end = Math.min(total, start + count - 1)
  start = Math.max(1, end - count + 1)

  const items: PageItem[] = []
  if (start > 1) items.push('ellipsis-start')
  for (let i = start; i <= end; i++) items.push(i)
  if (end < total) items.push('ellipsis-end')
  return items
}

/** Reads a page number from a route query value. Falls back to 1. */
export function parsePage(value: unknown): number {
  const raw = Array.isArray(value) ? value[0] : value
  const page = Number.parseInt(String(raw ?? ''), 10)
  return Number.isFinite(page) && page > 0 ? page : 1
}
