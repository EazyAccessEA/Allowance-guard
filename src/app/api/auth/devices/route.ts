import { NextResponse } from 'next/server'
import { requireUser, getTrustedDevices, removeTrustedDevice, logSecurityEvent } from '@/lib/auth-enhanced'

export async function GET() {
  try {
    const session = await requireUser()
    const devices = await getTrustedDevices(session.user_id)
    
    // Remove sensitive information
    const sanitizedDevices = devices.map((device) => {
      const d = device as Record<string, unknown>
      return {
        id: d.id,
        device_name: d.device_name,
        device_type: d.device_type,
        browser_name: d.browser_name,
        browser_version: d.browser_version,
        os_name: d.os_name,
        os_version: d.os_version,
        last_used_at: d.last_used_at,
        created_at: d.created_at
      }
    })
    
    return NextResponse.json({
      success: true,
      devices: sanitizedDevices
    })
    
  } catch (error) {
    console.error('Get devices error:', error)
    return NextResponse.json(
      { error: 'Failed to get devices' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await requireUser()
    const { deviceFingerprint } = await req.json()
    
    if (!deviceFingerprint) {
      return NextResponse.json(
        { error: 'Device fingerprint is required' },
        { status: 400 }
      )
    }
    
    // Remove the trusted device
    await removeTrustedDevice(session.user_id, deviceFingerprint)
    
    // Log device removal
    await logSecurityEvent(session.user_id, session.id, {
      event_type: 'trusted_device_removed',
      event_data: { device_fingerprint: deviceFingerprint }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Device removed successfully'
    })
    
  } catch (error) {
    console.error('Remove device error:', error)
    return NextResponse.json(
      { error: 'Failed to remove device' },
      { status: 500 }
    )
  }
}
