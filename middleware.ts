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

/** Very tight CSP. Extend connect-src for your RPCs/analytics if needed. */
const CSP = [
  "default-src 'self'",
  "img-src 'self' data: blob: https:",
  "style-src 'self' 'unsafe-inline'", // Next injects inline styles
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live", // Allow Next.js and Vercel
  `connect-src 'self' ${new URL(ORIGIN).origin} https://eth.llamarpc.com https://polygon-rpc.com https://arb1.arbitrum.io https://mainnet.optimism.io https://mainnet.base.org https: wss:`,
  "font-src 'self' data: https://fonts.gstatic.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

const RATE_LIMIT_PATHS = new Map<string, { windowSec: number; max: number }>([
  ['/api/scan', { windowSec: 60, max: 12 }],
  ['/api/coinbase/create-charge', { windowSec: 60, max: 10 }],
  ['/api/create-checkout-session', { windowSec: 60, max: 10 }],
  ['/api/share/create', { windowSec: 60, max: 20 }],
])

// Enhanced in-memory rate limiting with bot-aware logic
const memoryBucket = new Map<string, { reset: number; count: number; lastSeen: number }>()

/** Sophisticated Rate Limiting with Bot Awareness */
function checkRateLimit(req: NextRequest, botInfo: ReturnType<typeof isBot>): NextResponse | null {
  // Skip rate limiting for high-priority bots
  if (botInfo.priority === 'high') {
    return null
  }
  
  // Apply relaxed rate limiting for medium-priority bots
  const rateLimitMultiplier = botInfo.priority === 'medium' ? 3 : 1
  
  for (const [prefix, cfg] of RATE_LIMIT_PATHS) {
    if (req.nextUrl.pathname.startsWith(prefix)) {
      const ip = req.headers.get('x-forwarded-for') || 
                 req.headers.get('x-real-ip') || 
                 req.headers.get('cf-connecting-ip') || // Cloudflare
                 'unknown'
      
      const key = `${prefix}:${ip}:${botInfo.category}`
      const now = Date.now()
      const rec = memoryBucket.get(key) || { 
        reset: now + cfg.windowSec * 1000, 
        count: 0, 
        lastSeen: now 
      }
      
      // Reset if window expired
      if (now > rec.reset) { 
        rec.count = 0
        rec.reset = now + cfg.windowSec * 1000
      }
      
      rec.count++
      rec.lastSeen = now
      memoryBucket.set(key, rec)
      
      const effectiveLimit = cfg.max * rateLimitMultiplier
      
      if (rec.count > effectiveLimit) {
        return createErrorResponse(
          'Rate limit exceeded', 
          429, 
          req.headers.get('x-request-id') || generateUUID()
        )
      }
      
      // Create response with rate limit headers
      const response = NextResponse.next()
      response.headers.set('x-ratelimit-limit', String(effectiveLimit))
      response.headers.set('x-ratelimit-remaining', String(Math.max(0, effectiveLimit - rec.count)))
      response.headers.set('x-ratelimit-reset', String(Math.ceil(rec.reset / 1000)))
      response.headers.set('x-bot-category', botInfo.category)
      
      return response
    }
  }
  
  return null
}

/** Enhanced Security Headers with Bot-Specific Optimizations */
function applySecurityHeaders(response: NextResponse, botInfo: ReturnType<typeof isBot>): NextResponse {
  // Core security headers (always applied)
  response.headers.set('content-security-policy', CSP)
  response.headers.set('referrer-policy', 'strict-origin-when-cross-origin')
  response.headers.set('x-content-type-options', 'nosniff')
  response.headers.set('x-frame-options', 'DENY')
  response.headers.set('permissions-policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set('strict-transport-security', 'max-age=31536000; includeSubDomains; preload')
  
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
  const origin = req.headers.get('origin') || ''
  const isSame = origin === ORIGIN
  
  if (req.method === 'OPTIONS') {
    const pre = NextResponse.json({}, { status: 204 })
    pre.headers.set('access-control-allow-methods', 'GET,POST,DELETE,PUT,OPTIONS')
    pre.headers.set('access-control-allow-headers', 'content-type, stripe-signature, x-cc-webhook-signature')
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

/** Main Middleware Function with Comprehensive Error Handling */
export async function middleware(req: NextRequest) {
  const requestId = req.headers.get('x-request-id') || generateUUID()
  let botInfo: ReturnType<typeof isBot> = { isBot: false, category: 'unknown', priority: 'low' }
  
  try {
    // 1. Intelligent Bot Detection
    const userAgent = req.headers.get('user-agent') || ''
    botInfo = isBot(userAgent)
    
    // 2. Early return for high-priority bots (search engines, performance tools)
    if (botInfo.priority === 'high') {
      const response = NextResponse.next()
      response.headers.set('x-request-id', requestId)
      return applySecurityHeaders(applyCORS(response, req, botInfo), botInfo)
    }
    
    // 3. Sophisticated Rate Limiting (skips high-priority bots)
    const rateLimitResponse = checkRateLimit(req, botInfo)
    if (rateLimitResponse) {
      return rateLimitResponse
    }
    
    // 4. Create base response
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