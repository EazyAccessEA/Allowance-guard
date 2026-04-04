import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { getUserInvoices } from '@/lib/billing'
import { withReq } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/billing/invoices
 *
 * Returns the authenticated user's invoice history from the local DB.
 * Invoices are populated by the Stripe webhook handler.
 */
export async function GET(req: Request) {
  const L = withReq(req)

  try {
    const session = await requireUser()
    const invoices = await getUserInvoices(session.user_id as number)

    return NextResponse.json({ ok: true, invoices })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHENTICATED') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    L.error('billing.invoices.list.failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 })
  }
}
