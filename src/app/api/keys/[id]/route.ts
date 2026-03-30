import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { revokeApiKey } from '@/lib/api-keys'
import { withReq } from '@/lib/logger'
import { auditUserAction } from '@/lib/audit-enhanced'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * DELETE /api/keys/[id]
 * Revoke an API key (soft delete).
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const L = withReq(req)

  try {
    const session = await requireUser()
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Key ID required' }, { status: 400 })
    }

    const revoked = await revokeApiKey(session.user_id as number, id)

    if (!revoked) {
      return NextResponse.json(
        { error: 'API key not found or already revoked' },
        { status: 404 },
      )
    }

    await auditUserAction(
      'api_key.revoked',
      String(session.user_id),
      id,
      {},
    )

    L.info('keys.revoke.success', { userId: session.user_id, keyId: id })

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHENTICATED') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    L.error('keys.revoke.failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return NextResponse.json({ error: 'Failed to revoke API key' }, { status: 500 })
  }
}
