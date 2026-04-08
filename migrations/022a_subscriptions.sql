-- 022a_subscriptions.sql
--
-- Creates the billing `subscriptions` table that migrations 023, 024, 025,
-- and 026 assume already exists. This file was missing from the migrations
-- history — the Drizzle schema at src/db/schema/subscriptions.ts defines the
-- final shape, but no raw-SQL migration ever created the original table.
--
-- Ordering: this file is numbered `022a` so it runs strictly after
-- `022_phase5_institutional.sql` and strictly before `023_re_engagement.sql`
-- (the migration runner sorts lexicographically; `022_` < `022a` < `023_`).
--
-- Shape: matches the ORIGINAL table (Stripe-only, pre-crypto). Later
-- migrations add columns and relax constraints:
--   * 023_re_engagement.sql  → adds cancelled_at, re_engagement_email_sent
--   * 026_subscriptions_crypto.sql → drops NOT NULL on stripe_*, adds
--     provider, coinbase_charge_code, billing_interval
--
-- Idempotent: uses IF NOT EXISTS throughout so re-running against a DB
-- that already has a partial subscriptions table will not break.

CREATE TABLE IF NOT EXISTS subscriptions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 INTEGER NOT NULL,
  stripe_customer_id      TEXT NOT NULL,
  stripe_subscription_id  TEXT NOT NULL,
  plan                    TEXT NOT NULL DEFAULT 'free',
  status                  TEXT NOT NULL DEFAULT 'active',
  current_period_start    TIMESTAMPTZ,
  current_period_end      TIMESTAMPTZ,
  cancel_at_period_end    BOOLEAN NOT NULL DEFAULT FALSE,
  metadata                JSONB DEFAULT '{}'::jsonb,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Required by `gen_random_uuid()` — safe to enable on any Postgres instance.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx
  ON subscriptions (user_id);

CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_stripe_subscription_id_key
  ON subscriptions (stripe_subscription_id);

CREATE INDEX IF NOT EXISTS subscriptions_stripe_customer_id_idx
  ON subscriptions (stripe_customer_id);

CREATE INDEX IF NOT EXISTS subscriptions_status_idx
  ON subscriptions (status);

-- DOWN
DROP INDEX IF EXISTS subscriptions_status_idx;
DROP INDEX IF EXISTS subscriptions_stripe_customer_id_idx;
DROP INDEX IF EXISTS subscriptions_stripe_subscription_id_key;
DROP INDEX IF EXISTS subscriptions_user_id_idx;
DROP TABLE IF EXISTS subscriptions;
