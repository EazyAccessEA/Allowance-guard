const mockQuery = jest.fn()

jest.mock('@/lib/db', () => ({
  pool: { query: (...args: unknown[]) => mockQuery(...args) },
}))

import { auditUser } from '@/lib/audit'

describe('auditUser', () => {
  beforeEach(() => {
    mockQuery.mockReset()
    mockQuery.mockResolvedValue(undefined)
  })

  it('inserts audit log with correct parameters', async () => {
    await auditUser('login', 'user-123', 'session', { browser: 'chrome' }, '1.2.3.4', '/api/auth')

    expect(mockQuery).toHaveBeenCalledTimes(1)
    const [sql, params] = mockQuery.mock.calls[0]
    expect(sql).toContain('INSERT INTO audit_logs')
    expect(sql).toContain("'user'")
    // meta is JSON.stringified before hitting the DB (src/lib/audit.ts)
    expect(params).toEqual(['user-123', 'login', 'session', JSON.stringify({ browser: 'chrome' }), '1.2.3.4', '/api/auth'])
  })

  it('converts numeric actorId to string', async () => {
    await auditUser('update', 42, 'profile')

    const [, params] = mockQuery.mock.calls[0]
    expect(params[0]).toBe('42')
  })

  it('passes null actorId as null', async () => {
    await auditUser('anonymous_action', null, 'page')

    const [, params] = mockQuery.mock.calls[0]
    expect(params[0]).toBeNull()
  })

  it('handles missing ip and path (undefined -> null)', async () => {
    await auditUser('action', 'user-1', 'subject')

    const [, params] = mockQuery.mock.calls[0]
    expect(params[4]).toBeNull() // ip
    expect(params[5]).toBeNull() // path
  })

  it('passes meta as a JSON string', async () => {
    const meta = { key: 'value', nested: { a: 1 } }
    await auditUser('action', 'user-1', 'subject', meta)

    const [, params] = mockQuery.mock.calls[0]
    expect(params[3]).toBe(JSON.stringify(meta))
  })

  it("uses 'user' as actor_type always", async () => {
    await auditUser('any_action', 'actor', 'subject')

    const [sql] = mockQuery.mock.calls[0]
    expect(sql).toContain("'user'")
    expect(sql).toContain('actor_type')
  })

  it('defaults meta to empty object (JSON-stringified)', async () => {
    await auditUser('action', 'user-1', 'subject')

    const [, params] = mockQuery.mock.calls[0]
    expect(params[3]).toEqual(JSON.stringify({}))
  })
})
