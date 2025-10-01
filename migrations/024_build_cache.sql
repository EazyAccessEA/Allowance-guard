-- Migration 024: Build Cache System
-- Adds build tracking for cache invalidation and consistent loading

-- Build cache table for tracking builds
CREATE TABLE IF NOT EXISTS build_cache (
  id SERIAL PRIMARY KEY,
  build_id TEXT NOT NULL UNIQUE,
  version TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT false,
  static_assets JSONB,
  api_endpoints JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_build_cache_build_id ON build_cache(build_id);
CREATE INDEX IF NOT EXISTS idx_build_cache_is_active ON build_cache(is_active);
CREATE INDEX IF NOT EXISTS idx_build_cache_timestamp ON build_cache(timestamp);

-- View for current build information
CREATE OR REPLACE VIEW current_build AS
SELECT 
  build_id,
  version,
  timestamp,
  static_assets,
  api_endpoints
FROM build_cache 
WHERE is_active = true 
ORDER BY timestamp DESC 
LIMIT 1;

-- Function to activate new build
CREATE OR REPLACE FUNCTION activate_build(p_build_id TEXT, p_version TEXT, p_static_assets JSONB, p_api_endpoints JSONB)
RETURNS void AS $$
BEGIN
  -- Deactivate all current builds
  UPDATE build_cache SET is_active = false;
  
  -- Insert new active build
  INSERT INTO build_cache (build_id, version, is_active, static_assets, api_endpoints)
  VALUES (p_build_id, p_version, true, p_static_assets, p_api_endpoints);
END;
$$ LANGUAGE plpgsql;

-- Function to check if build has changed
CREATE OR REPLACE FUNCTION check_build_change(p_current_build_id TEXT)
RETURNS TABLE(
  has_changed BOOLEAN,
  new_build_id TEXT,
  new_version TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN cb.build_id IS NULL OR cb.build_id != p_current_build_id THEN true
      ELSE false
    END as has_changed,
    cb.build_id as new_build_id,
    cb.version as new_version
  FROM current_build cb;
END;
$$ LANGUAGE plpgsql;

-- Function to cleanup old builds (keep last 5)
CREATE OR REPLACE FUNCTION cleanup_old_builds()
RETURNS void AS $$
BEGIN
  DELETE FROM build_cache 
  WHERE id NOT IN (
    SELECT id FROM build_cache 
    ORDER BY timestamp DESC 
    LIMIT 5
  );
END;
$$ LANGUAGE plpgsql;

-- Add comments
COMMENT ON TABLE build_cache IS 'Build tracking for cache invalidation and consistent loading';
COMMENT ON VIEW current_build IS 'Current active build information';
COMMENT ON FUNCTION activate_build IS 'Activate a new build and deactivate others';
COMMENT ON FUNCTION check_build_change IS 'Check if build has changed since last check';
COMMENT ON FUNCTION cleanup_old_builds IS 'Clean up old build records, keeping only last 5';
