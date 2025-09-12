import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { sendMail } from '@/lib/mailer'
import { randomBytes } from 'crypto'

export async function POST(req: Request) {
  try {
    const { email, redirect = '/' } = await req.json().catch(() => ({}))
    
    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }
    
    // Validate redirect URL
    if (typeof redirect !== 'string' || !redirect.startsWith('/')) {
      return NextResponse.json({ error: 'Invalid redirect URL' }, { status: 400 })
    }
    
    // Check for existing unexpired magic links (rate limiting)
    const existing = await pool.query(
      `SELECT id FROM magic_links 
       WHERE email=$1 AND expires_at > NOW() AND consumed_at IS NULL 
       ORDER BY created_at DESC LIMIT 1`,
      [email.toLowerCase()]
    )
    
    if (existing.rows.length > 0) {
      return NextResponse.json({ 
        error: 'Magic link already sent. Please check your email or wait a few minutes.' 
      }, { status: 429 })
    }
    
    // Generate secure token
    const token = randomBytes(32).toString('hex')
    
    // Ensure we have a valid base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const url = `${baseUrl}/api/auth/magic/verify?token=${token}&redirect=${encodeURIComponent(redirect)}`
    
    // Store magic link in database
    await pool.query(
      `INSERT INTO magic_links (email, token, purpose, meta, expires_at)
       VALUES ($1,$2,'signin',$3, NOW() + INTERVAL '20 minutes')`,
      [email.toLowerCase(), token, JSON.stringify({ redirect })]
    )
    
    // Send email
    const html = `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">Sign in to Allowance Guard</h2>
        <p>Click the button below to sign in to your account:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" 
             style="background: #1a1a1a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Sign In
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          This link will expire in 20 minutes. If you didn't request this, you can safely ignore this email.
        </p>
        <p style="color: #666; font-size: 12px;">
          If the button doesn't work, copy and paste this link: ${url}
        </p>
      </div>
    `
    
    // In development, log the magic link instead of sending email
    if (process.env.NODE_ENV === 'development') {
      console.log('🔗 Magic Link (Development Mode):', url)
      console.log('📧 Would send email to:', email)
    } else {
      await sendMail(email, 'Sign in to Allowance Guard', html)
    }
    
    const response: { ok: boolean; message: string; magicLink?: string } = { 
      ok: true, 
      message: 'Magic link sent to your email' 
    }
    
    // In development, include the magic link in the response
    if (process.env.NODE_ENV === 'development') {
      response.magicLink = url
      response.message = 'Magic link generated (check console for URL)'
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Magic link request error:', error)
    return NextResponse.json({ 
      error: 'Failed to send magic link. Please try again.' 
    }, { status: 500 })
  }
}
