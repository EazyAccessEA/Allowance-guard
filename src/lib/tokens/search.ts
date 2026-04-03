import { pool } from '@/lib/db'

export type TokenSearchFilters = {
  query?: string
  chainId?: number
  category?: string
  verified?: boolean
  limit?: number
  offset?: number
  sort?: 'relevance' | 'verified' | 'name' | 'symbol' | 'recent'
  fuzzy?: boolean               // NEW: default true when q present and length >= 3
  minScore?: number             // NEW: optional score floor (0..~3)
}

export type TokenSearchResult = {
  chainId: number
  tokenAddress: string
  name: string
  symbol: string
  decimals: number | null
  standard: 'ERC20' | 'ERC721' | 'ERC1155'
  description: string | null
  website: string | null
  logoUrl: string | null
  verified: boolean
  categories: string[]
  score?: number                // NEW: only in fuzzy mode
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
    sort,                 // if q present and sort not provided -> default 'relevance'
    fuzzy,
    minScore
  } = filters

  const qNorm = (query ?? '').trim().toLowerCase()
  const useFuzzy = !!qNorm && (fuzzy ?? (qNorm.length >= 3))
  const safeLimit = clamp(limit, 1, 100)
  const safeOffset = Math.max(0, offset)

  const params: (string | number | boolean)[] = []
  let p = 1

  const where: string[] = []
  const needsCategory = typeof category === 'string' && category.trim().length > 0

  // Common filters
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
  if (needsCategory) {
    where.push(`tc.name = $${p}`)
    params.push(category!.trim())
    p++
  }

  // Text filter (fuzzy vs classic)
  if (qNorm) {
    if (useFuzzy) {
      // Recall-oriented filter: either LIKE match or trigram similarity over small floor
      where.push(`(
        lower(tm.name)   ILIKE $${p} OR
        lower(tm.symbol) ILIKE $${p + 1} OR
        tm.token_address ILIKE $${p + 2} OR
        similarity(lower(tm.name),   $${p + 3}) > 0.1 OR
        similarity(lower(tm.symbol), $${p + 3}) > 0.1
      )`)
      params.push(`%${qNorm}%`, `%${qNorm}%`, `${qNorm}%`, qNorm)
      p += 4
    } else {
      // Classic ILIKE
      where.push(`(
        lower(tm.name)   ILIKE $${p} OR
        lower(tm.symbol) ILIKE $${p + 1} OR
        tm.token_address ILIKE $${p + 2}
      )`)
      params.push(`%${qNorm}%`, `%${qNorm}%`, `${qNorm}%`)
      p += 3
    }
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : ''

  // COUNT total distinct tokens
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
  const countRes = await pool.query(countSql, params)
  const total = Number(countRes.rows[0]?.total ?? 0)

  // ORDER & SCORE
  let orderBy = `tm.verified DESC, tm.name ASC`
  let selectScore = `NULL::float AS "score"`

  if (useFuzzy) {
    // Weighted score:
    //  - symbol similarity (x1.5)
    //  - name similarity (x1.0)
    //  - exact/prefix bonuses for symbol/name/address
    //  - verified boost (+0.5)
    // Result is ~[0..3]; tune weights as you like.
    selectScore = `
      (
        -- similarity components
        1.5 * similarity(lower(tm.symbol), $${p}) +
        1.0 * similarity(lower(tm.name),   $${p}) +
        -- exact/prefix bonuses
        CASE WHEN lower(tm.symbol) = $${p} THEN 0.9
             WHEN lower(tm.symbol) LIKE $${p + 1} THEN 0.6 ELSE 0 END +
        CASE WHEN lower(tm.name)   = $${p} THEN 0.4
             WHEN lower(tm.name)   LIKE $${p + 1} THEN 0.3 ELSE 0 END +
        CASE WHEN tm.token_address = $${p} THEN 0.8
             WHEN tm.token_address LIKE $${p + 1} THEN 0.2 ELSE 0 END +
        -- verified boost
        CASE WHEN tm.verified THEN 0.5 ELSE 0 END
      ) AS "score"
    `
    params.push(qNorm, `${qNorm}%`)
    p += 2

    orderBy = `"score" DESC, tm.verified DESC, tm.name ASC`
  } else {
    // Classic sorting
    switch (sort) {
      case 'name':
        orderBy = `tm.name ASC, tm.symbol ASC`; break
      case 'symbol':
        orderBy = `tm.symbol ASC, tm.name ASC`; break
      case 'recent':
        orderBy = `tm.created_at DESC NULLS LAST, tm.name ASC`; break
      case 'relevance':
      case 'verified':
      default:
        orderBy = `tm.verified DESC, tm.name ASC`
    }
  }

  // Optional minScore floor (fuzzy only)
  let havingClause = ''
  if (useFuzzy && typeof minScore === 'number') {
    havingClause = `HAVING (${selectScore.replace(/ AS "score"$/,'')}) >= ${Math.max(0, minScore)}`
    // Note: this inlines expression; safe since we don't inject untrusted strings (minScore is numeric).
  }

  // DATA query
  const dataSql = `
    SELECT
      tm.chain_id              AS "chainId",
      tm.token_address         AS "tokenAddress",
      tm.name                  AS "name",
      tm.symbol                AS "symbol",
      tm.decimals              AS "decimals",
      tm.standard              AS "standard",
      tm.description           AS "description",
      tm.website               AS "website",
      tm.logo_url              AS "logoUrl",
      tm.verified              AS "verified",
      COALESCE(ARRAY_AGG(DISTINCT tc.name) FILTER (WHERE tc.name IS NOT NULL), '{}') AS "categories",
      ${selectScore}
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
    GROUP BY tm.chain_id, tm.token_address, tm.name, tm.symbol, tm.decimals, tm.standard, tm.description, tm.website, tm.logo_url, tm.verified
    ${havingClause}
    ORDER BY ${orderBy}
    LIMIT $${p} OFFSET $${p + 1}
  `
  const dataRes = await pool.query(dataSql, [...params, safeLimit, safeOffset])
  return { tokens: dataRes.rows as unknown as TokenSearchResult[], total }
}
