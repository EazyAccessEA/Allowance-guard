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
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${success ? 'Unsubscribed' : 'Error'} — AllowanceGuard</title>
  <style>
    body { font-family: 'IBM Plex Sans', -apple-system, sans-serif; background: #F7F5F0; color: #0F1115; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { background: #fff; border: 1px solid rgba(15,17,21,0.14); border-radius: 12px; padding: 48px 40px; max-width: 440px; text-align: center; box-shadow: 0 1px 3px rgba(15,17,21,0.06); }
    h1 { font-size: 24px; margin: 0 0 12px; }
    p { color: #4A4D54; line-height: 1.6; margin: 0 0 24px; }
    a { display: inline-block; background: #0F1115; color: #F7F5F0; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 500; }
    a:hover { background: #2A2D33; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${success ? 'Done' : 'Oops'}</h1>
    <p>${message}</p>
    <a href="https://www.allowanceguard.com">Back to AllowanceGuard</a>
  </div>
</body>
</html>`
}
