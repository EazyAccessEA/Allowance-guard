import { NextRequest, NextResponse } from 'next/server'
import { getAuditLogs } from '@/lib/audit-enhanced'
import { secureLogger } from '@/lib/secure-logger'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    
    // Parse query parameters
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    const actorType = searchParams.get('actorType') || undefined
    const action = searchParams.get('action') || undefined
    const category = searchParams.get('category') || undefined
    const severity = searchParams.get('severity') || undefined
    const actorId = searchParams.get('actorId') || undefined
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined
    
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

// POST endpoint to create audit log (for testing or manual logging)
export async function POST(req: NextRequest) {
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
