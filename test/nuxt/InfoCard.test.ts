import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import InfoCard from '~/components/InfoCard.vue'

const episode = {
  title: 'Pilot',
  accent: 'S01 E01',
  accentLabel: 'Episode',
  meta: 'December 2, 2013',
  metaLabel: 'Aired',
}

describe('InfoCard', () => {
  it('renders a titled article with labelled lines for screen readers', async () => {
    const wrapper = await mountSuspended(InfoCard, { props: episode })
    expect(wrapper.find('article h3').text()).toBe('Pilot')
    expect(wrapper.text()).toContain('Episode: S01 E01')
    expect(wrapper.text()).toContain('Aired: December 2, 2013')
    expect(wrapper.find('time').exists()).toBe(false)
  })

  it('wraps the meta line in <time> when given a datetime', async () => {
    const wrapper = await mountSuspended(InfoCard, {
      props: { ...episode, datetime: '2013-12-02' },
    })
    const time = wrapper.find('time')
    expect(time.attributes('datetime')).toBe('2013-12-02')
    expect(time.text()).toBe('December 2, 2013')
  })
})
