-- Users & sessions
CREATE TABLE IF NOT EXISTS users (
  id           BIGSERIAL PRIMARY KEY,
  email        TEXT UNIQUE NOT NULL,
  name         TEXT,
  image        TEXT,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id           BIGSERIAL PRIMARY KEY,
  user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token        TEXT UNIQUE NOT NULL,
  expires_at   TIMESTAMP NOT NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS magic_links (
  id           BIGSERIAL PRIMARY KEY,
  email        TEXT NOT NULL,
  token        TEXT UNIQUE NOT NULL,
  purpose      TEXT NOT NULL DEFAULT 'signin',   -- signin | invite
  meta         JSONB NOT NULL DEFAULT '{}'::jsonb,
  expires_at   TIMESTAMP NOT NULL,
  consumed_at  TIMESTAMP NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Teams & membership
CREATE TYPE team_role AS ENUM ('owner','admin','editor','viewer');

CREATE TABLE IF NOT EXISTS teams (
  id           BIGSERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  owner_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_members (
  team_id      BIGINT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role         team_role NOT NULL DEFAULT 'viewer',
  created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (team_id, user_id)
);

-- Team-managed wallets (what this team can view/control)
CREATE TABLE IF NOT EXISTS team_wallets (
  team_id        BIGINT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  created_at     TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (team_id, wallet_address)
);

-- Invites
CREATE TABLE IF NOT EXISTS team_invites (
  id           BIGSERIAL PRIMARY KEY,
  team_id      BIGINT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  email        TEXT NOT NULL,
  role         team_role NOT NULL DEFAULT 'viewer',
  token        TEXT UNIQUE NOT NULL,
  invited_by   BIGINT NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  accepted_at  TIMESTAMP NULL,
  expires_at   TIMESTAMP NOT NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_wallets_team ON team_wallets(team_id);
CREATE INDEX IF NOT EXISTS idx_team_invites_team ON team_invites(team_id);
