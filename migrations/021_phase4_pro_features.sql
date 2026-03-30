-- Phase 4: Pro Features
-- Continuous monitoring, historical timeline, automated revocation rules

-- =========================================================================
-- 4.1 Continuous Monitoring
-- =========================================================================

CREATE TABLE IF NOT EXISTS monitored_wallets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         INTEGER NOT NULL,
  wallet_address  TEXT NOT NULL,
  chains          JSONB DEFAULT '[]',
  enabled         BOOLEAN NOT NULL DEFAULT TRUE,
  freq_minutes    INTEGER NOT NULL DEFAULT 720,
  last_scan_at    TIMESTAMPTZ,
  last_change_at  TIMESTAMPTZ,
  notify_channels JSONB DEFAULT '{"email": true}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS monitored_wallets_user_id_idx ON monitored_wallets (user_id);
CREATE INDEX IF NOT EXISTS monitored_wallets_wallet_address_idx ON monitored_wallets (wallet_address);
CREATE UNIQUE INDEX IF NOT EXISTS monitored_wallets_user_wallet_key ON monitored_wallets (user_id, wallet_address);
CREATE INDEX IF NOT EXISTS monitored_wallets_enabled_idx ON monitored_wallets (enabled);

CREATE TABLE IF NOT EXISTS monitoring_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  monitor_id      UUID NOT NULL,
  wallet_address  TEXT NOT NULL,
  chain_id        INTEGER NOT NULL,
  event_type      TEXT NOT NULL,
  payload         JSONB DEFAULT '{}',
  notified        BOOLEAN NOT NULL DEFAULT FALSE,
  acknowledged    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS monitoring_events_monitor_id_idx ON monitoring_events (monitor_id);
CREATE INDEX IF NOT EXISTS monitoring_events_wallet_address_idx ON monitoring_events (wallet_address);
CREATE INDEX IF NOT EXISTS monitoring_events_event_type_idx ON monitoring_events (event_type);
CREATE INDEX IF NOT EXISTS monitoring_events_created_at_idx ON monitoring_events (created_at);

-- Snapshot table for change detection (stores last-known state per allowance)
CREATE TABLE IF NOT EXISTS monitoring_snapshots (
  wallet_address  TEXT NOT NULL,
  chain_id        INTEGER NOT NULL,
  token_address   TEXT NOT NULL,
  spender_address TEXT NOT NULL,
  amount          TEXT,
  is_unlimited    BOOLEAN,
  PRIMARY KEY (wallet_address, chain_id, token_address, spender_address)
);

-- =========================================================================
-- 4.2 Historical Timeline / Time Machine
-- =========================================================================

CREATE TABLE IF NOT EXISTS wallet_events (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address    TEXT NOT NULL,
  chain_id          INTEGER NOT NULL,
  token_address     TEXT NOT NULL,
  spender_address   TEXT NOT NULL,
  event_type        TEXT NOT NULL, -- approval_granted | approval_changed | approval_revoked | risk_changed
  previous_amount   TEXT,
  new_amount        TEXT,
  previous_unlimited BOOLEAN,
  new_unlimited     BOOLEAN,
  risk_score        INTEGER,
  previous_risk_score INTEGER,
  block_number      TEXT,
  tx_hash           TEXT,
  metadata          JSONB DEFAULT '{}',
  token_symbol      TEXT,
  spender_label     TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS wallet_events_wallet_address_idx ON wallet_events (wallet_address);
CREATE INDEX IF NOT EXISTS wallet_events_chain_id_idx ON wallet_events (chain_id);
CREATE INDEX IF NOT EXISTS wallet_events_event_type_idx ON wallet_events (event_type);
CREATE INDEX IF NOT EXISTS wallet_events_created_at_idx ON wallet_events (created_at);
CREATE INDEX IF NOT EXISTS wallet_events_wallet_created_idx ON wallet_events (wallet_address, created_at);

CREATE TABLE IF NOT EXISTS risk_snapshots (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address    TEXT NOT NULL,
  risk_score        INTEGER NOT NULL,
  total_allowances  INTEGER NOT NULL DEFAULT 0,
  unlimited_count   INTEGER NOT NULL DEFAULT 0,
  high_risk_count   INTEGER NOT NULL DEFAULT 0,
  chain_breakdown   JSONB DEFAULT '{}',
  snapshot_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS risk_snapshots_wallet_address_idx ON risk_snapshots (wallet_address);
CREATE INDEX IF NOT EXISTS risk_snapshots_snapshot_at_idx ON risk_snapshots (snapshot_at);
CREATE INDEX IF NOT EXISTS risk_snapshots_wallet_snapshot_idx ON risk_snapshots (wallet_address, snapshot_at);

-- =========================================================================
-- 4.4 Automated Revocation Rules (Sentinel)
-- =========================================================================

CREATE TABLE IF NOT EXISTS revocation_rules (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 INTEGER NOT NULL,
  name                    TEXT NOT NULL,
  description             TEXT,
  enabled                 BOOLEAN NOT NULL DEFAULT TRUE,
  wallets                 JSONB DEFAULT '[]',
  chains                  JSONB DEFAULT '[]',
  conditions              JSONB NOT NULL DEFAULT '[]',
  action                  TEXT NOT NULL DEFAULT 'alert_only',
  max_executions_per_day  INTEGER NOT NULL DEFAULT 10,
  trigger_count           INTEGER NOT NULL DEFAULT 0,
  last_triggered_at       TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS revocation_rules_user_id_idx ON revocation_rules (user_id);
CREATE INDEX IF NOT EXISTS revocation_rules_enabled_idx ON revocation_rules (enabled);

CREATE TABLE IF NOT EXISTS rule_executions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id         UUID NOT NULL,
  user_id         INTEGER NOT NULL,
  wallet_address  TEXT NOT NULL,
  chain_id        INTEGER NOT NULL,
  token_address   TEXT NOT NULL,
  spender_address TEXT NOT NULL,
  action          TEXT NOT NULL,
  success         BOOLEAN,
  details         JSONB DEFAULT '{}',
  tx_hash         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS rule_executions_rule_id_idx ON rule_executions (rule_id);
CREATE INDEX IF NOT EXISTS rule_executions_user_id_idx ON rule_executions (user_id);
CREATE INDEX IF NOT EXISTS rule_executions_created_at_idx ON rule_executions (created_at);
