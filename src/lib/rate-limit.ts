// Enhanced rate limiting utility with improved security
import { NextRequest, NextResponse } from 'next/server'

interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  message?: string
  keyGenerator?: (req: NextRequest) => string
}

// Enhanced in-memory store with better security
const requestCounts = new Map<string, { count: number; resetTime: number; lastSeen: number }>()

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, maxRequests, message = 'Too many requests', keyGenerator } = options

  return (req: NextRequest) => {
    const key = keyGenerator ? keyGenerator(req) : getDefaultKey(req)
    const now = Date.now()

    // Clean up expired entries and suspicious patterns
    cleanupExpiredEntries(now)
    detectAndBlockSuspiciousActivity(now)

    // Get or create rate limit entry
    const entry = requestCounts.get(key) || { count: 0, resetTime: now + windowMs, lastSeen: now }
    
    // Reset if window has expired
    if (entry.resetTime < now) {
      entry.count = 0
      entry.resetTime = now + windowMs
    }

    // Update last seen
    entry.lastSeen = now

    // Increment count
    entry.count++
    requestCounts.set(key, entry)

    // Check if limit exceeded
    if (entry.count > maxRequests) {
      return NextResponse.json(
        { error: message, retryAfter: Math.ceil((entry.resetTime - now) / 1000) },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((entry.resetTime - now) / 1000).toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(entry.resetTime / 1000).toString()
          }
        }
      )
    }

    // Return rate limit headers
    return NextResponse.next({
      headers: {
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': Math.max(0, maxRequests - entry.count).toString(),
        'X-RateLimit-Reset': Math.ceil(entry.resetTime / 1000).toString()
      }
    })
  }
}

function cleanupExpiredEntries(now: number): void {
  for (const [key, value] of requestCounts.entries()) {
    if (value.resetTime < now) {
      requestCounts.delete(key)
    }
  }
}

function detectAndBlockSuspiciousActivity(now: number): void {
  // Detect rapid-fire requests from same IP (potential bot)
  const suspiciousThreshold = 50 // requests in 1 minute
  const timeWindow = 60 * 1000 // 1 minute
  
  for (const [key, value] of requestCounts.entries()) {
    if (value.count > suspiciousThreshold && (now - value.lastSeen) < timeWindow) {
      // Mark as suspicious and extend reset time
      value.resetTime = now + (5 * 60 * 1000) // 5 minute penalty
      requestCounts.set(key, value)
    }
  }
}

function getDefaultKey(req: NextRequest): string {
  const ip = req.headers.get('x-forwarded-for') || 
             req.headers.get('x-real-ip') || 
             'unknown'
  return ip.split(',')[0].trim()
}

// Predefined rate limiters for different use cases
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per 15 minutes
  message: 'Too many API requests, please try again later'
})

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 auth attempts per 15 minutes
  message: 'Too many authentication attempts, please try again later'
})

export const scanRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 scans per minute
  message: 'Too many scan requests, please wait before scanning again',
  keyGenerator: (req) => {
    const ip = getDefaultKey(req)
    const wallet = req.headers.get('x-wallet-address') || 'anonymous'
    return `${ip}:${wallet}`
  }
})

export const strictRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5, // 5 requests per minute
  message: 'Rate limit exceeded, please slow down'
})
