// CSRF protection utility
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const CSRF_TOKEN_COOKIE = 'csrf-token'
const CSRF_HEADER = 'x-csrf-token'

// Generate a secure CSRF token
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Get CSRF token from cookies
export async function getCSRFToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(CSRF_TOKEN_COOKIE)?.value || null
}

// Set CSRF token in cookies
export function setCSRFTokenCookie(response: NextResponse, token: string): void {
  response.cookies.set(CSRF_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/'
  })
}

// Validate CSRF token
export async function validateCSRFToken(request: NextRequest): Promise<boolean> {
  const cookieStore = await cookies()
  const cookieToken = cookieStore.get(CSRF_TOKEN_COOKIE)?.value
  const headerToken = request.headers.get(CSRF_HEADER)

  if (!cookieToken || !headerToken) {
    return false
  }

  // Use timing-safe comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(cookieToken, 'hex'),
    Buffer.from(headerToken, 'hex')
  )
}

// CSRF middleware for API routes
export function csrfProtection() {
  return async (request: NextRequest) => {
    // Skip CSRF for GET requests and safe methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      return NextResponse.next()
    }

    // Skip CSRF for public endpoints that don't modify state
    const url = new URL(request.url)
    const publicEndpoints = ['/api/healthz', '/api/health', '/api/readiness']
    
    if (publicEndpoints.some(endpoint => url.pathname.startsWith(endpoint))) {
      return NextResponse.next()
    }

    // Validate CSRF token
    const isValid = await validateCSRFToken(request)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      )
    }

    return NextResponse.next()
  }
}

// Generate and return CSRF token for forms
export async function getCSRFTokenForForm(): Promise<string> {
  let token = await getCSRFToken()
  
  if (!token) {
    token = generateCSRFToken()
  }
  
  return token
}
