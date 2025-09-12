import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { createSession, setSessionCookie } from '@/lib/auth'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const token = url.searchParams.get('token') || ''
  const redirect = url.searchParams.get('redirect') || '/'

  const { rows } = await pool.query(
    `SELECT * FROM magic_links WHERE token=$1 AND expires_at > NOW() AND consumed_at IS NULL`,
    [token]
  )
  const ml = rows[0]
  if (!ml) return NextResponse.redirect(new URL('/signin?e=invalid', url.origin))

  // Upsert user
  const email = (ml.email as string).toLowerCase()
  const u = await pool.query(
    `INSERT INTO users (email) VALUES ($1)
     ON CONFLICT (email) DO UPDATE SET email=EXCLUDED.email
     RETURNING id`, [email]
  )
  // Consume link
  await pool.query(`UPDATE magic_links SET consumed_at=NOW() WHERE id=$1`, [ml.id])

  // Session
  const sessToken = await createSession(u.rows[0].id)
  await setSessionCookie(sessToken)

  return NextResponse.redirect(new URL(redirect, url.origin))
}
