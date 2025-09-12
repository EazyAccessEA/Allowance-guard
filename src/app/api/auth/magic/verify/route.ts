import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { setSessionCookie } from '@/lib/auth'
import { randomBytes } from 'crypto'

export async function GET(req: Request) {
  const url = new URL(req.url)
  
  try {
    const token = url.searchParams.get('token') || ''
    const redirect = url.searchParams.get('redirect') || '/'

    // Validate token format
    if (!token || typeof token !== 'string' || token.length !== 64) {
      return NextResponse.redirect(new URL('/signin?error=invalid_token', url.origin))
    }

    // Validate redirect URL
    if (!redirect.startsWith('/') || redirect.includes('//')) {
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

      // Create session using the same client
      const sessToken = randomBytes(32).toString('hex')
      const sessionResult = await client.query(
        `INSERT INTO sessions (user_id, token, expires_at)
         VALUES ($1,$2,NOW() + INTERVAL '30 days') RETURNING token`,
        [userId, sessToken]
      )
      
      if (!sessionResult.rows[0]) {
        throw new Error('Failed to create session')
      }
      
      await setSessionCookie(sessionResult.rows[0].token)

      await client.query('COMMIT')

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
    return NextResponse.redirect(new URL('/signin?error=verification_failed', url.origin))
  }
}
