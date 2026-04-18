-- Migration 032 — One-time-code (OTP) email auth
--
-- Adds a codes table for email-based sign-in via 6-digit one-time codes.
-- Replaces magic-link on the upgrade funnel where cross-tab / mobile
-- / spam-preview friction made links unreliable. Matches the standard
-- consumer-SaaS pattern (Linear, Slack, Notion, Discord).
--
-- The 6-digit code itself is never stored; only an HMAC-SHA256 hash
-- keyed with OTP_SECRET. Rate limits are enforced at the API layer
-- (/api/auth/otp-request). The attempts counter lets the verify
-- endpoint lock a code after 5 wrong guesses so a leaked hash
-- couldn't be brute-forced within the 10-minute TTL.
--
-- Magic-link table stays for /api/teams/invite. SIWE stays for
-- wallet-first users on /login. This is an additive auth path, not
-- a replacement.

BEGIN;

CREATE TABLE IF NOT EXISTS otp_codes (
  id          BIGSERIAL PRIMARY KEY,
  email       TEXT NOT NULL,
  code_hash   TEXT NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  attempts    INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fast lookup of the most recent unconsumed code for an email on verify
CREATE INDEX IF NOT EXISTS otp_codes_email_active_idx
  ON otp_codes (LOWER(email), created_at DESC)
  WHERE consumed_at IS NULL;

-- Cleanup scan (cron could GC expired + consumed rows later)
CREATE INDEX IF NOT EXISTS otp_codes_expires_idx
  ON otp_codes (expires_at)
  WHERE consumed_at IS NULL;

COMMIT;

-- DOWN
-- DROP INDEX IF EXISTS otp_codes_expires_idx;
-- DROP INDEX IF EXISTS otp_codes_email_active_idx;
-- DROP TABLE IF EXISTS otp_codes;
