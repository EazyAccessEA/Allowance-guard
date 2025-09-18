import { NextResponse } from 'next/server'
import { requireUser, verify2FAToken, logSecurityEvent } from '@/lib/auth-enhanced'
import { pool } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const session = await requireUser()
    const { token } = await req.json()
    
    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: '2FA token is required' },
        { status: 400 }
      )
    }
    
    // Verify the 2FA token before disabling
    const isValid = await verify2FAToken(session.user_id, token)
    
    if (!isValid) {
      // Log failed 2FA verification
      await logSecurityEvent(session.user_id, session.id, {
        event_type: '2fa_disable_verification_failed',
        event_data: { method: 'totp' }
      })
      
      return NextResponse.json(
        { error: 'Invalid 2FA token' },
        { status: 400 }
      )
    }
    
    // Disable 2FA
    await pool.query(
      `UPDATE users SET 
        two_factor_enabled = FALSE, 
        two_factor_secret = NULL 
       WHERE id = $1`,
      [session.user_id]
    )
    
    // Delete all backup codes
    await pool.query(
      `DELETE FROM user_backup_codes WHERE user_id = $1`,
      [session.user_id]
    )
    
    // Log successful 2FA disablement
    await logSecurityEvent(session.user_id, session.id, {
      event_type: '2fa_disabled',
      event_data: { method: 'totp' }
    })
    
    return NextResponse.json({
      success: true,
      message: '2FA has been disabled successfully'
    })
    
  } catch (error) {
    console.error('2FA disable error:', error)
    return NextResponse.json(
      { error: 'Failed to disable 2FA' },
      { status: 500 }
    )
  }
}
