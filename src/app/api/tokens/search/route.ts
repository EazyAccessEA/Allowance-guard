import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { searchTokens } from '@/lib/tokens/search'

const searchSchema = z.object({
  q: z.string().optional(),
  chainId: z.coerce.number().int().positive().optional(),
  category: z.string().optional(),
  verified: z
    .union([z.string(), z.boolean()])
    .transform(v => (typeof v === 'string' ? v === 'true' : v))
    .optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  sort: z.enum(['relevance', 'verified', 'name', 'symbol', 'recent']).optional()
})

export async function GET(req: NextRequest) {
  try {
    const paramsObj = Object.fromEntries(new URL(req.url).searchParams.entries())
    const parsed = searchSchema.parse(paramsObj)

    const { tokens, total } = await searchTokens({
      query: parsed.q,
      chainId: parsed.chainId,
      category: parsed.category,
      verified: parsed.verified,
      limit: parsed.limit,
      offset: parsed.offset,
      sort: parsed.sort
    })

    return NextResponse.json({
      success: true,
      data: tokens,
      pagination: {
        total,
        limit: parsed.limit,
        offset: parsed.offset,
        hasMore: total > parsed.offset + parsed.limit
      }
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid search parameters' },
      { status: 400 }
    )
  }
}
