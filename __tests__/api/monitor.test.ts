/**
 * @jest-environment node
 */

/**
 * Tests for GET/POST /api/monitor
 */

jest.mock('@/lib/db', () => ({
  pool: { query: jest.fn() },
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

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => Promise.resolve({ get: jest.fn(), set: jest.fn() })),
  headers: jest.fn(() => Promise.resolve(new Map())),
}))

import { getSession } from '@/lib/auth'
import { pool } from '@/lib/db'

const mockGetSession = getSession as jest.Mock
const mockPool = pool as { query: jest.Mock }

const VALID_WALLET = '0x1234567890abcdef1234567890abcdef12345678'

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

describe('GET /api/monitor', () => {
  test('requires authentication - returns 401 without session', async () => {
    mockGetSession.mockResolvedValue(null)

    const { GET } = await import('@/app/api/monitor/route')
    const req = createRequest(
      'GET',
      `http://localhost:3000/api/monitor?wallet=${VALID_WALLET}`,
    )
    const res = await GET(req)

    expect(res.status).toBe(401)
  })

  test('returns monitor config for authenticated user wallet', async () => {
    mockGetSession.mockResolvedValue({ user_id: 1, email: 'test@example.com' })
    mockPool.query.mockResolvedValue({
      rows: [
        {
          wallet_address: VALID_WALLET,
          user_id: 1,
          enabled: true,
          freq_minutes: 720,
        },
      ],
    })

    const { GET } = await import('@/app/api/monitor/route')
    const req = createRequest(
      'GET',
      `http://localhost:3000/api/monitor?wallet=${VALID_WALLET}`,
    )
    const res = await GET(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.monitor).toBeDefined()
    expect(json.monitor.wallet_address).toBe(VALID_WALLET)
  })

  test('returns null monitor for wallet with no config', async () => {
    mockGetSession.mockResolvedValue({ user_id: 1, email: 'test@example.com' })
    mockPool.query.mockResolvedValue({ rows: [] })

    const { GET } = await import('@/app/api/monitor/route')
    const req = createRequest(
      'GET',
      `http://localhost:3000/api/monitor?wallet=${VALID_WALLET}`,
    )
    const res = await GET(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.monitor).toBeNull()
  })

  test('returns 400 for invalid wallet format', async () => {
    mockGetSession.mockResolvedValue({ user_id: 1, email: 'test@example.com' })

    const { GET } = await import('@/app/api/monitor/route')
    const req = createRequest(
      'GET',
      'http://localhost:3000/api/monitor?wallet=not-valid',
    )
    const res = await GET(req)

    expect(res.status).toBe(400)
  })

  test('queries are scoped to authenticated user', async () => {
    mockGetSession.mockResolvedValue({ user_id: 42, email: 'test@example.com' })
    mockPool.query.mockResolvedValue({ rows: [] })

    const { GET } = await import('@/app/api/monitor/route')
    const req = createRequest(
      'GET',
      `http://localhost:3000/api/monitor?wallet=${VALID_WALLET}`,
    )
    await GET(req)

    // Verify user_id is passed to the query
    expect(mockPool.query).toHaveBeenCalledWith(
      expect.any(String),
      expect.arrayContaining([42]),
    )
  })
})

describe('POST /api/monitor', () => {
  test('requires authentication - returns 401 without session', async () => {
    mockGetSession.mockResolvedValue(null)

    const { POST } = await import('@/app/api/monitor/route')
    const req = createRequest('POST', 'http://localhost:3000/api/monitor', {
      wallet: VALID_WALLET,
    })
    const res = await POST(req)

    expect(res.status).toBe(401)
  })

  test('creates/updates monitor config with valid data', async () => {
    mockGetSession.mockResolvedValue({ user_id: 1, email: 'test@example.com' })
    mockPool.query.mockResolvedValue({ rows: [] })

    const { POST } = await import('@/app/api/monitor/route')
    const req = createRequest('POST', 'http://localhost:3000/api/monitor', {
      wallet: VALID_WALLET,
      enabled: true,
      freq_minutes: 360,
    })
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.ok).toBe(true)
    expect(mockPool.query).toHaveBeenCalled()
  })

  test('returns 400 for invalid wallet format in POST', async () => {
    mockGetSession.mockResolvedValue({ user_id: 1, email: 'test@example.com' })

    const { POST } = await import('@/app/api/monitor/route')
    const req = createRequest('POST', 'http://localhost:3000/api/monitor', {
      wallet: 'bad-address',
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })
})
