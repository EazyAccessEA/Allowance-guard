-- Migration 017: Token Curation System
-- Adds comprehensive token discovery, curation, and categorization capabilities

-- Enable fuzzy search extension now (needed later in Phase 4), harmless if unused
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Enums (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'token_standard') THEN
    CREATE TYPE token_standard AS ENUM ('ERC20','ERC721','ERC1155');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'curation_status') THEN
    CREATE TYPE curation_status AS ENUM ('pending','approved','rejected');
  END IF;
END$$;

-- Canonical token metadata
CREATE TABLE IF NOT EXISTS token_metadata (
  chain_id      INTEGER NOT NULL,
  token_address VARCHAR(42) NOT NULL,
  name          TEXT NOT NULL,
  symbol        TEXT NOT NULL,
  decimals      INTEGER,
  standard      token_standard NOT NULL DEFAULT 'ERC20',
  description   TEXT,
  website       TEXT,
  logo_url      TEXT,
  verified      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT pk_token_metadata PRIMARY KEY (chain_id, token_address),
  CONSTRAINT chk_token_metadata_addr_lower CHECK (token_address ~ '^0x[0-9a-f]{40}$')
);

CREATE INDEX IF NOT EXISTS idx_token_metadata_name    ON token_metadata (name);
CREATE INDEX IF NOT EXISTS idx_token_metadata_symbol  ON token_metadata (symbol);
CREATE INDEX IF NOT EXISTS idx_token_metadata_verified ON token_metadata (verified);

-- Submissions
CREATE TABLE IF NOT EXISTS token_submissions (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  chain_id      INTEGER NOT NULL,
  token_address VARCHAR(42) NOT NULL,
  name          TEXT NOT NULL,
  symbol        TEXT NOT NULL,
  decimals      INTEGER,
  standard      token_standard NOT NULL DEFAULT 'ERC20',
  description   TEXT,
  website       TEXT,
  logo_url      TEXT,
  submitted_by  TEXT NOT NULL,
  status        curation_status NOT NULL DEFAULT 'pending',
  verified      BOOLEAN NOT NULL DEFAULT FALSE,
  admin_notes   TEXT,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_token_submissions_token UNIQUE (chain_id, token_address),
  CONSTRAINT chk_token_submissions_addr_lower CHECK (token_address ~ '^0x[0-9a-f]{40}$')
);

CREATE INDEX IF NOT EXISTS idx_token_submissions_status       ON token_submissions (status);
CREATE INDEX IF NOT EXISTS idx_token_submissions_submitted_by ON token_submissions (submitted_by);
CREATE INDEX IF NOT EXISTS idx_token_submissions_created_at   ON token_submissions (created_at);

-- Categories
CREATE TABLE IF NOT EXISTS token_categories (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  description TEXT,
  icon        TEXT,
  color       TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Category mappings
CREATE TABLE IF NOT EXISTS token_category_mappings (
  chain_id      INTEGER NOT NULL,
  token_address VARCHAR(42) NOT NULL,
  category_id   INTEGER NOT NULL REFERENCES token_categories(id) ON DELETE CASCADE,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT pk_token_category_mappings PRIMARY KEY (chain_id, token_address, category_id),
  CONSTRAINT chk_token_category_addr_lower CHECK (token_address ~ '^0x[0-9a-f]{40}$')
);

CREATE INDEX IF NOT EXISTS idx_token_category_mappings_category ON token_category_mappings (category_id);

-- Lowercase enforcement trigger (defensive; app should also lowercase)
CREATE OR REPLACE FUNCTION ensure_lower_address()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.token_address := lower(NEW.token_address);
  RETURN NEW;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_token_metadata_lower'
  ) THEN
    CREATE TRIGGER trg_token_metadata_lower
    BEFORE INSERT OR UPDATE ON token_metadata
    FOR EACH ROW EXECUTE FUNCTION ensure_lower_address();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_token_submissions_lower'
  ) THEN
    CREATE TRIGGER trg_token_submissions_lower
    BEFORE INSERT OR UPDATE ON token_submissions
    FOR EACH ROW EXECUTE FUNCTION ensure_lower_address();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_token_category_mappings_lower'
  ) THEN
    CREATE TRIGGER trg_token_category_mappings_lower
    BEFORE INSERT OR UPDATE ON token_category_mappings
    FOR EACH ROW EXECUTE FUNCTION ensure_lower_address();
  END IF;
END$$;

-- Touch updated_at on update
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_token_metadata_updated_at'
  ) THEN
    CREATE TRIGGER trg_token_metadata_updated_at
    BEFORE UPDATE ON token_metadata
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_token_submissions_updated_at'
  ) THEN
    CREATE TRIGGER trg_token_submissions_updated_at
    BEFORE UPDATE ON token_submissions
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
  END IF;
END$$;

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