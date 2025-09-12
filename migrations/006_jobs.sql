-- Lightweight job queue (Vercel friendly: triggered by cron/API)
DO $$ BEGIN
    CREATE TYPE job_status AS ENUM ('pending','running','succeeded','failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS jobs (
  id            BIGSERIAL PRIMARY KEY,
  type          TEXT NOT NULL,                -- e.g., 'scan_wallet'
  payload       JSONB NOT NULL,
  status        job_status NOT NULL DEFAULT 'pending',
  attempts      INTEGER NOT NULL DEFAULT 0,
  max_attempts  INTEGER NOT NULL DEFAULT 3,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  started_at    TIMESTAMP NULL,
  finished_at   TIMESTAMP NULL,
  error         TEXT NULL
);

CREATE INDEX IF NOT EXISTS idx_jobs_status_created ON jobs(status, created_at);

-- Helpful read-path indexes for pagination & sorting
CREATE INDEX IF NOT EXISTS idx_allowances_wallet_sort
  ON allowances (wallet_address, is_unlimited DESC, amount DESC, chain_id, token_address, spender_address);

-- Optional: a fast COUNT() path per wallet
CREATE MATERIALIZED VIEW IF NOT EXISTS allowances_counts AS
SELECT wallet_address, COUNT(*) AS total
FROM allowances GROUP BY wallet_address;

-- Refresh helper function (optional; can manual refresh after big writes)
CREATE OR REPLACE FUNCTION refresh_allowances_counts()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW allowances_counts;
END;
$$ LANGUAGE plpgsql;
