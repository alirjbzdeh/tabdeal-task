import { expect, test } from '@playwright/test'

test.describe('languages', () => {
  test('English is the default: no prefix, ltr, with hreflang alternates', async ({ request }) => {
    const html = await (await request.get('/')).text()
    expect(html).toMatch(/<html[^>]*lang="en-US"[^>]*dir="ltr"/)
    expect(html).toMatch(/<link[^>]*href="[^"]*\/fa"[^>]*hreflang="fa-IR"/)
  })

  test('Persian lives under /fa: rtl, translated and server-rendered', async ({ request }) => {
    const response = await request.get('/fa')
    expect(response.status()).toBe(200)
    const html = await response.text()
    expect(html).toMatch(/<html[^>]*lang="fa-IR"[^>]*dir="rtl"/)
    expect(html).toContain('شخصیت‌های ریک و مورتی')
    expect(html).toContain('href="/fa/character/1"')
  })

  test('detail page uses Persian labels, digits and calendar', async ({ request }) => {
    const html = await (await request.get('/fa/character/1')).text()
    expect(html).toContain('قسمت‌ها')
    expect(html).toContain('مکان‌ها')
    expect(html).toMatch(/datetime="2013-12-02"[^>]*>۱۱ آذر ۱۳۹۲/)
    expect(html).toContain('در ۵۱ قسمت حضور دارد')
  })

  test('the error page is translated and right-to-left too', async ({ request }) => {
    const response = await request.get('/fa/character/99999', { headers: { accept: 'text/html' } })
    expect(response.status()).toBe(404)
    const html = await response.text()
    expect(html).toMatch(/<html[^>]*lang="fa-IR"[^>]*dir="rtl"/)
    expect(html).toContain('<title>صفحه پیدا نشد · ریک و مورتی</title>')
  })

  test('the language link keeps the current search and page', async ({ page }) => {
    await page.goto('/?name=smith', { waitUntil: 'networkidle' })
    await page.getByRole('link', { name: 'فارسی' }).click()
    await expect(page).toHaveURL(/\/fa\?name=smith$/)
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
    await expect(page.getByLabel('جست‌وجوی شخصیت با نام')).toHaveValue('smith')

    await page.getByRole('link', { name: 'English' }).click()
    await expect(page).toHaveURL(/\/\?name=smith$/)
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr')
  })
})
