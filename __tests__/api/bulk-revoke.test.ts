/**
 * @jest-environment node
 */

/**
 * Tests for POST/GET /api/bulk-revoke
 */

jest.mock('@/lib/db', () => ({
  pool: { query: jest.fn(), connect: jest.fn() },
  db: { query: jest.fn() },
}))

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
  requireUser: jest.fn(),
}))

jest.mock('@/lib/audit-enhanced', () => ({
  auditUserAction: jest.fn(),
}))

jest.mock('@/lib/secure-logger', () => ({
  secureLogger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

jest.mock('@/lib/logger', () => ({
  withReq: jest.fn(() => ({ info: jest.fn(), warn: jest.fn(), error: jest.fn() })),
  apiLogger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
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

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => Promise.resolve({ get: jest.fn(), set: jest.fn() })),
  headers: jest.fn(() => Promise.resolve(new Map())),
}))

import { getSession } from '@/lib/auth'

const mockGetSession = getSession as jest.Mock

const VALID_WALLET = '0x1234567890abcdef1234567890abcdef12345678'

function createRequest(
  method: string,
  urlOrBody?: string | unknown,
  body?: unknown,
) {
  if (typeof urlOrBody === 'string') {
    return new Request(urlOrBody, {
      method,
      headers: { 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}),
    })
  }
  return new Request('http://localhost:3000/api/bulk-revoke', {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(urlOrBody ? { body: JSON.stringify(urlOrBody) } : {}),
  })
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('POST /api/bulk-revoke', () => {
  test('requires authentication - returns 401 without session', async () => {
    mockGetSession.mockResolvedValue(null)

    const { POST } = await import('@/app/api/bulk-revoke/route')
    const req = createRequest('POST', {
      walletAddress: VALID_WALLET,
      allowances: [],
    })
    const res = await POST(req as any)

    expect(res.status).toBe(401)
  })

  test('returns planning info with gas estimates for valid request', async () => {
    mockGetSession.mockResolvedValue({ user_id: 1, email: 'test@example.com' })

    const allowances = [
      {
        chain_id: 1,
        token_address: '0xaaaa',
        spender_address: '0xbbbb',
        standard: 'ERC20',
        amount: '1000',
        is_unlimited: true,
      },
      {
        chain_id: 1,
        token_address: '0xcccc',
        spender_address: '0xdddd',
        standard: 'ERC721',
        amount: '1',
        is_unlimited: false,
      },
    ]

    const { POST } = await import('@/app/api/bulk-revoke/route')
    const req = createRequest('POST', {
      walletAddress: VALID_WALLET,
      allowances,
    })
    const res = await POST(req as any)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.planning).toBeDefined()
    expect(json.planning.totalAllowances).toBe(2)
    expect(json.planning.totalEstimatedGas).toBeGreaterThan(0)
    expect(json.planning.chains).toBe(1)
  })

  test('validates allowances array - returns 400 when missing', async () => {
    mockGetSession.mockResolvedValue({ user_id: 1, email: 'test@example.com' })

    const { POST } = await import('@/app/api/bulk-revoke/route')
    const req = createRequest('POST', {
      walletAddress: VALID_WALLET,
      // no allowances field
    })
    const res = await POST(req as any)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain('allowances')
  })

  test('validates allowance structure - returns 400 on invalid', async () => {
    mockGetSession.mockResolvedValue({ user_id: 1, email: 'test@example.com' })

    const { POST } = await import('@/app/api/bulk-revoke/route')
    const req = createRequest('POST', {
      walletAddress: VALID_WALLET,
      allowances: [{ bad: 'data' }],
    })
    const res = await POST(req as any)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBeDefined()
  })

  test('returns 400 for empty allowances array', async () => {
    mockGetSession.mockResolvedValue({ user_id: 1, email: 'test@example.com' })

    const { POST } = await import('@/app/api/bulk-revoke/route')
    const req = createRequest('POST', {
      walletAddress: VALID_WALLET,
      allowances: [],
    })
    const res = await POST(req as any)

    expect(res.status).toBe(400)
  })
})

describe('GET /api/bulk-revoke', () => {
  test('requires authentication - returns 401 without session', async () => {
    mockGetSession.mockResolvedValue(null)

    const { GET } = await import('@/app/api/bulk-revoke/route')
    const req = createRequest(
      'GET',
      `http://localhost:3000/api/bulk-revoke?walletAddress=${VALID_WALLET}`,
    )
    const res = await GET(req as any)

    expect(res.status).toBe(401)
  })

  test('returns stats for wallet when authenticated', async () => {
    mockGetSession.mockResolvedValue({ user_id: 1, email: 'test@example.com' })

    const { GET } = await import('@/app/api/bulk-revoke/route')
    const req = createRequest(
      'GET',
      `http://localhost:3000/api/bulk-revoke?walletAddress=${VALID_WALLET}`,
    )
    const res = await GET(req as any)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.walletAddress).toBe(VALID_WALLET)
    expect(json).toHaveProperty('totalBulkOperations')
    expect(json).toHaveProperty('totalAllowancesRevoked')
  })
})
