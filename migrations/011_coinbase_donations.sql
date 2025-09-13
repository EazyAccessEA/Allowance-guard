CREATE TABLE IF NOT EXISTS coinbase_donations (
  id BIGSERIAL PRIMARY KEY,
  charge_code       TEXT NOT NULL UNIQUE,        -- e.g. "66BEOV2A"
  last_event_id     TEXT,                        -- most recent webhook event id (not unique; per charge)
  status            TEXT NOT NULL,               -- NEW, PENDING, CONFIRMED, FAILED, RESOLVED, etc.
  hosted_url        TEXT,                        -- Coinbase hosted checkout URL (optional)
  local_amount      INTEGER NOT NULL,            -- minor units: 100 == 1.00
  local_currency    TEXT NOT NULL,               -- GBP / USD, etc.
  metadata          JSONB,                       -- anything we want to keep (addresses, timeline, pricing)
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS coinbase_donations_created_at_idx ON coinbase_donations (created_at DESC);
CREATE INDEX IF NOT EXISTS coinbase_donations_status_idx      ON coinbase_donations (status);
