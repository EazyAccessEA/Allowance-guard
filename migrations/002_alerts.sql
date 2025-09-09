-- Alert subscriptions table
CREATE TABLE IF NOT EXISTS alert_subscriptions (
  id              BIGSERIAL PRIMARY KEY,
  email           TEXT NOT NULL,
  wallet_address  TEXT NOT NULL,
  risk_only       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (email, wallet_address)
);

-- Index for efficient wallet lookups
CREATE INDEX IF NOT EXISTS idx_alerts_wallet ON alert_subscriptions(wallet_address);

-- Alert history table (optional - logs sends)
CREATE TABLE IF NOT EXISTS alert_history (
  id              BIGSERIAL PRIMARY KEY,
  email           TEXT NOT NULL,
  wallet_address  TEXT NOT NULL,
  sent_at         TIMESTAMP NOT NULL DEFAULT NOW(),
  items_count     INTEGER NOT NULL DEFAULT 0
);

-- Index for alert history queries
CREATE INDEX IF NOT EXISTS idx_alert_history_email ON alert_history(email);
CREATE INDEX IF NOT EXISTS idx_alert_history_wallet ON alert_history(wallet_address);
CREATE INDEX IF NOT EXISTS idx_alert_history_sent_at ON alert_history(sent_at);
