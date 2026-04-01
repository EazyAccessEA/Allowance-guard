/**
 * Unit tests for src/lib/auth.ts
 *
 * Covers: getSession, requireUser, createSession, setSessionCookie, clearSessionCookie
 */

// ---------------------------------------------------------------------------
// Mocks — must be declared before imports
// ---------------------------------------------------------------------------

const mockCookieStore = {
  get: jest.fn(),
  set: jest.fn(),
}

jest.mock('next/headers', () => ({
  cookies: jest.fn().mockResolvedValue(mockCookieStore),
}))

jest.mock('@/lib/db', () => ({
  pool: { query: jest.fn() },
}))

const mockRandomBytes = jest.fn()
jest.mock('crypto', () => ({
  randomBytes: mockRandomBytes,
}))

// ---------------------------------------------------------------------------
// Imports (after mocks)
// ---------------------------------------------------------------------------

import { getSession, requireUser, createSession, setSessionCookie, clearSessionCookie } from '@/lib/auth'
import { pool } from '@/lib/db'

const mockQuery = pool.query as jest.Mock

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('auth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // -------------------------------------------------------------------------
  // getSession
  // -------------------------------------------------------------------------

  describe('getSession', () => {
    it('returns null when no cookie is present', async () => {
      mockCookieStore.get.mockReturnValue(undefined)

      const result = await getSession()
      expect(result).toBeNull()
      expect(mockQuery).not.toHaveBeenCalled()
    })

    it('returns null when DB returns no rows (expired session)', async () => {
      mockCookieStore.get.mockReturnValue({ value: 'some-token' })
      mockQuery.mockResolvedValue({ rows: [] })

      const result = await getSession()
      expect(result).toBeNull()
    })

    it('returns user data on valid session', async () => {
      const user = { session_id: 1, user_id: 42, email: 'a@b.com', name: 'Alice' }
      mockCookieStore.get.mockReturnValue({ value: 'valid-token' })
      mockQuery.mockResolvedValue({ rows: [user] })

      const result = await getSession()
      expect(result).toEqual(user)
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('JOIN users'),
        ['valid-token'],
      )
    })
  })

  // -------------------------------------------------------------------------
  // requireUser
  // -------------------------------------------------------------------------

  describe('requireUser', () => {
    it('throws UNAUTHENTICATED when no session', async () => {
      mockCookieStore.get.mockReturnValue(undefined)

      await expect(requireUser()).rejects.toThrow('UNAUTHENTICATED')
    })

    it('returns session on valid session', async () => {
      const user = { session_id: 1, user_id: 42, email: 'a@b.com', name: 'Alice' }
      mockCookieStore.get.mockReturnValue({ value: 'valid-token' })
      mockQuery.mockResolvedValue({ rows: [user] })

      const result = await requireUser()
      expect(result).toEqual(user)
    })
  })

  // -------------------------------------------------------------------------
  // createSession
  // -------------------------------------------------------------------------

  describe('createSession', () => {
    it('generates a 64-char hex token and inserts into DB', async () => {
      const fakeBytes = Buffer.alloc(32, 0xab)
      mockRandomBytes.mockReturnValue(fakeBytes)
      const expectedToken = fakeBytes.toString('hex')

      mockQuery.mockResolvedValue({ rows: [{ token: expectedToken }] })

      const token = await createSession(7)

      expect(mockRandomBytes).toHaveBeenCalledWith(32)
      expect(token).toHaveLength(64)
      expect(token).toBe(expectedToken)
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO sessions'),
        [7, expectedToken],
      )
    })

    it('throws if DB insert fails (no rows returned)', async () => {
      mockRandomBytes.mockReturnValue(Buffer.alloc(32, 0))
      mockQuery.mockResolvedValue({ rows: [] })

      await expect(createSession(1)).rejects.toThrow('Failed to create session')
    })
  })

  // -------------------------------------------------------------------------
  // setSessionCookie
  // -------------------------------------------------------------------------

  describe('setSessionCookie', () => {
    it('sets correct cookie options (httpOnly, sameSite, secure, path, maxAge)', async () => {
      await setSessionCookie('tok123')

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'ag_sess',
        'tok123',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        }),
      )
    })
  })

  // -------------------------------------------------------------------------
  // clearSessionCookie
  // -------------------------------------------------------------------------

  describe('clearSessionCookie', () => {
    it('sets maxAge to 0', async () => {
      await clearSessionCookie()

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'ag_sess',
        '',
        expect.objectContaining({ maxAge: 0 }),
      )
    })
  })
})
