import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupportedChainIds } from '@/lib/networks'
import { replaceTokenCategories } from '@/lib/tokens/categories'

// TODO: auth guard (admin or trusted curator)

const bodySchema = z.object({
  chainId: z.coerce.number().int().positive(),
  tokenAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid token address'),
  categoryIds: z.array(z.coerce.number().int().positive()).max(20)
})

export async function POST(req: NextRequest) {
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
