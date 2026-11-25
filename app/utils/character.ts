import type { Character, CharacterStatus } from '~/types/api'

/** "Dead-Human", "Alive-Alien", "Unknown-Unknown" (no spaces around the dash, as in the design). */
export function formatStatusLine(character: Pick<Character, 'status' | 'species'>): string {
  return `${capitalize(character.status)}-${capitalize(character.species)}`
}

export function statusTone(status: CharacterStatus): 'success' | 'danger' | 'unknown' {
  if (status === 'Alive') return 'success'
  if (status === 'Dead') return 'danger'
  return 'unknown'
}

/** "S03E07" -> "S03 E07" */
export function formatEpisodeCode(code: string): string {
  return code.replace(/^(S\d+)(E\d+)$/i, '$1 $2')
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/** "Planet" -> "Planet", "" or "unknown" -> fallback. */
export function orUnknown(value: string | null | undefined, fallback = 'Unknown'): string {
  return value && value.toLowerCase() !== 'unknown' ? value : fallback
}

/**
 * A short plain-English description, used on the page and as the meta description, e.g.
 * "Rick Sanchez is a human from Earth (C-137). Alive, last seen at Citadel of Ricks.
 * Appears in 51 episodes."
 */
export function describeCharacter(
  character: Pick<Character, 'name' | 'status' | 'species' | 'type' | 'origin' | 'location'>,
  episodeCount: number,
): string {
  const { name, status, species, type, origin, location } = character

  const knownSpecies = species && species.toLowerCase() !== 'unknown'
  const kind = knownSpecies
    ? `${/^[aeiou]/i.test(species) ? 'an' : 'a'} ${species.toLowerCase()}${type ? ` (${type})` : ''}`
    : 'a character of unknown species'
  const from = orUnknown(origin.name, '') ? ` from ${origin.name}` : ''

  const state = status === 'unknown' ? 'Status unknown' : status
  const seen = orUnknown(location.name, '') ? `, last seen at ${location.name}` : ''

  const episodes = `Appears in ${episodeCount} ${episodeCount === 1 ? 'episode' : 'episodes'}.`

  return `${name} is ${kind}${from}. ${state}${seen}. ${episodes}`
}
