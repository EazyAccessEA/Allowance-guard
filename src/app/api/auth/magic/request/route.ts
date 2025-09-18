import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { sendMail } from '@/lib/mailer'
import { randomBytes } from 'crypto'
import { 
  recordLoginAttempt, 
  checkAccountLockout
} from '@/lib/auth-enhanced'
import { getDeviceInfo } from '@/lib/device-detection'

export async function POST(req: Request) {
  try {
    const { email, redirect = '/' } = await req.json().catch(() => ({}))
    
    // Get device info for security tracking
    const deviceInfo = await getDeviceInfo()
    
    // Validate email
    if (!email || typeof email !== 'string') {
      await recordLoginAttempt(email || '', deviceInfo.ip, deviceInfo.userAgent, false, 'invalid_email')
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      await recordLoginAttempt(email, deviceInfo.ip, deviceInfo.userAgent, false, 'invalid_email_format')
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }
    
    // Validate redirect URL
    if (typeof redirect !== 'string' || !redirect.startsWith('/')) {
      await recordLoginAttempt(email, deviceInfo.ip, deviceInfo.userAgent, false, 'invalid_redirect')
      return NextResponse.json({ error: 'Invalid redirect URL' }, { status: 400 })
    }
    
    // Check account lockout
    const lockoutStatus = await checkAccountLockout(email)
    if (lockoutStatus.locked) {
      await recordLoginAttempt(email, deviceInfo.ip, deviceInfo.userAgent, false, 'account_locked')
      return NextResponse.json({ 
        error: 'Account temporarily locked due to too many failed attempts. Please try again later.' 
      }, { status: 429 })
    }
    
    // Check for existing unexpired magic links (rate limiting)
    const existing = await pool.query(
      `SELECT id FROM magic_links 
       WHERE email=$1 AND expires_at > NOW() AND consumed_at IS NULL 
       ORDER BY created_at DESC LIMIT 1`,
      [email.toLowerCase()]
    )
    
    if (existing.rows.length > 0) {
      await recordLoginAttempt(email, deviceInfo.ip, deviceInfo.userAgent, false, 'rate_limited')
      return NextResponse.json({ 
        error: 'Magic link already sent. Please check your email or wait a few minutes.' 
      }, { status: 429 })
    }
    
    // Generate secure token
    const token = randomBytes(32).toString('hex')
    
    // Ensure we have a valid base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const url = `${baseUrl}/api/auth/magic/verify?token=${token}&redirect=${encodeURIComponent(redirect)}`
    
    // Store magic link in database with device info
    await pool.query(
      `INSERT INTO magic_links (email, token, purpose, meta, expires_at)
       VALUES ($1,$2,'signin',$3, NOW() + INTERVAL '20 minutes')`,
      [email.toLowerCase(), token, JSON.stringify({ 
        redirect, 
        device: {
          fingerprint: deviceInfo.fingerprint,
          name: deviceInfo.name,
          type: deviceInfo.type,
          browser: deviceInfo.browser,
          os: deviceInfo.os
        }
      })]
    )
    
    // Send email with branded template
    const content = `
      <h2>🔐 Sign in to Allowance Guard</h2>
      <p>Click the button below to securely sign in to your account:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" class="button">Sign In Securely</a>
      </div>
      
      <div class="alert-box">
        <p><strong>Security Note:</strong> This link will expire in 20 minutes for your security.</p>
        <p>If you didn't request this sign-in link, you can safely ignore this email.</p>
      </div>
      
      <p><strong>Having trouble?</strong> If the button doesn't work, copy and paste this link into your browser:</p>
      <div class="address">${url}</div>
      
      <h2>What's Next?</h2>
      <ul>
        <li>Access your team dashboards and wallet monitoring</li>
        <li>Manage token approvals and security settings</li>
        <li>Invite team members and collaborate on security</li>
        <li>Set up autonomous monitoring and alerts</li>
      </ul>
    `
    
    // In development, log the magic link instead of sending email
    if (process.env.NODE_ENV === 'development') {
      console.log('🔗 Magic Link (Development Mode):', url)
      console.log('📧 Would send email to:', email)
      console.log('📧 Email content preview:', content)
    } else {
      await sendMail(email, '🔐 Sign in to Allowance Guard', content)
    }
    
    // Record successful magic link request
    await recordLoginAttempt(email, deviceInfo.ip, deviceInfo.userAgent, true)
    
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
