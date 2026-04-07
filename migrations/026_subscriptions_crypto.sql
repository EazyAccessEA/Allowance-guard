-- Extend subscriptions table to support Coinbase Commerce (crypto) payments
-- alongside Stripe. Stripe columns become nullable; a `provider` column
-- distinguishes rows.

ALTER TABLE subscriptions
  ALTER COLUMN stripe_customer_id DROP NOT NULL,
  ALTER COLUMN stripe_subscription_id DROP NOT NULL;

ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS provider TEXT NOT NULL DEFAULT 'stripe',
  ADD COLUMN IF NOT EXISTS coinbase_charge_code TEXT,
  ADD COLUMN IF NOT EXISTS billing_interval TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_coinbase_charge_code_key
  ON subscriptions (coinbase_charge_code)
  WHERE coinbase_charge_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS subscriptions_provider_idx
  ON subscriptions (provider);
