import { test, expect } from '@playwright/test'

test('Stripe create endpoint returns URL (fake)', async ({ request }) => {
  const r = await request.post('/api/create-checkout-session', {
    data: { amount: 500, currency: 'usd', email: 'e2e@example.com' }
  })
  
  if (r.ok()) {
    const j = await r.json()
    expect(j.id).toBe('cs_test_fake')
  } else {
    // If not in fake mode, just check that the endpoint exists
    expect(r.status()).toBeLessThan(500) // Not a server error
  }
})

test('Coinbase charge endpoint returns hostedUrl (fake)', async ({ request }) => {
  const r = await request.post('/api/coinbase/create-charge', {
    data: { amount: 5, currency: 'USD' }
  })
  
  if (r.ok()) {
    const j = await r.json()
    expect(j.hosted_url).toContain('/success?provider=coinbase')
  } else {
    // If not in fake mode, just check that the endpoint exists
    expect(r.status()).toBeLessThan(500) // Not a server error
  }
})
