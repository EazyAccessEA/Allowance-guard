/**
 * @jest-environment node
 */

/**
 * Tests for POST /api/v1/scan (B2B API)
 */

jest.mock('@/lib/db', () => ({
  pool: { query: jest.fn() },
  db: { query: jest.fn() },
}))

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
  requireUser: jest.fn(),
}))

jest.mock('@/lib/jobs', () => ({
  enqueueScan: jest.fn(),
}))

jest.mock('@/lib/networks', () => ({
  enabledChainIds: jest.fn(() => [1, 42161, 8453, 10, 137, 43114]),
  getSupportedChainIds: jest.fn(() => [1, 42161, 8453, 10, 137, 43114, 56]),
}))

jest.mock('@/lib/logger', () => ({
  withReq: jest.fn(() => ({ info: jest.fn(), warn: jest.fn(), error: jest.fn() })),
  apiLogger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

jest.mock('@/middleware/api-auth', () => ({
  authenticateApiKey: jest.fn(),
  withUsageTracking: jest.fn(),
}))

jest.mock('@/middleware/api-rate-limit', () => ({
  checkBurstRateLimit: jest.fn(),
}))

jest.mock('@/lib/api-response', () => ({
  apiSuccess: jest.fn((data: unknown, status: number, _apiKey: unknown) => {
    return new Response(JSON.stringify({ data }), {
      status,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Remaining': '99',
        'X-RateLimit-Limit': '100',
      },
    })
  }),
  apiBadRequest: jest.fn((msg: string) => {
    return new Response(JSON.stringify({ error: msg }), { status: 400 })
  }),
  apiServerError: jest.fn((msg: string) => {
    return new Response(JSON.stringify({ error: msg }), { status: 500 })
  }),
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => Promise.resolve({ get: jest.fn(), set: jest.fn() })),
  headers: jest.fn(() => Promise.resolve(new Map())),
}))

import { authenticateApiKey } from '@/middleware/api-auth'
import { checkBurstRateLimit } from '@/middleware/api-rate-limit'
import { enqueueScan } from '@/lib/jobs'

const mockAuthenticateApiKey = authenticateApiKey as jest.Mock
const mockCheckBurstRateLimit = checkBurstRateLimit as jest.Mock
const mockEnqueueScan = enqueueScan as jest.Mock

const VALID_WALLET = '0x1234567890abcdef1234567890abcdef12345678'

function createRequest(
  method: string,
  body?: unknown,
  headers?: Record<string, string>,
) {
  const init: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
  }
  if (body) init.body = JSON.stringify(body)
  return new Request('http://localhost:3000/api/v1/scan', init)
}

beforeEach(() => {
  jest.clearAllMocks()
  mockCheckBurstRateLimit.mockResolvedValue(null)
})

describe('POST /api/v1/scan', () => {
  test('returns 401 without API key', async () => {
    const errorResponse = new Response(
      JSON.stringify({ error: 'API key required' }),
      { status: 401 },
    )
    mockAuthenticateApiKey.mockResolvedValue({ error: errorResponse })

    const { POST } = await import('@/app/api/v1/scan/route')
    const req = createRequest('POST', { wallet: VALID_WALLET })
    const res = await POST(req as any)

    expect(res.status).toBe(401)
  })

  test('returns 401 with invalid API key', async () => {
    const errorResponse = new Response(
      JSON.stringify({ error: 'Invalid API key' }),
      { status: 401 },
    )
    mockAuthenticateApiKey.mockResolvedValue({ error: errorResponse })

    const { POST } = await import('@/app/api/v1/scan/route')
    const req = createRequest('POST', { wallet: VALID_WALLET }, {
      'X-API-Key': 'invalid-key',
    })
    const res = await POST(req as any)

    expect(res.status).toBe(401)
  })

  test('returns 201 with valid API key and wallet', async () => {
    const mockApiKey = { id: 'key_123', user_id: 1, plan: 'developer' }
    mockAuthenticateApiKey.mockResolvedValue({ apiKey: mockApiKey })
    mockEnqueueScan.mockResolvedValue(99)

    const { POST } = await import('@/app/api/v1/scan/route')
    const req = createRequest('POST', { wallet: VALID_WALLET }, {
      'X-API-Key': 'ag_live_validkey123',
    })
    const res = await POST(req as any)

    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.data.scanId).toBe(99)
    expect(json.data.wallet).toBe(VALID_WALLET)
  })

  test('rate limit headers are present in response', async () => {
    const mockApiKey = { id: 'key_123', user_id: 1, plan: 'developer' }
    mockAuthenticateApiKey.mockResolvedValue({ apiKey: mockApiKey })
    mockEnqueueScan.mockResolvedValue(100)

    const { POST } = await import('@/app/api/v1/scan/route')
    const req = createRequest('POST', { wallet: VALID_WALLET }, {
      'X-API-Key': 'ag_live_validkey123',
    })
    const res = await POST(req as any)

    expect(res.headers.get('X-RateLimit-Remaining')).toBeDefined()
    expect(res.headers.get('X-RateLimit-Limit')).toBeDefined()
  })

  test('returns 429 when rate limited', async () => {
    const mockApiKey = { id: 'key_123', user_id: 1, plan: 'free' }
    mockAuthenticateApiKey.mockResolvedValue({ apiKey: mockApiKey })

    const rateLimitResponse = new Response(
      JSON.stringify({ error: 'Rate limit exceeded' }),
      { status: 429, headers: { 'Retry-After': '60' } },
    )
    mockCheckBurstRateLimit.mockResolvedValue(rateLimitResponse)

    const { POST } = await import('@/app/api/v1/scan/route')
    const req = createRequest('POST', { wallet: VALID_WALLET }, {
      'X-API-Key': 'ag_live_freekey456',
    })
    const res = await POST(req as any)

    expect(res.status).toBe(429)
  })
})
