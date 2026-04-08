-- Create baseline api_keys table for deployments that missed original billing setup.
-- This ensures 027_api_public_keys.sql can safely alter the table.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER NOT NULL,
  key_hash TEXT NOT NULL,
  prefix TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT 'Default',
  plan TEXT NOT NULL DEFAULT 'api_free',
  rate_limit INTEGER NOT NULL DEFAULT 100,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS api_keys_user_id_idx ON api_keys (user_id);
CREATE INDEX IF NOT EXISTS api_keys_key_hash_idx ON api_keys (key_hash);
CREATE INDEX IF NOT EXISTS api_keys_prefix_idx ON api_keys (prefix);
