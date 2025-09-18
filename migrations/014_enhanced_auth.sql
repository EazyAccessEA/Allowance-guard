-- Enhanced Authentication System Migration
-- Adds 2FA, device management, security tracking, and user profiles

-- User profile enhancements
ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_secret TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS backup_codes TEXT[]; -- Array of backup codes
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS login_attempts INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS security_notifications BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC';
ALTER TABLE users ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';

-- Enhanced sessions with device tracking
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS device_fingerprint TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS device_name TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS device_type TEXT; -- desktop, mobile, tablet
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS browser_name TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS browser_version TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS os_name TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS os_version TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS ip_address INET;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS location_country TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS location_city TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS is_trusted BOOLEAN DEFAULT FALSE;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMP DEFAULT NOW();
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS created_via TEXT DEFAULT 'magic_link'; -- magic_link, 2fa, etc.

-- Security events tracking
CREATE TABLE IF NOT EXISTS security_events (
  id           BIGSERIAL PRIMARY KEY,
  user_id      BIGINT REFERENCES users(id) ON DELETE CASCADE,
  session_id   BIGINT REFERENCES sessions(id) ON DELETE SET NULL,
  event_type   TEXT NOT NULL, -- login_success, login_failed, 2fa_enabled, device_added, etc.
  event_data   JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address   INET,
  user_agent   TEXT,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Login attempts tracking (separate from security_events for performance)
CREATE TABLE IF NOT EXISTS login_attempts (
  id           BIGSERIAL PRIMARY KEY,
  email        TEXT NOT NULL,
  ip_address   INET NOT NULL,
  user_agent   TEXT,
  success      BOOLEAN NOT NULL,
  failure_reason TEXT, -- invalid_token, expired, rate_limited, etc.
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Device management
CREATE TABLE IF NOT EXISTS trusted_devices (
  id           BIGSERIAL PRIMARY KEY,
  user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_fingerprint TEXT NOT NULL,
  device_name  TEXT NOT NULL,
  device_type  TEXT NOT NULL,
  browser_name TEXT,
  browser_version TEXT,
  os_name      TEXT,
  os_version   TEXT,
  last_used_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, device_fingerprint)
);

-- 2FA backup codes (separate table for better security)
CREATE TABLE IF NOT EXISTS user_backup_codes (
  id           BIGSERIAL PRIMARY KEY,
  user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code_hash    TEXT NOT NULL, -- Hashed backup code
  used_at      TIMESTAMP NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_two_factor ON users(two_factor_enabled);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_device ON sessions(device_fingerprint);
CREATE INDEX IF NOT EXISTS idx_sessions_last_activity ON sessions(last_activity_at);
CREATE INDEX IF NOT EXISTS idx_security_events_user ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_created ON security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_login_attempts_created ON login_attempts(created_at);
CREATE INDEX IF NOT EXISTS idx_trusted_devices_user ON trusted_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_trusted_devices_fingerprint ON trusted_devices(device_fingerprint);
CREATE INDEX IF NOT EXISTS idx_backup_codes_user ON user_backup_codes(user_id);

-- Cleanup old data (keep last 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_auth_data()
RETURNS void AS $$
BEGIN
  -- Clean up old login attempts (keep 90 days)
  DELETE FROM login_attempts WHERE created_at < NOW() - INTERVAL '90 days';
  
  -- Clean up old security events (keep 1 year)
  DELETE FROM security_events WHERE created_at < NOW() - INTERVAL '1 year';
  
  -- Clean up expired sessions
  DELETE FROM sessions WHERE expires_at < NOW();
  
  -- Clean up used backup codes older than 30 days
  DELETE FROM user_backup_codes WHERE used_at IS NOT NULL AND used_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON TABLE security_events IS 'Tracks all security-related events for audit and monitoring';
COMMENT ON TABLE login_attempts IS 'Tracks login attempts for rate limiting and security analysis';
COMMENT ON TABLE trusted_devices IS 'Stores user-trusted devices for enhanced security';
COMMENT ON TABLE user_backup_codes IS 'Stores hashed 2FA backup codes for account recovery';
COMMENT ON FUNCTION cleanup_old_auth_data() IS 'Cleans up old authentication data for performance and privacy';
