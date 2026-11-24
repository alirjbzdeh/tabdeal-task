import { describe, expect, it } from 'vitest'
import { formatEpisodeCode, formatStatusLine, statusTone } from '~/utils/character'

describe('formatStatusLine', () => {
  it('joins status and species with a dash and no spaces', () => {
    expect(formatStatusLine({ status: 'Dead', species: 'Human' })).toBe('Dead-Human')
    expect(formatStatusLine({ status: 'Alive', species: 'Alien' })).toBe('Alive-Alien')
  })

  it('capitalizes "unknown" status and species', () => {
    expect(formatStatusLine({ status: 'unknown', species: 'Robot' })).toBe('Unknown-Robot')
    expect(formatStatusLine({ status: 'Dead', species: 'unknown' })).toBe('Dead-Unknown')
  })
})

describe('statusTone', () => {
  it('maps each status to a color tone', () => {
    expect(statusTone('Alive')).toBe('success')
    expect(statusTone('Dead')).toBe('danger')
    expect(statusTone('unknown')).toBe('unknown')
  })
})

describe('formatEpisodeCode', () => {
  it('adds a space between season and episode', () => {
    expect(formatEpisodeCode('S03E07')).toBe('S03 E07')
  })

  it('leaves unexpected formats alone', () => {
    expect(formatEpisodeCode('Special')).toBe('Special')
  })
})
