/**
 * Compliance Audit Export
 *
 * Generates timestamped audit reports for institutional compliance.
 * Supports JSON, CSV formats with full audit trails.
 */
import { randomBytes, randomUUID } from 'crypto'
import { pool } from '@/lib/db'
import { secureLogger } from '@/lib/secure-logger'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ExportType = 'full_audit' | 'risk_summary' | 'allowance_snapshot' | 'team_report'
export type ExportFormat = 'json' | 'csv'

export interface ExportFilters {
  wallets?: string[]
  chains?: number[]
  dateFrom?: string
  dateTo?: string
  teamId?: number
  actions?: string[]
  severity?: string[]
}

export interface ExportResult {
  id: string
  downloadToken: string
  exportType: ExportType
  format: ExportFormat
  rowCount: number
  data: string
  contentType: string
  filename: string
}

// ---------------------------------------------------------------------------
// Audit log query
// ---------------------------------------------------------------------------

async function queryAuditLogs(
  userId: number,
  filters: ExportFilters,
): Promise<Record<string, unknown>[]> {
  const conditions: string[] = ['actor_id = $1']
  const params: unknown[] = [String(userId)]
  let paramIdx = 2

  if (filters.dateFrom) {
    conditions.push(`created_at >= $${paramIdx}`)
    params.push(filters.dateFrom)
    paramIdx++
  }
  if (filters.dateTo) {
    conditions.push(`created_at <= $${paramIdx}`)
    params.push(filters.dateTo)
    paramIdx++
  }
  if (filters.actions && filters.actions.length > 0) {
    conditions.push(`action = ANY($${paramIdx}::text[])`)
    params.push(filters.actions)
    paramIdx++
  }
  if (filters.severity && filters.severity.length > 0) {
    conditions.push(`severity = ANY($${paramIdx}::text[])`)
    params.push(filters.severity)
    paramIdx++
  }

  const { rows } = await pool.query(
    `SELECT id, at, actor_type, actor_id, action, subject, meta, ip, path, severity, category, created_at
     FROM audit_logs
     WHERE ${conditions.join(' AND ')}
     ORDER BY created_at DESC
     LIMIT 10000`,
    params,
  )
  return rows
}

// ---------------------------------------------------------------------------
// Risk snapshots query
// ---------------------------------------------------------------------------

async function queryRiskSummary(
  wallets: string[],
  filters: ExportFilters,
): Promise<Record<string, unknown>[]> {
  const conditions: string[] = ['wallet_address = ANY($1::text[])']
  const params: unknown[] = [wallets.map((w) => w.toLowerCase())]
  let paramIdx = 2

  if (filters.dateFrom) {
    conditions.push(`snapshot_at >= $${paramIdx}`)
    params.push(filters.dateFrom)
    paramIdx++
  }
  if (filters.dateTo) {
    conditions.push(`snapshot_at <= $${paramIdx}`)
    params.push(filters.dateTo)
    paramIdx++
  }

  const { rows } = await pool.query(
    `SELECT id, wallet_address, risk_score, total_allowances, unlimited_count,
            high_risk_count, chain_breakdown, snapshot_at
     FROM risk_snapshots
     WHERE ${conditions.join(' AND ')}
     ORDER BY snapshot_at DESC
     LIMIT 10000`,
    params,
  )
  return rows
}

// ---------------------------------------------------------------------------
// Allowance snapshot query
// ---------------------------------------------------------------------------

async function queryAllowanceSnapshot(
  wallets: string[],
  filters: ExportFilters,
): Promise<Record<string, unknown>[]> {
  const conditions: string[] = ['a.wallet_address = ANY($1::text[])']
  const params: unknown[] = [wallets.map((w) => w.toLowerCase())]
  let paramIdx = 2

  if (filters.chains && filters.chains.length > 0) {
    conditions.push(`a.chain_id = ANY($${paramIdx}::int[])`)
    params.push(filters.chains)
    paramIdx++
  }

  const { rows } = await pool.query(
    `SELECT a.wallet_address, a.chain_id, a.token_address, a.spender_address,
            a.standard, a.allowance_type, a.amount, a.is_unlimited,
            a.risk_score, a.risk_flags, a.updated_at,
            tm.name AS token_name, tm.symbol AS token_symbol,
            sl.label AS spender_label, sl.trust AS spender_trust
     FROM allowances a
     LEFT JOIN token_metadata tm ON tm.chain_id = a.chain_id AND tm.token_address = a.token_address
     LEFT JOIN spender_labels sl ON sl.chain_id = a.chain_id AND sl.address = a.spender_address
     WHERE ${conditions.join(' AND ')}
     ORDER BY a.is_unlimited DESC, a.risk_score DESC NULLS LAST
     LIMIT 10000`,
    params,
  )
  return rows
}

