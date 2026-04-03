import { pool } from '@/lib/db'
import { normalizeAddress } from '@/lib/eth/normalize'

export type CategoryRow = {
  id: number
  name: string
  description: string | null
  icon: string | null
  color: string | null
  tokenCount: number
}

export async function getTokenCategories(): Promise<CategoryRow[]> {
  const q = `
    SELECT
      tc.id, tc.name, tc.description, tc.icon, tc.color,
      COALESCE(COUNT(tcm.token_address), 0)::int AS "tokenCount"
    FROM token_categories tc
    LEFT JOIN token_category_mappings tcm ON tcm.category_id = tc.id
    GROUP BY tc.id, tc.name, tc.description, tc.icon, tc.color
    ORDER BY LOWER(tc.name) ASC
  `
  const { rows } = await pool.query(q)
  return rows as unknown as CategoryRow[]
}

export async function ensureCategory(name: string, meta: {
  description?: string | null
  icon?: string | null
  color?: string | null
}) {
  const q = `
    INSERT INTO token_categories (name, description, icon, color)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (name) DO UPDATE SET
      description = COALESCE(EXCLUDED.description, token_categories.description),
      icon        = COALESCE(EXCLUDED.icon, token_categories.icon),
      color       = COALESCE(EXCLUDED.color, token_categories.color)
    RETURNING id, name
  `
  const { rows } = await pool.query(q, [name, meta.description ?? null, meta.icon ?? null, meta.color ?? null])
  return rows[0]
}

export async function updateCategory(id: number, meta: {
  name?: string
  description?: string | null
  icon?: string | null
  color?: string | null
}) {
  // Build dynamic update
  const sets: string[] = []
  const params: (string | number | null)[] = []
  let p = 1

  for (const [k, v] of Object.entries(meta)) {
    if (typeof v === 'undefined') continue
    sets.push(`${k} = $${p++}`)
    params.push(v)
  }
  if (!sets.length) return

  params.push(id)
  const q = `UPDATE token_categories SET ${sets.join(', ')} WHERE id = $${p}`
  await pool.query(q, params)
}

export async function deleteCategory(id: number) {
  // FK ON DELETE CASCADE handles mappings
  await pool.query('DELETE FROM token_categories WHERE id = $1', [id])
}

export async function replaceTokenCategories(chainId: number, tokenAddress: string, categoryIds: number[]) {
  const addr = normalizeAddress(tokenAddress)
  // Neon serverless driver doesn't support pool.connect(); use sequential queries.
  await pool.query(
    'DELETE FROM token_category_mappings WHERE chain_id = $1 AND token_address = $2',
    [chainId, addr]
  )
  if (categoryIds.length) {
    const values: string[] = []
    const params: (number | string)[] = []
    let i = 1
    for (const catId of categoryIds) {
      values.push(`($${i++}, $${i++}, $${i++})`)
      params.push(chainId, addr, catId)
    }
    await pool.query(
      `INSERT INTO token_category_mappings (chain_id, token_address, category_id) VALUES ${values.join(',')}`,
      params
    )
  }
}
