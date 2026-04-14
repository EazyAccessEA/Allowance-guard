-- 030_usage_records.sql
--
-- Create the usage_records table that tracks API call history.
-- Used by api-keys.ts for daily rate limit enforcement and by the
-- account dashboard for usage metrics.
--
-- Drizzle schema at src/db/schema/usage.ts defined this table but no
-- CREATE migration existed. Production databases may already have it
-- (created ad-hoc at some point) — IF NOT EXISTS makes this safe.

CREATE TABLE IF NOT EXISTS usage_records (
  id               BIGSERIAL PRIMARY KEY,
  user_id          INTEGER,
  api_key_id       TEXT, -- UUID string referencing api_keys.id
  endpoint         TEXT NOT NULL,
  method           TEXT NOT NULL DEFAULT 'GET',
  response_status  INTEGER,
  duration_ms      INTEGER,
  metadata         JSONB DEFAULT '{}'::jsonb,
  timestamp        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS usage_records_user_id_idx      ON usage_records (user_id);
CREATE INDEX IF NOT EXISTS usage_records_api_key_id_idx   ON usage_records (api_key_id);
CREATE INDEX IF NOT EXISTS usage_records_timestamp_idx    ON usage_records (timestamp);
CREATE INDEX IF NOT EXISTS usage_records_endpoint_idx     ON usage_records (endpoint);
