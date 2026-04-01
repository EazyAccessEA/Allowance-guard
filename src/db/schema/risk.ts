import {
  pgTable, integer, varchar, boolean, timestamp, index,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

const nowTs = sql`now()`

/**
 * Cache of contract verification status from block explorers.
 * Used by the risk scoring system to check if spender contracts
 * have verified source code.
 */
export const contractVerificationCache = pgTable('contract_verification_cache', {
  chainId: integer('chain_id').notNull(),
  address: varchar('address', { length: 42 }).notNull(),
  verified: boolean('verified').notNull().default(false),
  checkedAt: timestamp('checked_at').default(nowTs).notNull(),
}, (table) => [
  index('idx_cvc_chain_address').on(table.chainId, table.address),
])
