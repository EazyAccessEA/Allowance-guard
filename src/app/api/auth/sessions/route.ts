import { NextResponse } from 'next/server'
import { requireUser, invalidateSession, logSecurityEvent } from '@/lib/auth-enhanced'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    const session = await requireUser()
    
    // Get all active sessions for the user
    const { rows } = await pool.query(
      `SELECT 
        id, device_name, device_type, browser_name, browser_version,
        os_name, os_version, ip_address, location_country, location_city,
        is_trusted, last_activity_at, created_at, expires_at
       FROM sessions 
       WHERE user_id = $1 AND expires_at > NOW()
       ORDER BY last_activity_at DESC`,
      [session.user_id]
    )
    
    // Sanitize sensitive information
    const sanitizedSessions = rows.map(sess => ({
      id: sess.id,
      device_name: sess.device_name,
      device_type: sess.device_type,
      browser_name: sess.browser_name,
      browser_version: sess.browser_version,
      os_name: sess.os_name,
      os_version: sess.os_version,
      ip_address: sess.ip_address ? sess.ip_address.replace(/\d+$/, '***') : null, // Mask last octet
      location_country: sess.location_country,
      location_city: sess.location_city,
      is_trusted: sess.is_trusted,
      last_activity_at: sess.last_activity_at,
      created_at: sess.created_at,
      expires_at: sess.expires_at,
      is_current: sess.id === session.id
    }))
    
    return NextResponse.json({
      success: true,
      sessions: sanitizedSessions
    })
    
  } catch (error) {
    console.error('Get sessions error:', error)
    return NextResponse.json(
      { error: 'Failed to get sessions' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await requireUser()
    const { sessionId } = await req.json()
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }
    
    // Verify the session belongs to the user
    const { rows } = await pool.query(
      `SELECT id FROM sessions WHERE id = $1 AND user_id = $2`,
      [sessionId, session.user_id]
    )
    
    if (!rows[0]) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }
    
    // Invalidate the session
    await invalidateSession(sessionId)
    
    // Log session invalidation
    await logSecurityEvent(session.user_id, session.id, {
      event_type: 'session_invalidated',
      event_data: { invalidated_session_id: sessionId }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Session invalidated successfully'
    })
    
  } catch (error) {
    console.error('Invalidate session error:', error)
    return NextResponse.json(
      { error: 'Failed to invalidate session' },
      { status: 500 }
    )
  }
}
