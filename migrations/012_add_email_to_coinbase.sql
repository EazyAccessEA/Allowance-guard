-- Add email column to coinbase_donations table
ALTER TABLE coinbase_donations
ADD COLUMN IF NOT EXISTS email TEXT;
