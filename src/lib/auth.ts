import { cookies } from 'next/headers'
import { randomBytes } from 'crypto'
import { pool } from '@/lib/db'

const COOKIE = 'ag_sess'
const DAYS = 30

export async function getSession() {
  const token = (await cookies()).get(COOKIE)?.value
  if (!token) return null
  const { rows } = await pool.query(
    `SELECT s.id as session_id, u.id as user_id, u.email, u.name
       FROM sessions s JOIN users u ON u.id=s.user_id
      WHERE s.token=$1 AND s.expires_at > NOW()`, [token]
  )
  return rows[0] || null
}

export async function requireUser() {
  const s = await getSession()
  if (!s) throw new Error('UNAUTHENTICATED')
  return s
}

export async function createSession(userId: number) {
  const token = randomBytes(32).toString('hex')
  const { rows } = await pool.query(
    `INSERT INTO sessions (user_id, token, expires_at)
     VALUES ($1,$2,NOW() + INTERVAL '${DAYS} days') RETURNING token`,
    [userId, token]
  )
  return rows[0].token as string
}

export async function setSessionCookie(token: string) {
  const c = await cookies()
  c.set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  })
}

export async function clearSessionCookie() {
  const c = await cookies()
  c.set(COOKIE, '', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV==='production', path:'/', maxAge: 0 })
}
