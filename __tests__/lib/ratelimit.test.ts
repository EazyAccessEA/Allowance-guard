/**
 * Unit tests for src/lib/ratelimit.ts
 *
 * Covers: limitHit, limitOrThrow, RATE_LIMITS coverage,
 *   Redis configured + ready,
 *   Redis configured but unreachable (fail-closed),
 *   Redis unconfigured (fail-open — intentional per-env opt-in).
 *
 * REDIS_URL is set before any import because the module evaluates
 * REDIS_CONFIGURED at load time.
 */

process.env.REDIS_URL = 'redis://localhost:6379'

// ---------------------------------------------------------------------------
// Mocks — must be declared before imports
// ---------------------------------------------------------------------------

const mockIncr = jest.fn()
const mockExpire = jest.fn()
const mockTtl = jest.fn()
const mockConnect = jest.fn()
const mockOn = jest.fn()

jest.mock('redis', () => ({
  createClient: jest.fn(() => ({
    connect: mockConnect,
    on: mockOn,
    incr: mockIncr,
    expire: mockExpire,
    ttl: mockTtl,
  })),
}))

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ratelimit', () => {
  // -----------------------------------------------------------------------
  // Tests where Redis is ready (connect resolves before import)
  // -----------------------------------------------------------------------

  describe('with Redis ready', () => {
    let limitHit: typeof import('@/lib/ratelimit').limitHit
    let limitOrThrow: typeof import('@/lib/ratelimit').limitOrThrow

    beforeAll(async () => {
      // Make connect resolve so `ready = true`
      mockConnect.mockResolvedValue(undefined)

      // Import the module — this triggers client.connect().then(() => ready = true)
      const mod = await import('@/lib/ratelimit')
      limitHit = mod.limitHit
      limitOrThrow = mod.limitOrThrow

      // Allow microtask to run (the .then() that sets ready = true)
      await new Promise((r) => setTimeout(r, 10))
    })

    beforeEach(() => {
      mockIncr.mockReset()
      mockExpire.mockReset()
      mockTtl.mockReset()
    })

    // ----- limitHit -----

    it('returns allowed: true when under max', async () => {
      mockIncr.mockResolvedValue(1)
      mockTtl.mockResolvedValue(60)

      const result = await limitHit('test-key', 60, 10)
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(9) // 10 - 1
    })

    it('returns allowed: false when over max', async () => {
      mockIncr.mockResolvedValue(11)
      mockTtl.mockResolvedValue(45)

      const result = await limitHit('test-key', 60, 10)
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
      expect(result.ttl).toBe(45)
    })

    it('sets expire on first request (count === 1)', async () => {
      mockIncr.mockResolvedValue(1)
      mockTtl.mockResolvedValue(60)

      await limitHit('new-key', 60, 10)

      expect(mockExpire).toHaveBeenCalledWith(expect.stringContaining('rl:new-key'), 60)
    })

    it('does not set expire on subsequent requests (count > 1)', async () => {
      mockIncr.mockResolvedValue(5)
      mockTtl.mockResolvedValue(42)

      await limitHit('existing-key', 60, 10)

      expect(mockExpire).not.toHaveBeenCalled()
    })

    it('returns correct remaining count', async () => {
      mockIncr.mockResolvedValue(7)
      mockTtl.mockResolvedValue(30)

      const result = await limitHit('test-key', 60, 10)
      expect(result.remaining).toBe(3) // max(0, 10 - 7)
    })

    it('remaining is 0 when count exceeds max', async () => {
      mockIncr.mockResolvedValue(15)
      mockTtl.mockResolvedValue(20)

      const result = await limitHit('test-key', 60, 10)
      expect(result.remaining).toBe(0) // max(0, 10 - 15) = 0
    })

    // ----- limitOrThrow -----

    it('returns undefined for unknown endpoint (no limit configured)', async () => {
      const result = await limitOrThrow('127.0.0.1', 'nonexistent-endpoint')
      expect(result).toBeUndefined()
      expect(mockIncr).not.toHaveBeenCalled()
    })

    it('throws "Rate limit exceeded" when over limit', async () => {
      mockIncr.mockResolvedValue(11) // over max:10 for coinbase-charge
      mockTtl.mockResolvedValue(50)

      await expect(limitOrThrow('127.0.0.1', 'coinbase-charge')).rejects.toThrow('Rate limit exceeded')
    })

    it('returns result when under limit', async () => {
      mockIncr.mockResolvedValue(3)
      mockTtl.mockResolvedValue(55)

      const result = await limitOrThrow('127.0.0.1', 'scan')
      expect(result).toBeDefined()
      expect(result!.allowed).toBe(true)
    })
  })

  // -----------------------------------------------------------------------
  // Tests where Redis is NOT ready (fail-closed)
  // -----------------------------------------------------------------------

  describe('with Redis unavailable (fail-closed)', () => {
    it('returns allowed: false when Redis connect fails', async () => {
      // Use isolateModules to get a fresh module with connect rejecting
      let limitHitFresh: typeof import('@/lib/ratelimit').limitHit

      jest.isolateModules(() => {
        // Override mockConnect to reject for this isolated import
        mockConnect.mockRejectedValue(new Error('ECONNREFUSED'))

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const mod = require('@/lib/ratelimit')
        limitHitFresh = mod.limitHit
      })

      // Give the .catch() microtask time to run
      await new Promise((r) => setTimeout(r, 10))

      const result = await limitHitFresh!('key', 60, 10)
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
      expect(result.ttl).toBe(60)
    })
  })

  // -----------------------------------------------------------------------
  // Tests where Redis is NOT configured (fail-open — per-env opt-in)
  // -----------------------------------------------------------------------

  describe('with Redis unconfigured (fail-open)', () => {
    it('returns allowed: true without contacting Redis', async () => {
      const prevUrl = process.env.REDIS_URL
      const prevHost = process.env.REDIS_HOST
      delete process.env.REDIS_URL
      delete process.env.REDIS_HOST

      let limitHitFresh: typeof import('@/lib/ratelimit').limitHit
      mockConnect.mockClear()
      mockIncr.mockClear()

      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const mod = require('@/lib/ratelimit')
        limitHitFresh = mod.limitHit
      })

      const result = await limitHitFresh!('unconfigured-key', 60, 10)

      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(10)
      expect(result.ttl).toBe(60)
      // Crucially, we never even tried to connect or hit Redis.
      expect(mockConnect).not.toHaveBeenCalled()
      expect(mockIncr).not.toHaveBeenCalled()

      // Restore for any subsequent tests that might import the module fresh.
      if (prevUrl !== undefined) process.env.REDIS_URL = prevUrl
      if (prevHost !== undefined) process.env.REDIS_HOST = prevHost
    })
  })
})
