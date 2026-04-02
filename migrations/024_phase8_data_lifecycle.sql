-- Migration 024: Phase 8 — Data Lifecycle & Analytics
-- Creates analytics_events, feature_flags tables, data integrity fixes,
-- month-based index for monitoring_events partitioning, and cleanup views.

BEGIN;

-- ============================================================================
-- 8.3 — Analytics Events table (funnel tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS analytics_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       INTEGER,
  session_id    TEXT,
  event_name    TEXT NOT NULL,
  metadata      JSONB DEFAULT '{}'::jsonb,
  ip_address    TEXT,
  user_agent    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Validate event names
ALTER TABLE analytics_events
  ADD CONSTRAINT analytics_events_event_name_check
  CHECK (event_name IN (
    'wallet_connected',
    'scan_started',
    'scan_completed',
    'revoke_initiated',
    'revoke_completed',
    'upgrade_clicked',
    'checkout_started',
    'checkout_completed',
    'trial_started',
    'trial_converted'
  ));

CREATE INDEX idx_analytics_events_user_id     ON analytics_events (user_id);
CREATE INDEX idx_analytics_events_event_name  ON analytics_events (event_name);
CREATE INDEX idx_analytics_events_created_at  ON analytics_events (created_at);
CREATE INDEX idx_analytics_events_user_event  ON analytics_events (user_id, event_name, created_at);

COMMENT ON TABLE analytics_events IS 'Funnel tracking events for business analytics (Phase 8)';

-- ============================================================================
-- 8.4 — Feature Flags table (A/B testing foundation)
-- ============================================================================

CREATE TABLE IF NOT EXISTS feature_flags (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL UNIQUE,
  description         TEXT,
  rollout_percentage  INTEGER NOT NULL DEFAULT 0 CHECK (rollout_percentage BETWEEN 0 AND 100),
  target_plans        JSONB DEFAULT '[]'::jsonb,
  enabled             BOOLEAN NOT NULL DEFAULT false,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_feature_flags_name ON feature_flags (name);

COMMENT ON TABLE feature_flags IS 'Feature flags for A/B testing and gradual rollouts (Phase 8)';

-- ============================================================================
-- 8.2 — Data Integrity Fixes
-- ============================================================================

-- 1. FK constraint on usage_records.api_key_id → api_keys.id (SET NULL on delete)
--    Only add if the constraint doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_usage_records_api_key'
      AND table_name = 'usage_records'
  ) THEN
    ALTER TABLE usage_records
      ADD CONSTRAINT fk_usage_records_api_key
      FOREIGN KEY (api_key_id) REFERENCES api_keys(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 2. EVM wallet address validation on team_wallets
--    Validates 0x followed by 40 hex characters (case-insensitive)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'team_wallets_address_check'
      AND table_name = 'team_wallets'
  ) THEN
    ALTER TABLE team_wallets
      ADD CONSTRAINT team_wallets_address_check
      CHECK (wallet_address ~* '^0x[0-9a-f]{40}$');
  END IF;
END $$;

-- 3. Stale detection for risk_snapshots (computed via view)
CREATE OR REPLACE VIEW risk_snapshots_with_staleness AS
SELECT
  *,
  (created_at < NOW() - INTERVAL '24 hours') AS is_stale
FROM risk_snapshots;

COMMENT ON VIEW risk_snapshots_with_staleness IS 'Risk snapshots with staleness flag (stale if > 24 hours old)';

-- ============================================================================
-- 8.1 — Month-based index for monitoring_events (preparation for partitioning)
-- ============================================================================

-- Create a month-based index to improve query performance on time ranges
-- Full table partitioning requires DBA intervention (recreate table as partitioned)
CREATE INDEX IF NOT EXISTS idx_monitoring_events_month
  ON monitoring_events (DATE_TRUNC('month', created_at));

-- ============================================================================
-- 8.3 — Materialized view for allowance counts (for analytics dashboard)
-- ============================================================================

-- Create materialized view for dashboard stats (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_matviews WHERE matviewname = 'allowances_counts'
  ) THEN
    EXECUTE '
      CREATE MATERIALIZED VIEW allowances_counts AS
      SELECT
        COUNT(*) AS total_allowances,
        COUNT(*) FILTER (WHERE is_unlimited = true) AS unlimited_allowances,
        COUNT(DISTINCT wallet_address) AS unique_wallets,
        COUNT(DISTINCT spender_address) AS unique_spenders,
        COUNT(DISTINCT chain_id) AS chains_used
      FROM allowances
    ';
    CREATE UNIQUE INDEX ON allowances_counts ((1));
  END IF;
END $$;

-- ============================================================================
-- Revenue analytics view (for admin dashboard)
-- ============================================================================

CREATE OR REPLACE VIEW revenue_summary AS
SELECT
  s.plan,
  s.status,
  COUNT(*) AS subscriber_count,
  COUNT(*) FILTER (WHERE s.status = 'active') AS active_count,
  COUNT(*) FILTER (WHERE s.status = 'canceled') AS cancelled_count,
  COUNT(*) FILTER (WHERE s.status = 'trialing') AS trialing_count,
  COUNT(*) FILTER (WHERE s.cancelled_at IS NOT NULL
    AND s.cancelled_at > NOW() - INTERVAL '30 days') AS recent_cancellations
FROM subscriptions s
GROUP BY s.plan, s.status;

COMMENT ON VIEW revenue_summary IS 'Aggregated subscription metrics for revenue dashboard (Phase 8)';

-- ============================================================================
-- Analytics funnel view
-- ============================================================================

CREATE OR REPLACE VIEW analytics_funnel AS
SELECT
  event_name,
  DATE_TRUNC('day', created_at) AS event_day,
  COUNT(*) AS event_count,
  COUNT(DISTINCT user_id) AS unique_users
FROM analytics_events
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY event_name, DATE_TRUNC('day', created_at)
ORDER BY event_day DESC, event_name;

COMMENT ON VIEW analytics_funnel IS 'Daily aggregated funnel events for analytics dashboard (Phase 8)';

-- ============================================================================
-- Cleanup function for Phase 8 data
-- ============================================================================

CREATE OR REPLACE FUNCTION cleanup_phase8_data()
RETURNS TABLE(table_name TEXT, rows_deleted BIGINT) AS $$
DECLARE
  v_rows BIGINT;
BEGIN
  -- Clean webhook deliveries older than 30 days
  DELETE FROM webhook_deliveries WHERE created_at < NOW() - INTERVAL '30 days';
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  table_name := 'webhook_deliveries'; rows_deleted := v_rows;
  RETURN NEXT;

  -- Clean expired sessions
  DELETE FROM sessions WHERE expires_at < NOW();
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  table_name := 'sessions'; rows_deleted := v_rows;
  RETURN NEXT;

  -- Clean old analytics events (keep 180 days)
  DELETE FROM analytics_events WHERE created_at < NOW() - INTERVAL '180 days';
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  table_name := 'analytics_events'; rows_deleted := v_rows;
  RETURN NEXT;

  RETURN;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_phase8_data() IS 'Cleans up old webhook deliveries, expired sessions, and aged analytics events';

COMMIT;
