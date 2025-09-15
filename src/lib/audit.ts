import { pool } from '@/lib/db'

export async function auditUser(action: string, actorId: string | number | null, subject: string | null, meta: any = {}, ip?: string | null, path?: string | null) {
  await pool.query(
    `INSERT INTO audit_logs (actor_type, actor_id, action, subject, meta, ip, path)
     VALUES ('user', $1, $2, $3, $4, $5, $6)`,
     [actorId != null ? String(actorId) : null, action, subject, meta, ip || null, path || null]
  )
}
