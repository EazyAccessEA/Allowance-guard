import { randomBytes } from 'crypto'
import { pool } from '@/lib/db'

const TOKEN_TTL_MIN = 15

export async function createMagicLink(email: string, purpose: 'signin' = 'signin'): Promise<string> {
  const token = randomBytes(32).toString('hex')
  await pool.query(
    `INSERT INTO magic_links (email, token, purpose, expires_at)
     VALUES ($1, $2, $3, NOW() + ($4 || ' minutes')::interval)`,
    [email.toLowerCase(), token, purpose, String(TOKEN_TTL_MIN)]
  )
  return token
}

export interface ConsumedLink {
  email: string
  meta: Record<string, unknown>
}

export async function consumeMagicLink(token: string): Promise<ConsumedLink | null> {
  const { rows } = await pool.query(
    `UPDATE magic_links
        SET consumed_at = NOW()
      WHERE token = $1
        AND consumed_at IS NULL
        AND expires_at > NOW()
      RETURNING email, meta`,
    [token]
  )
  if (!rows[0]) return null
  return { email: rows[0].email as string, meta: (rows[0].meta as Record<string, unknown>) ?? {} }
}

export async function getOrCreateUserByEmail(email: string): Promise<number> {
  const normalized = email.toLowerCase()
  const existing = await pool.query(`SELECT id FROM users WHERE email = $1 LIMIT 1`, [normalized])
  if (existing.rows[0]) return existing.rows[0].id as number
  const inserted = await pool.query(
    `INSERT INTO users (email) VALUES ($1) RETURNING id`,
    [normalized]
  )
  return inserted.rows[0].id as number
}
