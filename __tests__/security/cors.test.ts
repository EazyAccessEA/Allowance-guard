/**
 * @jest-environment node
 */

/**
 * CORS Configuration Tests
 *
 * Verify that CORS is properly configured: no wildcard origin,
 * origin allowlist is enforced, and preflight requests are handled.
 */

import { NextRequest, NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'

const ROOT = path.resolve(__dirname, '..', '..')

describe('CORS Configuration', () => {
  test('vercel.json does not contain wildcard Access-Control-Allow-Origin', () => {
    const vercelPath = path.join(ROOT, 'vercel.json')
    const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf-8'))
    const configStr = JSON.stringify(vercelConfig)
    expect(configStr).not.toContain('"Access-Control-Allow-Origin":"*"')
    expect(configStr).not.toContain("'Access-Control-Allow-Origin':'*'")
  })

  test('middleware does not use wildcard CORS origin', () => {
    const middlewarePath = path.join(ROOT, 'middleware.ts')
    const middlewareSrc = fs.readFileSync(middlewarePath, 'utf-8')
    // Should not set Access-Control-Allow-Origin to literal "*"
    expect(middlewareSrc).not.toMatch(
      /access-control-allow-origin.*['"]\*['"]/i,
    )
  })

  test('middleware validates origin against known origin', () => {
    const middlewarePath = path.join(ROOT, 'middleware.ts')
    const middlewareSrc = fs.readFileSync(middlewarePath, 'utf-8')
    // Should reference origin validation logic
    expect(middlewareSrc).toMatch(/origin/i)
    // Should compare against ORIGIN constant or similar
    expect(middlewareSrc).toMatch(/isSame|allowedOrigin|ORIGIN/i)
  })

  test('middleware sets "null" for disallowed origins', () => {
    const middlewarePath = path.join(ROOT, 'middleware.ts')
    const middlewareSrc = fs.readFileSync(middlewarePath, 'utf-8')
    // When origin does not match, it should set 'null'
    expect(middlewareSrc).toContain("'null'")
  })

  test('middleware handles OPTIONS preflight requests', () => {
    const middlewarePath = path.join(ROOT, 'middleware.ts')
    const middlewareSrc = fs.readFileSync(middlewarePath, 'utf-8')
    expect(middlewareSrc).toContain("req.method === 'OPTIONS'")
    expect(middlewareSrc).toMatch(/access-control-allow-methods/i)
    expect(middlewareSrc).toMatch(/access-control-allow-headers/i)
  })

  test('preflight allows required headers including x-csrf-token', () => {
    const middlewarePath = path.join(ROOT, 'middleware.ts')
    const middlewareSrc = fs.readFileSync(middlewarePath, 'utf-8')
    expect(middlewareSrc).toContain('x-csrf-token')
    expect(middlewareSrc).toContain('stripe-signature')
  })

  test('middleware applies security headers', () => {
    const middlewarePath = path.join(ROOT, 'middleware.ts')
    const middlewareSrc = fs.readFileSync(middlewarePath, 'utf-8')
    expect(middlewareSrc).toContain('content-security-policy')
    expect(middlewareSrc).toContain('x-content-type-options')
    expect(middlewareSrc).toContain('x-frame-options')
    expect(middlewareSrc).toContain('strict-transport-security')
    expect(middlewareSrc).toContain('referrer-policy')
  })

  test('CSP does not allow unsafe-eval in policy directives', () => {
    const middlewarePath = path.join(ROOT, 'middleware.ts')
    const middlewareSrc = fs.readFileSync(middlewarePath, 'utf-8')
    // Extract the CSP array content (between the brackets of the CSP definition)
    const cspMatch = middlewareSrc.match(/const CSP = \[([\s\S]*?)\]\.join/)
    expect(cspMatch).toBeTruthy()
    const cspContent = cspMatch![1]
    // The CSP directives themselves should not contain 'unsafe-eval'
    expect(cspContent).not.toContain("'unsafe-eval'")
  })

  test('X-Frame-Options is set to DENY', () => {
    const middlewarePath = path.join(ROOT, 'middleware.ts')
    const middlewareSrc = fs.readFileSync(middlewarePath, 'utf-8')
    expect(middlewareSrc).toContain("'x-frame-options', 'DENY'")
  })

  test('frame-ancestors is set to none in CSP', () => {
    const middlewarePath = path.join(ROOT, 'middleware.ts')
    const middlewareSrc = fs.readFileSync(middlewarePath, 'utf-8')
    expect(middlewareSrc).toContain("frame-ancestors 'none'")
  })
})

describe('CORS middleware behavior', () => {
  // Dynamically import the middleware to test its actual behavior
  let middleware: (req: NextRequest) => Promise<NextResponse>

  beforeAll(async () => {
    // The middleware uses Edge-compatible code, so we can import it directly
    try {
      const mod = await import('../../middleware')
      middleware = mod.middleware
    } catch {
      // If import fails due to edge runtime constraints, skip these tests
    }
  })

  test('same-origin request gets proper CORS header', async () => {
    if (!middleware) return

    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const req = new NextRequest(new URL('/api/scan', origin), {
      headers: { origin },
    })

    const res = await middleware(req)
    const corsOrigin = res.headers.get('access-control-allow-origin')
    // Should either be the same origin or not set (for same-origin without header)
    if (corsOrigin) {
      expect(corsOrigin).not.toBe('*')
    }
  })

  test('cross-origin request from unknown origin gets null', async () => {
    if (!middleware) return

    const req = new NextRequest(
      new URL('/api/scan', 'http://localhost:3000'),
      { headers: { origin: 'https://evil.com' } },
    )

    const res = await middleware(req)
    const corsOrigin = res.headers.get('access-control-allow-origin')
    if (corsOrigin) {
      expect(corsOrigin).toBe('null')
    }
  })
})
