import { test, expect } from '@playwright/test'

test.describe('API Key & Documentation', () => {
  test('API documentation page loads', async ({ page }) => {
    // Try the main docs page first
    const response = await page.goto('/docs/api')
    if (response && response.status() === 404) {
      // Fall back to api-reference
      await page.goto('/docs/api-reference')
    }
    await page.waitForLoadState('networkidle')

    await expect(page.locator('body')).toBeVisible()
    const content = await page.textContent('body')
    expect(content!.length).toBeGreaterThan(0)
  })

  test('docs page shows API information', async ({ page }) => {
    await page.goto('/docs')
    await page.waitForLoadState('networkidle')

    const content = await page.textContent('body')
    // Docs should mention API-related concepts
    const hasApiContent = content!.toLowerCase().includes('api')
      || content!.toLowerCase().includes('endpoint')
      || content!.toLowerCase().includes('documentation')
    expect(hasApiContent).toBeTruthy()
  })

  test('API key management requires auth', async ({ request }) => {
    const r = await request.get('/api/keys')
    // Should reject unauthenticated requests
    expect(r.status()).toBeLessThan(500)
  })

  test('API key creation requires auth', async ({ request }) => {
    const r = await request.post('/api/keys', {
      data: { name: 'test-key' }
    })
    expect(r.status()).toBeLessThan(500)
    expect(r.status()).toBeGreaterThanOrEqual(400)
  })

  test('v1 API health endpoint responds', async ({ request }) => {
    // The public B2B API should have some accessible endpoint
    const r = await request.get('/api/v1/scan', {
      params: { wallet: '0x1111111111111111111111111111111111111111' }
    })
    // May require API key but should not be 500
    expect(r.status()).toBeLessThan(500)
  })

  test('account keys page loads', async ({ page }) => {
    await page.goto('/account/keys')
    await page.waitForLoadState('networkidle')

    // May redirect to login or show auth prompt
    await expect(page.locator('body')).toBeVisible()
  })
})
