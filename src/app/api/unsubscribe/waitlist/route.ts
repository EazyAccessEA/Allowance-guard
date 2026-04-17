import { NextResponse } from 'next/server'
import { db } from '@/db'
import { waitlistSubscribers } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return new NextResponse(unsubPage('Invalid unsubscribe link.', false), {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    })
  }

  try {
    const result = await db
      .update(waitlistSubscribers)
      .set({ unsubscribed: true, updatedAt: new Date() })
      .where(eq(waitlistSubscribers.id, id))
      .returning({ id: waitlistSubscribers.id })

    if (result.length === 0) {
      return new NextResponse(unsubPage('Subscription not found.', false), {
        status: 404,
        headers: { 'Content-Type': 'text/html' },
      })
    }

    return new NextResponse(unsubPage('You have been unsubscribed.', true), {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    })
  } catch (err) {
    console.error('[unsubscribe/waitlist] failed', err)
    return new NextResponse(unsubPage('Something went wrong. Please try again.', false), {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    })
  }
}

function unsubPage(message: string, success: boolean): string {
  // Inline-styled HTML response (no React render — this endpoint serves
  // direct GET hits from email links). Ledger canon: paper bg, ink text,
  // hairline rule, sharp corners, single oxblood beat.
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${success ? 'Unsubscribed' : 'Error'} — AllowanceGuard</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F7F5F0; color: #0F1115; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 24px; }
    .card { background: #F7F5F0; border-left: 3px solid #2D0A0A; padding: 40px 36px; max-width: 460px; text-align: left; }
    .wordmark { font-family: Georgia, 'Times New Roman', serif; font-style: italic; font-size: 18px; color: #0F1115; margin: 0 0 24px; padding-bottom: 16px; border-bottom: 1px solid rgba(15,17,21,0.14); }
    h1 { font-family: Georgia, 'Times New Roman', serif; font-style: italic; font-weight: normal; font-size: 26px; color: #0F1115; margin: 0 0 12px; letter-spacing: -0.015em; }
    p { color: #2A2D33; line-height: 1.6; margin: 0 0 24px; font-size: 15px; }
    a.button { display: inline-block; background: #2D0A0A; color: #F7F5F0; padding: 12px 24px; text-decoration: none; font-weight: 600; font-size: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <p class="wordmark">AllowanceGuard</p>
    <h1>${success ? "Done. You're unsubscribed." : 'Something went wrong.'}</h1>
    <p>${message}</p>
    <a class="button" href="https://www.allowanceguard.com">Back to AllowanceGuard</a>
  </div>
</body>
</html>`
}
