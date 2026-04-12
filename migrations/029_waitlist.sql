-- 029_waitlist.sql
-- Waitlist / email capture for coming-soon features

CREATE TABLE IF NOT EXISTS waitlist_subscribers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL,
  interest      TEXT NOT NULL DEFAULT 'general',   -- segment tag: general, mobile, sdk, api, chains
  referrer      TEXT,                               -- page URL that captured this lead
  confirmed     BOOLEAN NOT NULL DEFAULT false,     -- reserved for future double opt-in
  unsubscribed  BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS waitlist_email_interest_uniq
  ON waitlist_subscribers (lower(email), interest);

CREATE INDEX IF NOT EXISTS waitlist_created_at_idx
  ON waitlist_subscribers (created_at);
