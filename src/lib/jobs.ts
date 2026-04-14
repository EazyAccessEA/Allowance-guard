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
      WHERE type='scan_wallet' AND status IN ('pending'::job_status,'running'::job_status)
        AND payload->>'wallet' = $1
        AND created_at > NOW() - ($2 || ' minutes')::interval
      LIMIT 1`,
    [wallet.toLowerCase(), String(minMinutes)]
  )
  return !!rows[0]
}

export interface ScanOwnership {
  /** User ID that owns the scan job. Used for /api/v1/scan/:id authorization. */
  userId?: number
  /** API key ID that created the scan. Used for /api/v1/scan/:id authorization. */
  apiKeyId?: string
}

export async function enqueueScan(wallet: string, chains: number[], ownership?: ScanOwnership) {
  // JSON.stringify required: neon .query() doesn't auto-serialize objects
  // like the old direct-call API did.
  const payload = {
    wallet: wallet.toLowerCase(),
    chains,
    ...(ownership?.userId !== undefined && { userId: ownership.userId }),
    ...(ownership?.apiKeyId !== undefined && { apiKeyId: ownership.apiKeyId }),
  }
  const { rows } = await pool.query(
    `INSERT INTO jobs (type, payload) VALUES ('scan_wallet', $1::jsonb) RETURNING id`,
    [JSON.stringify(payload)],
  )
  return rows[0].id as number
}

export async function getJob(id: number) {
  const { rows } = await pool.query(`SELECT * FROM jobs WHERE id=$1`, [id])
  return rows[0] || null
}

/** Claim the oldest pending job for processing. */
export async function claimPending(_limit = 1) {
  // Step 1: find the oldest pending job (simple SELECT, no subquery)
  const { rows: pending } = await pool.query(
    `SELECT id FROM jobs WHERE status='pending'::job_status ORDER BY created_at ASC LIMIT 1`
  )
  if (!pending.length) return []

  // Step 2: atomically claim it (check status again to prevent double-claim)
  const jobId = pending[0].id
  const { rows: claimed } = await pool.query(
    `UPDATE jobs SET status='running'::job_status, started_at=NOW(), updated_at=NOW(), attempts=attempts+1
     WHERE id=$1 AND status='pending'::job_status
     RETURNING *`,
    [jobId]
  )
  if (!claimed.length) return [] // another worker claimed it first
  return claimed as unknown as JobRow[]
}

export async function finishJob(id: number, ok: boolean, error?: string) {
  if (ok) {
    await pool.query(
      `UPDATE jobs SET status='succeeded'::job_status, finished_at=NOW(), updated_at=NOW(), error=NULL WHERE id=$1`,
      [id]
    )
  } else {
    await pool.query(
      `UPDATE jobs SET status=(CASE WHEN attempts>=max_attempts THEN 'failed' ELSE 'pending' END)::job_status,
              updated_at=NOW(), finished_at=CASE WHEN attempts>=max_attempts THEN NOW() ELSE NULL END,
              error=$2
       WHERE id=$1`,
      [id, error?.slice(0, 5000) || null]
    )
  }
}
