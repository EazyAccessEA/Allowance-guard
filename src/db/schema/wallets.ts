import {
  pgTable,
  uuid,
  integer,
  text,
  timestamp,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

/**
 * user_wallets — wallets a signed-in user has saved to their account.
 *
 * Distinct from `wallet_monitors` (which holds monitor-cron config for
 * Sentinel-tier customers' actively-watched wallets) and the homepage
 * scanner's anonymous flow (no persistence). This is the user's
 * "address book" — wallets they want to see in their dashboard, scan
 * with one click, and label.
 *
 * Quota gated by feature-gate.ts checkWalletQuota:
 *   - Free:      3 wallets (CONSUMER_PLAN_LIMITS.free.maxWallets)
 *   - Pro:       unlimited
 *   - Sentinel:  unlimited
 *
 * The unique index on (user_id, lower(wallet_address)) prevents the
 * same user saving the same address twice in different cases.
 *
 * Council:
 *   #18 DBA: ON DELETE CASCADE so deleting a user removes their saved
 *     wallets without orphaned rows; uuid PK avoids enumerable IDs;
 *     index on user_id since every read is by-user.
 *   #4 Security: every read/write must filter by user_id at the
 *     query layer (enforced in /api/account/wallets routes).
 *   #15 Staff engineer: minimal schema — no event_count / last_scanned
 *     etc. (those belong in scan/monitor tables); just the address book.
 */
export const userWallets = pgTable(
  'user_wallets',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: integer('user_id').notNull(),
    walletAddress: text('wallet_address').notNull(),
    /** Optional user-given label, e.g. "Trading wallet" — max 80 chars enforced at API layer */
    label: text('label'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index('user_wallets_user_id_idx').on(t.userId),
    /**
     * Case-insensitive uniqueness so the same address (with/without
     * checksum casing differences) isn't saved twice. Mirrors the
     * `lower()` comparisons elsewhere in the codebase.
     */
    uniqUserAddr: uniqueIndex('user_wallets_user_addr_uniq').on(t.userId, t.walletAddress),
  }),
)
