-- Per-wallet risk policy
CREATE TABLE IF NOT EXISTS alert_policies (
  wallet_address   TEXT PRIMARY KEY,
  min_risk_score   INTEGER NOT NULL DEFAULT 0,
  unlimited_only   BOOLEAN NOT NULL DEFAULT FALSE,
  include_spenders TEXT[] NOT NULL DEFAULT '{}',
  ignore_spenders  TEXT[] NOT NULL DEFAULT '{}',
  include_tokens   TEXT[] NOT NULL DEFAULT '{}',
  ignore_tokens    TEXT[] NOT NULL DEFAULT '{}',
  chains           INTEGER[] NOT NULL DEFAULT '{}',
  updated_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Slack subscriptions
CREATE TABLE IF NOT EXISTS slack_subscriptions (
  id              BIGSERIAL PRIMARY KEY,
  wallet_address  TEXT NOT NULL,
  webhook_url     TEXT NOT NULL,
  risk_only       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (wallet_address, webhook_url)
);

CREATE INDEX IF NOT EXISTS idx_slack_wallet ON slack_subscriptions(wallet_address);
