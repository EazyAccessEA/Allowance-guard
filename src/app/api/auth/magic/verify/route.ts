import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { setSessionCookie } from '@/lib/auth'
import { 
  createEnhancedSession,
  logSecurityEvent,
  recordLoginAttempt,
  resetLoginAttempts,
  addTrustedDevice,
  getTrustedDevices
} from '@/lib/auth-enhanced'
import { getDeviceInfo } from '@/lib/device-detection'

export async function GET(req: Request) {
  const url = new URL(req.url)
  
  try {
    const token = url.searchParams.get('token') || ''
    const redirect = url.searchParams.get('redirect') || '/'
    
    // Get device info for security tracking
    const deviceInfo = await getDeviceInfo()

    // Validate token format
    if (!token || typeof token !== 'string' || token.length !== 64) {
      await recordLoginAttempt('', deviceInfo.ip, deviceInfo.userAgent, false, 'invalid_token_format')
      return NextResponse.redirect(new URL('/signin?error=invalid_token', url.origin))
    }

    // Validate redirect URL
    if (!redirect.startsWith('/') || redirect.includes('//')) {
      await recordLoginAttempt('', deviceInfo.ip, deviceInfo.userAgent, false, 'invalid_redirect')
      return NextResponse.redirect(new URL('/signin?error=invalid_redirect', url.origin))
    }

    // Find magic link
    const { rows } = await pool.query(
      `SELECT * FROM magic_links 
       WHERE token=$1 AND expires_at > NOW() AND consumed_at IS NULL`,
      [token]
    )
    
    const ml = rows[0]
    if (!ml) {
      await recordLoginAttempt('', deviceInfo.ip, deviceInfo.userAgent, false, 'expired_or_invalid_token')
      return NextResponse.redirect(new URL('/signin?error=expired_or_invalid', url.origin))
    }

    // Use database transaction for atomicity
    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      // Upsert user
      const email = (ml.email as string).toLowerCase()
      const userResult = await client.query(
        `INSERT INTO users (email) VALUES ($1)
         ON CONFLICT (email) DO UPDATE SET email=EXCLUDED.email
         RETURNING id`, 
        [email]
      )
      
      const userId = userResult.rows[0].id

      // Consume magic link
      await client.query(
        `UPDATE magic_links SET consumed_at=NOW() WHERE id=$1`, 
        [ml.id]
      )

      // Create enhanced session with device tracking
      const sessToken = await createEnhancedSession(userId, deviceInfo, 'magic_link')
      
      // Check if this is a trusted device
      const trustedDevices = await getTrustedDevices(userId)
      const isTrustedDevice = trustedDevices.some(device => {
        const d = device as Record<string, unknown>
        return d.device_fingerprint === deviceInfo.fingerprint
      })
      
      // If not trusted, add to trusted devices (first login from this device)
      if (!isTrustedDevice) {
        await addTrustedDevice(userId, deviceInfo)
      }
      
      // Update session to mark as trusted if it's a known device
      if (isTrustedDevice) {
        await client.query(
          `UPDATE sessions SET is_trusted = TRUE WHERE token = $1`,
          [sessToken]
        )
      }
      
      await setSessionCookie(sessToken)

      await client.query('COMMIT')

      // Reset login attempts on successful login
      await resetLoginAttempts(email)
      
      // Log successful login event
      await logSecurityEvent(userId, null, {
        event_type: 'login_success',
        event_data: {
          method: 'magic_link',
          device: deviceInfo,
          is_new_device: !isTrustedDevice
        },
        ip_address: deviceInfo.ip,
        user_agent: deviceInfo.userAgent
      })
      
      // Record successful login attempt
      await recordLoginAttempt(email, deviceInfo.ip, deviceInfo.userAgent, true)

      // Redirect to intended destination
      return NextResponse.redirect(new URL(redirect, url.origin))

    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }

  } catch (error) {
    console.error('Magic link verification error:', error)
    
    // Log failed verification attempt
    const deviceInfo = await getDeviceInfo()
    await recordLoginAttempt('', deviceInfo.ip, deviceInfo.userAgent, false, 'verification_failed')
    
    return NextResponse.redirect(new URL('/signin?error=verification_failed', url.origin))
  }
}
