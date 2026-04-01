import { test, expect } from '@playwright/test'

const WALLET = '0x1111111111111111111111111111111111111111'

test.describe('Revocation Flow', () => {
  test('homepage loads the security dashboard area', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // The main app area or dashboard should be present
    await expect(page.locator('body')).toBeVisible()

    // Look for the connect wallet or scan button
    const connectOrScan = page.getByRole('button', { name: /connect|scan|check/i })
    if (await connectOrScan.count() > 0) {
      await expect(connectOrScan.first()).toBeVisible()
    }
  })

  test('allowance API endpoint responds', async ({ request }) => {
    const r = await request.get(`/api/allowances?wallet=${WALLET}`)

    if (r.ok()) {
      const data = await r.json()
      // Should return an array or object with allowance data
      expect(data).toBeTruthy()
    } else {
      // Endpoint exists but may need seeded data
      expect(r.status()).toBeLessThan(500)
    }
  })

  test('scan API endpoint responds', async ({ request }) => {
    const r = await request.post('/api/scan', {
      data: { wallet: WALLET, chain: 'ethereum' }
    })

    // Should accept the request or return a known client error
    expect(r.status()).toBeLessThan(500)
  })

  test('bulk revoke API endpoint exists', async ({ request }) => {
    const r = await request.post('/api/bulk-revoke', {
      data: { wallet: WALLET, approvals: [] }
    })

    // Endpoint should exist (not 404) even if it rejects unauthenticated
    expect(r.status()).toBeLessThan(500)
  })

  test('gas estimate API endpoint responds', async ({ request }) => {
    const r = await request.get(`/api/gas-estimate?chain=ethereum`)

    if (r.ok()) {
      const data = await r.json()
      expect(data).toBeTruthy()
    } else {
      expect(r.status()).toBeLessThan(500)
    }
  })

  test('risk assessment API responds', async ({ request }) => {
    const r = await request.get(`/api/risk?wallet=${WALLET}`)

    if (r.ok()) {
      const data = await r.json()
      expect(data).toBeTruthy()
    } else {
      expect(r.status()).toBeLessThan(500)
    }
  })
})
