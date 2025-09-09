import { NextResponse } from 'next/server'
import { sendDailyDigests } from '@/lib/alerts'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const res = await sendDailyDigests()
    return NextResponse.json({ 
      ok: true, 
      message: `Sent ${res.sent} digests with ${res.errors} errors`,
      ...res 
    })
  } catch (error) {
    console.error('Daily digest error:', error)
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to send daily digests' 
    }, { status: 500 })
  }
}

export async function POST() {
  try {
    const res = await sendDailyDigests()
    return NextResponse.json({ 
      ok: true, 
      message: `Sent ${res.sent} digests with ${res.errors} errors`,
      ...res 
    })
  } catch (error) {
    console.error('Daily digest error:', error)
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to send daily digests' 
    }, { status: 500 })
  }
}
