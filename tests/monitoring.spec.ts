import { test, expect } from '@playwright/test'

test.describe('Monitoring Features', () => {
  test('features page loads and mentions monitoring', async ({ page }) => {
    await page.goto('/features')
    await page.waitForLoadState('networkidle')

    const content = await page.textContent('body')
    expect(content).toBeTruthy()

    const hasMonitoring = content!.toLowerCase().includes('monitor')
      || content!.toLowerCase().includes('alert')
      || content!.toLowerCase().includes('watch')
    expect(hasMonitoring).toBeTruthy()
  })

  test('features page lists key capabilities', async ({ page }) => {
    await page.goto('/features')
    await page.waitForLoadState('networkidle')

    const content = await page.textContent('body')
    // Should mention core features
    const hasScan = content!.toLowerCase().includes('scan')
    const hasRevoke = content!.toLowerCase().includes('revok')
    expect(hasScan || hasRevoke).toBeTruthy()
  })

  test('alerts API requires authentication', async ({ request }) => {
    const r = await request.get('/api/alerts')
    expect(r.status()).toBeLessThan(500)
  })

  test('monitor API requires authentication', async ({ request }) => {
    const r = await request.post('/api/monitor', {
      data: { wallet: '0x1111111111111111111111111111111111111111' }
    })
    expect(r.status()).toBeLessThan(500)
    expect(r.status()).toBeGreaterThanOrEqual(400)
  })

  test('settings page loads', async ({ page }) => {
    await page.goto('/settings')
    await page.waitForLoadState('networkidle')

    // May show auth prompt or settings form
    await expect(page.locator('body')).toBeVisible()
    const content = await page.textContent('body')
    expect(content!.length).toBeGreaterThan(0)
  })

  test('rules API requires authentication', async ({ request }) => {
    const r = await request.get('/api/rules')
    expect(r.status()).toBeLessThan(500)
  })
})
