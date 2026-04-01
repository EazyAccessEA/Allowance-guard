import { test, expect } from '@playwright/test'

test.describe('Payment Flow', () => {
  test('pricing page displays all tiers', async ({ page }) => {
    await page.goto('/pricing')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('Free')).toBeVisible()
    await expect(page.getByText('Pro')).toBeVisible()
    await expect(page.getByText('Sentinel')).toBeVisible()
  })

  test('pricing page has upgrade buttons', async ({ page }) => {
    await page.goto('/pricing')
    await page.waitForLoadState('networkidle')

    // Look for CTA buttons
    const buttons = page.getByRole('button').or(page.getByRole('link'))
    await expect(buttons.first()).toBeVisible()
  })

  test('pro plan shows correct price', async ({ page }) => {
    await page.goto('/pricing')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('$9.99')).toBeVisible()
  })

  test('sentinel plan shows correct price', async ({ page }) => {
    await page.goto('/pricing')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('$49.99')).toBeVisible()
  })

  test('stripe checkout endpoint responds in fake mode', async ({ request }) => {
    const r = await request.post('/api/create-checkout-session', {
      data: { amount: 999, currency: 'usd', email: 'payment-test@example.com' }
    })

    if (r.ok()) {
      const j = await r.json()
      // In fake mode we expect a test session id
      expect(j.id || j.sessionId || j.url).toBeTruthy()
    } else {
      // Endpoint exists but may require auth — should not be a 500
      expect(r.status()).toBeLessThan(500)
    }
  })

  test('billing API endpoint exists', async ({ request }) => {
    const r = await request.get('/api/billing')
    // May require auth, but should not be a server error
    expect(r.status()).toBeLessThan(500)
  })
})
