/**
 * @jest-environment node
 */

/**
 * Tests for POST /api/scan
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

jest.mock('@/lib/logger', () => ({
  withReq: jest.fn(() => ({ info: jest.fn(), warn: jest.fn(), error: jest.fn() })),
  apiLogger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

jest.mock('@/lib/networks', () => ({
  enabledChainIds: jest.fn(() => [1, 42161, 8453, 10, 137, 43114]),
}))

jest.mock('@/lib/rate-limit', () => ({
  scanRateLimit: jest.fn(() => null),
}))

jest.mock('@/lib/metrics', () => ({
  incrScan: jest.fn(),
}))

jest.mock('@/middleware/validation', () => ({
  validateRequest: jest.fn(() => jest.fn()),
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => Promise.resolve({ get: jest.fn(), set: jest.fn() })),
  headers: jest.fn(() => Promise.resolve(new Map())),
}))

jest.mock('@/lib/validation', () => ({
  scanRequestSchema: {},
}))

import { enqueueScan } from '@/lib/jobs'
import { scanRateLimit } from '@/lib/rate-limit'
import { validateRequest } from '@/middleware/validation'

const mockEnqueueScan = enqueueScan as jest.Mock
const mockScanRateLimit = scanRateLimit as jest.Mock
const mockValidateRequest = validateRequest as jest.Mock

function createRequest(
  method: string,
  body?: unknown,
  url = 'http://localhost:3000/api/scan',
) {
  const init: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
  if (body) init.body = JSON.stringify(body)
  return new Request(url, init)
}

beforeEach(() => {
  jest.clearAllMocks()
  mockScanRateLimit.mockReturnValue(null)
})

describe('POST /api/scan', () => {
  test('returns 200 with jobId for valid wallet address', async () => {
    const wallet = '0x1234567890abcdef1234567890abcdef12345678'
    mockValidateRequest.mockReturnValue(() =>
      Promise.resolve({
        success: true,
        data: { walletAddress: wallet, chains: [] },
      }),
    )
    mockEnqueueScan.mockResolvedValue(42)

    const { POST } = await import('@/app/api/scan/route')
    const req = createRequest('POST', { walletAddress: wallet })
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.ok).toBe(true)
    expect(json.jobId).toBe(42)
  })

  test('returns 400 for invalid wallet address', async () => {
    mockValidateRequest.mockReturnValue(() =>
      Promise.resolve({
        success: false,
        error: 'Invalid wallet address',
        details: { walletAddress: ['Invalid address format'] },
      }),
    )

    const { POST } = await import('@/app/api/scan/route')
    const req = createRequest('POST', { walletAddress: 'not-a-wallet' })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBeDefined()
  })

  test('returns 429 when rate limited', async () => {
    const { NextResponse } = await import('next/server')
    mockScanRateLimit.mockReturnValue(
      NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 }),
    )

    const { POST } = await import('@/app/api/scan/route')
    const req = createRequest('POST', {
      walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    })
    const res = await POST(req)

    expect(res.status).toBe(429)
  })

  test('handles duplicate scan gracefully', async () => {
    const wallet = '0x1234567890abcdef1234567890abcdef12345678'
    mockValidateRequest.mockReturnValue(() =>
      Promise.resolve({
        success: true,
        data: { walletAddress: wallet, chains: [] },
      }),
    )
    mockEnqueueScan.mockRejectedValue(new Error('uniq_jobs_active_wallet'))

    const { POST } = await import('@/app/api/scan/route')
    const req = createRequest('POST', { walletAddress: wallet })
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.ok).toBe(true)
    expect(json.message).toContain('already in progress')
  })
})
