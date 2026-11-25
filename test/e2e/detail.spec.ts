import { expect, test } from '@playwright/test'

test.describe('character detail page', () => {
  test('is server-rendered: hero, episodes and locations are in the raw HTML', async ({
    request,
  }) => {
    const response = await request.get('/character/1')
    expect(response.status()).toBe(200)
    const html = await response.text()
    expect(html).toMatch(/<h1[^>]*>\s*Rick Sanchez\s*<\/h1>/)
    expect(html).toContain('Alive-Human')
    expect(html).toContain('Pilot')
    expect(html).toContain('S01 E01')
    expect(html).toContain('datetime="2013-12-02"')
    expect(html).toContain('Earth (C-137)')
    expect(html).toContain('Dimension C-137')
    expect(html).toContain('Citadel of Ricks')
    expect(html).toContain('<title>Rick Sanchez · Rick and Morty</title>')
    expect(html).not.toContain('/api/character/50')
  })

  test('the character is one <article>: hero as its header, episodes and locations inside', async ({
    page,
  }) => {
    await page.goto('/character/1')
    const article = page.getByRole('article', { name: 'Rick Sanchez' })
    await expect(article.getByRole('heading', { level: 1 })).toHaveText('Rick Sanchez')
    await expect(article.getByRole('region', { name: 'Episodes' })).toBeVisible()
    await expect(article.getByRole('region', { name: 'Locations' })).toBeVisible()
  })

  test('lists every episode and both locations, origin first', async ({ page }) => {
    await page.goto('/character/1')
    const episodes = page.getByRole('region', { name: 'Episodes' }).getByRole('article')
    await expect(episodes).toHaveCount(51)
    const locations = page
      .getByRole('region', { name: 'Locations' })
      .getByRole('heading', { level: 3 })
    await expect(locations).toHaveText(['Earth (C-137)', 'Citadel of Ricks'])
  })

  test('handles a single episode and unknown places', async ({ page }) => {
    await page.goto('/character/7')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Squanchy')
    await expect(page.getByText('Unknown-Unknown')).toBeVisible()
    await expect(page.getByRole('region', { name: 'Episodes' }).getByRole('article')).toHaveCount(1)
    await expect(page.getByText('Origin and location are unknown.')).toBeVisible()
  })

  test('shows the same place once when origin and location match', async ({ page }) => {
    await page.goto('/character/6')
    const locations = page.getByRole('region', { name: 'Locations' }).getByRole('article')
    await expect(locations).toHaveCount(1)
    await expect(locations).toContainText('Bird World')
  })

  test('answers 404 for an unknown or invalid id', async ({ request, page }) => {
    expect((await request.get('/character/99999')).status()).toBe(404)
    expect((await request.get('/character/abc')).status()).toBe(404)

    await page.goto('/character/99999')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found')
    await page.getByRole('link', { name: 'Back to all characters' }).click()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole('link', { name: 'Rick Sanchez' })).toBeVisible()
  })

  test('opens from the home page with no console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()))

    await page.goto('/', { waitUntil: 'networkidle' })
    await page.getByRole('link', { name: 'Birdperson' }).click()
    await expect(page).toHaveURL(/\/character\/6$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Birdperson')
    await expect(page.getByText('Dead-Bird-Person')).toBeVisible()
    expect(errors).toEqual([])
  })
})
