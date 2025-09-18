# 🔐 Security Features Guide

**Allowance Guard v1.9.0** - Comprehensive Security Documentation

## 🛡️ Overview

Allowance Guard implements enterprise-grade security features to protect user accounts and sensitive data. This document provides a comprehensive overview of all security features implemented in version 1.9.0.

## 🔑 Authentication & Access Control

### Magic Link Authentication
- **Secure Email-based Login**: No passwords required, reducing attack vectors
- **Time-limited Tokens**: Magic links expire after 15 minutes
- **Single-use Tokens**: Each magic link can only be used once
- **Rate Limiting**: Prevents brute force attacks on magic link generation

### Two-Factor Authentication (2FA)
- **TOTP Support**: Time-based One-Time Password using authenticator apps
- **QR Code Generation**: Easy setup with Google Authenticator, Authy, etc.
- **Backup Codes**: 10 single-use backup codes for account recovery
- **Secure Secret Storage**: 2FA secrets are encrypted before database storage
- **Optional but Recommended**: Users can enable 2FA for enhanced security

## 📱 Device Management

### Device Fingerprinting
- **Unique Device Identification**: Creates unique fingerprints based on:
  - Browser information
  - Operating system details
  - Screen resolution
  - Timezone
  - User agent string
- **Persistent Tracking**: Devices are remembered across sessions
- **Privacy-focused**: No personal information is collected

### Trusted Device System
- **Device Trust**: Users can mark devices as trusted
- **Automatic Trust**: Previously used devices are automatically trusted
- **Device Management**: Users can view and remove trusted devices
- **Security Alerts**: Notifications for new device logins

### Session Management
- **Active Session Tracking**: Monitor all active sessions
- **Session Invalidation**: Users can terminate specific sessions
- **Cross-device Visibility**: See all devices where you're logged in
- **Automatic Cleanup**: Expired sessions are automatically removed

## 🔍 Security Monitoring

### Security Event Logging
- **Comprehensive Audit Trail**: All security events are logged:
  - Login attempts (successful and failed)
  - 2FA setup and removal
  - Device additions and removals
  - Session creation and termination
  - Account lockouts
- **Event Details**: Each event includes:
  - Timestamp
  - IP address
  - User agent
  - Device information
  - Event-specific data

### Login Attempt Monitoring
- **Rate Limiting**: Prevents brute force attacks
- **Account Lockout**: Temporary lockout after failed attempts
- **IP-based Tracking**: Monitor suspicious login patterns
- **Failure Reason Logging**: Detailed logging of why logins fail

## 🛡️ Technical Security

### Data Protection
- **Encryption at Rest**: Sensitive data is encrypted before storage
- **Secure Key Management**: Encryption keys are properly managed
- **No Plain Text Secrets**: All secrets are encrypted or hashed
- **Database Security**: Proper indexing and access controls

### API Security
- **Input Validation**: All inputs are validated and sanitized
- **Rate Limiting**: API endpoints are rate-limited
- **CSRF Protection**: Cross-site request forgery protection
- **Security Headers**: Comprehensive security headers
- **Error Handling**: Secure error handling without information leakage

### Environment Security
- **Environment Variables**: All secrets stored in environment variables
- **No Hardcoded Secrets**: No sensitive data in source code
- **Secure Configuration**: Production-ready security configurations
- **Access Control**: Proper file permissions and access controls

## 🔧 Implementation Details

