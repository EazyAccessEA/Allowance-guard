# Security Guidelines

## Environment Variables

### Production Security
- **Never commit actual environment variables** to version control
- Use Vercel's secure environment variable storage for production
- Rotate secrets regularly (every 90 days)
- Use different secrets for development, staging, and production

### Required Environment Variables
```bash
# Database
DATABASE_URL=postgresql://...

# RPC Endpoints
ETHEREUM_RPC_URL=https://...
ARBITRUM_RPC_URL=https://...
BASE_RPC_URL=https://...

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...

# SMTP
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...

# Security
NEXTAUTH_SECRET=...
NEXTAUTH_URL=...
```

## Security Features Implemented

### 1. Security Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security: max-age=31536000
- Content-Security-Policy: Restrictive policy
- Referrer-Policy: strict-origin-when-cross-origin

### 2. Rate Limiting
- API endpoints: 100 requests per 15 minutes
- Authentication: 5 attempts per 15 minutes
- Scanning: 10 scans per minute
- Strict endpoints: 5 requests per minute

### 3. CSRF Protection
- Token-based CSRF protection
- Secure cookie settings
- Timing-safe comparison

### 4. Input Validation
- Wallet address format validation
- Email format validation
- Input sanitization
- Length limits

### 5. Security Middleware
- IP-based rate limiting
- Suspicious request detection
- Security event logging
- Origin validation

## Deployment Security

### Vercel Configuration
1. Set all environment variables in Vercel dashboard
2. Enable automatic HTTPS
3. Configure custom domains with SSL
4. Set up monitoring and alerts

### Database Security
1. Use connection pooling
2. Enable SSL connections
3. Restrict database access by IP
4. Regular backups with encryption

### RPC Security
1. Use production-grade RPC providers
2. Implement failover mechanisms
3. Monitor RPC usage and costs
4. Rate limit RPC requests

## Monitoring and Alerting

### Security Events to Monitor
- Failed authentication attempts
- Rate limit violations
- Suspicious user agents
- Unusual traffic patterns
- Database connection errors

### Logging
- All security events are logged
- IP addresses and user agents tracked
- Failed requests logged with details
- Regular log rotation and cleanup

## Incident Response

### Security Breach Response
1. Immediately rotate all secrets
2. Review access logs
3. Check for unauthorized access
4. Notify users if necessary
5. Document incident and lessons learned

### Contact Information
- Security Issues: legal.support@allowanceguard.com
- Emergency: [Your emergency contact]

## Best Practices

### For Developers
- Never log sensitive information
- Validate all inputs
- Use parameterized queries
- Keep dependencies updated
- Regular security audits

### For Users
- Use strong passwords
- Enable 2FA where available
- Keep software updated
- Report security issues immediately

## Vulnerability Disclosure

We take security seriously. If you discover a security vulnerability:

1. **DO NOT** create a public GitHub issue
2. Email security details to: legal.support@allowanceguard.com
3. Include steps to reproduce
4. Allow reasonable time for response
5. We will acknowledge receipt within 48 hours

## License and Legal

This software is provided under GPL-3.0 license with additional security terms. See LICENSE file for full details.

**Disclaimer**: This software is provided "as is" without warranty. Users are responsible for their own security assessments and risk management.
