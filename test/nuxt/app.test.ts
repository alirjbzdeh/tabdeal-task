import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import IndexPage from '~/pages/index.vue'

// Runs inside a real Nuxt environment (auto-imports, plugins, router).
describe('home page', () => {
  it('renders the page heading', async () => {
    const wrapper = await mountSuspended(IndexPage)
    expect(wrapper.find('h1').text()).toContain('Rick and Morty')
  })
})
