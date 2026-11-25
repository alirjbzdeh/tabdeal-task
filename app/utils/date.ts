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

/**
 * The API's air dates look like "December 2, 2013". Turns that into "2013-12-02" for
 * `<time datetime>`. Parsed by hand: `new Date()` would use the local time zone and can land on
 * the day before. Returns undefined for anything else.
 */
export function airDateToIso(value: string): string | undefined {
  const match = /^([a-z]+)\s+(\d{1,2}),\s*(\d{4})$/i.exec(value.trim())
  if (!match) return undefined
  const [, monthName = '', day = '', year = ''] = match
  const month = MONTHS.indexOf(monthName.toLowerCase()) + 1
  if (!month) return undefined
  return `${year}-${String(month).padStart(2, '0')}-${day.padStart(2, '0')}`
}
