-- Migration 028 — SIWE (Sign-In with Ethereum) auth
--
-- Adds wallet-address identity to the users table and a nonce table
-- for SIWE replay protection. Magic-link tables stay — deprecated but
-- not dropped, in case we need to roll back or keep a fallback path.

BEGIN;

-- Allow users to be wallet-identified. Email becomes optional.
ALTER TABLE users
  ALTER COLUMN email DROP NOT NULL;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS wallet_address TEXT UNIQUE;

-- Fast lookup by wallet on login
CREATE INDEX IF NOT EXISTS users_wallet_address_idx
  ON users (LOWER(wallet_address));

-- At least one identity must be present
ALTER TABLE users
  DROP CONSTRAINT IF EXISTS users_identity_present;
ALTER TABLE users
  ADD CONSTRAINT users_identity_present
  CHECK (email IS NOT NULL OR wallet_address IS NOT NULL);

-- Single-use nonces for SIWE challenge. Issued by /api/auth/nonce,
-- consumed by /api/auth/siwe. Short TTL (10 min) enforced in SQL.
CREATE TABLE IF NOT EXISTS siwe_nonces (
  nonce        TEXT PRIMARY KEY,
  issued_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at   TIMESTAMP NOT NULL DEFAULT NOW() + INTERVAL '10 minutes',
  consumed_at  TIMESTAMP
);

CREATE INDEX IF NOT EXISTS siwe_nonces_expires_idx
  ON siwe_nonces (expires_at)
  WHERE consumed_at IS NULL;

COMMIT;
