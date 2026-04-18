// These tests target the PostgreSQL fallback path of the cache layer
// (initCache / cacheSet-via-INSERT / cacheGet-via-SELECT / cleanupCache).
// The global Upstash mock in test/setup.ts would otherwise intercept
// every call before PG ever runs. Clearing the env vars before the
// module loads flips src/lib/upstash.ts into the "not configured"
// branch, and each cache.ts operation falls straight through to PG —
// exactly what these assertions exercise.
delete process.env.UPSTASH_REDIS_REST_URL
delete process.env.UPSTASH_REDIS_REST_TOKEN

const mockQuery = jest.fn()

jest.mock('@/lib/db', () => ({
  pool: { query: (...args: unknown[]) => mockQuery(...args) },
}))

import { initCache, cacheSet, cacheGet, cacheDel, cleanupCache, cacheHealthCheck } from '@/lib/cache'
import { __resetUpstashForTests } from '@/lib/upstash'

// Reset the cached Upstash singleton once the env has been stripped
// so subsequent getUpstash() calls return null.
__resetUpstashForTests()

describe('cache', () => {
  beforeEach(() => {
    mockQuery.mockReset()
    mockQuery.mockResolvedValue({ rows: [] })
  })

  describe('initCache', () => {
    it('creates table and index', async () => {
      await initCache()

      expect(mockQuery).toHaveBeenCalledTimes(2)
      expect(mockQuery.mock.calls[0][0]).toContain('CREATE TABLE IF NOT EXISTS cache')
      expect(mockQuery.mock.calls[1][0]).toContain('CREATE INDEX IF NOT EXISTS idx_cache_expires_at')
    })
  })

  describe('cacheSet', () => {
    it('serializes value to JSON and stores with calculated expiry', async () => {
      const before = Date.now()
      await cacheSet('my-key', { foo: 'bar' }, 120)
      const after = Date.now()

      expect(mockQuery).toHaveBeenCalledTimes(1)
      const [sql, params] = mockQuery.mock.calls[0]
      expect(sql).toContain('INSERT INTO cache')
      expect(sql).toContain('ON CONFLICT (key)')
      expect(params[0]).toBe('my-key')
      expect(params[1]).toBe('{"foo":"bar"}')
      const expiry = (params[2] as Date).getTime()
      expect(expiry).toBeGreaterThanOrEqual(before + 120 * 1000)
      expect(expiry).toBeLessThanOrEqual(after + 120 * 1000)
    })

    it('defaults to 3600s TTL', async () => {
      const before = Date.now()
      await cacheSet('key', 'value')
      const after = Date.now()

      const [, params] = mockQuery.mock.calls[0]
      const expiry = (params[2] as Date).getTime()
      expect(expiry).toBeGreaterThanOrEqual(before + 3600 * 1000)
      expect(expiry).toBeLessThanOrEqual(after + 3600 * 1000)
    })
  })

  describe('cacheGet', () => {
    it('returns parsed JSON on cache hit', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ value: '{"count":5}' }] })

      const result = await cacheGet<{ count: number }>('key')

      expect(result).toEqual({ count: 5 })
      const [sql, params] = mockQuery.mock.calls[0]
      expect(sql).toContain('expires_at > NOW()')
      expect(params).toEqual(['key'])
    })

    it('returns null for expired entries (DB returns 0 rows)', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] })

      const result = await cacheGet('expired-key')

      expect(result).toBeNull()
    })

    it('returns null on JSON parse error', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ value: '{invalid json' }] })

      const result = await cacheGet('bad-json-key')

      expect(result).toBeNull()
    })
  })

  describe('cacheDel', () => {
    it('uses = comparison for exact key', async () => {
      await cacheDel('exact-key')

      const [sql, params] = mockQuery.mock.calls[0]
      expect(sql).toContain('key = $1')
      expect(sql).not.toContain('LIKE')
      expect(params).toEqual(['exact-key'])
    })

    it('converts wildcard * to LIKE with %', async () => {
      await cacheDel('prefix:*')

      const [sql, params] = mockQuery.mock.calls[0]
      expect(sql).toContain('LIKE')
      expect(params).toEqual(['prefix:%'])
    })
  })

  describe('cleanupCache', () => {
    it('deletes expired entries', async () => {
      await cleanupCache()

      expect(mockQuery).toHaveBeenCalledTimes(1)
      expect(mockQuery.mock.calls[0][0]).toContain('DELETE FROM cache WHERE expires_at <= NOW()')
    })
  })

  describe('cacheHealthCheck (DB fallback path)', () => {
    it('returns ok: true via the database backend on success', async () => {
      // initCache (CREATE TABLE, CREATE INDEX), cacheSet (INSERT),
      // cacheGet (SELECT returning the written row).
      mockQuery
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ value: JSON.stringify({ timestamp: Date.now() }) }] })

      const result = await cacheHealthCheck()
      expect(result).toEqual({ ok: true, message: 'ok', backend: 'database' })
    })

    it('returns ok: false with message when the database path throws', async () => {
      mockQuery.mockRejectedValueOnce(new Error('Connection refused'))
      const result = await cacheHealthCheck()
      expect(result).toEqual({ ok: false, message: 'Connection refused', backend: 'database' })
    })
  })
})
