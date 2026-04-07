/**
 * POST /api/keys/public
 *
 * Issue a new PUBLIC API key (`ag_pub_*`) for the authenticated user.
 * Public keys are browser-safe: read-only (GET only), rate-limited on the
 * `api_public` plan, and optionally origin-locked.
 *
 * See migration 027 and src/middleware/api-auth.ts for the enforcement
 * points. The plaintext key is returned exactly once.
 */
import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { requireUser } from '@/lib/auth'
import { generatePublicApiKey, listApiKeys } from '@/lib/api-keys'
import { validateRequest } from '@/middleware/validation'
import { withReq } from '@/lib/logger'
import { auditUserAction } from '@/lib/audit-enhanced'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const originSchema = z
  .string()
  .min(1)
  .max(253)
  .refine(
    (v) => /^https?:\/\/[^\s/]+$/i.test(v),
    'Origin must be of the form https://example.com (no path)',
  )

const createPublicKeySchema = z.object({
  name: z.string().min(1).max(100).default('Public (browser)'),
  allowedOrigins: z.array(originSchema).max(20).optional(),
})

export async function POST(req: Request) {
  const L = withReq(req)

  try {
    const session = await requireUser()

    const validation = await validateRequest(createPublicKeySchema)(req as NextRequest)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error, details: validation.details },
        { status: 400 },
      )
    }

    const { name, allowedOrigins } = validation.data!

    // Limit total active keys per user (secret + public combined)
    const existing = await listApiKeys(session.user_id as number)
    if (existing.length >= 5) {
      return NextResponse.json(
        { error: 'Maximum of 5 active API keys per account', code: 'KEY_LIMIT_EXCEEDED' },
        { status: 400 },
      )
    }

    const result = await generatePublicApiKey(
      session.user_id as number,
      name,
      allowedOrigins,
    )

    await auditUserAction(
      'api_key.created',
      String(session.user_id),
      result.id,
      { prefix: result.prefix, name, keyType: 'public', allowedOrigins },
    )

    L.info('keys.public.create.success', { userId: session.user_id, keyId: result.id })

    return NextResponse.json({
      ok: true,
      key: result.key, // Shown only once
      id: result.id,
      prefix: result.prefix,
      keyType: 'public' as const,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHENTICATED') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    L.error('keys.public.create.failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return NextResponse.json({ error: 'Failed to create public API key' }, { status: 500 })
  }
}
