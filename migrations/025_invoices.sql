-- 025_invoices.sql — Local mirror of Stripe invoices for custom invoicing

CREATE TABLE IF NOT EXISTS invoices (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       INTEGER NOT NULL,
  stripe_invoice_id TEXT NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT,
  amount_due    INTEGER NOT NULL DEFAULT 0,
  amount_paid   INTEGER NOT NULL DEFAULT 0,
  currency      TEXT NOT NULL DEFAULT 'usd',
  status        TEXT NOT NULL DEFAULT 'draft',
  plan          TEXT,
  period_start  TIMESTAMPTZ,
  period_end    TIMESTAMPTZ,
  hosted_invoice_url TEXT,
  invoice_pdf_url TEXT,
  invoice_number TEXT,
  description   TEXT,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  paid_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS invoices_stripe_invoice_id_key ON invoices (stripe_invoice_id);
CREATE INDEX IF NOT EXISTS invoices_user_id_idx ON invoices (user_id);
CREATE INDEX IF NOT EXISTS invoices_stripe_customer_id_idx ON invoices (stripe_customer_id);
CREATE INDEX IF NOT EXISTS invoices_status_idx ON invoices (status);
