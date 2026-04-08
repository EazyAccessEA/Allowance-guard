-- 027_api_public_keys.sql
--
-- Introduces the browser-safe "public" API key tier (ag_pub_*) required by
-- @allowance-guard/react and any other dApp integrators that need to call
-- /api/v1 directly from the browser.
--
-- Design:
--   * `key_type` distinguishes secret (ag_live_*) from public (ag_pub_*) keys.
--     Secret keys keep their existing behaviour. Public keys are:
--       - read-only (middleware enforces GET only)
--       - lower rate limits (see api_public plan in src/lib/plans.ts)
--       - CORS-enabled on /api/v1 responses
--       - optionally origin-locked via allowed_origins
--   * `allowed_origins` is NULL by default (accept any origin). Dashboard UI
--     can tighten this to a specific production domain.
--
-- Rollout: this migration is additive and backward-compatible. All existing
-- keys default to key_type='secret', preserving current behaviour.

ALTER TABLE api_keys
  ADD COLUMN IF NOT EXISTS key_type text NOT NULL DEFAULT 'secret',
  ADD COLUMN IF NOT EXISTS allowed_origins text[];

-- Sanity check: key_type must be one of the two values we support.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'api_keys_key_type_check'
  ) THEN
    ALTER TABLE api_keys
      ADD CONSTRAINT api_keys_key_type_check
      CHECK (key_type IN ('secret', 'public'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS api_keys_key_type_idx ON api_keys (key_type);
