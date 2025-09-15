// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { randomUUID } from 'crypto'

/** Your public origin (no trailing slash) */
const ORIGIN = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'http://localhost:3000'

/** Very tight CSP. Extend connect-src for your RPCs/analytics if needed. */
const CSP = [
  "default-src 'self'",
  "img-src 'self' data:",
  "style-src 'self' 'unsafe-inline'", // Next injects inline styles
  "script-src 'self'",                // avoid 'unsafe-eval' if possible
  `connect-src 'self' ${new URL(ORIGIN).origin} https://eth.llamarpc.com https://polygon-rpc.com https://arb1.arbitrum.io https://mainnet.optimism.io https://mainnet.base.org`,
  "font-src 'self' data:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
].join('; ')

const RATE_LIMIT_PATHS = new Map<string, { windowSec: number; max: number }>([
  ['/api/scan', { windowSec: 60, max: 12 }],
  ['/api/coinbase/create-charge', { windowSec: 60, max: 10 }],
  ['/api/create-checkout-session', { windowSec: 60, max: 10 }],
  ['/api/share/create', { windowSec: 60, max: 20 }],
])

// naive in-memory fallback (dev); production should use Redis (see §16.3)
const memoryBucket = new Map<string, { reset: number; count: number }>()

export async function middleware(req: NextRequest) {
  // 1) Request ID
  const requestId = req.headers.get('x-request-id') || randomUUID()

  // 2) Simple per-IP rate limit on selected paths (dev fallback)
  let res: NextResponse | null = null
  for (const [prefix, cfg] of RATE_LIMIT_PATHS) {
    if (req.nextUrl.pathname.startsWith(prefix)) {
      const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
      const key = `${prefix}:${ip}`
      const now = Date.now()
      const rec = memoryBucket.get(key) || { reset: now + cfg.windowSec * 1000, count: 0 }
      if (now > rec.reset) { rec.count = 0; rec.reset = now + cfg.windowSec * 1000 }
      rec.count++
      memoryBucket.set(key, rec)
      if (rec.count > cfg.max) {
        res = NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
        res.headers.set('x-request-id', requestId)
        res.headers.set('retry-after', Math.ceil((rec.reset - now)/1000).toString())
      } else {
        res = NextResponse.next()
        res.headers.set('x-request-id', requestId)
        res.headers.set('x-ratelimit-limit', String(cfg.max))
        res.headers.set('x-ratelimit-remaining', String(Math.max(0, cfg.max - rec.count)))
      }
      break
    }
  }
  if (!res) {
    res = NextResponse.next()
    res.headers.set('x-request-id', requestId)
  }

  // 3) Security headers (always)
  res.headers.set('content-security-policy', CSP)
  res.headers.set('referrer-policy', 'strict-origin-when-cross-origin')
  res.headers.set('x-content-type-options', 'nosniff')
  res.headers.set('x-frame-options', 'DENY')
  res.headers.set('permissions-policy', 'camera=(), microphone=(), geolocation=()')
  res.headers.set('strict-transport-security', 'max-age=31536000; includeSubDomains; preload') // HTTPS only

  // 4) CORS (tight default; relax only if you truly need cross-origin)
  // Allow same-origin and your public site; block others for write routes.
  const origin = req.headers.get('origin') || ''
  const isSame = origin === ORIGIN
  if (req.method === 'OPTIONS') {
    const pre = NextResponse.json({}, { status: 204 })
    pre.headers.set('access-control-allow-methods', 'GET,POST,DELETE,PUT,OPTIONS')
    pre.headers.set('access-control-allow-headers', 'content-type, stripe-signature, x-cc-webhook-signature')
    pre.headers.set('access-control-allow-origin', isSame ? ORIGIN : 'null')
    pre.headers.set('vary', 'origin')
    pre.headers.set('x-request-id', requestId)
    return pre
  } else if (origin) {
    res.headers.set('access-control-allow-origin', isSame ? ORIGIN : 'null')
    res.headers.set('vary', 'origin')
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
