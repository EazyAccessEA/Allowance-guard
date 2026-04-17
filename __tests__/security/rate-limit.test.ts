/**
 * Rate Limiting Tests — Upstash backend.
 *
 * Verifies that rate limiting works correctly: allows requests under the
 * limit, blocks at the limit, and fails closed when Upstash is configured
 * but unreachable.
 */

// Mark this file as a module — see the twin file at
// __tests__/lib/ratelimit.test.ts for the reason.
export {}

process.env.UPSTASH_REDIS_REST_URL = 'https://fake.upstash.io'
process.env.UPSTASH_REDIS_REST_TOKEN = 'fake-token'

const mockIncr = jest.fn()
const mockExpire = jest.fn()
const mockTtl = jest.fn()

jest.mock('@upstash/redis', () => ({
  Redis: jest.fn().mockImplementation(() => ({
    incr: mockIncr,
    expire: mockExpire,
    ttl: mockTtl,
    ping: jest.fn(),
  })),
}))

// Need to import after mocks are set up
let limitHit: typeof import('@/lib/ratelimit').limitHit
let limitOrThrow: typeof import('@/lib/ratelimit').limitOrThrow

beforeAll(async () => {
  const mod = await import('@/lib/ratelimit')
  limitHit = mod.limitHit
  limitOrThrow = mod.limitOrThrow
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('limitHit', () => {
  test('returns allowed: true when under limit', async () => {
    mockIncr.mockResolvedValue(3)
    mockTtl.mockResolvedValue(45)

    const result = await limitHit('test:key', 60, 10)
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(7)
    expect(result.ttl).toBe(45)
  })

  test('sets expiry on first request in window (count === 1)', async () => {
    mockIncr.mockResolvedValue(1)
    mockExpire.mockResolvedValue(true)
    mockTtl.mockResolvedValue(60)

    await limitHit('test:key', 60, 10)
    expect(mockExpire).toHaveBeenCalled()
  })

  test('does not set expiry for subsequent requests (count > 1)', async () => {
    mockIncr.mockResolvedValue(5)
    mockTtl.mockResolvedValue(42)

    await limitHit('test:key', 60, 10)
    expect(mockExpire).not.toHaveBeenCalled()
  })

  test('returns allowed: false when at limit', async () => {
    mockIncr.mockResolvedValue(11)
    mockTtl.mockResolvedValue(30)

    const result = await limitHit('test:key', 60, 10)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  test('returns allowed: false when over limit', async () => {
    mockIncr.mockResolvedValue(100)
    mockTtl.mockResolvedValue(15)

    const result = await limitHit('test:key', 60, 10)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  test('remaining never goes negative', async () => {
    mockIncr.mockResolvedValue(50)
    mockTtl.mockResolvedValue(10)

    const result = await limitHit('test:key', 60, 10)
    expect(result.remaining).toBe(0)
  })
})

describe('limitOrThrow', () => {
  test('throws "Rate limit exceeded" when over limit', async () => {
    mockIncr.mockResolvedValue(100)
    mockTtl.mockResolvedValue(30)

    await expect(limitOrThrow('192.168.1.1', 'scan')).rejects.toThrow(
      'Rate limit exceeded',
    )
  })

  test('returns result for request under limit', async () => {
    mockIncr.mockResolvedValue(1)
    mockExpire.mockResolvedValue(true)
    mockTtl.mockResolvedValue(60)

    const result = await limitOrThrow('192.168.1.1', 'scan')
    expect(result).toBeDefined()
    expect(result!.allowed).toBe(true)
  })

  test('returns undefined for unknown endpoint (no limit configured)', async () => {
    const result = await limitOrThrow('192.168.1.1', 'unknown-endpoint')
    expect(result).toBeUndefined()
  })
})

describe('All known endpoints have rate limits', () => {
  const requiredEndpoints = [
    'coinbase-charge',
    'stripe-checkout',
    'scan',
    'share-create',
    'bulk-revoke',
    'preferences',
    'monitor',
    'audit-logs',
  ]

  for (const endpoint of requiredEndpoints) {
    test(`${endpoint} has a configured rate limit`, async () => {
      mockIncr.mockResolvedValue(1)
      mockExpire.mockResolvedValue(true)
      mockTtl.mockResolvedValue(60)

      const result = await limitOrThrow('192.168.1.1', endpoint)
      // Should NOT be undefined (undefined means no limit configured)
      expect(result).toBeDefined()
    })
  }
})

describe('Fail-closed behavior', () => {
  test('fails closed when Upstash INCR throws', async () => {
    mockIncr.mockRejectedValue(new Error('Connection refused'))
    mockTtl.mockReset()

    const result = await limitHit('test:key', 60, 10)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
    expect(result.ttl).toBe(60)
  })
})
