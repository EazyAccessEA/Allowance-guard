/**
 * @jest-environment node
 */

/**
 * Tests for GET /api/allowances
 */

jest.mock('@/lib/db', () => ({
  pool: {
    query: jest.fn(),
  },
  db: { query: jest.fn() },
}))

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
  requireUser: jest.fn(),
}))

jest.mock('@/lib/logger', () => ({
  withReq: jest.fn(() => ({ info: jest.fn(), warn: jest.fn(), error: jest.fn() })),
  apiLogger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

jest.mock('@/lib/cache', () => ({
  cacheGet: jest.fn().mockResolvedValue(null),
  cacheSet: jest.fn(),
}))

jest.mock('@/middleware/validation', () => ({
  validateQuery: jest.fn(() => jest.fn()),
}))

jest.mock('@/lib/validation', () => ({
  allowanceQuerySchema: {},
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => Promise.resolve({ get: jest.fn(), set: jest.fn() })),
  headers: jest.fn(() => Promise.resolve(new Map())),
}))

import { pool } from '@/lib/db'
import { cacheGet } from '@/lib/cache'
import { validateQuery } from '@/middleware/validation'

const mockPool = pool as { query: jest.Mock }
const mockCacheGet = cacheGet as jest.Mock
const mockValidateQuery = validateQuery as jest.Mock

function createRequest(url: string) {
  return new Request(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
}

const VALID_WALLET = '0x1234567890abcdef1234567890abcdef12345678'

beforeEach(() => {
  jest.clearAllMocks()
  mockCacheGet.mockResolvedValue(null)
})

describe('GET /api/allowances', () => {
  test('returns allowances for a valid wallet', async () => {
    const mockRows = [
      {
        chain_id: 1,
        token_address: '0xdead',
        spender_address: '0xbeef',
        standard: 'ERC20',
        allowance_type: 'approve',
        amount: '1000000',
        is_unlimited: false,
        risk_score: 0,
        risk_flags: [],
      },
    ]

    mockValidateQuery.mockReturnValue(() => ({
      success: true,
      data: { wallet: VALID_WALLET, riskOnly: false, page: 1, pageSize: 25 },
    }))

    mockPool.query
      .mockResolvedValueOnce({ rows: mockRows })
      .mockResolvedValueOnce({ rows: [{ total: 1 }] })

    const { GET } = await import('@/app/api/allowances/route')
    const req = createRequest(
      `http://localhost:3000/api/allowances?wallet=${VALID_WALLET}&page=1&pageSize=25`,
    )
    const res = await GET(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.allowances).toHaveLength(1)
    expect(json.total).toBe(1)
    expect(json.page).toBe(1)
  })

  test('returns empty array for wallet with no allowances', async () => {
    mockValidateQuery.mockReturnValue(() => ({
      success: true,
      data: { wallet: VALID_WALLET, riskOnly: false, page: 1, pageSize: 25 },
    }))

    mockPool.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ total: 0 }] })

    const { GET } = await import('@/app/api/allowances/route')
    const req = createRequest(
      `http://localhost:3000/api/allowances?wallet=${VALID_WALLET}&page=1&pageSize=25`,
    )
    const res = await GET(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.allowances).toHaveLength(0)
    expect(json.total).toBe(0)
  })

  test('returns 400 for invalid wallet address', async () => {
    mockValidateQuery.mockReturnValue(() => ({
      success: false,
      error: 'Invalid wallet address',
      details: { wallet: ['Must be a valid Ethereum address'] },
    }))

    const { GET } = await import('@/app/api/allowances/route')
    const req = createRequest('http://localhost:3000/api/allowances?wallet=invalid')
    const res = await GET(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBeDefined()
  })

  test('pagination works with page and pageSize params', async () => {
    mockValidateQuery.mockReturnValue(() => ({
      success: true,
      data: { wallet: VALID_WALLET, riskOnly: false, page: 2, pageSize: 10 },
    }))

    mockPool.query
      .mockResolvedValueOnce({ rows: [{ chain_id: 1 }] })
      .mockResolvedValueOnce({ rows: [{ total: 50 }] })

    const { GET } = await import('@/app/api/allowances/route')
    const req = createRequest(
      `http://localhost:3000/api/allowances?wallet=${VALID_WALLET}&page=2&pageSize=10`,
    )
    const res = await GET(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.page).toBe(2)
    expect(json.pageSize).toBe(10)
    // Verify offset calculation: (page-1) * pageSize = 10
    const queryCall = mockPool.query.mock.calls[0]
    expect(queryCall[1]).toContain(10) // offset
  })

  test('riskOnly filter is applied', async () => {
    mockValidateQuery.mockReturnValue(() => ({
      success: true,
      data: { wallet: VALID_WALLET, riskOnly: true, page: 1, pageSize: 25 },
    }))

    mockPool.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ total: 0 }] })

    const { GET } = await import('@/app/api/allowances/route')
    const req = createRequest(
      `http://localhost:3000/api/allowances?wallet=${VALID_WALLET}&riskOnly=true`,
    )
    const res = await GET(req)

    expect(res.status).toBe(200)
    // Verify the SQL includes the risk filter
    const queryCall = mockPool.query.mock.calls[0]
    expect(queryCall[0]).toContain('is_unlimited=true')
  })
})
