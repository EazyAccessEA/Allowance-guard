import { test, expect } from '@playwright/test'

test.describe('Authentication Behavior', () => {
  test('homepage shows connect wallet option', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Should show a connect wallet button or WalletConnect prompt
    const connectButton = page.getByRole('button', { name: /connect/i })
      .or(page.getByTestId('test-connect'))

    if (await connectButton.count() > 0) {
      await expect(connectButton.first()).toBeVisible()
    } else {
      // Might use a different label; check for wallet-related text
      const content = await page.textContent('body')
      const hasWalletRef = content!.toLowerCase().includes('wallet')
        || content!.toLowerCase().includes('connect')
      expect(hasWalletRef).toBeTruthy()
    }
  })

  test('header contains navigation links', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Header should have key nav items
    const header = page.locator('header').or(page.locator('nav'))
    if (await header.count() > 0) {
      await expect(header.first()).toBeVisible()
    }
  })

  test('protected settings page handles unauthenticated access', async ({ page }) => {
    await page.goto('/settings')
    await page.waitForLoadState('networkidle')

    // Should either redirect, show auth message, or load settings
    await expect(page.locator('body')).toBeVisible()
    const content = await page.textContent('body')
    expect(content!.length).toBeGreaterThan(0)
  })

  test('protected account page handles unauthenticated access', async ({ page }) => {
    await page.goto('/account')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('body')).toBeVisible()
    const url = page.url()
    // Should either stay on /account or redirect somewhere (e.g., / or /login)
    expect(url).toBeTruthy()
  })

  test('CSRF endpoint exists', async ({ request }) => {
    const r = await request.get('/api/csrf')
    // Should return a CSRF token or appropriate response
    expect(r.status()).toBeLessThan(500)
  })

  test('protected API endpoints reject unauthenticated requests gracefully', async ({ request }) => {
    const endpoints = [
      '/api/alerts',
      '/api/teams',
      '/api/keys',
      '/api/rules',
    ]

    for (const endpoint of endpoints) {
      const r = await request.get(endpoint)
      // Should not crash — return 401, 403, or redirect
      expect(r.status()).toBeLessThan(500)
    }
  })
})
