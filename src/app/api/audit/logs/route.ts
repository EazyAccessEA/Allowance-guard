import { NextRequest, NextResponse } from 'next/server'
import { getAuditLogs } from '@/lib/audit-enhanced'
import { secureLogger } from '@/lib/secure-logger'
import { getSession } from '@/lib/auth'

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || '').split(',').filter(Boolean).map(Number)

function isAdmin(userId: number): boolean {
  return ADMIN_USER_IDS.includes(userId)
}

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)

    // Parse query parameters
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    const actorType = searchParams.get('actorType') || undefined
    const action = searchParams.get('action') || undefined
    const category = searchParams.get('category') || undefined
    const severity = searchParams.get('severity') || undefined
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined

    // Non-admin users can only see their own logs
    const actorId = isAdmin(session.user_id) ? (searchParams.get('actorId') || undefined) : String(session.user_id)

    // Validate parameters
    if (limit > 1000) {
      return NextResponse.json({ error: 'Limit cannot exceed 1000' }, { status: 400 })
    }

    if (offset < 0) {
      return NextResponse.json({ error: 'Offset cannot be negative' }, { status: 400 })
    }

    const logs = await getAuditLogs({
      limit,
      offset,
      actorType,
      action,
      category,
      severity,
      startDate,
      endDate,
      actorId
    })

    return NextResponse.json(logs)
    
  } catch (error) {
    secureLogger.error('Failed to retrieve audit logs', { error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST endpoint to create audit log — requires admin role
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!isAdmin(session.user_id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()

    // Validate required fields
    if (!body.action || !body.actorType) {
      return NextResponse.json({ error: 'Missing required fields: action, actorType' }, { status: 400 })
    }
    
    // Import audit functions
    const { auditEvent } = await import('@/lib/audit-enhanced')
    
    await auditEvent({
      actorType: body.actorType,
      actorId: body.actorId || null,
      action: body.action,
      subject: body.subject || null,
      meta: body.meta || {},
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null,
      path: req.nextUrl.pathname,
      userAgent: req.headers.get('user-agent') || null,
      sessionId: req.headers.get('x-session-id') || null,
      severity: body.severity || 'medium',
      category: body.category || 'data_access'
    })
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    secureLogger.error('Failed to create audit log', { error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
