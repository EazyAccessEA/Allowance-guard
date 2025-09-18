-- Migration 015: Performance Metrics Tracking
-- Adds table for Core Web Vitals and performance monitoring

-- Performance metrics table
CREATE TABLE IF NOT EXISTS performance_metrics (
  id SERIAL PRIMARY KEY,
  
  -- Core Web Vitals
  lcp INTEGER, -- Largest Contentful Paint (ms)
  inp INTEGER, -- Interaction to Next Paint (ms)
  cls DECIMAL(6,3), -- Cumulative Layout Shift
  fid INTEGER, -- First Input Delay (ms) - legacy
  ttfb INTEGER, -- Time to First Byte (ms)
  
  -- Navigation timing
  load_time INTEGER, -- Total load time (ms)
  dom_content_loaded INTEGER, -- DOM content loaded time (ms)
  first_paint INTEGER, -- First paint time (ms)
  first_contentful_paint INTEGER, -- First contentful paint time (ms)
  
  -- Resource metrics
  total_size BIGINT, -- Total resource size (bytes)
  resource_count INTEGER, -- Number of resources
  image_count INTEGER, -- Number of images
  script_count INTEGER, -- Number of scripts
  stylesheet_count INTEGER, -- Number of stylesheets
  
  -- Context
  user_agent TEXT,
  connection TEXT, -- Connection type and speed
  page_url TEXT, -- Page URL where metrics were collected
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes for performance
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_page_url ON performance_metrics(page_url);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_lcp ON performance_metrics(lcp) WHERE lcp IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_performance_metrics_inp ON performance_metrics(inp) WHERE inp IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_performance_metrics_cls ON performance_metrics(cls) WHERE cls IS NOT NULL;

-- Performance alerts table for tracking budget violations
CREATE TABLE IF NOT EXISTS performance_alerts (
  id SERIAL PRIMARY KEY,
  
  -- Alert details
  alert_type VARCHAR(50) NOT NULL, -- 'lcp', 'inp', 'cls', 'fid', 'ttfb', 'bundle_size'
  threshold_value DECIMAL(10,3) NOT NULL, -- The threshold that was exceeded
  actual_value DECIMAL(10,3) NOT NULL, -- The actual value that exceeded the threshold
  severity VARCHAR(20) DEFAULT 'warning', -- 'warning', 'critical'
  
  -- Context
  page_url TEXT,
  user_agent TEXT,
  connection TEXT,
  
  -- Metadata
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by TEXT,
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance alerts
CREATE INDEX IF NOT EXISTS idx_performance_alerts_type ON performance_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_performance_alerts_severity ON performance_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_performance_alerts_resolved ON performance_alerts(resolved);
CREATE INDEX IF NOT EXISTS idx_performance_alerts_created_at ON performance_alerts(created_at);

-- Performance summary view for dashboard
CREATE OR REPLACE VIEW performance_summary AS
SELECT 
  DATE_TRUNC('hour', timestamp) as hour,
  page_url,
  
  -- Core Web Vitals averages
  AVG(lcp) as avg_lcp,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY lcp) as p75_lcp,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY lcp) as p95_lcp,
  
  AVG(inp) as avg_inp,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY inp) as p75_inp,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY inp) as p95_inp,
  
  AVG(cls) as avg_cls,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY cls) as p75_cls,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY cls) as p95_cls,
  
  AVG(fid) as avg_fid,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY fid) as p75_fid,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY fid) as p95_fid,
  
  AVG(ttfb) as avg_ttfb,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY ttfb) as p75_ttfb,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY ttfb) as p95_ttfb,
  
  -- Resource metrics
  AVG(total_size) as avg_total_size,
  AVG(resource_count) as avg_resource_count,
  
  -- Sample count
  COUNT(*) as sample_count
  
FROM performance_metrics
WHERE timestamp > NOW() - INTERVAL '7 days'
GROUP BY DATE_TRUNC('hour', timestamp), page_url
ORDER BY hour DESC, page_url;

-- Function to clean up old performance data (keep 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_performance_data()
RETURNS void AS $$
BEGIN
  DELETE FROM performance_metrics 
  WHERE timestamp < NOW() - INTERVAL '30 days';
  
  DELETE FROM performance_alerts 
  WHERE created_at < NOW() - INTERVAL '30 days' 
  AND resolved = TRUE;
END;
$$ LANGUAGE plpgsql;

-- Add comment
COMMENT ON TABLE performance_metrics IS 'Core Web Vitals and performance metrics collected from client-side monitoring';
COMMENT ON TABLE performance_alerts IS 'Performance budget violations and alerts';
COMMENT ON VIEW performance_summary IS 'Hourly aggregated performance metrics for dashboard display';
