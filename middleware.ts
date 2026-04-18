// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// Use Web Crypto API instead of Node.js crypto for Edge Runtime compatibility
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/** Your public origin (no trailing slash) */
const ORIGIN = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'http://localhost:3000'

/* ── CSRF protection ─────────────────────────────────────────────────── */
const CSRF_COOKIE = 'ag_csrf'
const CSRF_HEADER = 'x-csrf-token'
const STATE_CHANGING_METHODS = new Set(['POST', 'PUT', 'DELETE', 'PATCH'])
const CSRF_EXEMPT_PREFIXES = [
  '/api/v1/',           // B2B API (API key auth)
  '/api/stripe/',       // Stripe webhooks
  '/api/coinbase/',     // Coinbase webhooks
  '/api/jobs/',         // CRON routes
  '/api/monitor/cron',  // CRON route
  '/api/rules/evaluate',// CRON route
  '/api/email/cron',    // CRON route
  '/api/webhooks/process', // CRON route
  '/api/healthz',       // Health check
  '/api/readiness',     // Readiness check
  '/api/alerts/daily',  // Cron-triggered
]

function isCsrfExempt(pathname: string): boolean {
  return CSRF_EXEMPT_PREFIXES.some(prefix => pathname.startsWith(prefix))
}

/**
 * Validate CSRF token on state-changing requests from the browser.
 * Returns a 403 response if invalid, or null if valid/exempt.
 */
function checkCsrf(req: NextRequest): NextResponse | null {
  if (!STATE_CHANGING_METHODS.has(req.method)) return null
  if (isCsrfExempt(req.nextUrl.pathname)) return null

  // Skip if no session cookie — request will fail auth anyway
  const sessionCookie = req.cookies.get('ag_sess')?.value
  if (!sessionCookie) return null

  const csrfCookie = req.cookies.get(CSRF_COOKIE)?.value
  const csrfHeader = req.headers.get(CSRF_HEADER)

  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
  }

  return null
}

/** Sophisticated Bot Detection with User-Agent Analysis */
const BOT_PATTERNS = {
  // Search Engine Bots (High Priority - Never Rate Limit)
  searchEngines: /Googlebot|bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|facebookexternalhit/i,
  
  // Performance Testing Tools
  performanceTools: /Lighthouse|PageSpeedInsights|GTmetrix|WebPageTest|Chrome-Lighthouse/i,
  
  // Social Media Crawlers
  socialCrawlers: /Twitterbot|LinkedInBot|WhatsApp|TelegramBot|SkypeUriPreview/i,
  
  // Monitoring & Analytics
  monitoring: /pingdom|uptimerobot|statuscake|pingbot|monitor/i,
  
  // Development & Testing
  development: /curl|wget|python-requests|postman|insomnia/i
}

/** Intelligent Bot Detection Function */
function isBot(userAgent: string): { isBot: boolean; category: string; priority: 'high' | 'medium' | 'low' } {
  if (!userAgent) return { isBot: false, category: 'unknown', priority: 'low' }
  
  // High priority bots - bypass ALL middleware logic
  if (BOT_PATTERNS.searchEngines.test(userAgent)) {
    return { isBot: true, category: 'search-engine', priority: 'high' }
  }
  
  if (BOT_PATTERNS.performanceTools.test(userAgent)) {
    return { isBot: true, category: 'performance-tool', priority: 'high' }
  }
  
  // Medium priority bots - bypass rate limiting but apply security headers
  if (BOT_PATTERNS.socialCrawlers.test(userAgent)) {
    return { isBot: true, category: 'social-crawler', priority: 'medium' }
  }
  
  if (BOT_PATTERNS.monitoring.test(userAgent)) {
    return { isBot: true, category: 'monitoring', priority: 'medium' }
  }
  
  // Low priority bots - apply minimal middleware
  if (BOT_PATTERNS.development.test(userAgent)) {
    return { isBot: true, category: 'development', priority: 'low' }
  }
  
  return { isBot: false, category: 'human', priority: 'low' }
}

/** Enhanced Error Handling with Graceful Degradation */
function createErrorResponse(message: string, status: number = 500, requestId: string): NextResponse {
  const errorResponse = NextResponse.json(
    { 
      error: message, 
      requestId,
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && { debug: true })
    }, 
    { status }
  )
  
  // Add error tracking headers
  errorResponse.headers.set('x-request-id', requestId)
  errorResponse.headers.set('x-error-type', 'middleware-error')
  
  return errorResponse
}

