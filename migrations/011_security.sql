-- Webhook replay protection (store processed events)
CREATE TABLE IF NOT EXISTS webhook_events (
  provider   TEXT NOT NULL,         -- 'stripe' | 'coinbase'
  event_id   TEXT NOT NULL,         -- Stripe: event.id, Coinbase: event.id
  received_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (provider, event_id)
);

-- Minimal audit log
CREATE TABLE IF NOT EXISTS audit_logs (
  id          BIGSERIAL PRIMARY KEY,
  at          TIMESTAMP NOT NULL DEFAULT NOW(),
  actor_type  TEXT NOT NULL,        -- 'user' | 'system' | 'webhook'
  actor_id    TEXT NULL,            -- user_id / provider name
  ip          TEXT NULL,
  path        TEXT NULL,
  action      TEXT NOT NULL,        -- e.g., 'revoke', 'policy.update', 'webhook.confirmed'
  subject     TEXT NULL,            -- e.g., wallet/spender/token/tx or teamId
  meta        JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_audit_time ON audit_logs(at DESC);
