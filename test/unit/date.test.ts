import { describe, expect, it } from 'vitest'
import { airDateToIso } from '~/utils/date'

describe('airDateToIso', () => {
  it('turns the API air date into an ISO date', () => {
    expect(airDateToIso('December 2, 2013')).toBe('2013-12-02')
    expect(airDateToIso('September 10, 2017')).toBe('2017-09-10')
    expect(airDateToIso('  may 31,2015 ')).toBe('2015-05-31')
  })

  it('returns undefined for anything it does not understand', () => {
    expect(airDateToIso('')).toBeUndefined()
    expect(airDateToIso('2013-12-02')).toBeUndefined()
    expect(airDateToIso('Smarch 2, 2013')).toBeUndefined()
  })
})
