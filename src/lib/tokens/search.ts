import { pool } from '@/lib/db'

export type TokenSearchFilters = {
  query?: string
  chainId?: number
  category?: string
  verified?: boolean
  limit?: number
  offset?: number
  sort?: 'relevance' | 'verified' | 'name' | 'symbol' | 'recent'
}

export type TokenSearchResult = {
  chainId: number
  tokenAddress: string
  name: string
  symbol: string
  decimals: number | null
  standard: 'ERC20' | 'ERC721' | 'ERC1155'
  verified: boolean
  categories: string[]
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

export async function searchTokens(filters: TokenSearchFilters): Promise<{ tokens: TokenSearchResult[]; total: number }> {
  const {
    query,
    chainId,
    category,
    verified,
    limit = 20,
    offset = 0,
    sort = 'verified'
  } = filters

  const params: (string | number | boolean)[] = []
  let p = 1

  // WHERE conditions
  const where: string[] = []

  if (query && query.trim()) {
    // Use ILIKE for case-insensitive match on name/symbol/address
    where.push(`(
      tm.name ILIKE $${p} OR
      tm.symbol ILIKE $${p} OR
      tm.token_address ILIKE $${p}
    )`)
    params.push(`%${query.trim()}%`)
    p++
  }

  if (typeof chainId === 'number' && Number.isFinite(chainId)) {
    where.push(`tm.chain_id = $${p}`)
    params.push(chainId)
    p++
  }

  if (typeof verified === 'boolean') {
    where.push(`tm.verified = $${p}`)
    params.push(verified)
    p++
  }

  // Category filtering (optional)
  // If a category is provided, we switch LEFT JOIN -> INNER JOIN on the mapping+category
  const needsCategory = typeof category === 'string' && category.trim().length > 0
  if (needsCategory) {
    where.push(`tc.name = $${p}`)
    params.push(category.trim())
    p++
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : ''

  // Sorting
  let orderBy = `tm.verified DESC, tm.name ASC`
  switch (sort) {
    case 'name':
      orderBy = `tm.name ASC, tm.symbol ASC`
      break
    case 'symbol':
      orderBy = `tm.symbol ASC, tm.name ASC`
      break
    case 'recent':
      orderBy = `tm.created_at DESC NULLS LAST, tm.name ASC`
      break
    case 'relevance':
      // crude relevance: verified first, then name match closeness via name length (as proxy)
      // you can enhance in Phase 4 with pg_trgm similarity
      orderBy = `tm.verified DESC, length(tm.name) ASC, tm.name ASC`
      break
    default:
      orderBy = `tm.verified DESC, tm.name ASC`
  }

  const safeLimit = clamp(limit, 1, 100)
  const safeOffset = Math.max(0, offset)

  // COUNT total (distinct pair)
  const countSql = `
    SELECT COUNT(*) AS total
    FROM (
      SELECT tm.chain_id, tm.token_address
      FROM token_metadata tm
      ${needsCategory ? `
        INNER JOIN token_category_mappings tcm
          ON tcm.chain_id = tm.chain_id AND tcm.token_address = tm.token_address
        INNER JOIN token_categories tc ON tc.id = tcm.category_id
      ` : `
        LEFT JOIN token_category_mappings tcm
          ON tcm.chain_id = tm.chain_id AND tcm.token_address = tm.token_address
        LEFT JOIN token_categories tc ON tc.id = tcm.category_id
      `}
      ${whereClause}
      GROUP BY tm.chain_id, tm.token_address
    ) sub
  `

  const dataSql = `
    SELECT
      tm.chain_id              AS "chainId",
      tm.token_address         AS "tokenAddress",
      tm.name                  AS "name",
      tm.symbol                AS "symbol",
      tm.decimals              AS "decimals",
      tm.standard              AS "standard",
      tm.verified              AS "verified",
      COALESCE(ARRAY_AGG(DISTINCT tc.name) FILTER (WHERE tc.name IS NOT NULL), '{}') AS "categories"
    FROM token_metadata tm
    ${needsCategory ? `
      INNER JOIN token_category_mappings tcm
        ON tcm.chain_id = tm.chain_id AND tcm.token_address = tm.token_address
      INNER JOIN token_categories tc ON tc.id = tcm.category_id
    ` : `
      LEFT JOIN token_category_mappings tcm
        ON tcm.chain_id = tm.chain_id AND tcm.token_address = tm.token_address
      LEFT JOIN token_categories tc ON tc.id = tcm.category_id
    `}
    ${whereClause}
    GROUP BY tm.chain_id, tm.token_address, tm.name, tm.symbol, tm.decimals, tm.standard, tm.verified
    ORDER BY ${orderBy}
    LIMIT $${p} OFFSET $${p + 1}
  `

  const countRes = await pool.query<{ total: string }>(countSql, params)
  const total = Number(countRes.rows[0]?.total ?? 0)

  const dataRes = await pool.query<TokenSearchResult>(dataSql, [...params, safeLimit, safeOffset])
  return { tokens: dataRes.rows, total }
}
