const MONTHS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
]

export function airDateToIso(value: string): string | undefined {
  const match = /^([a-z]+)\s+(\d{1,2}),\s*(\d{4})$/i.exec(value.trim())
  if (!match) return undefined
  const [, monthName = '', day = '', year = ''] = match
  const month = MONTHS.indexOf(monthName.toLowerCase()) + 1
  if (!month) return undefined
  return `${year}-${String(month).padStart(2, '0')}-${day.padStart(2, '0')}`
}
