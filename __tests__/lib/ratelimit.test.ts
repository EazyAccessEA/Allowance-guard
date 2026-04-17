/**
 * Unit tests for src/lib/ratelimit.ts
 *
 * Covers: limitHit, limitOrThrow, RATE_LIMITS coverage,
 *   Upstash configured + reachable,
 *   Upstash configured but unreachable (fail-closed),
 *   Upstash unconfigured (fail-open — intentional per-env opt-in).
 *
 * UPSTASH_REDIS_REST_URL / TOKEN are set before any import because the
 * Upstash factory at src/lib/upstash.ts evaluates its configured flag at
 * first call and caches the client.
 */

// Mark this file as a module so top-level const declarations don't
// collide with the identically-named mocks in security/rate-limit.test.ts
// (without this, TypeScript treats both files as scripts sharing one
// global scope and flags `mockIncr`/`mockExpire`/`mockTtl` as
// redeclarations).
export {}

process.env.UPSTASH_REDIS_REST_URL = 'https://fake.upstash.io'
process.env.UPSTASH_REDIS_REST_TOKEN = 'fake-token'

// ---------------------------------------------------------------------------
// Mocks — must be declared before imports
// ---------------------------------------------------------------------------

const mockIncr = jest.fn()
const mockExpire = jest.fn()
const mockTtl = jest.fn()
const mockPing = jest.fn()

jest.mock('@upstash/redis', () => ({
  Redis: jest.fn().mockImplementation(() => ({
    incr: mockIncr,
    expire: mockExpire,
    ttl: mockTtl,
    ping: mockPing,
  })),
}))

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ratelimit', () => {
  // -----------------------------------------------------------------------
  // Tests where Upstash is configured and reachable
  // -----------------------------------------------------------------------

  describe('with Upstash ready', () => {
    let limitHit: typeof import('@/lib/ratelimit').limitHit
    let limitOrThrow: typeof import('@/lib/ratelimit').limitOrThrow

    beforeAll(async () => {
      const mod = await import('@/lib/ratelimit')
      limitHit = mod.limitHit
      limitOrThrow = mod.limitOrThrow
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

    it('normalises ttl of -1 (no TTL set) to the window size', async () => {
      // Upstash returns -1 when a key has no TTL. Callers rely on a positive
      // ttl for retry-after headers, so we normalise.
      mockIncr.mockResolvedValue(3)
      mockTtl.mockResolvedValue(-1)

      const result = await limitHit('no-ttl-key', 60, 10)
      expect(result.ttl).toBe(60)
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
  // Tests where Upstash is configured but unreachable (fail-closed)
  // -----------------------------------------------------------------------

  describe('with Upstash unreachable (fail-closed)', () => {
    it('returns allowed: false when INCR throws', async () => {
      let limitHitFresh: typeof import('@/lib/ratelimit').limitHit

      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const mod = require('@/lib/ratelimit')
        limitHitFresh = mod.limitHit
      })

      mockIncr.mockRejectedValue(new Error('ECONNREFUSED'))
      mockTtl.mockReset()

      const result = await limitHitFresh!('key', 60, 10)
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
      expect(result.ttl).toBe(60)
    })
  })

  // -----------------------------------------------------------------------
  // Tests where Upstash is NOT configured (fail-open — per-env opt-in)
  // -----------------------------------------------------------------------

  describe('with Upstash unconfigured (fail-open)', () => {
    it('returns allowed: true without contacting Upstash', async () => {
      const prevUrl = process.env.UPSTASH_REDIS_REST_URL
      const prevToken = process.env.UPSTASH_REDIS_REST_TOKEN
      delete process.env.UPSTASH_REDIS_REST_URL
      delete process.env.UPSTASH_REDIS_REST_TOKEN

      let limitHitFresh: typeof import('@/lib/ratelimit').limitHit
      mockIncr.mockClear()
      mockExpire.mockClear()

      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const mod = require('@/lib/ratelimit')
        limitHitFresh = mod.limitHit
      })

      const result = await limitHitFresh!('unconfigured-key', 60, 10)

      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(10)
      expect(result.ttl).toBe(60)
      // Crucially, we never contacted Upstash.
      expect(mockIncr).not.toHaveBeenCalled()
      expect(mockExpire).not.toHaveBeenCalled()

      // Restore for any subsequent tests that might import the module fresh.
      if (prevUrl !== undefined) process.env.UPSTASH_REDIS_REST_URL = prevUrl
      if (prevToken !== undefined) process.env.UPSTASH_REDIS_REST_TOKEN = prevToken
    })
  })
})
