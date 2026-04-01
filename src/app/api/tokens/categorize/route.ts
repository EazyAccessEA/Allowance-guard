import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupportedChainIds } from '@/lib/networks'
import { replaceTokenCategories } from '@/lib/tokens/categories'
import { getSession } from '@/lib/auth'

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || '').split(',').filter(Boolean).map(Number)

const bodySchema = z.object({
  chainId: z.coerce.number().int().positive(),
  tokenAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid token address'),
  categoryIds: z.array(z.coerce.number().int().positive()).max(20)
})

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!ADMIN_USER_IDS.includes(session.user_id as number)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const json = await req.json()
    const body = bodySchema.parse(json)

    if (!getSupportedChainIds(true).includes(body.chainId)) {
      return NextResponse.json({ success: false, error: 'Unsupported chainId' }, { status: 400 })
    }

    await replaceTokenCategories(body.chainId, body.tokenAddress, body.categoryIds)
    return NextResponse.json({ success: true, message: 'Token categorized' })
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid categorize payload' }, { status: 400 })
  }
}
