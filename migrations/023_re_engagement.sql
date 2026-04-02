-- Migration: Add re-engagement email tracking to subscriptions
-- Tracks when users cancel and whether we've sent the "We miss you" email

ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS re_engagement_email_sent BOOLEAN NOT NULL DEFAULT FALSE;

-- Index for the re-engagement cron query:
-- find canceled users from ~7 days ago who haven't received the email yet
CREATE INDEX IF NOT EXISTS subscriptions_re_engagement_idx
  ON subscriptions (status, cancelled_at)
  WHERE status = 'canceled' AND re_engagement_email_sent = FALSE;
