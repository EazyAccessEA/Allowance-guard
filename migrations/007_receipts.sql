-- Day 11: Receipts & Timeline
-- Track revocation transactions with on-chain verification

DO $$ BEGIN
    CREATE TYPE receipt_status AS ENUM ('pending','verified','mismatch','failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS revocation_receipts (
  id               BIGSERIAL PRIMARY KEY,
  wallet_address   TEXT NOT NULL,
  chain_id         INTEGER NOT NULL,
  token_address    TEXT NOT NULL,
  spender_address  TEXT NOT NULL,
  standard         VARCHAR(10) NOT NULL,       -- ERC20 | ERC721 | ERC1155
  allowance_type   VARCHAR(12) NOT NULL,       -- per-token | all-assets
  pre_amount       NUMERIC(78,0) NOT NULL,     -- before tx (from UI row)
  post_amount      NUMERIC(78,0) NULL,         -- after verify
  tx_hash          TEXT NOT NULL,
  status           receipt_status NOT NULL DEFAULT 'pending',
  error            TEXT NULL,
  created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
  verified_at      TIMESTAMP NULL
);

CREATE INDEX IF NOT EXISTS idx_receipts_wallet ON revocation_receipts(wallet_address, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_receipts_tx ON revocation_receipts(tx_hash);
