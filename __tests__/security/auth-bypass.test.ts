/**
 * @jest-environment node
 */

/**
 * Auth Bypass Tests
 *
 * Verify that every protected endpoint rejects unauthenticated requests
 * with a 401 status code.
 */

jest.mock('@/lib/db', () => ({
  pool: { query: jest.fn(), connect: jest.fn(() => ({ query: jest.fn(), release: jest.fn() })) },
  db: { query: jest.fn(), connect: jest.fn(() => ({ query: jest.fn(), release: jest.fn() })) },
}))
jest.mock('@/lib/auth', () => ({ getSession: jest.fn(), requireUser: jest.fn() }))
jest.mock('@/lib/ratelimit', () => ({ limitHit: jest.fn(), limitOrThrow: jest.fn() }))
jest.mock('@/lib/billing', () => ({
  getUserSubscription: jest.fn(),
  createCheckoutSession: jest.fn(),
  createPortalSession: jest.fn(),
  syncSubscription: jest.fn(),
  stripe: { webhooks: { constructEvent: jest.fn() } },
}))
jest.mock('@/lib/feature-gate', () => ({
  checkFeature: jest.fn(),
  checkWalletQuota: jest.fn(),
  isFeatureAllowed: jest.fn(),
}))
jest.mock('@/lib/audit', () => ({ auditUser: jest.fn() }))
jest.mock('@/lib/audit-enhanced', () => ({
  auditUserAction: jest.fn(),
  auditEvent: jest.fn(),
  getAuditLogs: jest.fn().mockResolvedValue({ logs: [], total: 0 }),
}))
jest.mock('@/lib/logger', () => ({
  apiLogger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
  withReq: jest.fn(() => ({ info: jest.fn(), warn: jest.fn(), error: jest.fn() })),
}))
jest.mock('@/lib/secure-logger', () => ({
  secureLogger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => Promise.resolve({ get: jest.fn(), set: jest.fn() })),
}))
jest.mock('@/middleware/validation', () => ({
  validateRequest: jest.fn(() => jest.fn().mockResolvedValue({ success: true, data: { plan: 'pro', interval: 'monthly' } })),
}))
jest.mock('@/lib/plans', () => ({
  CONSUMER_PRICES: {
    pro: { stripePriceIdMonthly: 'price_test', stripePriceIdYearly: 'price_test_y' },
    sentinel: { stripePriceIdMonthly: 'price_s', stripePriceIdYearly: 'price_sy' },
  },
}))

import { NextRequest } from 'next/server'
import { getSession, requireUser } from '@/lib/auth'

const mockGetSession = getSession as jest.Mock
const mockRequireUser = requireUser as jest.Mock

function makeRequest(method: string, url: string, body?: object): NextRequest {
  const init: RequestInit = { method, headers: { 'content-type': 'application/json' } }
  if (body) init.body = JSON.stringify(body)
  return new NextRequest(new URL(url, 'http://localhost:3000'), init)
}

async function callHandler(
  handler: (req: NextRequest) => Promise<Response>,
  req: NextRequest,
): Promise<{ status: number; body: unknown }> {
  try {
    const res = await handler(req)
    const body = await res.json().catch(() => null)
    return { status: res.status, body }
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'UNAUTHENTICATED') {
      return { status: 401, body: { error: 'UNAUTHENTICATED' } }
    }
    throw err
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  mockGetSession.mockResolvedValue(null)
  mockRequireUser.mockRejectedValue(new Error('UNAUTHENTICATED'))
})

describe('Auth Bypass Protection', () => {
  test('POST /api/bulk-revoke rejects without auth', async () => {
    const { POST } = await import('@/app/api/bulk-revoke/route')
    const req = makeRequest('POST', '/api/bulk-revoke', {
      walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
      allowances: [],
    })
    const { status } = await callHandler(POST, req)
    expect(status).toBe(401)
  })

  test('GET /api/monitor rejects without auth', async () => {
    const { GET } = await import('@/app/api/monitor/route')
    const req = makeRequest('GET', '/api/monitor?wallet=0x1234567890abcdef1234567890abcdef12345678')
    const { status } = await callHandler(GET as (req: NextRequest) => Promise<Response>, req)
    expect(status).toBe(401)
  })

  test('POST /api/monitor rejects without auth', async () => {
    const { POST } = await import('@/app/api/monitor/route')
    const req = makeRequest('POST', '/api/monitor', {
      wallet: '0x1234567890abcdef1234567890abcdef12345678',
    })
    const { status } = await callHandler(POST as (req: NextRequest) => Promise<Response>, req)
    expect(status).toBe(401)
  })

  test('POST /api/billing/portal rejects without auth', async () => {
    const { POST } = await import('@/app/api/billing/portal/route')
    const req = makeRequest('POST', '/api/billing/portal')
    const { status } = await callHandler(POST as (req: NextRequest) => Promise<Response>, req)
    expect(status).toBe(401)
  })

  test('POST /api/billing/create-subscription rejects without auth', async () => {
    const { POST } = await import('@/app/api/billing/create-subscription/route')
    const req = makeRequest('POST', '/api/billing/create-subscription', {
      plan: 'pro',
      interval: 'monthly',
    })
    const { status } = await callHandler(POST as (req: NextRequest) => Promise<Response>, req)
    expect(status).toBe(401)
  })

  test('GET /api/teams rejects without auth', async () => {
    const { GET } = await import('@/app/api/teams/route')
    const { status } = await callHandler(GET as unknown as (req: NextRequest) => Promise<Response>, makeRequest('GET', '/api/teams'))
    expect(status).toBe(401)
  })

  test('POST /api/teams rejects without auth', async () => {
    const { POST } = await import('@/app/api/teams/route')
    const req = makeRequest('POST', '/api/teams', { name: 'Test Team' })
    const { status } = await callHandler(POST, req)
    expect(status).toBe(401)
  })

  test('GET /api/audit/logs rejects without auth', async () => {
    const { GET } = await import('@/app/api/audit/logs/route')
    const req = makeRequest('GET', '/api/audit/logs')
    const { status } = await callHandler(GET, req)
    expect(status).toBe(401)
  })

  test('POST /api/preferences rejects without auth', async () => {
    const { POST } = await import('@/app/api/preferences/route')
    const req = makeRequest('POST', '/api/preferences', { daily_digest: true })
    const { status } = await callHandler(POST, req)
    expect(status).toBe(401)
  })
})
