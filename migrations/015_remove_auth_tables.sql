-- Remove authentication tables that are no longer needed
-- This migration removes the email-based authentication system

-- Drop authentication-related tables
DROP TABLE IF EXISTS login_attempts;
DROP TABLE IF EXISTS security_events;
DROP TABLE IF EXISTS trusted_devices;

-- Remove authentication columns from users table
ALTER TABLE users 
DROP COLUMN IF EXISTS two_factor_secret,
DROP COLUMN IF EXISTS two_factor_enabled,
DROP COLUMN IF EXISTS two_factor_backup_codes;

-- Remove device info from sessions table
ALTER TABLE sessions
DROP COLUMN IF EXISTS device_fingerprint,
DROP COLUMN IF EXISTS device_name,
DROP COLUMN IF EXISTS device_type,
DROP COLUMN IF EXISTS browser_name,
DROP COLUMN IF EXISTS browser_version,
DROP COLUMN IF EXISTS os_name,
DROP COLUMN IF EXISTS os_version,
DROP COLUMN IF EXISTS ip_address,
DROP COLUMN IF EXISTS user_agent,
DROP COLUMN IF EXISTS is_trusted;

-- Drop indexes that are no longer needed
DROP INDEX IF EXISTS idx_login_attempts_email;
DROP INDEX IF EXISTS idx_login_attempts_ip;
DROP INDEX IF EXISTS idx_security_events_user;
DROP INDEX IF EXISTS idx_trusted_devices_user;
