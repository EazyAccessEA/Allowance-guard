import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      action,
      actorType,
      actorId,
      subject,
      category,
      severity,
      meta
    } = body

    // Validate required fields
    if (!action || !actorType || !category || !severity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get client IP
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'

    // Get user agent
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Get path
    const path = request.nextUrl.pathname

    // Log audit event to console for now (in production, this would go to a proper audit system)
    console.log('AUDIT LOG:', {
      timestamp: new Date().toISOString(),
      actorType,
      actorId,
      action,
      subject,
      category,
      severity,
      meta: meta || {},
      ip,
      path,
      userAgent
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Audit log error:', error)
    return NextResponse.json(
      { error: 'Failed to log audit event' },
      { status: 500 }
    )
  }
}
