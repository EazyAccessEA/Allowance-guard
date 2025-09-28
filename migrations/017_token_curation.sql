-- Migration 017: Token Curation System
-- Adds comprehensive token discovery, curation, and categorization capabilities

-- Create enums for token standards and curation status
DO $$ BEGIN
    CREATE TYPE token_standard AS ENUM ('ERC20', 'ERC721', 'ERC1155');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE curation_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Canonical metadata table (approved/known tokens)
CREATE TABLE IF NOT EXISTS token_metadata (
  chain_id INTEGER NOT NULL,
  token_address VARCHAR(42) NOT NULL, -- lowercased 0x...
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  decimals INTEGER,
  standard token_standard NOT NULL DEFAULT 'ERC20',
  description TEXT,
  website TEXT,
  logo_url TEXT,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (chain_id, token_address)
);

-- Community submissions table (review queue)
CREATE TABLE IF NOT EXISTS token_submissions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  chain_id INTEGER NOT NULL,
  token_address VARCHAR(42) NOT NULL, -- lowercased 0x...
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  decimals INTEGER,
  standard token_standard NOT NULL DEFAULT 'ERC20',
  description TEXT,
  website TEXT,
  logo_url TEXT,
  submitted_by TEXT NOT NULL, -- email or wallet
  status curation_status NOT NULL DEFAULT 'pending',
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  admin_notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS token_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Category mappings table (many-to-many)
CREATE TABLE IF NOT EXISTS token_category_mappings (
  chain_id INTEGER NOT NULL,
  token_address VARCHAR(42) NOT NULL, -- lowercased 0x...
  category_id INTEGER NOT NULL REFERENCES token_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (chain_id, token_address, category_id)
);

-- Indexes for token_metadata
CREATE INDEX IF NOT EXISTS idx_token_metadata_name ON token_metadata(name);
CREATE INDEX IF NOT EXISTS idx_token_metadata_symbol ON token_metadata(symbol);
CREATE INDEX IF NOT EXISTS idx_token_metadata_verified ON token_metadata(verified);

-- Indexes for token_submissions
CREATE UNIQUE INDEX IF NOT EXISTS uq_token_submissions_token ON token_submissions(chain_id, token_address);
CREATE INDEX IF NOT EXISTS idx_token_submissions_status ON token_submissions(status);
CREATE INDEX IF NOT EXISTS idx_token_submissions_submitted_by ON token_submissions(submitted_by);
CREATE INDEX IF NOT EXISTS idx_token_submissions_created_at ON token_submissions(created_at);

-- Indexes for token_category_mappings
CREATE INDEX IF NOT EXISTS idx_token_category_mappings_category ON token_category_mappings(category_id);

-- Add constraints to ensure lowercase, checksummed addresses
ALTER TABLE token_metadata 
ADD CONSTRAINT chk_token_metadata_address_format 
CHECK (token_address ~ '^0x[0-9a-f]{40}$');

ALTER TABLE token_submissions 
ADD CONSTRAINT chk_token_submissions_address_format 
CHECK (token_address ~ '^0x[0-9a-f]{40}$');

ALTER TABLE token_category_mappings 
ADD CONSTRAINT chk_token_category_mappings_address_format 
CHECK (token_address ~ '^0x[0-9a-f]{40}$');

-- Add trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to token_metadata and token_submissions
DROP TRIGGER IF EXISTS update_token_metadata_updated_at ON token_metadata;
CREATE TRIGGER update_token_metadata_updated_at
    BEFORE UPDATE ON token_metadata
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_token_submissions_updated_at ON token_submissions;
CREATE TRIGGER update_token_submissions_updated_at
    BEFORE UPDATE ON token_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE token_metadata IS 'Canonical metadata for approved/known tokens';
COMMENT ON TABLE token_submissions IS 'Community submissions for token review and curation';
COMMENT ON TABLE token_categories IS 'Token categories for organization and discovery';
COMMENT ON TABLE token_category_mappings IS 'Many-to-many mapping between tokens and categories';

COMMENT ON COLUMN token_metadata.token_address IS 'Lowercased, checksummed Ethereum address (0x...)';
COMMENT ON COLUMN token_submissions.token_address IS 'Lowercased, checksummed Ethereum address (0x...)';
COMMENT ON COLUMN token_category_mappings.token_address IS 'Lowercased, checksummed Ethereum address (0x...)';
COMMENT ON COLUMN token_submissions.submitted_by IS 'Email address or wallet address of submitter';
COMMENT ON COLUMN token_submissions.admin_notes IS 'Internal notes for curation decisions';
