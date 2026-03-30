-- Day 19: Optional chain settings for runtime toggling
CREATE TABLE IF NOT EXISTS chain_settings (
  chain_id   INTEGER PRIMARY KEY,
  enabled    BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
