import { NextResponse } from 'next/server'
import { requireUser, verify2FAToken, enable2FA, logSecurityEvent } from '@/lib/auth-enhanced'

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
    
    // Verify the 2FA token
    const isValid = await verify2FAToken(session.user_id, token)
    
    if (!isValid) {
      // Log failed 2FA verification
      await logSecurityEvent(session.user_id, session.id, {
        event_type: '2fa_verification_failed',
        event_data: { method: 'totp' }
      })
      
      return NextResponse.json(
        { error: 'Invalid 2FA token' },
        { status: 400 }
      )
    }
    
    // Enable 2FA and get backup codes
    const { backupCodes } = await enable2FA(session.user_id, token)
    
    // Log successful 2FA enablement
    await logSecurityEvent(session.user_id, session.id, {
      event_type: '2fa_enabled',
      event_data: { method: 'totp' }
    })
    
    return NextResponse.json({
      success: true,
      backupCodes,
      message: '2FA has been enabled successfully'
    })
    
  } catch (error) {
    console.error('2FA verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify 2FA token' },
      { status: 500 }
    )
  }
}
