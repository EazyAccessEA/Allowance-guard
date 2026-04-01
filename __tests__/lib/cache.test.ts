const mockQuery = jest.fn()

jest.mock('@/lib/db', () => ({
  pool: { query: (...args: unknown[]) => mockQuery(...args) },
}))

import { initCache, cacheSet, cacheGet, cacheDel, cleanupCache, cacheHealthCheck } from '@/lib/cache'

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

  describe('cacheHealthCheck', () => {
    it('returns ok: true on success', async () => {
      // initCache (2 calls) + cacheSet (1 call) + cacheGet (1 call)
      mockQuery
        .mockResolvedValueOnce({ rows: [] }) // CREATE TABLE
        .mockResolvedValueOnce({ rows: [] }) // CREATE INDEX
        .mockResolvedValueOnce({ rows: [] }) // INSERT (cacheSet)
        .mockResolvedValueOnce({ rows: [{ value: JSON.stringify({ timestamp: Date.now() }) }] }) // SELECT (cacheGet)

      const result = await cacheHealthCheck()

      expect(result).toEqual({ ok: true, message: 'ok' })
    })

    it('returns ok: false with message on error', async () => {
      mockQuery.mockRejectedValueOnce(new Error('Connection refused'))

      const result = await cacheHealthCheck()

      expect(result).toEqual({ ok: false, message: 'Connection refused' })
    })
  })
})
