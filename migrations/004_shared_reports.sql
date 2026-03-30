-- Public share links for read-only wallet reports
CREATE TABLE IF NOT EXISTS shared_reports (
  id                 BIGSERIAL PRIMARY KEY,
  token              TEXT UNIQUE NOT NULL,                 -- public share id
  wallet_address     TEXT NOT NULL,
  censor_addresses   BOOLEAN NOT NULL DEFAULT TRUE,        -- mask 0x1234…abcd
  censor_amounts     BOOLEAN NOT NULL DEFAULT FALSE,       -- hide amounts
  risk_only          BOOLEAN NOT NULL DEFAULT TRUE,        -- show only risky
  expires_at         TIMESTAMP NULL,
  created_at         TIMESTAMP NOT NULL DEFAULT NOW(),
  last_view_at       TIMESTAMP NULL,
  view_count         INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_shared_reports_wallet ON shared_reports(wallet_address);
