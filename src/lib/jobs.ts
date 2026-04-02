// lib/jobs.ts
import { pool } from '@/lib/db'

export type JobRow = {
  id: number
  type: string
  payload: Record<string, unknown>
  status: 'pending'|'running'|'succeeded'|'failed'
  attempts: number
  max_attempts: number
  created_at: string
  updated_at: string
  started_at: string | null
  finished_at: string | null
  error: string | null
}

export async function hasRecentScan(wallet: string, minMinutes = 3) {
  const { rows } = await pool.query(
    `SELECT 1 FROM jobs
      WHERE type='scan_wallet' AND status IN ('pending','running')
        AND payload->>'wallet' = $1
        AND created_at > NOW() - ($2 || ' minutes')::interval
      LIMIT 1`,
    [wallet.toLowerCase(), String(minMinutes)]
  )
  return !!rows[0]
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
  // Atomic claim: select + update in a single statement via CTE
  const { rows: jobs } = await pool.query(
    `WITH claimed AS (
       SELECT id FROM jobs
       WHERE status='pending'
       ORDER BY created_at ASC
       LIMIT $1
     )
     UPDATE jobs SET status='running', started_at=NOW(), updated_at=NOW(), attempts=attempts+1
     FROM claimed WHERE jobs.id = claimed.id
     RETURNING jobs.*`,
    [limit]
  )
  return jobs as JobRow[]
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
