/**
 * Unit tests for src/lib/api-keys.ts
 *
 * Tests: generateApiKey, validateApiKey, listApiKeys, revokeApiKey,
 *        recordApiUsage, checkApiKeyRateLimit
 */

jest.mock('@/lib/db', () => ({
  pool: { query: jest.fn() },
}))

jest.mock('@/lib/logger', () => ({
  apiLogger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

jest.mock('@/lib/plans', () => ({
  API_PLAN_LIMITS: {
    api_free: { callsPerDay: 100, burstPerMinute: 10 },
    api_developer: { callsPerDay: 10_000, burstPerMinute: 60 },
    api_growth: { callsPerDay: 100_000, burstPerMinute: 300 },
    api_enterprise: { callsPerDay: -1, burstPerMinute: -1 },
  },
}))

import { createHash } from 'crypto'
import { pool } from '@/lib/db'
import { apiLogger } from '@/lib/logger'
import {
  generateApiKey,
  validateApiKey,
  listApiKeys,
  revokeApiKey,
  recordApiUsage,
  checkApiKeyRateLimit,
} from '@/lib/api-keys'

const mockQuery = pool.query as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

// ---------------------------------------------------------------------------
// generateApiKey
// ---------------------------------------------------------------------------

describe('generateApiKey', () => {
  it('returns a key that starts with ag_live_ and is 72 chars long', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'key-uuid-1' }] })

    const result = await generateApiKey(1, 'My Key')

    expect(result.key).toMatch(/^ag_live_/)
    // 8 prefix chars + 64 hex chars = 72
    expect(result.key).toHaveLength(72)
  })

  it('stores the SHA-256 hash in the DB, not the plaintext key', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'key-uuid-2' }] })

    const result = await generateApiKey(1, 'My Key')
    const expectedHash = createHash('sha256').update(result.key).digest('hex')

    expect(mockQuery).toHaveBeenCalledTimes(1)
    const [sql, params] = mockQuery.mock.calls[0]
    expect(sql).toContain('INSERT INTO api_keys')
    // params[1] is the key_hash
    expect(params[1]).toBe(expectedHash)
    // Plaintext key must NOT appear in any param
    expect(params).not.toContain(result.key)
  })

  it('returns prefix as first 16 characters of the key', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'key-uuid-3' }] })

    const result = await generateApiKey(1, 'My Key')

    expect(result.prefix).toBe(result.key.slice(0, 16))
    expect(result.prefix).toMatch(/^ag_live_[a-f0-9]{8}$/)
  })

  it('uses the default api_free plan when none specified', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'key-uuid-4' }] })

    await generateApiKey(1, 'My Key')

    const params = mockQuery.mock.calls[0][1]
    // params[4] = plan, params[5] = rateLimit (from api_free = 100)
    expect(params[4]).toBe('api_free')
    expect(params[5]).toBe(100)
  })
})

// ---------------------------------------------------------------------------
// validateApiKey
// ---------------------------------------------------------------------------

describe('validateApiKey', () => {
  it('returns null for a key without ag_live_ prefix', async () => {
    const result = await validateApiKey('bad_prefix_abc123')

    expect(result).toBeNull()
    expect(mockQuery).not.toHaveBeenCalled()
  })

  it('returns null when DB returns no matching rows (revoked/expired)', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] })

    const result = await validateApiKey('ag_live_' + 'a'.repeat(64))

    expect(result).toBeNull()
  })

  it('returns ValidatedKey when DB returns a matching row', async () => {
    const dbRow = {
      id: 'key-uuid-5',
      user_id: 42,
      plan: 'api_developer',
      rate_limit: 10_000,
      prefix: 'ag_live_aaaaaaaa',
      name: 'Test Key',
    }
    mockQuery
      .mockResolvedValueOnce({ rows: [dbRow] }) // SELECT
      .mockResolvedValueOnce({}) // UPDATE last_used_at

    const result = await validateApiKey('ag_live_' + 'a'.repeat(64))

    expect(result).toEqual({
      id: 'key-uuid-5',
      userId: 42,
      plan: 'api_developer',
      rateLimit: 10_000,
      prefix: 'ag_live_aaaaaaaa',
      name: 'Test Key',
      // key_type + allowed_origins added when public keys (ag_pub_*) were
      // introduced; default secret-key rows carry 'secret' + null.
      keyType: 'secret',
      allowedOrigins: null,
    })
  })

  it('fires an UPDATE for last_used_at (fire-and-forget)', async () => {
    const dbRow = {
      id: 'key-uuid-6',
      user_id: 1,
      plan: 'api_free',
      rate_limit: 100,
      prefix: 'ag_live_bbbbbbbb',
      name: 'Key',
    }
    mockQuery
      .mockResolvedValueOnce({ rows: [dbRow] })
      .mockResolvedValueOnce({})

    await validateApiKey('ag_live_' + 'b'.repeat(64))

    // Second call should be the UPDATE last_used_at
    expect(mockQuery).toHaveBeenCalledTimes(2)
    expect(mockQuery.mock.calls[1][0]).toContain('UPDATE api_keys SET last_used_at')
    expect(mockQuery.mock.calls[1][1]).toEqual(['key-uuid-6'])
  })
})