// ---------------------------------------------------------------------------
// Team report query
// ---------------------------------------------------------------------------

async function queryTeamReport(
  teamId: number,
  filters: ExportFilters,
): Promise<Record<string, unknown>[]> {
  const conditions: string[] = ['ta.team_id = $1']
  const params: unknown[] = [teamId]
  let paramIdx = 2

  if (filters.dateFrom) {
    conditions.push(`ta.created_at >= $${paramIdx}`)
    params.push(filters.dateFrom)
    paramIdx++
  }
  if (filters.dateTo) {
    conditions.push(`ta.created_at <= $${paramIdx}`)
    params.push(filters.dateTo)
    paramIdx++
  }

  const { rows } = await pool.query(
    `SELECT ta.id, ta.team_id, ta.user_id, ta.action, ta.subject, ta.details,
            ta.ip_address, ta.created_at, u.email AS user_email, u.name AS user_name
     FROM team_activity ta
     LEFT JOIN users u ON u.id = ta.user_id
     WHERE ${conditions.join(' AND ')}
     ORDER BY ta.created_at DESC
     LIMIT 10000`,
    params,
  )
  return rows
}

// ---------------------------------------------------------------------------
// CSV formatter
// ---------------------------------------------------------------------------

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return ''

  const headers = Object.keys(rows[0])
  const lines = [headers.join(',')]

  for (const row of rows) {
    const values = headers.map((h) => {
      const val = row[h]
      if (val === null || val === undefined) return ''
      if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`
      const str = String(val)
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    })
    lines.push(values.join(','))
  }

  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate a compliance audit export.
 */
export async function generateExport(
  userId: number,
  exportType: ExportType,
  format: ExportFormat,
  filters: ExportFilters,
): Promise<ExportResult> {
  let rows: Record<string, unknown>[]

  switch (exportType) {
    case 'full_audit':
      rows = await queryAuditLogs(userId, filters)
      break
    case 'risk_summary':
      rows = await queryRiskSummary(filters.wallets ?? [], filters)
      break
    case 'allowance_snapshot':
      rows = await queryAllowanceSnapshot(filters.wallets ?? [], filters)
      break
    case 'team_report':
      if (!filters.teamId) throw new Error('teamId required for team_report')
      rows = await queryTeamReport(filters.teamId, filters)
      break
    default:
      throw new Error(`Unknown export type: ${exportType}`)
  }

  const now = new Date().toISOString()
  const data = format === 'csv' ? toCsv(rows) : JSON.stringify({
    meta: {
      exportType,
      generatedAt: now,
      generatedBy: userId,
      filters,
      rowCount: rows.length,
    },
    records: rows,
  }, null, 2)

  const contentType = format === 'csv' ? 'text/csv' : 'application/json'
  const ext = format === 'csv' ? 'csv' : 'json'
  const dateStr = now.slice(0, 10)
  const filename = `allowanceguard_${exportType}_${dateStr}.${ext}`

  const downloadToken = randomBytes(32).toString('hex')

  // Record the export
  const { rows: inserted } = await pool.query(
    `INSERT INTO compliance_exports (user_id, team_id, export_type, format, filters, row_count, file_size, download_token, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW() + INTERVAL '24 hours')
     RETURNING id`,
    [userId, filters.teamId ?? null, exportType, format, JSON.stringify(filters), rows.length, Buffer.byteLength(data), downloadToken],
  )

  secureLogger.info('Compliance export generated', {
    exportId: inserted[0]?.id,
    exportType,
    format,
    rowCount: rows.length,
  })

  return {
    id: inserted[0]?.id as string,
    downloadToken,
    exportType,
    format,
    rowCount: rows.length,
    data,
    contentType,
    filename,
  }
}

/**
 * Get user's export history.
 */
export async function getExportHistory(
  userId: number,
  limit = 20,
): Promise<Record<string, unknown>[]> {
  const { rows } = await pool.query(
    `SELECT id, export_type, format, row_count, file_size, created_at
     FROM compliance_exports
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [userId, limit],
  )
  return rows
}
