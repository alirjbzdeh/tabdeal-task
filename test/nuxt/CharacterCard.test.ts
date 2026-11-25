import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import CharacterCard from '~/components/CharacterCard.vue'
import type { Character } from '~/types/api'

const character: Pick<Character, 'id' | 'name' | 'status' | 'species' | 'image'> = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Dead',
  species: 'Human',
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
}

describe('CharacterCard', () => {
  it('shows the name, links to the detail page and formats the status line', async () => {
    const wrapper = await mountSuspended(CharacterCard, { props: { character } })
    const link = wrapper.find('a')
    expect(link.text()).toBe('Rick Sanchez')
    expect(link.attributes('href')).toBe('/character/1')
    expect(wrapper.text()).toContain('Dead-Human')
    expect(wrapper.find('.bg-danger').exists()).toBe(true)
  })

  it('sizes the image (no layout shift) and lazy-loads unless told otherwise', async () => {
    const lazy = await mountSuspended(CharacterCard, { props: { character } })
    const img = lazy.find('img')
    expect(img.attributes()).toMatchObject({
      width: '300',
      height: '300',
      loading: 'lazy',
      fetchpriority: 'auto',
    })
    expect(img.attributes('alt')).toBe('Portrait of Rick Sanchez')

    const eager = await mountSuspended(CharacterCard, { props: { character, eager: true } })
    expect(eager.find('img').attributes()).toMatchObject({
      loading: 'eager',
      fetchpriority: 'high',
    })

    const lcp = await mountSuspended(CharacterCard, { props: { character, priority: true } })
    expect(lcp.find('img').attributes()).toMatchObject({ loading: 'eager', fetchpriority: 'high' })
  })
})
