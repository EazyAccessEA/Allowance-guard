import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { checkFeature } from '@/lib/feature-gate'
import { generateExport, getExportHistory, type ExportType, type ExportFormat, type ExportFilters } from '@/lib/compliance-export'
import { auditUser } from '@/lib/audit'
import { secureLogger } from '@/lib/secure-logger'
import { pool } from '@/lib/db'

const VALID_EXPORT_TYPES: ExportType[] = ['full_audit', 'risk_summary', 'allowance_snapshot', 'team_report']
const VALID_FORMATS: ExportFormat[] = ['json', 'csv']

/**
 * POST /api/compliance/export
 * Generate a compliance audit export. Requires export feature (Pro+).
 */
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const access = await checkFeature(session.user_id as number, 'export')
  if (!access.allowed) {
    return NextResponse.json(
      { error: 'Compliance exports require the Pro plan or higher', requiredPlan: access.requiredPlan },
      { status: 403 },
    )
  }

  const body = await req.json().catch(() => ({}))
  const { exportType, format = 'json', filters = {} } = body as {
    exportType?: string
    format?: string
    filters?: ExportFilters
  }

  if (!exportType || !VALID_EXPORT_TYPES.includes(exportType as ExportType)) {
    return NextResponse.json(
      { error: `Invalid export type. Must be one of: ${VALID_EXPORT_TYPES.join(', ')}` },
      { status: 400 },
    )
  }

  if (!VALID_FORMATS.includes(format as ExportFormat)) {
    return NextResponse.json(
      { error: `Invalid format. Must be one of: ${VALID_FORMATS.join(', ')}` },
      { status: 400 },
    )
  }

  // For team_report, verify team membership
  if (exportType === 'team_report') {
    if (!filters.teamId) {
      return NextResponse.json({ error: 'teamId is required for team_report' }, { status: 400 })
    }
    const mem = await pool.query(
      `SELECT role FROM team_members WHERE team_id = $1 AND user_id = $2`,
      [filters.teamId, session.user_id],
    )
    if (!mem.rows[0]) {
      return NextResponse.json({ error: 'Not a member of this team' }, { status: 403 })
    }
  }

  try {
    const result = await generateExport(
      session.user_id as number,
      exportType as ExportType,
      format as ExportFormat,
      filters,
    )

    await auditUser(
      'compliance_export',
      session.user_id as number,
      exportType,
      { format, filters, rowCount: result.rowCount },
    )

    return new NextResponse(result.data, {
      status: 200,
      headers: {
        'Content-Type': result.contentType,
        'Content-Disposition': `attachment; filename="${result.filename}"`,
        'X-Export-Id': result.id,
        'X-Export-Rows': String(result.rowCount),
      },
    })
  } catch (err) {
    secureLogger.error('Compliance export failed', { err })
    return NextResponse.json({ error: 'Export generation failed' }, { status: 500 })
  }
}

/**
 * GET /api/compliance/export
 * Get export history.
 */
export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const access = await checkFeature(session.user_id as number, 'export')
  if (!access.allowed) {
    return NextResponse.json(
      { error: 'Compliance exports require the Pro plan or higher', requiredPlan: access.requiredPlan },
      { status: 403 },
    )
  }

  const history = await getExportHistory(session.user_id as number)
  return NextResponse.json({ exports: history })
}
