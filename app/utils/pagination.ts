export type PageItem = number | 'ellipsis-start' | 'ellipsis-end'

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
