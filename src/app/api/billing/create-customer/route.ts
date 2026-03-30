import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { getOrCreateCustomer } from '@/lib/billing'
import { withReq } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const L = withReq(req)

  try {
    const session = await requireUser()
    const customerId = await getOrCreateCustomer(
      session.user_id as number,
      session.email as string,
    )

    L.info('billing.customer.created', { userId: session.user_id, customerId })

    return NextResponse.json({ ok: true, customerId })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHENTICATED') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    L.error('billing.customer.failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
  }
}
