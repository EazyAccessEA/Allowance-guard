-- 031_user_wallets.sql
--
-- Create the user_wallets table that holds a signed-in user's saved
-- wallet address-book.
--
-- The Drizzle schema at src/db/schema/wallets.ts defined this table
-- but no CREATE migration existed. Four routes already SELECT from
-- user_wallets (user/onboarding, account/usage, billing/manage,
-- feature-gate.ts checkWalletQuota), all wrapped in .catch() handlers
-- that fell through to count=0 — meaning the wallet quota was
-- silently unenforced because the table didn't exist (or did exist
-- ad-hoc in some environments). This migration makes it real and
-- consistent.
--
-- IF NOT EXISTS guards used everywhere — production DB may already
-- have a table with this name created ad-hoc; this migration is safe
-- in either case. If the existing columns differ, the operator
-- should ALTER manually before applying.
--
-- Council: #18 DBA — uuid PK avoids enumerable IDs; ON DELETE CASCADE
-- so user-deletion cleans up address-book rows; user_id index since
-- every read is by-user; lower() unique index prevents
-- case-difference duplicates.

CREATE TABLE IF NOT EXISTS user_wallets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wallet_address  TEXT NOT NULL,
  label           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_wallets_user_id_idx
  ON user_wallets (user_id);

CREATE UNIQUE INDEX IF NOT EXISTS user_wallets_user_addr_uniq
  ON user_wallets (user_id, lower(wallet_address));

-- DOWN

DROP INDEX IF EXISTS user_wallets_user_addr_uniq;
DROP INDEX IF EXISTS user_wallets_user_id_idx;
DROP TABLE IF EXISTS user_wallets;
