-- Day 18: DB tuning & performance improvements
-- Schema tune-ups, indexes, and optimizations

-- 1) If allowances.amount is TEXT, cast it once to NUMERIC for faster sort/filters.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='allowances' AND column_name='amount' AND data_type NOT IN ('numeric')
  ) THEN
    ALTER TABLE allowances
      ALTER COLUMN amount TYPE NUMERIC(78,0) USING NULLIF(amount, '')::NUMERIC(78,0);
  END IF;
END$$;

-- 2) Hot-path indexes for your list queries
-- Note: idx_allowances_wallet_sort already exists in 006_jobs.sql, but let's ensure it's optimal
CREATE INDEX IF NOT EXISTS idx_allowances_wallet_sort
  ON allowances (wallet_address, is_unlimited DESC, amount DESC, chain_id, token_address, spender_address);

-- 3) Risky filter accelerators
CREATE INDEX IF NOT EXISTS idx_allowances_wallet_risky
  ON allowances (wallet_address, is_unlimited DESC, amount DESC)
  WHERE (is_unlimited = TRUE OR risk_score > 0);

-- 4) Fast membership for risk_flags (array)
CREATE INDEX IF NOT EXISTS idx_allowances_risk_flags_gin
  ON allowances USING GIN (risk_flags);

-- 5) Joins to token/spender tables (defensive if not already PK/idx)
CREATE INDEX IF NOT EXISTS idx_token_meta_pair
  ON token_metadata (chain_id, token_address);
CREATE INDEX IF NOT EXISTS idx_spender_labels_pair
  ON spender_labels (chain_id, address);

-- 6) Jobs de-dupe: forbid >1 pending/running scan per wallet
CREATE UNIQUE INDEX IF NOT EXISTS uniq_jobs_active_wallet
  ON jobs ((payload->>'wallet'))
  WHERE type='scan_wallet' AND status IN ('pending','running');

-- 7) Receipts/timeline: wallet-time lookups
CREATE INDEX IF NOT EXISTS idx_receipts_wallet_time
  ON revocation_receipts (wallet_address, created_at DESC);

-- 8) Monitors: due picks (enabled + last_scan_at)
CREATE INDEX IF NOT EXISTS idx_monitors_enabled_due
  ON wallet_monitors (enabled, last_scan_at);

-- 9) Shared reports: wallet lookup
CREATE INDEX IF NOT EXISTS idx_shared_reports_wallet
  ON shared_reports (wallet_address);

-- 10) Additional performance indexes for common queries
CREATE INDEX IF NOT EXISTS idx_allowances_chain_token
  ON allowances (chain_id, token_address);

CREATE INDEX IF NOT EXISTS idx_allowances_spender
  ON allowances (spender_address);

-- 11) Update table statistics for better query planning
ANALYZE allowances;
ANALYZE token_metadata;
ANALYZE spender_labels;
ANALYZE jobs;
ANALYZE revocation_receipts;
ANALYZE wallet_monitors;
