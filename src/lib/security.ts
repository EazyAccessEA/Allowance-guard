// Security utilities and middleware
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .slice(0, 1000) // Limit length
}

// Validate wallet address format
export const walletAddressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address format')

// Validate email format
export const emailSchema = z.string().email('Invalid email format').max(254)

// Validate chain ID
export const chainIdSchema = z.number().int().positive()

// Validate pagination parameters
export const paginationSchema = z.object({
  page: z.number().int().min(1).max(1000).default(1),
  pageSize: z.number().int().min(1).max(100).default(25)
})

// Security headers middleware
export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }
  
  return response
}

// Request validation middleware
export function validateRequest(schema: z.ZodSchema) {
  return async (request: NextRequest) => {
    try {
      const body = await request.json()
      const validated = schema.parse(body)
      return { success: true, data: validated }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: 'Invalid request data',
          details: error.issues
        }
      }
      return {
        success: false,
        error: 'Request parsing failed'
      }
    }
  }
}

// IP address validation
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const remoteAddr = (request as NextRequest & { ip?: string }).ip
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return remoteAddr || 'unknown'
}

// Check if request is from allowed origin
export function isAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  const allowedOrigins = [
    'https://www.allowanceguard.com',
    'https://allowance-guard-obph-26vdaayxd-abdur-rahman-morris-projects.vercel.app',
    'http://localhost:3000' // For development
  ]
  
  if (!origin) return true // Allow requests without origin (like direct API calls)
  
  return allowedOrigins.includes(origin)
}

// Security logging
export function logSecurityEvent(event: string, details: Record<string, unknown>, request: NextRequest) {
  const ip = getClientIP(request)
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  console.warn(`[SECURITY] ${event}`, {
    ip,
    userAgent,
    timestamp: new Date().toISOString(),
    ...details
  })
}

// Block suspicious requests
export function isSuspiciousRequest(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || ''
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /php/i
  ]
  
  return suspiciousPatterns.some(pattern => pattern.test(userAgent))
}

// Rate limiting by IP (simple in-memory implementation)
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>()

export function checkIPRateLimit(ip: string, maxRequests: number = 100, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now()
  const entry = ipRequestCounts.get(ip) || { count: 0, resetTime: now + windowMs }
  
  if (entry.resetTime < now) {
    entry.count = 0
    entry.resetTime = now + windowMs
  }
  
  entry.count++
  ipRequestCounts.set(ip, entry)
  
  return entry.count <= maxRequests
}
