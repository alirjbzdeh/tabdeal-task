import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import SearchBar from '~/components/SearchBar.vue'

describe('SearchBar', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('emits the search after the debounce delay', async () => {
    const wrapper = await mountSuspended(SearchBar, { props: { debounce: 400 } })
    await wrapper.find('input').setValue('rick')

    vi.advanceTimersByTime(399)
    expect(wrapper.emitted('search')).toBeUndefined()

    vi.advanceTimersByTime(1)
    expect(wrapper.emitted('search')).toEqual([['rick']])
  })

  it('only emits once while the user keeps typing', async () => {
    const wrapper = await mountSuspended(SearchBar)
    const input = wrapper.find('input')
    await input.setValue('r')
    vi.advanceTimersByTime(200)
    await input.setValue('ri')
    vi.advanceTimersByTime(200)
    await input.setValue('rick')
    vi.advanceTimersByTime(400)

    expect(wrapper.emitted('search')).toEqual([['rick']])
  })

  it('searches right away on submit (Enter / button) and trims the value', async () => {
    const wrapper = await mountSuspended(SearchBar)
    await wrapper.find('input').setValue('  morty ')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('search')).toEqual([['morty']])
    vi.advanceTimersByTime(1000)
    expect(wrapper.emitted('search')).toHaveLength(1)
  })

  it('does not emit when the value matches the current search', async () => {
    const wrapper = await mountSuspended(SearchBar, { props: { modelValue: 'rick' } })
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('search')).toBeUndefined()
  })

  it('follows modelValue changes (back/forward, clear search)', async () => {
    const wrapper = await mountSuspended(SearchBar, { props: { modelValue: 'rick' } })
    await wrapper.setProps({ modelValue: '' })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('')
  })

  it('has an accessible label and a GET form fallback', async () => {
    const wrapper = await mountSuspended(SearchBar)
    const id = wrapper.find('input').attributes('id')
    expect(id).toBeTruthy()
    expect(wrapper.find('label').attributes('for')).toBe(id)
    expect(wrapper.find('form').attributes()).toMatchObject({ method: 'get', action: '/' })
    expect(wrapper.find('input').attributes('name')).toBe('name')
  })
})
