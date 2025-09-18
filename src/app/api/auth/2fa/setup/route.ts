import { NextResponse } from 'next/server'
import { requireUser, generate2FASecret, logSecurityEvent } from '@/lib/auth-enhanced'

export async function POST() {
  try {
    const session = await requireUser()
    
    // Generate 2FA secret and QR code
    const { secret, qrCode } = await generate2FASecret(session.user_id)
    
    // Log 2FA setup initiation
    await logSecurityEvent(session.user_id, session.id, {
      event_type: '2fa_setup_initiated',
      event_data: { method: 'totp' }
    })
    
    return NextResponse.json({
      success: true,
      secret,
      qrCode
    })
    
  } catch (error) {
    console.error('2FA setup error:', error)
    return NextResponse.json(
      { error: 'Failed to setup 2FA' },
      { status: 500 }
    )
  }
}
