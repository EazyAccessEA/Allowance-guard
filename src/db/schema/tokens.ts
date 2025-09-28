import {
  pgTable, bigint, integer, text, varchar, boolean, timestamp,
  pgEnum, primaryKey, serial, index, uniqueIndex
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

/** ---------- Enums ---------- */
export const tokenStandard = pgEnum('token_standard', ['ERC20', 'ERC721', 'ERC1155'])
export const curationStatus = pgEnum('curation_status', ['pending', 'approved', 'rejected'])

/** ---------- Helpers ---------- */
const nowTs = sql`now()`

/** ---------- Canonical metadata (approved/known tokens) ---------- */
export const tokenMetadata = pgTable('token_metadata', {
  chainId: integer('chain_id').notNull(),
  tokenAddress: varchar('token_address', { length: 42 }).notNull(), // lowercased 0x...
  name: text('name').notNull(),
  symbol: text('symbol').notNull(),
  decimals: integer('decimals'),
  standard: tokenStandard('standard').notNull().default('ERC20'),
  description: text('description'),
  website: text('website'),
  logoUrl: text('logo_url'),
  verified: boolean('verified').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: false }).notNull().default(nowTs),
  updatedAt: timestamp('updated_at', { withTimezone: false }).notNull().default(nowTs)
}, (t) => ({
  pk: primaryKey({ columns: [t.chainId, t.tokenAddress] }),
  byName: index('idx_token_metadata_name').on(t.name),
  bySymbol: index('idx_token_metadata_symbol').on(t.symbol),
  byVerified: index('idx_token_metadata_verified').on(t.verified)
}))

/** ---------- Community submissions (review queue) ---------- */
export const tokenSubmissions = pgTable('token_submissions', {
  id: bigint('id', { mode: 'bigint' }).primaryKey().default(sql`generated always as identity`),
  chainId: integer('chain_id').notNull(),
  tokenAddress: varchar('token_address', { length: 42 }).notNull(), // lowercased 0x...
  name: text('name').notNull(),
  symbol: text('symbol').notNull(),
  decimals: integer('decimals'),
  standard: tokenStandard('standard').notNull().default('ERC20'),
  description: text('description'),
  website: text('website'),
  logoUrl: text('logo_url'),
  submittedBy: text('submitted_by').notNull(), // email or wallet
  status: curationStatus('status').notNull().default('pending'),
  verified: boolean('verified').notNull().default(false),
  adminNotes: text('admin_notes'),
  createdAt: timestamp('created_at', { withTimezone: false }).notNull().default(nowTs),
  updatedAt: timestamp('updated_at', { withTimezone: false }).notNull().default(nowTs)
}, (t) => ({
  uniqPerToken: uniqueIndex('uq_token_submissions_token').on(t.chainId, t.tokenAddress),
  byStatus: index('idx_token_submissions_status').on(t.status),
  bySubmitter: index('idx_token_submissions_submitted_by').on(t.submittedBy),
  byCreated: index('idx_token_submissions_created_at').on(t.createdAt)
}))

/** ---------- Categories ---------- */
export const tokenCategories = pgTable('token_categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  icon: text('icon'),
  color: text('color'),
  createdAt: timestamp('created_at', { withTimezone: false }).notNull().default(nowTs)
})

/** ---------- Category mappings (many-to-many) ---------- */
export const tokenCategoryMappings = pgTable('token_category_mappings', {
  chainId: integer('chain_id').notNull(),
  tokenAddress: varchar('token_address', { length: 42 }).notNull(), // lowercased 0x...
  categoryId: integer('category_id').notNull().references(() => tokenCategories.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: false }).notNull().default(nowTs)
}, (t) => ({
  pk: primaryKey({ columns: [t.chainId, t.tokenAddress, t.categoryId] }),
  byCategory: index('idx_token_category_mappings_category').on(t.categoryId)
}))
