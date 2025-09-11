// lib/jobs.ts
import { pool } from '@/lib/db'

export type JobRow = {
  id: number
  type: string
  payload: any
  status: 'pending'|'running'|'succeeded'|'failed'
  attempts: number
  max_attempts: number
  created_at: string
  updated_at: string
  started_at: string | null
  finished_at: string | null
  error: string | null
}

export async function enqueueScan(wallet: string, chains: number[]) {
  const { rows } = await pool.query(
    `INSERT INTO jobs (type, payload) VALUES ('scan_wallet', $1) RETURNING id`,
    [ { wallet: wallet.toLowerCase(), chains } ]
  )
  return rows[0].id as number
}

export async function getJob(id: number) {
  const { rows } = await pool.query(`SELECT * FROM jobs WHERE id=$1`, [id])
  return rows[0] || null
}

/** Claim up to N jobs for processing (SKIP LOCKED allows multiple processors). */
export async function claimPending(limit = 3) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const { rows } = await client.query(
      `SELECT id FROM jobs
       WHERE status='pending'
       ORDER BY created_at ASC
       FOR UPDATE SKIP LOCKED
       LIMIT $1`, [limit]
    )
    if (!rows.length) { await client.query('COMMIT'); return [] }
    const ids = rows.map(r => r.id)
    await client.query(
      `UPDATE jobs SET status='running', started_at=NOW(), updated_at=NOW(), attempts=attempts+1
       WHERE id = ANY($1::bigint[])`,
      [ids]
    )
    await client.query('COMMIT')
    const { rows: jobs } = await pool.query(`SELECT * FROM jobs WHERE id = ANY($1::bigint[])`, [ids])
    return jobs as JobRow[]
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

export async function finishJob(id: number, ok: boolean, error?: string) {
  if (ok) {
    await pool.query(
      `UPDATE jobs SET status='succeeded', finished_at=NOW(), updated_at=NOW(), error=NULL WHERE id=$1`,
      [id]
    )
  } else {
    await pool.query(
      `UPDATE jobs SET status=CASE WHEN attempts>=max_attempts THEN 'failed' ELSE 'pending' END,
              updated_at=NOW(), finished_at=CASE WHEN attempts>=max_attempts THEN NOW() ELSE NULL END,
              error=$2
       WHERE id=$1`,
      [id, error?.slice(0, 5000) || null]
    )
  }
}
