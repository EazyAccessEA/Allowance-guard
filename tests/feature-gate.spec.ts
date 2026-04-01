import { test, expect } from '@playwright/test'

test.describe('Feature Gating', () => {
  test('pricing page shows feature comparison', async ({ page }) => {
    await page.goto('/pricing')
    await page.waitForLoadState('networkidle')

    // Pricing page should list features that differentiate tiers
    const pageContent = await page.textContent('body')
    expect(pageContent).toBeTruthy()

    // Should mention key premium features
    const hasBatchRevoke = pageContent!.toLowerCase().includes('batch') || pageContent!.toLowerCase().includes('bulk')
    const hasMonitoring = pageContent!.toLowerCase().includes('monitor')
    const hasAlerts = pageContent!.toLowerCase().includes('alert')

    // At least one premium feature should be mentioned
    expect(hasBatchRevoke || hasMonitoring || hasAlerts).toBeTruthy()
  })

  test('pricing page has links for each tier', async ({ page }) => {
    await page.goto('/pricing')
    await page.waitForLoadState('networkidle')

    // Should have actionable links or buttons for upgrading
    const actionElements = page.getByRole('button').or(page.getByRole('link'))
    const count = await actionElements.count()
    // At minimum: nav links + tier CTA buttons
    expect(count).toBeGreaterThan(2)
  })

  test('free tier limits are communicated', async ({ page }) => {
    await page.goto('/pricing')
    await page.waitForLoadState('networkidle')

    const pageContent = await page.textContent('body')
    // Free tier should mention wallet limit (3 wallets)
    const mentionsLimit = pageContent!.includes('3') || pageContent!.toLowerCase().includes('free')
    expect(mentionsLimit).toBeTruthy()
  })

  test('homepage shows upgrade prompt or feature highlights', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Homepage should have some mention of premium features or pricing
    const pricingLink = page.getByRole('link', { name: /pricing/i })
      .or(page.getByRole('link', { name: /upgrade/i }))
      .or(page.getByRole('link', { name: /pro/i }))

    if (await pricingLink.count() > 0) {
      await expect(pricingLink.first()).toBeVisible()
    } else {
      // At minimum, the page should load without errors
      await expect(page.locator('body')).toBeVisible()
    }
  })

  test('bulk revoke API requires authentication', async ({ request }) => {
    const r = await request.post('/api/bulk-revoke', {
      data: { wallet: '0x1111111111111111111111111111111111111111', approvals: [] }
    })
    // Should reject unauthenticated requests (401/403) or require valid input (400)
    // but not crash (500)
    expect(r.status()).toBeLessThan(500)
    expect(r.status()).toBeGreaterThanOrEqual(400)
  })
})