### Database Schema
```sql
-- Enhanced users table with 2FA support
ALTER TABLE users
ADD COLUMN two_factor_secret TEXT,
ADD COLUMN two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN two_factor_backup_codes TEXT[];

-- Device tracking in sessions
ALTER TABLE sessions
ADD COLUMN device_fingerprint TEXT,
ADD COLUMN device_name TEXT,
ADD COLUMN device_type TEXT,
ADD COLUMN browser_name TEXT,
ADD COLUMN browser_version TEXT,
ADD COLUMN os_name TEXT,
ADD COLUMN os_version TEXT,
ADD COLUMN ip_address TEXT,
ADD COLUMN user_agent TEXT,
ADD COLUMN is_trusted BOOLEAN NOT NULL DEFAULT FALSE;

-- Trusted devices table
CREATE TABLE trusted_devices (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_fingerprint TEXT NOT NULL,
  device_name TEXT NOT NULL,
  device_type TEXT NOT NULL,
  browser_name TEXT,
  browser_version TEXT,
  os_name TEXT,
  os_version TEXT,
  ip_address TEXT,
  user_agent TEXT,
  last_used_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, device_fingerprint)
);

-- Security events logging
CREATE TABLE security_events (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Login attempts tracking
CREATE TABLE login_attempts (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  reason TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### API Endpoints

#### Authentication
- `POST /api/auth/magic/request` - Request magic link
- `POST /api/auth/magic/verify` - Verify magic link
- `POST /api/auth/2fa/setup` - Setup 2FA
- `POST /api/auth/2fa/verify` - Verify 2FA token
- `POST /api/auth/2fa/disable` - Disable 2FA

#### Device Management
- `GET /api/auth/devices` - List trusted devices
- `DELETE /api/auth/devices/[id]` - Remove trusted device
- `GET /api/auth/sessions` - List active sessions
- `DELETE /api/auth/sessions/[id]` - Terminate session

### Frontend Components
- `TwoFactorSetup.tsx` - 2FA setup wizard
- `SecuritySettings.tsx` - Security dashboard
- `RollbarProvider.tsx` - Error monitoring integration

## 🚀 Getting Started

### For Users
1. **Enable 2FA**: Go to Settings → Security → Enable 2FA
2. **Manage Devices**: View and manage trusted devices
3. **Monitor Sessions**: Check active sessions across devices
4. **Review Security Events**: Monitor account security activity

### For Developers
1. **Database Migration**: Run the enhanced auth migration
2. **Environment Setup**: Configure security-related environment variables
3. **API Integration**: Use the new security API endpoints
4. **Frontend Integration**: Implement security components

## 🔒 Security Best Practices

### For Users
- **Enable 2FA**: Always enable two-factor authentication
- **Use Trusted Devices**: Only use devices you trust
- **Monitor Sessions**: Regularly check active sessions
- **Secure Email**: Keep your email account secure
- **Report Suspicious Activity**: Report any unusual account activity

### For Administrators
- **Regular Audits**: Review security events regularly
- **Monitor Logs**: Watch for suspicious patterns
- **Update Dependencies**: Keep all dependencies updated
- **Backup Data**: Regular backups of security data
- **Access Control**: Limit administrative access

## 📊 Security Metrics

### Key Performance Indicators
- **2FA Adoption Rate**: Percentage of users with 2FA enabled
- **Failed Login Attempts**: Monitor for brute force attacks
- **New Device Logins**: Track unusual device access
- **Session Duration**: Monitor session patterns
- **Security Event Volume**: Track security-related events

### Monitoring & Alerting
- **Real-time Alerts**: Immediate notifications for security events
- **Daily Reports**: Summary of security activity
- **Weekly Reviews**: Comprehensive security analysis
- **Monthly Audits**: Full security assessment

## 🆘 Security Support

### Reporting Security Issues
- **Email**: security@allowanceguard.com
- **GitHub**: Create a private security issue
- **Response Time**: 24-48 hours for critical issues

### Security Updates
- **Regular Updates**: Monthly security updates
- **Critical Patches**: Immediate patches for critical issues
- **Security Notifications**: Email notifications for security updates

## 📚 Additional Resources

- [Rollbar Error Monitoring Setup](ROLLBAR_SETUP.md)
- [Vercel Deployment Guide](VERCEL_ROLLBAR_SETUP.md)
- [API Documentation](https://www.allowanceguard.com/docs/api)
- [User Documentation](https://www.allowanceguard.com/docs)

---

**Last Updated**: September 18, 2025  
**Version**: 1.9.0  
**Security Level**: Enterprise Grade
