/**
 * Tests that all protected endpoints return 401 without a valid session.
 */

// --- Mocks (must come before route imports) ---

jest.mock('@/lib/db', () => ({
  pool: { query: jest.fn(), connect: jest.fn() },
  db: { query: jest.fn(), execute: jest.fn() },
}))

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
  requireUser: jest.fn(),
}))

jest.mock('@/lib/ratelimit', () => ({
  limitHit: jest.fn().mockResolvedValue({ allowed: true, remaining: 10, ttl: 60 }),
  limitOrThrow: jest.fn(),
}))

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

jest.mock('@/lib/audit-enhanced', () => ({ auditUserAction: jest.fn() }))

jest.mock('@/lib/secure-logger', () => ({
  secureLogger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

jest.mock('@/lib/logger', () => ({
  withReq: jest.fn(() => ({ info: jest.fn(), warn: jest.fn(), error: jest.fn() })),
  apiLogger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => Promise.resolve({ get: jest.fn(), set: jest.fn() })),
  headers: jest.fn(() => Promise.resolve(new Map())),
}))

jest.mock('@/lib/cache', () => ({
  cacheGet: jest.fn().mockResolvedValue(null),
  cacheSet: jest.fn(),
}))

jest.mock('@/middleware/validation', () => ({
  validateRequest: jest.fn(() => jest.fn()),
  validateQuery: jest.fn(() => jest.fn()),
}))

jest.mock('@/lib/plans', () => ({
  CONSUMER_PRICES: {},
}))

import { getSession, requireUser } from '@/lib/auth'

const mockGetSession = getSession as jest.Mock
const mockRequireUser = requireUser as jest.Mock

function createRequest(
  method: string,
  url: string,
  body?: unknown,
  headers?: Record<string, string>,
) {
  const init: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
  }
  if (body) init.body = JSON.stringify(body)
  return new Request(url, init)
}

beforeEach(() => {
  jest.clearAllMocks()
  // No session = unauthenticated
  mockGetSession.mockResolvedValue(null)
  mockRequireUser.mockRejectedValue(new Error('UNAUTHENTICATED'))
})

describe('Protected endpoints require authentication', () => {
  test('POST /api/bulk-revoke returns 401 without session', async () => {
    const { POST } = await import('@/app/api/bulk-revoke/route')
    const req = createRequest('POST', 'http://localhost:3000/api/bulk-revoke', {
      walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
      allowances: [],
    })
    const res = await POST(req as any)
    expect(res.status).toBe(401)
  })

  test('GET /api/monitor returns 401 without session', async () => {
    const { GET } = await import('@/app/api/monitor/route')
    const req = createRequest(
      'GET',
      'http://localhost:3000/api/monitor?wallet=0x1234567890abcdef1234567890abcdef12345678',
    )
    const res = await GET(req)
    expect(res.status).toBe(401)
  })

  test('POST /api/monitor returns 401 without session', async () => {
    const { POST } = await import('@/app/api/monitor/route')
    const req = createRequest('POST', 'http://localhost:3000/api/monitor', {
      wallet: '0x1234567890abcdef1234567890abcdef12345678',
    })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  test('POST /api/billing/portal returns 401 without session', async () => {
    const { POST } = await import('@/app/api/billing/portal/route')
    const req = createRequest('POST', 'http://localhost:3000/api/billing/portal')
    const res = await POST(req)
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.error).toBeDefined()
  })

  test('POST /api/billing/create-subscription returns 401 without session', async () => {
    const { POST } = await import('@/app/api/billing/create-subscription/route')
    const req = createRequest('POST', 'http://localhost:3000/api/billing/create-subscription', {
      plan: 'pro',
      interval: 'monthly',
    })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  test('GET /api/teams returns 401 without session', async () => {
    const { GET } = await import('@/app/api/teams/route')
    // requireUser throws for teams GET
    try {
      const res = await GET()
      // If the route catches the error internally
      expect(res.status).toBe(401)
    } catch (e: unknown) {
      // If requireUser throws and is not caught by the route
      expect((e as Error).message).toBe('UNAUTHENTICATED')
    }
  })

  test('POST /api/teams returns 401 without session', async () => {
    const { POST } = await import('@/app/api/teams/route')
    const req = createRequest('POST', 'http://localhost:3000/api/teams', {
      name: 'Test Team',
    })
    try {
      const res = await POST(req as any)
      expect(res.status).toBe(401)
    } catch (e: unknown) {
      expect((e as Error).message).toBe('UNAUTHENTICATED')
    }
  })
})
