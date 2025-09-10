import { NextResponse } from 'next/server'
import { sendDailyDigests, sendSlackDigests } from '@/lib/alerts'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const emailRes = await sendDailyDigests()
    const slackRes = await sendSlackDigests()
    return NextResponse.json({ 
      ok: true, 
      message: `Sent ${emailRes.sent} email digests and ${slackRes.sent} Slack digests`,
      email: emailRes,
      slack: slackRes
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
    const emailRes = await sendDailyDigests()
    const slackRes = await sendSlackDigests()
    return NextResponse.json({ 
      ok: true, 
      message: `Sent ${emailRes.sent} email digests and ${slackRes.sent} Slack digests`,
      email: emailRes,
      slack: slackRes
    })
  } catch (error) {
    console.error('Daily digest error:', error)
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to send daily digests' 
    }, { status: 500 })
  }
}