/** Strict CSP — no unsafe-eval, connect-src restricted to known domains */
const CSP = [
  "default-src 'self'",
  "img-src 'self' data: blob: https:",
  "style-src 'self' 'unsafe-inline'", // Next.js injects inline styles
  "script-src 'self' 'unsafe-inline' https://vercel.live https://js.stripe.com",
  [
    "connect-src 'self'",
    new URL(ORIGIN).origin,
    // RPC endpoints
    'https://eth.llamarpc.com',
    'https://polygon-rpc.com',
    'https://arb1.arbitrum.io',
    'https://mainnet.optimism.io',
    'https://mainnet.base.org',
    'https://api.avax.network',
    // Services
    'https://api.stripe.com',
    'https://*.upstash.io',
    'https://*.neon.tech',
    'https://api.coingecko.com',
    // WalletConnect / Reown
    'https://*.walletconnect.com',
    'wss://*.walletconnect.com',
    'https://*.reown.com',
    'wss://*.reown.com',
  ].join(' '),
  "font-src 'self' data: https://fonts.gstatic.com",
  "frame-ancestors 'none'",
  "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

// Rate limiting is handled by Redis-based src/lib/ratelimit.ts at the route level.
// In-memory rate limiting was removed — it resets on every serverless cold start
// and is unreliable on Vercel's edge/serverless architecture.

/** Enhanced Security Headers with Bot-Specific Optimizations */
function applySecurityHeaders(response: NextResponse, botInfo: ReturnType<typeof isBot>): NextResponse {
  // Core security headers (always applied)
  response.headers.set('content-security-policy', CSP)
  response.headers.set('referrer-policy', 'strict-origin-when-cross-origin')
  response.headers.set('x-content-type-options', 'nosniff')
  response.headers.set('x-frame-options', 'DENY')
  response.headers.set('permissions-policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set('strict-transport-security', 'max-age=31536000; includeSubDomains; preload')
  // Fix Cross-Origin-Opener-Policy for wallet connections
  response.headers.set('cross-origin-opener-policy', 'same-origin-allow-popups')
  
  // Bot-specific optimizations
  if (botInfo.isBot) {
    // Optimize for search engines
    if (botInfo.category === 'search-engine') {
      response.headers.set('x-robots-tag', 'index, follow, max-snippet:-1, max-image-preview:large')
      response.headers.set('cache-control', 'public, max-age=3600, s-maxage=86400')
    }
    
    // Performance tool optimizations
    if (botInfo.category === 'performance-tool') {
      response.headers.set('x-performance-test', 'true')
      response.headers.set('cache-control', 'no-cache, no-store, must-revalidate')
    }
    
    // Add bot identification header
    response.headers.set('x-bot-detected', 'true')
    response.headers.set('x-bot-category', botInfo.category)
    response.headers.set('x-bot-priority', botInfo.priority)
  }
  
  return response
}

/** Enhanced CORS with Bot Awareness */
function applyCORS(response: NextResponse, req: NextRequest, _botInfo: ReturnType<typeof isBot>): NextResponse {
  // /api/v1/* owns its own CORS story — browser-safe public keys need
  // cross-origin access, which the route-level api-auth middleware grants
  // per-key. Do NOT overwrite its headers here.
  if (req.nextUrl.pathname.startsWith('/api/v1/')) {
    if (req.method === 'OPTIONS') {
      // Permissive preflight so the route handler's OPTIONS export can finish.
      const pre = new NextResponse(null, { status: 204 })
      const origin = req.headers.get('origin') ?? '*'
      pre.headers.set('access-control-allow-origin', origin)
      pre.headers.set('access-control-allow-methods', 'GET, OPTIONS')
      pre.headers.set('access-control-allow-headers', 'authorization, content-type, accept, user-agent')
      pre.headers.set('access-control-max-age', '600')
      pre.headers.set('vary', 'origin')
      pre.headers.set('x-request-id', req.headers.get('x-request-id') || generateUUID())
      return pre
    }
    return response
  }

  const origin = req.headers.get('origin') || ''
  const isSame = origin === ORIGIN

  if (req.method === 'OPTIONS') {
    const pre = NextResponse.json({}, { status: 204 })
    pre.headers.set('access-control-allow-methods', 'GET,POST,DELETE,PUT,OPTIONS')
    pre.headers.set('access-control-allow-headers', 'content-type, stripe-signature, x-cc-webhook-signature, x-csrf-token')
    pre.headers.set('access-control-allow-origin', isSame ? ORIGIN : 'null')
    pre.headers.set('vary', 'origin')
    pre.headers.set('x-request-id', req.headers.get('x-request-id') || generateUUID())
    return pre
  } else if (origin) {
    response.headers.set('access-control-allow-origin', isSame ? ORIGIN : 'null')
    response.headers.set('vary', 'origin')
  }

  return response
}

/* ── Maintenance gate ─────────────────────────────────────────────────
 * While the product is pre-launch, redirect every page request to `/`
 * unless the visitor has the `ag_bypass` cookie (set via /api/bypass).
 *
 * Bypass paths: homepage, static assets, API routes (so webhooks, cron,
 * and the bypass endpoint itself keep working), and /privacy + /terms
 * (legal pages must stay accessible).
 * ──────────────────────────────────────────────────────────────────── */
const MAINTENANCE_BYPASS_COOKIE = 'ag_bypass'
const MAINTENANCE_ALLOWED = new Set(['/', '/privacy', '/terms', '/coming-soon'])

function isMaintenanceAllowed(pathname: string): boolean {
  if (MAINTENANCE_ALLOWED.has(pathname)) return true
  // All API routes stay open (webhooks, cron, bypass, subscribe, etc.)
  if (pathname.startsWith('/api/') || pathname.startsWith('/api')) return true
  return false
}

/** Main Middleware Function with Comprehensive Error Handling */
export async function middleware(req: NextRequest) {
  const requestId = req.headers.get('x-request-id') || generateUUID()
  let botInfo: ReturnType<typeof isBot> = { isBot: false, category: 'unknown', priority: 'low' }

  try {
    // Canonicalise apex -> www for page navigation. SIWE domain binding
    // and session cookies stay on one host. /api/* is exempted so webhooks
    // configured at apex keep working; SIWE itself handles both hosts
    // via the Host header in its domain check.
    if (
      req.headers.get('host') === 'allowanceguard.com' &&
      !req.nextUrl.pathname.startsWith('/api/')
    ) {
      const redirectUrl = new URL(
        req.nextUrl.pathname + req.nextUrl.search,
        'https://www.allowanceguard.com',
      )
      return NextResponse.redirect(redirectUrl, 308)
    }

    // 0. Skip middleware for health checks to prevent 403 errors
    if (req.nextUrl.pathname === '/api/healthz') {
      const response = NextResponse.next()
      response.headers.set('x-request-id', requestId)
      return response
    }

    // 0.5  Maintenance gate — redirect gated pages to homepage
    const bypassSecret = process.env.MAINTENANCE_BYPASS_SECRET
    if (bypassSecret) {
      const pathname = req.nextUrl.pathname
      if (!isMaintenanceAllowed(pathname)) {
        const cookie = req.cookies.get(MAINTENANCE_BYPASS_COOKIE)
        if (cookie?.value !== bypassSecret) {
          const url = req.nextUrl.clone()
          url.pathname = '/'
          url.search = ''
          return NextResponse.redirect(url)
        }
      }
    }
    
    // 1. Intelligent Bot Detection
    const userAgent = req.headers.get('user-agent') || ''
    botInfo = isBot(userAgent)
    
    // 2. Early return for high-priority bots (search engines, performance tools)
    if (botInfo.priority === 'high') {
      const response = NextResponse.next()
      response.headers.set('x-request-id', requestId)
      return applySecurityHeaders(applyCORS(response, req, botInfo), botInfo)
    }
    
    // 3. CSRF validation — reject state-changing requests with bad/missing token
    const csrfBlock = checkCsrf(req)
    if (csrfBlock) {
      csrfBlock.headers.set('x-request-id', requestId)
      return csrfBlock
    }

    // 4. Create base response (rate limiting handled at route level via Redis)
    let response = NextResponse.next()
    response.headers.set('x-request-id', requestId)
    
    // 5. Apply security headers with bot optimizations
    response = applySecurityHeaders(response, botInfo)

    // 6. Apply CORS with bot awareness
    response = applyCORS(response, req, botInfo)
    
    return response
    
  } catch (error) {
    // Comprehensive error handling with graceful degradation
    console.error('Middleware error:', error)
    
    // For bots, always return a basic response to prevent 500s
    if (botInfo?.isBot) {
      const fallbackResponse = NextResponse.next()
      fallbackResponse.headers.set('x-request-id', requestId)
      fallbackResponse.headers.set('x-error-handled', 'true')
      return fallbackResponse
    }
    
    // For humans, return proper error response
    return createErrorResponse(
      'Internal server error in middleware',
      500,
      requestId
    )
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp)).*)',
  ],
}