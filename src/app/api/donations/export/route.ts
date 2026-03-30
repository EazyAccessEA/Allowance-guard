// /src/app/api/donations/export/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { donations } from '@/db/schema'
import { desc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

function escapeCSV(value: unknown): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export async function GET() {
  const rows = await db
    .select()
    .from(donations)
    .orderBy(desc(donations.createdAt))
    .limit(10000)

  const headers = [
    'created_at',
    'stripe_session_id',
    'stripe_event_id',
    'amount_total',
    'currency',
    'email',
    'payer_name',
    'payment_status',
  ]

  const lines = [headers.join(',')]

  for (const r of rows as Array<Record<string, unknown>>) {
    lines.push([
      r.createdAt,
      r.stripeSessionId,
      r.stripeEventId,
      r.amountTotal,
      r.currency,
      r.email ?? '',
      r.payerName ?? '',
      r.paymentStatus,
    ].map(escapeCSV).join(','))
  }

  const csv = lines.join('\n')
  const filename = `donations-${new Date().toISOString().slice(0,10)}.csv`

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
