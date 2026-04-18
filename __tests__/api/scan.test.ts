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

// The scan route now does an inline "fast-chain" scan before queuing
// any background work. Stub the heavy deps so the test can exercise
// the route end-to-end without touching RPC / DB.
jest.mock('@/lib/scanner', () => ({
  scanWalletOnChain: jest.fn().mockResolvedValue(undefined),
}))

jest.mock('@/lib/retry', () => ({
  withTimeout: jest.fn(<T>(p: Promise<T>) => p),
}))

jest.mock('@/lib/risk', () => ({
  refreshRiskForWallet: jest.fn().mockResolvedValue(undefined),
}))

jest.mock('@/lib/enrich', () => ({
  enrichWallet: jest.fn().mockResolvedValue(undefined),
}))

jest.mock('@/lib/cache', () => ({
  cacheDel: jest.fn().mockResolvedValue(undefined),
}))

jest.mock('@/lib/analytics', () => ({
  trackEvent: jest.fn(),
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
  test('returns 200 with scan summary + backgroundJobId for valid wallet address', async () => {
    const wallet = '0x1234567890abcdef1234567890abcdef12345678'
    mockValidateRequest.mockReturnValue(() =>
      Promise.resolve({
        success: true,
        data: { walletAddress: wallet, chains: [] },
      }),
    )
    // Only slow chains hit enqueueScan. With the default chain set
    // (6 fast + 21 slow) it runs exactly once and returns the job id.
    mockEnqueueScan.mockResolvedValue(42)

    const { POST } = await import('@/app/api/scan/route')
    const req = createRequest('POST', { walletAddress: wallet })
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.ok).toBe(true)
    // The route now returns the two-phase summary, not a single jobId.
    expect(json).toMatchObject({
      ok: true,
      scanned: expect.any(Number),
      failed: expect.any(Number),
      backgroundJobId: 42,
      backgroundChains: expect.any(Number),
      message: expect.stringContaining('Scanned'),
    })
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

  test('handles duplicate background-queue attempt gracefully', async () => {
    const wallet = '0x1234567890abcdef1234567890abcdef12345678'
    mockValidateRequest.mockReturnValue(() =>
      Promise.resolve({
        success: true,
        data: { walletAddress: wallet, chains: [] },
      }),
    )
    // enqueueScan throws the DB unique-constraint error; the route
    // swallows it because another scan already covers the slow chains.
    mockEnqueueScan.mockRejectedValue(new Error('uniq_jobs_active_wallet'))

    const { POST } = await import('@/app/api/scan/route')
    const req = createRequest('POST', { walletAddress: wallet })
    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.ok).toBe(true)
    // Duplicate -> backgroundJobId stays null; fast-scan summary still lands.
    expect(json.backgroundJobId).toBeNull()
    expect(json.message).toContain('Scanned')
  })
})
