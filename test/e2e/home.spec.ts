import { expect, test } from '@playwright/test'

test.describe('home page', () => {
  test('is server-rendered: characters are in the raw HTML', async ({ request }) => {
    const response = await request.get('/')
    expect(response.status()).toBe(200)
    const html = await response.text()
    expect(html).toContain('Rick Sanchez')
    expect(html).toContain('Alive-Human')
    expect(html).toContain('href="/?page=2"')
  })

  test('search and page live in the URL and are server-rendered too', async ({ request }) => {
    const html = await (await request.get('/?name=test&page=2')).text()
    expect(html).toContain('value="test"')
    expect(html).toMatch(/aria-current="page"[^>]*>\s*<span class="sr-only">Page<\/span>2/)
  })

  test('shows 20 cards and no console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()))

    await page.goto('/')
    await expect(page.getByRole('heading', { level: 2 })).toHaveCount(20)
    await expect(page.getByRole('link', { name: 'Rick Sanchez' })).toBeVisible()
    expect(errors).toEqual([])
  })

  test('search updates the results and the URL', async ({ page }) => {
    await page.goto('/?page=3', { waitUntil: 'networkidle' })
    await page.getByLabel('Search characters by name').fill('smith')
    await expect(page).toHaveURL(/\?name=smith$/) // page resets to 1
    await expect(page.getByRole('link', { name: 'Morty Smith' })).toBeVisible()
  })

  test('pressing Enter searches right away', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    const input = page.getByLabel('Search characters by name')
    await input.fill('birdperson')
    await input.press('Enter')
    await expect(page).toHaveURL(/\?name=birdperson/)
    await expect(page.getByRole('link', { name: 'Birdperson' })).toBeVisible()
    await expect(page.getByText('Dead-Bird-Person')).toBeVisible()
  })

  test('shows an empty state when nothing matches', async ({ page }) => {
    await page.goto('/?name=zzzzqqq')
    await expect(page.getByText('No characters found for “zzzzqqq”')).toBeVisible()
    await page.getByRole('link', { name: 'Clear search' }).click()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole('heading', { level: 2 })).toHaveCount(20)
  })

  test('handles a page past the end', async ({ page }) => {
    await page.goto('/?page=999')
    await expect(page.getByText('Nothing on this page')).toBeVisible()
  })

  test('pagination moves between pages', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'Pagination' })
    await nav.getByRole('link', { name: 'Next page' }).click()
    await expect(page).toHaveURL(/\?page=2$/)
    await expect(nav.locator('[aria-current="page"]')).toHaveText(/2/)
    await expect(page.getByRole('heading', { level: 2 })).toHaveCount(20)
  })
})

test('text typed before hydration is not lost', async ({ page }) => {
  await page.goto('/', { waitUntil: 'commit' })
  await page.getByLabel('Search characters by name').fill('squanch')
  await expect(page).toHaveURL(/\?name=squanch/)
  await expect(page.getByRole('link', { name: 'Squanchy' })).toBeVisible()
  await expect(page.getByText('Unknown-Unknown')).toBeVisible()
})
