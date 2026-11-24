import type { Character, CharacterStatus } from '~/types/api'

/** "Dead-Human", "Alive-Alien", "Unknown-Robot" (no spaces around the dash, as in the design). */
export function formatStatusLine(character: Pick<Character, 'status' | 'species'>): string {
  return `${capitalize(character.status)}-${character.species}`
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
