import { expect, test, type Page } from '@playwright/test'

const boxOf = async (page: Page, selector: string) => {
  const box = await page.locator(selector).first().boundingBox()
  if (!box) throw new Error(`${selector} is not visible`)
  return Object.fromEntries(Object.entries(box).map(([k, v]) => [k, Math.round(v)]))
}

test.describe('header matches the Figma frames', () => {
  test.skip(({ isMobile }) => isMobile, 'sets its own viewport sizes')

  test('desktop list frame (1920 wide)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')

    expect(await boxOf(page, 'header img')).toEqual({ x: 156, y: 12, width: 116, height: 36 })
    expect(await boxOf(page, 'form[role=search]')).toEqual({
      x: 156,
      y: 88,
      width: 1608,
      height: 80,
    })
    expect(await boxOf(page, 'form[role=search] input')).toEqual({
      x: 172,
      y: 104,
      width: 1458,
      height: 48,
    })
    expect(await boxOf(page, 'form[role=search] button')).toEqual({
      x: 1646,
      y: 104,
      width: 102,
      height: 48,
    })
    expect((await boxOf(page, 'main')).y).toBe(192)
    await expect(page.locator('header [aria-hidden=true]').first()).toBeVisible()
  })

  test('mobile list frame (360 wide)', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 })
    await page.goto('/')

    expect(await boxOf(page, 'header img')).toEqual({ x: 16, y: 12, width: 116, height: 36 })
    expect(await boxOf(page, 'form[role=search]')).toEqual({ x: 16, y: 72, width: 328, height: 80 })
    expect(await boxOf(page, 'form[role=search] input')).toEqual({
      x: 32,
      y: 88,
      width: 232,
      height: 48,
    })
    expect(await boxOf(page, 'form[role=search] button')).toEqual({
      x: 280,
      y: 88,
      width: 48,
      height: 48,
    })
    expect((await boxOf(page, 'main')).y).toBe(176)
    await expect(page.locator('header [aria-hidden=true]').first()).toBeHidden()
  })
})
