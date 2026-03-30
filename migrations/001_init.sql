-- addresses stored as lowercase hex text for speed today (can switch to BYTEA later)
CREATE TABLE IF NOT EXISTS allowances (
  wallet_address   TEXT NOT NULL,
  chain_id         INTEGER NOT NULL,
  token_address    TEXT NOT NULL,
  spender_address  TEXT NOT NULL,
  standard         VARCHAR(10) NOT NULL,        -- 'ERC20' | 'ERC721' | 'ERC1155'
  allowance_type   VARCHAR(12) NOT NULL,        -- 'per-token' | 'all-assets'
  amount           NUMERIC(78,0) NOT NULL,
  is_unlimited     BOOLEAN NOT NULL DEFAULT FALSE,
  last_seen_block  BIGINT NOT NULL,
  last_used_at     TIMESTAMP NULL,
  risk_score       INTEGER NOT NULL DEFAULT 0,
  risk_flags       TEXT[] NOT NULL DEFAULT '{}',
  updated_at       TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (wallet_address, chain_id, token_address, spender_address, allowance_type)
);

CREATE INDEX IF NOT EXISTS idx_allowances_wallet_chain ON allowances(wallet_address, chain_id);
CREATE INDEX IF NOT EXISTS idx_allowances_risk ON allowances(wallet_address, risk_score DESC, is_unlimited DESC);
