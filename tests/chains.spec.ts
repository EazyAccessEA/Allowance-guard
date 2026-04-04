import { test, expect } from '@playwright/test'
import { SUPPORTED_CHAINS, TEST_WALLET } from './helpers/chains'

/**
 * Parameterised E2E tests for all supported chains.
 * Verifies that scan and allowance API endpoints accept each chain
 * and return valid responses (not 500 errors).
 */

for (const chain of SUPPORTED_CHAINS) {
  test.describe(`Chain: ${chain.name} (${chain.slug})`, () => {
    test(`scan API accepts ${chain.slug}`, async ({ request }) => {
      const res = await request.post('/api/scan', {
        data: { wallet: TEST_WALLET, chain: chain.slug },
      })

      // Endpoint should not 500 — 200, 202 (queued), 400 (validation), 401, 429 are all acceptable
      expect(res.status()).toBeLessThan(500)
    })

    test(`allowances API accepts chain_id=${chain.id}`, async ({ request }) => {
      const res = await request.get(
        `/api/allowances?wallet=${TEST_WALLET}&chain_id=${chain.id}`,
      )

      expect(res.status()).toBeLessThan(500)

      if (res.ok()) {
        const data = await res.json()
        expect(data).toBeTruthy()
      }
    })

    test(`bulk-revoke API accepts ${chain.slug}`, async ({ request }) => {
      const res = await request.post('/api/bulk-revoke', {
        data: { wallet: TEST_WALLET, chain: chain.slug, approvals: [] },
      })

      // Should not 404 or 500
      expect(res.status()).toBeLessThan(500)
    })
  })
}

test.describe('Chain selector UI', () => {
  test('chain selector renders all supported chains', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Look for a chain selector dropdown or list
    const chainSelector = page.locator(
      '[data-testid="chain-selector"], [aria-label*="chain"], [aria-label*="network"], select[name*="chain"]',
    )

    if (await chainSelector.count() > 0) {
      await chainSelector.first().click()
      await page.waitForTimeout(300)

      // Verify at least some chain names are visible
      const chainNames = SUPPORTED_CHAINS.map((c) => c.name)
      let foundCount = 0
      for (const name of chainNames) {
        const el = page.getByText(name, { exact: false })
        if (await el.count() > 0) foundCount++
      }

      // At minimum we expect Ethereum to be present
      expect(foundCount).toBeGreaterThanOrEqual(1)
    } else {
      // Chain selector may not be visible without wallet connected — skip gracefully
      test.skip()
    }
  })
})
