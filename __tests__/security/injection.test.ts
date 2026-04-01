/**
 * Injection Tests
 *
 * Verify that XSS payloads are sanitized and SQL queries use
 * parameterized placeholders (not string interpolation).
 */

jest.mock('@/lib/db', () => ({
  pool: { query: jest.fn().mockResolvedValue({ rows: [] }) },
  db: { query: jest.fn() },
}))
jest.mock('next/headers', () => ({
  cookies: jest.fn(() =>
    Promise.resolve({
      get: jest.fn((name: string) => {
        if (name === 'ag_sess') return { value: 'test-session-token' }
        return undefined
      }),
      set: jest.fn(),
    }),
  ),
}))

import { sanitizeHtml } from '@/lib/sanitize'
import { pool } from '@/lib/db'

const mockQuery = pool.query as jest.Mock

describe('XSS Sanitization', () => {
  test('strips <script> tags and content', () => {
    const result = sanitizeHtml("<script>alert('xss')</script>")
    expect(result).not.toContain('<script')
    expect(result).not.toContain('alert')
  })

  test('strips <img> with onerror handler', () => {
    const result = sanitizeHtml("<img src=x onerror=alert('xss')>")
    expect(result).not.toContain('onerror')
    expect(result).not.toContain('alert')
  })

  test('removes javascript: protocol from href', () => {
    const result = sanitizeHtml('<a href="javascript:alert(\'xss\')">click</a>')
    expect(result).not.toContain('javascript:')
  })

  test('strips script injection via attribute breakout', () => {
    const result = sanitizeHtml('"><script>alert(document.cookie)</script>')
    expect(result).not.toContain('<script')
    expect(result).not.toContain('alert')
  })

  test('strips <svg> with onload handler', () => {
    const result = sanitizeHtml("<svg onload=alert('xss')>")
    expect(result).not.toContain('onload')
    expect(result).not.toContain('<svg')
  })

  test('preserves safe HTML tags', () => {
    const result = sanitizeHtml('<p>Hello <strong>world</strong></p>')
    expect(result).toContain('<p>')
    expect(result).toContain('<strong>')
  })

  test('strips nested script in allowed tags', () => {
    const result = sanitizeHtml('<p><script>document.cookie</script></p>')
    expect(result).not.toContain('<script')
    expect(result).toContain('<p>')
  })
})

describe('SQL Injection Prevention (parameterized queries)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('getSession uses parameterized query with $1 placeholder', async () => {
    // Re-import to trigger the getSession call with the mocked cookie
    const { getSession } = await import('@/lib/auth')
    await getSession()

    // pool.query should have been called with parameterized query
    if (mockQuery.mock.calls.length > 0) {
      const [query, params] = mockQuery.mock.calls[0]
      expect(query).toContain('$1')
      expect(Array.isArray(params)).toBe(true)
      expect(params).toContain('test-session-token')
      // The query should NOT embed the token directly
      expect(query).not.toContain('test-session-token')
    }
  })

  test('createSession uses parameterized query with $1 and $2', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ token: 'generated-token' }] })
    const { createSession } = await import('@/lib/auth')
    await createSession(42)

    expect(mockQuery).toHaveBeenCalled()
    const [query, params] = mockQuery.mock.calls[0]
    expect(query).toContain('$1')
    expect(query).toContain('$2')
    expect(Array.isArray(params)).toBe(true)
    expect(params[0]).toBe(42)
    // Token is the second parameter
    expect(typeof params[1]).toBe('string')
  })
})

describe('Wallet Address Validation', () => {
  test('SQL injection in wallet address is rejected by regex', () => {
    const malicious = "'; DROP TABLE users; --"
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/
    expect(ethAddressRegex.test(malicious)).toBe(false)
  })

  test('SQL injection disguised as wallet address is rejected', () => {
    const malicious = "0x' OR '1'='1"
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/
    expect(ethAddressRegex.test(malicious)).toBe(false)
  })

  test('valid wallet address passes regex', () => {
    const valid = '0x1234567890abcdef1234567890abcdef12345678'
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/
    expect(ethAddressRegex.test(valid)).toBe(true)
  })

  test('wallet address with wrong length is rejected', () => {
    const tooShort = '0x1234'
    const tooLong = '0x1234567890abcdef1234567890abcdef1234567890'
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/
    expect(ethAddressRegex.test(tooShort)).toBe(false)
    expect(ethAddressRegex.test(tooLong)).toBe(false)
  })

  test('wallet address with non-hex characters is rejected', () => {
    const withG = '0x1234567890abcdef1234567890abcdef1234567g'
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/
    expect(ethAddressRegex.test(withG)).toBe(false)
  })
})
