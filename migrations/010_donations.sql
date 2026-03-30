-- Create donations table for Stripe webhook integration
CREATE TABLE IF NOT EXISTS donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_session_id TEXT NOT NULL UNIQUE,
  stripe_event_id TEXT NOT NULL,
  amount_total INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'gbp',
  email TEXT,
  payer_name TEXT,
  payment_status TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_donations_stripe_session_id ON donations(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC);
