import { describe, expect, it } from 'vitest'
import {
  describeCharacter,
  formatEpisodeCode,
  formatStatusLine,
  orUnknown,
  statusTone,
  type Translator,
} from '~/utils/character'
import enMessages from '../../i18n/locales/en.json'
import faMessages from '../../i18n/locales/fa.json'

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

describe('orUnknown', () => {
  it('passes real values through and replaces empty / "unknown"', () => {
    expect(orUnknown('Planet')).toBe('Planet')
    expect(orUnknown('')).toBe('Unknown')
    expect(orUnknown('unknown')).toBe('Unknown')
    expect(orUnknown(undefined, 'n/a')).toBe('n/a')
  })
})

describe('describeCharacter', () => {
  const translator = (messages: Record<string, unknown>): Translator => ({
    t: (key, named = {}) => {
      const message = key
        .split('.')
        .reduce<unknown>((m, k) => (m as Record<string, unknown>)[k], messages)
      return String(message).replace(/\{(\w+)\}/g, (_, name: string) => String(named[name]))
    },
    number: (value) => String(value),
  })
  const en = translator(enMessages)

  const rick = {
    name: 'Rick Sanchez',
    status: 'Alive' as const,
    species: 'Human',
    type: '',
    origin: { name: 'Earth (C-137)', url: 'x/location/1' },
    location: { name: 'Citadel of Ricks', url: 'x/location/3' },
  }

  it('writes a short description', () => {
    expect(describeCharacter(rick, 51, en)).toBe(
      'Rick Sanchez is a human from Earth (C-137). Alive, last seen at Citadel of Ricks. Appears in 51 episodes.',
    )
  })

  it('handles unknowns, "an", the type and a single episode', () => {
    const squanchy = {
      ...rick,
      name: 'Squanchy',
      status: 'unknown' as const,
      species: 'unknown',
      origin: { name: 'unknown', url: '' },
      location: { name: 'unknown', url: '' },
    }
    expect(describeCharacter(squanchy, 1, en)).toBe(
      'Squanchy is a character of unknown species. Status unknown. Appears in 1 episode.',
    )
    expect(describeCharacter({ ...rick, species: 'Alien', type: 'Parasite' }, 2, en)).toContain(
      'is an alien (Parasite) from',
    )
  })

  it('uses the messages of the active language', () => {
    const fa = translator(faMessages)
    expect(describeCharacter(rick, 51, fa)).toBe(
      'Rick Sanchez یک human اهل Earth (C-137) است. زنده، آخرین بار در Citadel of Ricks دیده شده است. در 51 قسمت حضور دارد.',
    )
  })
})
