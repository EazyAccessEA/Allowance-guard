-- Migration 020: Add missing columns to token_metadata table
-- This migration adds the missing columns that were supposed to be in the original table

-- Add missing columns to token_metadata if they don't exist
DO $$
BEGIN
  -- Add verified column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'token_metadata' AND column_name = 'verified') THEN
    ALTER TABLE token_metadata ADD COLUMN verified BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;

  -- Add description column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'token_metadata' AND column_name = 'description') THEN
    ALTER TABLE token_metadata ADD COLUMN description TEXT;
  END IF;

  -- Add website column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'token_metadata' AND column_name = 'website') THEN
    ALTER TABLE token_metadata ADD COLUMN website TEXT;
  END IF;

  -- Add logo_url column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'token_metadata' AND column_name = 'logo_url') THEN
    ALTER TABLE token_metadata ADD COLUMN logo_url TEXT;
  END IF;

  -- Add created_at column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'token_metadata' AND column_name = 'created_at') THEN
    ALTER TABLE token_metadata ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT NOW();
  END IF;
END$$;

-- Create the missing index on verified column
CREATE INDEX IF NOT EXISTS idx_token_metadata_verified ON token_metadata (verified);
