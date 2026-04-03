-- Migration 024b: Fix the two errors from 024 initial run
-- 1. risk_snapshots view — find the actual timestamp column
-- 2. monitoring_events index — use plain btree (DATE_TRUNC is not IMMUTABLE)

-- Fix 1: risk_snapshots staleness view
DO $$
DECLARE
  ts_col TEXT;
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'risk_snapshots') THEN
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
      RAISE NOTICE 'Skipping — no timestamp column found in risk_snapshots';
    END IF;
  ELSE
    RAISE NOTICE 'Skipping — risk_snapshots table does not exist';
  END IF;
END $$;

-- Fix 2: monitoring_events month index (plain btree on created_at)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'monitoring_events') THEN
    CREATE INDEX IF NOT EXISTS idx_monitoring_events_created_at_month
      ON monitoring_events (created_at);
    RAISE NOTICE 'Created index idx_monitoring_events_created_at_month';
  ELSE
    RAISE NOTICE 'Skipping — monitoring_events table does not exist';
  END IF;
END $$;
