-- Migration 023: Predictive Performance System
-- Adds user behavior tracking for predictive optimization

-- User behavior patterns table
CREATE TABLE IF NOT EXISTS user_behavior_patterns (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  page_url TEXT NOT NULL,
  visit_count INTEGER NOT NULL DEFAULT 1,
  avg_session_duration INTEGER NOT NULL DEFAULT 0,
  device_type VARCHAR(10) NOT NULL DEFAULT 'desktop',
  connection_speed VARCHAR(10) NOT NULL DEFAULT 'medium',
  last_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  preferences JSONB,
  common_paths TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Composite unique constraint
  UNIQUE(user_id, page_url)
);

-- Predictive cache table
CREATE TABLE IF NOT EXISTS predictive_cache (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  predicted_pages TEXT[] NOT NULL,
  priority VARCHAR(10) NOT NULL DEFAULT 'medium',
  confidence DECIMAL(3,2) NOT NULL DEFAULT 0.5,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_behavior_user_id ON user_behavior_patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_user_behavior_page_url ON user_behavior_patterns(page_url);
CREATE INDEX IF NOT EXISTS idx_user_behavior_last_visit ON user_behavior_patterns(last_visit);
CREATE INDEX IF NOT EXISTS idx_user_behavior_visit_count ON user_behavior_patterns(visit_count);

CREATE INDEX IF NOT EXISTS idx_predictive_cache_user_id ON predictive_cache(user_id);
CREATE INDEX IF NOT EXISTS idx_predictive_cache_expires_at ON predictive_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_predictive_cache_confidence ON predictive_cache(confidence);

-- View for user behavior analytics
CREATE OR REPLACE VIEW user_behavior_analytics AS
SELECT 
  user_id,
  COUNT(DISTINCT page_url) as unique_pages,
  SUM(visit_count) as total_visits,
  AVG(avg_session_duration) as avg_session_duration,
  MAX(last_visit) as last_activity,
  device_type,
  connection_speed,
  -- Most visited pages
  (
    SELECT page_url 
    FROM user_behavior_patterns ubp2 
    WHERE ubp2.user_id = ubp.user_id 
    ORDER BY visit_count DESC 
    LIMIT 1
  ) as most_visited_page
FROM user_behavior_patterns ubp
GROUP BY user_id, device_type, connection_speed;

-- View for predictive insights
CREATE OR REPLACE VIEW predictive_insights AS
SELECT 
  page_url,
  COUNT(DISTINCT user_id) as unique_users,
  AVG(visit_count) as avg_visits_per_user,
  AVG(avg_session_duration) as avg_session_duration,
  device_type,
  connection_speed,
  -- Popular next pages
  (
    SELECT array_agg(DISTINCT next_page.page_url)
    FROM user_behavior_patterns next_page
    WHERE next_page.user_id IN (
      SELECT user_id FROM user_behavior_patterns 
      WHERE page_url = ubp.page_url
    )
    AND next_page.page_url != ubp.page_url
    ORDER BY next_page.visit_count DESC
    LIMIT 3
  ) as common_next_pages
FROM user_behavior_patterns ubp
GROUP BY page_url, device_type, connection_speed
HAVING COUNT(DISTINCT user_id) > 1;

-- Function to clean up expired predictive cache
CREATE OR REPLACE FUNCTION cleanup_expired_predictive_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM predictive_cache 
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to get user's predicted next pages
CREATE OR REPLACE FUNCTION get_user_predictions(p_user_id TEXT)
RETURNS TABLE(
  predicted_page TEXT,
  confidence DECIMAL(3,2),
  priority VARCHAR(10)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    unnest(pc.predicted_pages) as predicted_page,
    pc.confidence,
    pc.priority
  FROM predictive_cache pc
  WHERE pc.user_id = p_user_id
  AND pc.expires_at > NOW()
  ORDER BY pc.confidence DESC, pc.priority DESC;
END;
$$ LANGUAGE plpgsql;

-- Add comments
COMMENT ON TABLE user_behavior_patterns IS 'User behavior tracking for predictive performance optimization';
COMMENT ON TABLE predictive_cache IS 'Cached predictions for user navigation patterns';
COMMENT ON VIEW user_behavior_analytics IS 'Aggregated user behavior analytics';
COMMENT ON VIEW predictive_insights IS 'Predictive insights based on user patterns';
