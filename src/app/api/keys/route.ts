import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { requireUser } from '@/lib/auth'
import { generateApiKey, listApiKeys } from '@/lib/api-keys'
import { validateRequest } from '@/middleware/validation'
import { withReq } from '@/lib/logger'
import { auditUserAction } from '@/lib/audit-enhanced'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const createKeySchema = z.object({
  name: z.string().min(1).max(100).default('Default'),
})

/**
 * GET /api/keys
 * List all active API keys for the current user.
 */
export async function GET(req: Request) {
  const L = withReq(req)

  try {
    const session = await requireUser()
    const keys = await listApiKeys(session.user_id as number)

    return NextResponse.json({ ok: true, keys })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHENTICATED') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    L.error('keys.list.failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return NextResponse.json({ error: 'Failed to list API keys' }, { status: 500 })
  }
}

/**
 * POST /api/keys
 * Generate a new API key. The plaintext key is returned only once.
 */
export async function POST(req: Request) {
  const L = withReq(req)

  try {
    const session = await requireUser()

    const validation = await validateRequest(createKeySchema)(req as NextRequest)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error, details: validation.details },
        { status: 400 },
      )
    }

    const { name } = validation.data!

    // Limit number of active keys per user
    const existing = await listApiKeys(session.user_id as number)
    if (existing.length >= 5) {
      return NextResponse.json(
        { error: 'Maximum of 5 active API keys per account', code: 'KEY_LIMIT_EXCEEDED' },
        { status: 400 },
      )
    }

    const result = await generateApiKey(session.user_id as number, name)

    await auditUserAction(
      'api_key.created',
      String(session.user_id),
      result.id,
      { prefix: result.prefix, name },
    )

    L.info('keys.create.success', { userId: session.user_id, keyId: result.id })

    return NextResponse.json({
      ok: true,
      key: result.key, // Shown only once
      id: result.id,
      prefix: result.prefix,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHENTICATED') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    L.error('keys.create.failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return NextResponse.json({ error: 'Failed to create API key' }, { status: 500 })
  }
}
