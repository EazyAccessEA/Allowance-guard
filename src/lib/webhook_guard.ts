import { pool } from '@/lib/db'

export async function alreadyProcessed(provider: 'stripe'|'coinbase', eventId: string) {
  const { rows } = await pool.query(`SELECT 1 FROM webhook_events WHERE provider=$1 AND event_id=$2`, [provider, eventId])
  return !!rows[0]
}

export async function markProcessed(provider: 'stripe'|'coinbase', eventId: string) {
  await pool.query(`INSERT INTO webhook_events (provider, event_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`, [provider, eventId])
}

export async function auditWebhook(provider: string, action: string, subject: string | null, meta: any = {}) {
  await pool.query(
    `INSERT INTO audit_logs (actor_type, actor_id, action, subject, meta, path)
     VALUES ('webhook', $1, $2, $3, $4, $5)`,
     [provider, action, subject, meta, `/api/${provider}/webhook`]
  )
}
