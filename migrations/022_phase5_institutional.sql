-- Phase 5: Institutional & Compliance
-- Team dashboard enhancement, compliance audit export, webhook system

-- =========================================================================
-- 5.3 Webhook System
-- =========================================================================

CREATE TABLE IF NOT EXISTS webhooks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         INTEGER NOT NULL,
  team_id         BIGINT,                     -- optional: team-scoped webhook
  name            TEXT NOT NULL,
  url             TEXT NOT NULL,
  secret          TEXT NOT NULL,               -- HMAC signing secret (hashed)
  events          JSONB NOT NULL DEFAULT '[]', -- event types to subscribe to
  enabled         BOOLEAN NOT NULL DEFAULT TRUE,
  last_triggered_at TIMESTAMPTZ,
  failure_count   INTEGER NOT NULL DEFAULT 0,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS webhooks_user_id_idx ON webhooks (user_id);
CREATE INDEX IF NOT EXISTS webhooks_team_id_idx ON webhooks (team_id);
CREATE INDEX IF NOT EXISTS webhooks_enabled_idx ON webhooks (enabled);

-- Webhook delivery log for debugging and retry
CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id      UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
  event_type      TEXT NOT NULL,
  payload         JSONB NOT NULL DEFAULT '{}',
  status_code     INTEGER,
  response_body   TEXT,
  success         BOOLEAN NOT NULL DEFAULT FALSE,
  attempt         INTEGER NOT NULL DEFAULT 1,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS webhook_deliveries_webhook_id_idx ON webhook_deliveries (webhook_id);
CREATE INDEX IF NOT EXISTS webhook_deliveries_created_at_idx ON webhook_deliveries (created_at);
CREATE INDEX IF NOT EXISTS webhook_deliveries_event_type_idx ON webhook_deliveries (event_type);

-- =========================================================================
-- 5.1 Team enhancements — add description and settings to teams
-- =========================================================================

ALTER TABLE teams ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}';
ALTER TABLE teams ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Team activity log for compliance
CREATE TABLE IF NOT EXISTS team_activity (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id         BIGINT NOT NULL,
  user_id         INTEGER NOT NULL,
  action          TEXT NOT NULL,       -- wallet_added | wallet_removed | member_invited | member_removed | approval_revoked | scan_triggered | rule_created | export_generated
  subject         TEXT,                -- e.g. wallet address, member email
  details         JSONB DEFAULT '{}',
  ip_address      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS team_activity_team_id_idx ON team_activity (team_id);
CREATE INDEX IF NOT EXISTS team_activity_user_id_idx ON team_activity (user_id);
CREATE INDEX IF NOT EXISTS team_activity_action_idx ON team_activity (action);
CREATE INDEX IF NOT EXISTS team_activity_created_at_idx ON team_activity (created_at);
CREATE INDEX IF NOT EXISTS team_activity_team_created_idx ON team_activity (team_id, created_at);

-- =========================================================================
-- 5.2 Compliance export tracking
-- =========================================================================

CREATE TABLE IF NOT EXISTS compliance_exports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         INTEGER NOT NULL,
  team_id         BIGINT,
  export_type     TEXT NOT NULL,        -- full_audit | risk_summary | allowance_snapshot | team_report
  format          TEXT NOT NULL DEFAULT 'json', -- json | csv | pdf
  filters         JSONB DEFAULT '{}',   -- date range, wallets, chains, etc.
  row_count       INTEGER NOT NULL DEFAULT 0,
  file_size       INTEGER,
  download_token  TEXT UNIQUE,          -- one-time download token
  expires_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS compliance_exports_user_id_idx ON compliance_exports (user_id);
CREATE INDEX IF NOT EXISTS compliance_exports_team_id_idx ON compliance_exports (team_id);
CREATE INDEX IF NOT EXISTS compliance_exports_download_token_idx ON compliance_exports (download_token);
CREATE INDEX IF NOT EXISTS compliance_exports_created_at_idx ON compliance_exports (created_at);
