import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import AppPagination from '~/components/AppPagination.vue'

const to = (page: number) => ({ path: '/', query: page > 1 ? { page: String(page) } : {} })

describe('AppPagination', () => {
  it('renders nothing for a single page', async () => {
    const wrapper = await mountSuspended(AppPagination, { props: { page: 1, total: 1, to } })
    expect(wrapper.find('nav').exists()).toBe(false)
  })

  it('marks only the current page with aria-current', async () => {
    const wrapper = await mountSuspended(AppPagination, { props: { page: 3, total: 42, to } })
    const current = wrapper.findAll('[aria-current]')
    expect(current).toHaveLength(1)
    expect(current[0]!.attributes('aria-current')).toBe('page')
    expect(current[0]!.text()).toContain('3')
  })

  it('links to the right pages', async () => {
    const wrapper = await mountSuspended(AppPagination, { props: { page: 1, total: 42, to } })
    const hrefs = wrapper.findAll('a').map((a) => a.attributes('href'))
    expect(hrefs).toEqual(['/?page=2', '/?page=3', '/?page=4', '/?page=5', '/?page=2', '/?page=42'])
  })

  it('disables first/previous on page 1 and next/last on the last page', async () => {
    const first = await mountSuspended(AppPagination, { props: { page: 1, total: 42, to } })
    expect(first.find('a[aria-label="Previous page"]').exists()).toBe(false)
    expect(first.find('a[aria-label="Next page"]').exists()).toBe(true)

    const last = await mountSuspended(AppPagination, { props: { page: 42, total: 42, to } })
    expect(last.find('a[aria-label="Next page"]').exists()).toBe(false)
    expect(last.find('a[aria-label="First page"]').attributes('href')).toBe('/')
  })
})
