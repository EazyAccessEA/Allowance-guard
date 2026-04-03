-- Migration 024: Phase 8 — Data Lifecycle & Analytics
-- Creates analytics_events, feature_flags tables, data integrity fixes,
-- month-based index for monitoring_events partitioning, and cleanup views.
--
-- NOTE: Each section is its own transaction so one failure doesn't roll back everything.

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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'analytics_events_event_name_check'
      AND table_name = 'analytics_events'
  ) THEN
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
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id     ON analytics_events (user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name  ON analytics_events (event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at  ON analytics_events (created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_event  ON analytics_events (user_id, event_name, created_at);

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

CREATE UNIQUE INDEX IF NOT EXISTS idx_feature_flags_name ON feature_flags (name);

COMMENT ON TABLE feature_flags IS 'Feature flags for A/B testing and gradual rollouts (Phase 8)';

-- ============================================================================
-- 8.2 — Data Integrity Fixes (each wrapped safely — skips if table missing)
-- ============================================================================

-- 1. FK constraint on usage_records.api_key_id (only if both tables exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'usage_records')
     AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'api_keys')
     AND NOT EXISTS (
       SELECT 1 FROM information_schema.table_constraints
       WHERE constraint_name = 'fk_usage_records_api_key'
         AND table_name = 'usage_records'
     )
  THEN
    ALTER TABLE usage_records
      ADD CONSTRAINT fk_usage_records_api_key
      FOREIGN KEY (api_key_id) REFERENCES api_keys(id) ON DELETE SET NULL;
    RAISE NOTICE 'Added FK constraint fk_usage_records_api_key';
  ELSE
    RAISE NOTICE 'Skipping fk_usage_records_api_key (table missing or constraint exists)';
  END IF;
END $$;

-- 2. EVM wallet address validation on team_wallets (only if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'team_wallets')
     AND NOT EXISTS (
       SELECT 1 FROM information_schema.table_constraints
       WHERE constraint_name = 'team_wallets_address_check'
         AND table_name = 'team_wallets'
     )
  THEN
    ALTER TABLE team_wallets
      ADD CONSTRAINT team_wallets_address_check
      CHECK (wallet_address ~* '^0x[0-9a-f]{40}$');
    RAISE NOTICE 'Added CHECK constraint team_wallets_address_check';
  ELSE
    RAISE NOTICE 'Skipping team_wallets_address_check (table missing or constraint exists)';
  END IF;
END $$;

-- 3. Stale detection for risk_snapshots (only if table + column exist)
DO $$
DECLARE
  ts_col TEXT;
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'risk_snapshots') THEN
    -- Find the timestamp column (could be created_at or checked_at)
    SELECT column_name INTO ts_col
    FROM information_schema.columns
    WHERE table_name = 'risk_snapshots'
      AND data_type IN ('timestamp with time zone', 'timestamp without time zone')
    ORDER BY ordinal_position
    LIMIT 1;

    IF ts_col IS NOT NULL THEN
      EXECUTE format(
        'CREATE OR REPLACE VIEW risk_snapshots_with_staleness AS
         SELECT *, (%I < NOW() - INTERVAL ''24 hours'') AS is_stale
         FROM risk_snapshots', ts_col
      );
      RAISE NOTICE 'Created view risk_snapshots_with_staleness using column %', ts_col;
    ELSE
      RAISE NOTICE 'Skipping risk_snapshots_with_staleness (no timestamp column found)';
    END IF;
  ELSE
    RAISE NOTICE 'Skipping risk_snapshots_with_staleness (table missing)';
  END IF;
END $$;

-- ============================================================================
-- 8.1 — Month-based index for monitoring_events (only if table exists)
-- ============================================================================

-- DATE_TRUNC is not IMMUTABLE, so we use a simple btree index on created_at instead
-- which PostgreSQL can still use for month-based range queries efficiently
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'monitoring_events') THEN
    CREATE INDEX IF NOT EXISTS idx_monitoring_events_created_at_month
      ON monitoring_events (created_at);
    RAISE NOTICE 'Created index idx_monitoring_events_created_at_month';
  ELSE
    RAISE NOTICE 'Skipping monitoring_events index (table missing)';
  END IF;
END $$;

-- ============================================================================
-- 8.3 — Materialized view for allowance counts (only if table exists)
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'allowances')
     AND NOT EXISTS (SELECT 1 FROM pg_matviews WHERE matviewname = 'allowances_counts')
  THEN
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
    RAISE NOTICE 'Created materialized view allowances_counts';
  ELSE
    RAISE NOTICE 'Skipping allowances_counts (table missing or view exists)';
  END IF;
END $$;

-- ============================================================================
-- Revenue analytics view (only if subscriptions table exists)
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscriptions') THEN
    EXECUTE '
      CREATE OR REPLACE VIEW revenue_summary AS
      SELECT
        s.plan,
        s.status,
        COUNT(*) AS subscriber_count,
        COUNT(*) FILTER (WHERE s.status = ''active'') AS active_count,
        COUNT(*) FILTER (WHERE s.status = ''canceled'') AS cancelled_count,
        COUNT(*) FILTER (WHERE s.status = ''trialing'') AS trialing_count,
        COUNT(*) FILTER (WHERE s.cancelled_at IS NOT NULL
          AND s.cancelled_at > NOW() - INTERVAL ''30 days'') AS recent_cancellations
      FROM subscriptions s
      GROUP BY s.plan, s.status
    ';
    RAISE NOTICE 'Created view revenue_summary';
  ELSE
    RAISE NOTICE 'Skipping revenue_summary (subscriptions table missing)';
  END IF;
END $$;

-- ============================================================================
-- Analytics funnel view (always works — depends on analytics_events above)
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
-- Cleanup function for Phase 8 data (safe — checks table existence)
-- ============================================================================

CREATE OR REPLACE FUNCTION cleanup_phase8_data()
RETURNS TABLE(table_name TEXT, rows_deleted BIGINT) AS $$
DECLARE
  v_rows BIGINT;
BEGIN
  -- Clean webhook deliveries older than 30 days (if table exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'webhook_deliveries') THEN
    DELETE FROM webhook_deliveries WHERE created_at < NOW() - INTERVAL '30 days';
    GET DIAGNOSTICS v_rows = ROW_COUNT;
    table_name := 'webhook_deliveries'; rows_deleted := v_rows;
    RETURN NEXT;
  END IF;

  -- Clean expired sessions (if table exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') THEN
    DELETE FROM sessions WHERE expires_at < NOW();
    GET DIAGNOSTICS v_rows = ROW_COUNT;
    table_name := 'sessions'; rows_deleted := v_rows;
    RETURN NEXT;
  END IF;

  -- Clean old analytics events (keep 180 days)
  DELETE FROM analytics_events WHERE created_at < NOW() - INTERVAL '180 days';
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  table_name := 'analytics_events'; rows_deleted := v_rows;
  RETURN NEXT;

  RETURN;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_phase8_data() IS 'Cleans up old webhook deliveries, expired sessions, and aged analytics events';
