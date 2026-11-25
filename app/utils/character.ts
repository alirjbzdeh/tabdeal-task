import type { Character, CharacterStatus } from '~/types/api'

export function formatStatusLine(character: Pick<Character, 'status' | 'species'>): string {
  return `${capitalize(character.status)}-${capitalize(character.species)}`
}

export function statusTone(status: CharacterStatus): 'success' | 'danger' | 'unknown' {
  if (status === 'Alive') return 'success'
  if (status === 'Dead') return 'danger'
  return 'unknown'
}

export function formatEpisodeCode(code: string): string {
  return code.replace(/^(S\d+)(E\d+)$/i, '$1 $2')
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function orUnknown(value: string | null | undefined, fallback = 'Unknown'): string {
  return value && value.toLowerCase() !== 'unknown' ? value : fallback
}

export interface Translator {
  t: (key: string, named?: Record<string, unknown>) => string
  number: (value: number) => string
}

export function describeCharacter(
  character: Pick<Character, 'name' | 'status' | 'species' | 'type' | 'origin' | 'location'>,
  episodeCount: number,
  { t, number }: Translator,
): string {
  const { name, status, species, type, origin, location } = character
  const key = (k: string) => `character.describe.${k}`

  const knownSpecies = !!orUnknown(species, '')
  const origins = orUnknown(origin.name, '')
  const who = knownSpecies
    ? t(key(origins ? 'kindFrom' : 'kind'), {
        name,
        article: t(key(/^[aeiou]/i.test(species) ? 'an' : 'a')),
        kind: `${species.toLowerCase()}${type ? ` (${type})` : ''}`,
        origin: origins,
      })
    : t(key(origins ? 'unknownFrom' : 'unknown'), { name, origin: origins })

  const state = t(key({ Alive: 'alive', Dead: 'dead', unknown: 'statusUnknown' }[status]))
  const lastSeen = orUnknown(location.name, '')
  const seen = lastSeen
    ? t(key('seen'), { status: state, location: lastSeen })
    : t(key('status'), { status: state })

  const episodes = t(key(episodeCount === 1 ? 'episodesOne' : 'episodesOther'), {
    count: number(episodeCount),
  })

  return `${who} ${seen} ${episodes}`
}
