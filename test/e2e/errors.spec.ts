import { expect, test } from '@playwright/test'

test.describe('API errors and cancelling', () => {
  test('a rate limit shows its own message, server-rendered, with a retry button', async ({
    request,
    page,
  }) => {
    const response = await request.get('/?name=__429')
    expect(response.status()).toBe(503)
    expect(await response.text()).toContain('Too many requests')

    await page.goto('/?name=__429')
    await expect(page.getByRole('heading', { name: 'Too many requests' })).toBeVisible()
    await expect(page.getByText('Wait a few seconds and try again')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible()
  })

  test('a server error and a rejected request get different messages', async ({ page }) => {
    await page.goto('/?name=__500')
    await expect(page.getByRole('heading', { name: 'The API is having trouble' })).toBeVisible()

    await page.goto('/?name=__400')
    await expect(page.getByRole('heading', { name: 'Invalid request' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Try again' })).toHaveCount(0)
  })

  test('error messages are translated', async ({ page }) => {
    await page.goto('/fa?name=__429')
    await expect(page.getByRole('heading', { name: 'درخواست‌ها بیش از حد است' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'تلاش دوباره' })).toBeVisible()
  })

  test('a newer search cancels the request still in flight', async ({ page }) => {
    const slow = `slow${Date.now()}`
    await page.goto('/', { waitUntil: 'networkidle' })
    const cancelled: string[] = []
    page.on('requestfailed', (request) => {
      if (request.url().includes(`name=${slow}`)) cancelled.push(request.failure()?.errorText ?? '')
    })

    const input = page.getByLabel('Search characters by name')
    await input.fill(slow)
    await page.waitForRequest((r) => r.url().includes(`name=${slow}`))
    await input.fill('rick')
    await expect(page).toHaveURL(/\?name=rick$/)
    await expect(page.getByRole('link', { name: 'Rick Sanchez' })).toBeVisible()

    expect(cancelled).toHaveLength(1)
    expect(cancelled[0]).toMatch(/abort/i)
    await page.waitForTimeout(1600)
    await expect(page.getByRole('link', { name: 'Rick Sanchez' })).toBeVisible()
  })
})
