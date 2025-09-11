-- Token metadata cache (per chain)
CREATE TABLE IF NOT EXISTS token_metadata (
  chain_id      INTEGER NOT NULL,
  token_address TEXT    NOT NULL,
  standard      VARCHAR(10) NOT NULL,         -- ERC20 | ERC721 | ERC1155 | UNKNOWN
  name          TEXT,
  symbol        TEXT,
  decimals      INTEGER,                      -- ERC20 only
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (chain_id, token_address)
);

CREATE INDEX IF NOT EXISTS idx_token_meta_chain_symbol ON token_metadata(chain_id, symbol);

-- Spender labels (global cache, curated or auto)
CREATE TABLE IF NOT EXISTS spender_labels (
  chain_id      INTEGER NOT NULL,
  address       TEXT    NOT NULL,
  label         TEXT    NOT NULL,
  trust         VARCHAR(12) NOT NULL DEFAULT 'community', -- official | curated | community
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (chain_id, address)
);
