/**
 * CSRF Protection Tests
 *
 * Verify that state-changing requests require valid CSRF tokens,
 * exempt paths are skipped, and GET requests are not checked.
 */

const mockCookies = { get: jest.fn(), set: jest.fn() }

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => Promise.resolve(mockCookies)),
}))

import { validateCsrf } from '@/middleware/csrf'

beforeEach(() => {
  jest.clearAllMocks()
})

function makeHeaders(obj: Record<string, string> = {}): Headers {
  const h = new Headers()
  for (const [k, v] of Object.entries(obj)) h.set(k, v)
  return h
}

describe('CSRF Protection', () => {
  test('POST with matching CSRF cookie and header is allowed', async () => {
    const token = 'abc123secure'
    mockCookies.get.mockImplementation((name: string) => {
      if (name === 'ag_sess') return { value: 'session-token' }
      if (name === 'ag_csrf') return { value: token }
      return undefined
    })
    const headers = makeHeaders({ 'x-csrf-token': token })
    const result = await validateCsrf('POST', '/api/preferences', headers)
    expect(result).toBeNull()
  })

  test('POST without CSRF header returns 403', async () => {
    mockCookies.get.mockImplementation((name: string) => {
      if (name === 'ag_sess') return { value: 'session-token' }
      if (name === 'ag_csrf') return { value: 'valid-token' }
      return undefined
    })
    const headers = makeHeaders({})
    const result = await validateCsrf('POST', '/api/preferences', headers)
    expect(result).not.toBeNull()
    expect(result!.status).toBe(403)
  })

  test('POST with mismatched CSRF token returns 403', async () => {
    mockCookies.get.mockImplementation((name: string) => {
      if (name === 'ag_sess') return { value: 'session-token' }
      if (name === 'ag_csrf') return { value: 'correct-token' }
      return undefined
    })
    const headers = makeHeaders({ 'x-csrf-token': 'wrong-token' })
    const result = await validateCsrf('POST', '/api/preferences', headers)
    expect(result).not.toBeNull()
    expect(result!.status).toBe(403)
  })

  test('POST without session cookie skips CSRF (will fail auth anyway)', async () => {
    mockCookies.get.mockImplementation(() => undefined)
    const headers = makeHeaders({})
    const result = await validateCsrf('POST', '/api/preferences', headers)
    expect(result).toBeNull()
  })

  test('GET request skips CSRF validation', async () => {
    mockCookies.get.mockImplementation((name: string) => {
      if (name === 'ag_sess') return { value: 'session-token' }
      return undefined
    })
    const headers = makeHeaders({})
    const result = await validateCsrf('GET', '/api/preferences', headers)
    expect(result).toBeNull()
  })

  describe('Exempt paths skip CSRF validation', () => {
    const exemptPaths = [
      '/api/v1/test',
      '/api/stripe/webhook',
      '/api/coinbase/webhook',
      '/api/jobs/process',
      '/api/monitor/cron',
    ]

    for (const path of exemptPaths) {
      test(`${path} is exempt from CSRF`, async () => {
        mockCookies.get.mockImplementation((name: string) => {
          if (name === 'ag_sess') return { value: 'session-token' }
          return undefined
        })
        // No CSRF token at all, but should still pass because path is exempt
        const headers = makeHeaders({})
        const result = await validateCsrf('POST', path, headers)
        expect(result).toBeNull()
      })
    }
  })

  test('PATCH request requires CSRF token', async () => {
    mockCookies.get.mockImplementation((name: string) => {
      if (name === 'ag_sess') return { value: 'session-token' }
      if (name === 'ag_csrf') return { value: 'valid-token' }
      return undefined
    })
    const headers = makeHeaders({})
    const result = await validateCsrf('PATCH', '/api/teams', headers)
    expect(result).not.toBeNull()
    expect(result!.status).toBe(403)
  })

  test('DELETE request requires CSRF token', async () => {
    mockCookies.get.mockImplementation((name: string) => {
      if (name === 'ag_sess') return { value: 'session-token' }
      if (name === 'ag_csrf') return { value: 'valid-token' }
      return undefined
    })
    const headers = makeHeaders({})
    const result = await validateCsrf('DELETE', '/api/teams/123', headers)
    expect(result).not.toBeNull()
    expect(result!.status).toBe(403)
  })

  test('PUT request requires CSRF token', async () => {
    mockCookies.get.mockImplementation((name: string) => {
      if (name === 'ag_sess') return { value: 'session-token' }
      if (name === 'ag_csrf') return { value: 'valid-token' }
      return undefined
    })
    const headers = makeHeaders({})
    const result = await validateCsrf('PUT', '/api/teams', headers)
    expect(result).not.toBeNull()
    expect(result!.status).toBe(403)
  })
})
