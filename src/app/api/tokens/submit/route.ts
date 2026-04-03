import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { pool } from '@/lib/db'
import { getSupportedChainIds } from '@/lib/networks'
import { normalizeAddress } from '@/lib/eth/normalize'
import { validateTokenOnChain } from '@/lib/eth/validateToken'

const addressRegex = /^0x[a-fA-F0-9]{40}$/

const submissionSchema = z.object({
  chainId: z.coerce.number().int().positive(),
  tokenAddress: z.string().regex(addressRegex, 'Invalid token address'),
  name: z.string().min(1).max(100),
  symbol: z.string().min(1).max(12),
  decimals: z.coerce.number().int().min(0).max(36).optional(),
  standard: z.enum(['ERC20', 'ERC721', 'ERC1155']).optional(),
  description: z.string().max(600).optional(),
  website: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
  submittedBy: z.string().email('submittedBy must be an email')
})

export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const body = submissionSchema.parse(json)

    // 1) chain is supported?
    const enabledChains = getSupportedChainIds(true)
    if (!enabledChains.includes(body.chainId)) {
      return NextResponse.json({ success: false, error: 'Unsupported chainId' }, { status: 400 })
    }

    // 2) normalize address
    const tokenAddress = normalizeAddress(body.tokenAddress)

    // 3) dedupe against approved metadata
    {
      const q = `SELECT 1 FROM token_metadata WHERE chain_id = $1 AND token_address = $2 LIMIT 1`
      const r = await pool.query(q, [body.chainId, tokenAddress])
      if (r.rowCount && r.rows.length > 0) {
        return NextResponse.json({ success: false, error: 'Token already listed' }, { status: 409 })
      }
    }

    // 4) dedupe against existing submissions
    {
      const q = `SELECT status FROM token_submissions WHERE chain_id = $1 AND token_address = $2 LIMIT 1`
      const r = await pool.query(q, [body.chainId, tokenAddress])
      if (r.rowCount && r.rows.length > 0) {
        return NextResponse.json({ success: false, error: `Token already submitted (${String(r.rows[0].status)})` }, { status: 409 })
      }
    }

    // 5) on-chain validation
    const validation = await validateTokenOnChain({
      chainId: body.chainId,
      tokenAddress,
      claimedStandard: body.standard
    })
    if (!validation.valid) {
      return NextResponse.json({ success: false, error: `On-chain validation failed: ${validation.reason}` }, { status: 400 })
    }

    // If ERC20 and client omitted decimals, adopt detected value (best effort)
    const decimals = body.decimals ?? (validation.standard === 'ERC20' ? validation.decimals ?? null : null)

    // 6) persist submission
    const insertSql = `
      INSERT INTO token_submissions
        (chain_id, token_address, name, symbol, decimals, standard, description, website, logo_url, submitted_by, status, verified)
      VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'pending',false)
      RETURNING id
    `
    const params = [
      body.chainId,
      tokenAddress,
      body.name,
      body.symbol,
      decimals,
      validation.standard,  // trust detected standard
      body.description ?? null,
      body.website ?? null,
      body.logoUrl ?? null,
      body.submittedBy
    ]
    const res = await pool.query(insertSql, params)

    return NextResponse.json({
      success: true,
      submissionId: res.rows[0].id,
      detectedStandard: validation.standard,
      message: 'Token submitted for review'
    })
  } catch {
    // Zod error or JSON parse error
    return NextResponse.json({ success: false, error: 'Invalid submission data' }, { status: 400 })
  }
}
