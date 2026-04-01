/**
 * @jest-environment node
 */

/**
 * Tests for /api/billing/create-subscription and /api/billing/portal
 */

jest.mock('@/lib/db', () => ({
  pool: { query: jest.fn() },
  db: { query: jest.fn() },
}))

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
  requireUser: jest.fn(),
}))

jest.mock('@/lib/billing', () => ({
  getUserSubscription: jest.fn(),
  createCheckoutSession: jest.fn(),
  createPortalSession: jest.fn(),
  syncSubscription: jest.fn(),
  stripe: { webhooks: { constructEvent: jest.fn() } },
}))

jest.mock('@/lib/logger', () => ({
  withReq: jest.fn(() => ({ info: jest.fn(), warn: jest.fn(), error: jest.fn() })),
  apiLogger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

jest.mock('@/lib/plans', () => ({
  CONSUMER_PRICES: {
    pro: {
      stripePriceIdMonthly: 'price_pro_monthly',
      stripePriceIdYearly: 'price_pro_yearly',
    },
    sentinel: {
      stripePriceIdMonthly: 'price_sentinel_monthly',
      stripePriceIdYearly: 'price_sentinel_yearly',
    },
  },
}))

jest.mock('@/middleware/validation', () => ({
  validateRequest: jest.fn(() => jest.fn()),
}))

jest.mock('@/lib/validation', () => ({}))

jest.mock('@/lib/feature-gate', () => ({
  checkFeature: jest.fn(),
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => Promise.resolve({ get: jest.fn(), set: jest.fn() })),
  headers: jest.fn(() => Promise.resolve(new Map())),
}))

import { requireUser } from '@/lib/auth'
import { createCheckoutSession, createPortalSession } from '@/lib/billing'
import { validateRequest } from '@/middleware/validation'

const mockRequireUser = requireUser as jest.Mock
const mockCreateCheckoutSession = createCheckoutSession as jest.Mock
const mockCreatePortalSession = createPortalSession as jest.Mock
const mockValidateRequest = validateRequest as jest.Mock

function createRequest(method: string, url: string, body?: unknown) {
  const init: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
  if (body) init.body = JSON.stringify(body)
  return new Request(url, init)
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('POST /api/billing/create-subscription', () => {
  test('requires authentication - returns 401 without session', async () => {
    mockRequireUser.mockRejectedValue(new Error('UNAUTHENTICATED'))

    const { POST } = await import('@/app/api/billing/create-subscription/route')
    const req = createRequest(
      'POST',
      'http://localhost:3000/api/billing/create-subscription',
      { plan: 'pro', interval: 'monthly' },
    )
    const res = await POST(req)

    expect(res.status).toBe(401)
  })

  test('validates plan - accepts pro plan', async () => {
    mockRequireUser.mockResolvedValue({ user_id: 1, email: 'test@example.com' })
    mockValidateRequest.mockReturnValue(() =>
      Promise.resolve({
        success: true,
        data: { plan: 'pro', interval: 'monthly' },
      }),
    )
    mockCreateCheckoutSession.mockResolvedValue('https://checkout.stripe.com/session123')

    const { POST } = await import('@/app/api/billing/create-subscription/route')
    const req = createRequest(
      'POST',
      'http://localhost:3000/api/billing/create-subscription',
      { plan: 'pro', interval: 'monthly' },
    )
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.ok).toBe(true)
    expect(json.checkoutUrl).toBe('https://checkout.stripe.com/session123')
  })

  test('validates plan - accepts sentinel plan', async () => {
    mockRequireUser.mockResolvedValue({ user_id: 1, email: 'test@example.com' })
    mockValidateRequest.mockReturnValue(() =>
      Promise.resolve({
        success: true,
        data: { plan: 'sentinel', interval: 'yearly' },
      }),
    )
    mockCreateCheckoutSession.mockResolvedValue('https://checkout.stripe.com/session456')

    const { POST } = await import('@/app/api/billing/create-subscription/route')
    const req = createRequest(
      'POST',
      'http://localhost:3000/api/billing/create-subscription',
      { plan: 'sentinel', interval: 'yearly' },
    )
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.ok).toBe(true)
    expect(json.checkoutUrl).toContain('stripe.com')
  })

  test('rejects invalid plan', async () => {
    mockRequireUser.mockResolvedValue({ user_id: 1, email: 'test@example.com' })
    mockValidateRequest.mockReturnValue(() =>
      Promise.resolve({
        success: false,
        error: 'Invalid plan',
        details: { plan: ['Expected pro or sentinel'] },
      }),
    )

    const { POST } = await import('@/app/api/billing/create-subscription/route')
    const req = createRequest(
      'POST',
      'http://localhost:3000/api/billing/create-subscription',
      { plan: 'free', interval: 'monthly' },
    )
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  test('returns checkout URL', async () => {
    mockRequireUser.mockResolvedValue({ user_id: 1, email: 'user@example.com' })
    mockValidateRequest.mockReturnValue(() =>
      Promise.resolve({
        success: true,
        data: { plan: 'pro', interval: 'monthly' },
      }),
    )
    const expectedUrl = 'https://checkout.stripe.com/pay/cs_test_abc'
    mockCreateCheckoutSession.mockResolvedValue(expectedUrl)

    const { POST } = await import('@/app/api/billing/create-subscription/route')
    const req = createRequest(
      'POST',
      'http://localhost:3000/api/billing/create-subscription',
      { plan: 'pro', interval: 'monthly' },
    )
    const res = await POST(req)
    const json = await res.json()

    expect(json.checkoutUrl).toBe(expectedUrl)
  })
})

describe('POST /api/billing/portal', () => {
  test('requires authentication - returns 401 without session', async () => {
    mockRequireUser.mockRejectedValue(new Error('UNAUTHENTICATED'))

    const { POST } = await import('@/app/api/billing/portal/route')
    const req = createRequest('POST', 'http://localhost:3000/api/billing/portal')
    const res = await POST(req)

    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.error).toBeDefined()
  })

  test('returns portal URL for user with active subscription', async () => {
    mockRequireUser.mockResolvedValue({ user_id: 1, email: 'test@example.com' })
    const expectedUrl = 'https://billing.stripe.com/session/portal_abc'
    mockCreatePortalSession.mockResolvedValue(expectedUrl)

    const { POST } = await import('@/app/api/billing/portal/route')
    const req = createRequest('POST', 'http://localhost:3000/api/billing/portal')
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.ok).toBe(true)
    expect(json.url).toBe(expectedUrl)
  })

  test('returns 404 when no active subscription', async () => {
    mockRequireUser.mockResolvedValue({ user_id: 1, email: 'test@example.com' })
    mockCreatePortalSession.mockRejectedValue(new Error('NO_ACTIVE_SUBSCRIPTION'))

    const { POST } = await import('@/app/api/billing/portal/route')
    const req = createRequest('POST', 'http://localhost:3000/api/billing/portal')
    const res = await POST(req)

    expect(res.status).toBe(404)
    const json = await res.json()
    expect(json.code).toBe('NO_SUBSCRIPTION')
  })
})
