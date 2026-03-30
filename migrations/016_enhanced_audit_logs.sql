-- Migration 016: Enhanced Audit Logging
-- Adds comprehensive audit logging capabilities

-- Add new columns to existing audit_logs table
ALTER TABLE audit_logs 
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS session_id TEXT,
ADD COLUMN IF NOT EXISTS severity VARCHAR(20) DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'data_access',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing records to have default values
UPDATE audit_logs 
SET 
  severity = 'medium',
  category = 'data_access',
  created_at = COALESCE(at, NOW())
WHERE severity IS NULL OR category IS NULL OR created_at IS NULL;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_category ON audit_logs(category);
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON audit_logs(severity);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_type ON audit_logs(actor_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_session_id ON audit_logs(session_id);

-- Create audit log summary view for dashboard
CREATE OR REPLACE VIEW audit_log_summary AS
SELECT 
  DATE_TRUNC('hour', created_at) as hour,
  category,
  severity,
  actor_type,
  COUNT(*) as event_count,
  COUNT(DISTINCT actor_id) as unique_actors,
  COUNT(DISTINCT ip) as unique_ips
FROM audit_logs
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE_TRUNC('hour', created_at), category, severity, actor_type
ORDER BY hour DESC, event_count DESC;

-- Create audit log alerts table for critical events
CREATE TABLE IF NOT EXISTS audit_alerts (
  id SERIAL PRIMARY KEY,
  
  -- Alert details
  alert_type VARCHAR(50) NOT NULL, -- 'suspicious_activity', 'failed_auth', 'admin_action', 'data_breach'
  severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
  title TEXT NOT NULL,
  description TEXT,
  
  -- Related audit log
  audit_log_id BIGINT REFERENCES audit_logs(id),
  
  -- Context
  actor_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  path TEXT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'open', -- 'open', 'investigating', 'resolved', 'false_positive'
  assigned_to TEXT,
  resolution_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for audit alerts
CREATE INDEX IF NOT EXISTS idx_audit_alerts_type ON audit_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_audit_alerts_severity ON audit_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_audit_alerts_status ON audit_alerts(status);
CREATE INDEX IF NOT EXISTS idx_audit_alerts_created_at ON audit_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_alerts_actor_id ON audit_alerts(actor_id);

-- Function to automatically create alerts for critical events
CREATE OR REPLACE FUNCTION create_audit_alert()
RETURNS TRIGGER AS $$
BEGIN
  -- Create alert for critical security events
  IF NEW.severity = 'critical' AND NEW.category = 'security' THEN
    INSERT INTO audit_alerts (
      alert_type, severity, title, description, audit_log_id,
      actor_id, ip_address, user_agent, path
    ) VALUES (
      'critical_security_event',
      'critical',
      'Critical Security Event Detected',
      'A critical security event has been detected: ' || NEW.action,
      NEW.id,
      NEW.actor_id,
      NEW.ip,
      NEW.user_agent,
      NEW.path
    );
  END IF;
  
  -- Create alert for multiple failed authentication attempts
  IF NEW.action = 'auth.failed' AND NEW.severity = 'high' THEN
    -- Check for multiple failed attempts from same IP in last hour
    IF EXISTS (
      SELECT 1 FROM audit_logs 
      WHERE ip = NEW.ip 
        AND action = 'auth.failed' 
        AND created_at > NOW() - INTERVAL '1 hour'
        AND id != NEW.id
      HAVING COUNT(*) >= 5
    ) THEN
      INSERT INTO audit_alerts (
        alert_type, severity, title, description, audit_log_id,
        actor_id, ip_address, user_agent, path
      ) VALUES (
        'suspicious_activity',
        'high',
        'Multiple Failed Authentication Attempts',
        'Multiple failed authentication attempts detected from IP: ' || NEW.ip,
        NEW.id,
        NEW.actor_id,
        NEW.ip,
        NEW.user_agent,
        NEW.path
      );
    END IF;
  END IF;
  
  -- Create alert for admin actions
  IF NEW.actor_type = 'admin' AND NEW.severity IN ('high', 'critical') THEN
    INSERT INTO audit_alerts (
      alert_type, severity, title, description, audit_log_id,
      actor_id, ip_address, user_agent, path
    ) VALUES (
      'admin_action',
      NEW.severity,
      'Admin Action Performed',
      'Admin action performed: ' || NEW.action,
      NEW.id,
      NEW.actor_id,
      NEW.ip,
      NEW.user_agent,
      NEW.path
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic alert creation
DROP TRIGGER IF EXISTS audit_alert_trigger ON audit_logs;
CREATE TRIGGER audit_alert_trigger
  AFTER INSERT ON audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION create_audit_alert();

-- Function to clean up old audit data (keep 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_audit_data()
RETURNS void AS $$
BEGIN
  -- Clean up old audit logs (keep 90 days)
  DELETE FROM audit_logs 
  WHERE created_at < NOW() - INTERVAL '90 days';
  
  -- Clean up resolved alerts older than 30 days
  DELETE FROM audit_alerts 
  WHERE status = 'resolved' 
    AND resolved_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Add comments
COMMENT ON TABLE audit_logs IS 'Comprehensive audit trail for all system activities';
COMMENT ON TABLE audit_alerts IS 'Automated alerts for critical audit events';
COMMENT ON VIEW audit_log_summary IS 'Hourly aggregated audit log statistics for dashboard display';
COMMENT ON FUNCTION create_audit_alert() IS 'Automatically creates alerts for critical audit events';
COMMENT ON FUNCTION cleanup_old_audit_data() IS 'Cleans up old audit data to manage storage';
