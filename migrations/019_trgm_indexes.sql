-- Requires: CREATE EXTENSION IF NOT EXISTS pg_trgm;  (already added in 017)
-- Create fast trigram indexes for fuzzy search (case-insensitive)

CREATE INDEX IF NOT EXISTS idx_tm_name_trgm
  ON token_metadata USING GIN (lower(name) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_tm_symbol_trgm
  ON token_metadata USING GIN (lower(symbol) gin_trgm_ops);

-- token_address is already enforced lowercase; no need to wrap lower()
CREATE INDEX IF NOT EXISTS idx_tm_addr_trgm
  ON token_metadata USING GIN (token_address gin_trgm_ops);

-- Helpful when filtering by category -> mapping join
CREATE INDEX IF NOT EXISTS idx_tcm_token_trgm
  ON token_category_mappings USING GIN ((token_address) gin_trgm_ops);
