// Rate limiting utility for API routes
import { NextRequest, NextResponse } from 'next/server'

interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  message?: string
}

// In-memory store for rate limiting (in production, use Redis or similar)
const requestCounts = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, maxRequests, message = 'Too many requests' } = options

  return (req: NextRequest) => {
    const ip = (req as NextRequest & { ip?: string }).ip || req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const now = Date.now()

    // Clean up expired entries
    for (const [key, value] of requestCounts.entries()) {
      if (value.resetTime < now) {
        requestCounts.delete(key)
      }
    }

    // Get or create rate limit entry
    const entry = requestCounts.get(ip) || { count: 0, resetTime: now + windowMs }
    
    // Reset if window has expired
    if (entry.resetTime < now) {
      entry.count = 0
      entry.resetTime = now + windowMs
    }

    // Increment count
    entry.count++
    requestCounts.set(ip, entry)

    // Check if limit exceeded
    if (entry.count > maxRequests) {
      return NextResponse.json(
        { error: message, retryAfter: Math.ceil((entry.resetTime - now) / 1000) },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((entry.resetTime - now) / 1000).toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': Math.max(0, maxRequests - entry.count).toString(),
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
  message: 'Too many scan requests, please wait before scanning again'
})

export const strictRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5, // 5 requests per minute
  message: 'Rate limit exceeded, please slow down'
})
