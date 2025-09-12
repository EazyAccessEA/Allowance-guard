-- Wallet monitors (when to rescan)
CREATE TABLE IF NOT EXISTS wallet_monitors (
  wallet_address  TEXT PRIMARY KEY,
  enabled         BOOLEAN NOT NULL DEFAULT TRUE,
  freq_minutes    INTEGER NOT NULL DEFAULT 720, -- 12h default
  last_scan_at    TIMESTAMP NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- What we last alerted (to suppress duplicates)
CREATE TABLE IF NOT EXISTS alert_state (
  wallet_address   TEXT NOT NULL,
  chain_id         INTEGER NOT NULL,
  token_address    TEXT NOT NULL,
  spender_address  TEXT NOT NULL,
  allowance_type   VARCHAR(12) NOT NULL,
  last_amount      NUMERIC(78,0) NOT NULL DEFAULT 0,
  last_unlimited   BOOLEAN NOT NULL DEFAULT FALSE,
  last_notified_at TIMESTAMP NULL,
  PRIMARY KEY (wallet_address, chain_id, token_address, spender_address, allowance_type)
);

CREATE INDEX IF NOT EXISTS idx_monitors_last ON wallet_monitors (enabled, last_scan_at);