// ---------------------------------------------------------------------------
// listApiKeys
// ---------------------------------------------------------------------------

describe('listApiKeys', () => {
  it('returns mapped array of ApiKeyInfo', async () => {
    const now = new Date('2026-01-15T12:00:00Z')
    const dbRows = [
      {
        id: 'k1',
        prefix: 'ag_live_aaaaaaaa',
        name: 'Key One',
        plan: 'api_free',
        rate_limit: 100,
        last_used_at: now,
        created_at: now,
      },
      {
        id: 'k2',
        prefix: 'ag_live_bbbbbbbb',
        name: 'Key Two',
        plan: 'api_developer',
        rate_limit: 10_000,
        last_used_at: null,
        created_at: now,
      },
    ]
    mockQuery.mockResolvedValueOnce({ rows: dbRows })

    const result = await listApiKeys(1)

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      id: 'k1',
      prefix: 'ag_live_aaaaaaaa',
      name: 'Key One',
      plan: 'api_free',
      rateLimit: 100,
      lastUsedAt: now.toISOString(),
      createdAt: now.toISOString(),
      // Public-key fields surface on every row post-ag_pub_ rollout.
      keyType: 'secret',
      allowedOrigins: null,
    })
    expect(result[1].lastUsedAt).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// revokeApiKey
// ---------------------------------------------------------------------------

describe('revokeApiKey', () => {
  it('returns true when rowCount > 0', async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 1 })

    const result = await revokeApiKey(1, 'key-uuid-10')

    expect(result).toBe(true)
    expect(apiLogger.info).toHaveBeenCalledWith('api_key.revoked', {
      userId: 1,
      keyId: 'key-uuid-10',
    })
  })

  it('returns false when rowCount is 0', async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 0 })

    const result = await revokeApiKey(1, 'nonexistent')

    expect(result).toBe(false)
    expect(apiLogger.info).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// recordApiUsage
// ---------------------------------------------------------------------------

describe('recordApiUsage', () => {
  it('inserts a usage record', async () => {
    mockQuery.mockResolvedValueOnce({})

    await recordApiUsage('key-1', 1, '/api/v1/scan', 'GET', 200, 150)

    expect(mockQuery).toHaveBeenCalledTimes(1)
    const [sql, params] = mockQuery.mock.calls[0]
    expect(sql).toContain('INSERT INTO usage_records')
    expect(params).toEqual([1, 'key-1', '/api/v1/scan', 'GET', 200, 150])
  })

  it('swallows DB errors without throwing', async () => {
    mockQuery.mockRejectedValueOnce(new Error('DB connection lost'))

    // Should not throw
    await expect(recordApiUsage('key-1', 1, '/api/v1/scan', 'GET', 500)).resolves.toBeUndefined()
  })
})

// ---------------------------------------------------------------------------
// checkApiKeyRateLimit
// ---------------------------------------------------------------------------

describe('checkApiKeyRateLimit', () => {
  it('returns allowed: true when limit is -1 (unlimited)', async () => {
    const result = await checkApiKeyRateLimit('key-1', -1)

    expect(result).toEqual({ allowed: true, used: 0 })
    expect(mockQuery).not.toHaveBeenCalled()
  })

  it('returns allowed: true when used < limit', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ count: 50 }] })

    const result = await checkApiKeyRateLimit('key-1', 100)

    expect(result).toEqual({ allowed: true, used: 50 })
  })

  it('returns allowed: false when used >= limit', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ count: 100 }] })

    const result = await checkApiKeyRateLimit('key-1', 100)

    expect(result).toEqual({ allowed: false, used: 100 })
  })
})
