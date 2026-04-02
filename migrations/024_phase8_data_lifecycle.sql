-- Phase 8 — Data Lifecycle & Analytics
-- Migration: 024_phase8_data_lifecycle.sql
-- Created: 2026-04-02

BEGIN;

-- =====================================================
-- 8.1 — Table Partitioning for monitoring_events
-- =====================================================
-- Note: Full table partitioning requires recreating the table.
-- Instead, we add a time-based partial index and a partition-like
-- cleanup strategy. The cleanup cron handles data lifecycle.
-- For production partitioning, use pg_partman or manual partition
-- creation (requires table recreation which is a manual DBA task).

-- Add index to support efficient time-range queries and cleanup
CREATE INDEX IF NOT EXISTS monitoring_events_created_month_idx
  ON monitoring_events (date_trunc('month', created_at));

-- =====================================================
-- 8.2 — Data Integrity Fixes
-- =====================================================

-- 8.2.1 — FK constraint on usage_records.api_key_id → api_keys.id
-- SET NULL on delete so usage history is preserved when keys are revoked
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'usage_records_api_key_id_fk'
  ) THEN
    ALTER TABLE usage_records
      ADD CONSTRAINT usage_records_api_key_id_fk
      FOREIGN KEY (api_key_id) REFERENCES api_keys(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 8.2.2 — Webhook secrets: already hashed at application layer (SHA-256).
-- Add a prefix column for display identification (like API keys).
ALTER TABLE webhooks ADD COLUMN IF NOT EXISTS secret_prefix text;

-- Backfill prefix from first 8 chars of existing hashed secrets (for display only)
UPDATE webhooks SET secret_prefix = LEFT(secret, 8) WHERE secret_prefix IS NULL;

-- 8.2.3 — Subscription soft-delete: cancelled_at already exists in schema.
-- Add index to support queries on cancelled subscriptions.
CREATE INDEX IF NOT EXISTS subscriptions_cancelled_at_idx
  ON subscriptions (cancelled_at) WHERE cancelled_at IS NOT NULL;

-- 8.2.4 — Wallet address validation constraint
-- EVM addresses: 0x followed by 40 hex characters (case-insensitive)
-- Applied to team_wallets table for insert validation
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'team_wallets_address_check'
  ) THEN
    -- Only add if the table exists (created in Phase 5)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'team_wallets') THEN
      ALTER TABLE team_wallets
        ADD CONSTRAINT team_wallets_address_check
        CHECK (wallet_address ~ '^0x[a-fA-F0-9]{40}$');
    END IF;
  END IF;
END $$;

-- Also validate monitored_wallets addresses
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'monitored_wallets_address_check'
  ) THEN
    ALTER TABLE monitored_wallets
      ADD CONSTRAINT monitored_wallets_address_check
      CHECK (wallet_address ~ '^0x[a-fA-F0-9]{40}$');
  END IF;
END $$;

-- 8.2.5 — Risk snapshots staleness: add helper view
CREATE OR REPLACE VIEW risk_snapshots_with_staleness AS
SELECT *,
  (snapshot_at < NOW() - INTERVAL '24 hours') AS is_stale
FROM risk_snapshots;

-- =====================================================
-- 8.3 — Analytics Pipeline
-- =====================================================

-- Analytics events table for funnel tracking
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id integer,
  session_id text,
  event_name text NOT NULL,
  event_category text NOT NULL DEFAULT 'general',
  properties jsonb DEFAULT '{}',
  page_url text,
  referrer text,
  user_agent text,
  ip_hash text,  -- hashed IP for privacy
  created_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS analytics_events_user_id_idx ON analytics_events (user_id);
CREATE INDEX IF NOT EXISTS analytics_events_event_name_idx ON analytics_events (event_name);
CREATE INDEX IF NOT EXISTS analytics_events_category_idx ON analytics_events (event_category);
CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx ON analytics_events (created_at);
CREATE INDEX IF NOT EXISTS analytics_events_name_created_idx ON analytics_events (event_name, created_at);

-- Daily aggregated analytics (materialized for fast dashboard queries)
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics_daily_summary AS
SELECT
  DATE(created_at) AS day,
  event_name,
  event_category,
  COUNT(*) AS event_count,
  COUNT(DISTINCT user_id) AS unique_users,
  COUNT(DISTINCT session_id) AS unique_sessions
FROM analytics_events
GROUP BY DATE(created_at), event_name, event_category
ORDER BY day DESC, event_count DESC;

CREATE UNIQUE INDEX IF NOT EXISTS analytics_daily_summary_uniq
  ON analytics_daily_summary (day, event_name, event_category);

-- Revenue summary view (reads from subscriptions + usage_records)
CREATE OR REPLACE VIEW revenue_summary AS
SELECT
  s.plan,
  s.status,
  COUNT(*) AS subscriber_count,
  COUNT(*) FILTER (WHERE s.cancelled_at IS NOT NULL) AS cancelled_count,
  COUNT(*) FILTER (WHERE s.status = 'trialing') AS trialing_count,
  COUNT(*) FILTER (WHERE s.created_at > NOW() - INTERVAL '30 days') AS new_last_30d
FROM subscriptions s
WHERE s.status IN ('active', 'trialing', 'past_due', 'canceled')
GROUP BY s.plan, s.status;

-- =====================================================
-- 8.4 — Feature Flags / A/B Testing
-- =====================================================

CREATE TABLE IF NOT EXISTS feature_flags (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  enabled boolean NOT NULL DEFAULT false,
  rollout_percentage integer NOT NULL DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  target_plans jsonb DEFAULT '[]',  -- e.g. ["pro", "sentinel"] or [] for all
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS feature_flags_name_idx ON feature_flags (name);
CREATE INDEX IF NOT EXISTS feature_flags_enabled_idx ON feature_flags (enabled);

COMMIT;
