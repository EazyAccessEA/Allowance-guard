import { test, expect } from '@playwright/test'

test.describe('Account Pages', () => {
  test('account page loads', async ({ page }) => {
    await page.goto('/account')
    await page.waitForLoadState('networkidle')

    // Should load without a server error (may redirect or show auth prompt)
    await expect(page.locator('body')).toBeVisible()
    const content = await page.textContent('body')
    expect(content!.length).toBeGreaterThan(0)
  })

  test('account page references plan or subscription info', async ({ page }) => {
    await page.goto('/account')
    await page.waitForLoadState('networkidle')

    const content = await page.textContent('body')
    // Should mention account-related concepts (plan, subscription, wallet, etc.)
    const hasAccountContent = content!.toLowerCase().includes('plan')
      || content!.toLowerCase().includes('account')
      || content!.toLowerCase().includes('subscription')
      || content!.toLowerCase().includes('connect')
      || content!.toLowerCase().includes('sign in')
    expect(hasAccountContent).toBeTruthy()
  })

  test('billing page loads', async ({ page }) => {
    await page.goto('/account/billing')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('body')).toBeVisible()
  })

  test('usage page loads', async ({ page }) => {
    await page.goto('/account/usage')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('body')).toBeVisible()
  })

  test('account API endpoint exists', async ({ request }) => {
    const r = await request.get('/api/account')
    // Should return user data or auth error, not a 500
    expect(r.status()).toBeLessThan(500)
  })

  test('user API endpoint exists', async ({ request }) => {
    const r = await request.get('/api/user')
    expect(r.status()).toBeLessThan(500)
  })
})
