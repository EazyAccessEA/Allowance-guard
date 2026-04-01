/**
 * @jest-environment node
 */

const mockCookies = {
  get: jest.fn(),
  set: jest.fn(),
}

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => Promise.resolve(mockCookies)),
}))

jest.mock('crypto', () => ({
  randomBytes: jest.fn(() => ({
    toString: jest.fn(() => 'a'.repeat(64)),
  })),
}))

import { generateCsrfToken, getCsrfToken, validateCsrf } from '@/middleware/csrf'

describe('CSRF middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('generateCsrfToken', () => {
    it('generates a 64-char hex token', async () => {
      const token = await generateCsrfToken()

      expect(token).toHaveLength(64)
      expect(typeof token).toBe('string')
    })

    it('sets cookie with correct options', async () => {
      await generateCsrfToken()

      expect(mockCookies.set).toHaveBeenCalledWith(
        'ag_csrf',
        expect.any(String),
        expect.objectContaining({
          httpOnly: false,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        }),
      )
    })
  })

  describe('getCsrfToken', () => {
    it('returns existing token if cookie exists', async () => {
      mockCookies.get.mockReturnValue({ value: 'existing-token-abc' })

      const token = await getCsrfToken()

      expect(token).toBe('existing-token-abc')
      expect(mockCookies.set).not.toHaveBeenCalled()
    })

    it('generates new token if no cookie', async () => {
      mockCookies.get.mockReturnValue(undefined)

      const token = await getCsrfToken()

      expect(token).toHaveLength(64)
      expect(mockCookies.set).toHaveBeenCalled()
    })
  })

  describe('validateCsrf', () => {
    it('returns null for GET requests', async () => {
      const result = await validateCsrf('GET', '/api/data', new Headers())
      expect(result).toBeNull()
    })

    it('returns null for HEAD requests', async () => {
      const result = await validateCsrf('HEAD', '/api/data', new Headers())
      expect(result).toBeNull()
    })

    it.each([
      '/api/v1/scan',
      '/api/stripe/webhook',
      '/api/coinbase/webhook',
      '/api/jobs/process',
      '/api/monitor/cron',
      '/api/healthz',
      '/api/alerts/daily',
    ])('returns null for exempt path %s', async (path) => {
      const result = await validateCsrf('POST', path, new Headers())
      expect(result).toBeNull()
    })

    it('returns null when no session cookie (ag_sess)', async () => {
      mockCookies.get.mockImplementation((name: string) => {
        if (name === 'ag_sess') return undefined
        return undefined
      })

      const result = await validateCsrf('POST', '/api/settings', new Headers())
      expect(result).toBeNull()
    })

    it('returns 403 when CSRF cookie missing on POST', async () => {
      mockCookies.get.mockImplementation((name: string) => {
        if (name === 'ag_sess') return { value: 'session-123' }
        if (name === 'ag_csrf') return undefined
        return undefined
      })

      const headers = new Headers({ 'x-csrf-token': 'some-token' })
      const result = await validateCsrf('POST', '/api/settings', headers)

      expect(result).not.toBeNull()
      const body = await result!.json()
      expect(result!.status).toBe(403)
      expect(body.error).toBe('Invalid CSRF token')
    })

    it('returns 403 when CSRF header missing on POST', async () => {
      mockCookies.get.mockImplementation((name: string) => {
        if (name === 'ag_sess') return { value: 'session-123' }
        if (name === 'ag_csrf') return { value: 'csrf-token' }
        return undefined
      })

      const result = await validateCsrf('POST', '/api/settings', new Headers())

      expect(result).not.toBeNull()
      const body = await result!.json()
      expect(result!.status).toBe(403)
      expect(body.error).toBe('Invalid CSRF token')
    })

    it('returns 403 when CSRF cookie and header do not match', async () => {
      mockCookies.get.mockImplementation((name: string) => {
        if (name === 'ag_sess') return { value: 'session-123' }
        if (name === 'ag_csrf') return { value: 'cookie-token' }
        return undefined
      })

      const headers = new Headers({ 'x-csrf-token': 'different-header-token' })
      const result = await validateCsrf('POST', '/api/settings', headers)

      expect(result).not.toBeNull()
      const body = await result!.json()
      expect(result!.status).toBe(403)
      expect(body.error).toBe('Invalid CSRF token')
    })

    it('returns null when CSRF cookie matches header', async () => {
      const token = 'matching-csrf-token'
      mockCookies.get.mockImplementation((name: string) => {
        if (name === 'ag_sess') return { value: 'session-123' }
        if (name === 'ag_csrf') return { value: token }
        return undefined
      })

      const headers = new Headers({ 'x-csrf-token': token })
      const result = await validateCsrf('POST', '/api/settings', headers)

      expect(result).toBeNull()
    })
  })
})
