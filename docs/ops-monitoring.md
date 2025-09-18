# Ops Monitoring & Cost Guardrails

## Overview

Allowance Guard includes comprehensive operational monitoring to track costs, usage, and system health. This system is designed for a free service that hopes for contributions to keep running.

## Components

### 1. Metrics Collection (`lib/metrics.ts`)

**Redis-based daily counters:**
- RPC calls by chain ID
- Email sends
- Scan requests

**Graceful degradation:** Works even when Redis is unavailable.

### 2. Alerting System (`lib/ops_alert.ts`)

**Multi-channel alerts:**
- Slack webhook notifications
- Email fallback alerts
- JSON formatting utilities

**Error handling:** Timeouts, retries, and graceful failures.

### 3. Ops Dashboard (`/ops`)

**Protected dashboard:**
- Token-based authentication
- Real-time health and metrics
- Simple, read-only interface

### 4. API Endpoints

#### `/api/ops/metrics`
- **Purpose:** Database size, table metrics, daily counters
- **Auth:** Requires `OPS_DASH_TOKEN`
- **Response:** JSON with DB size, top tables, record counts, daily metrics

#### `/api/alerts/health`
- **Purpose:** Health monitoring with alerts
- **Schedule:** Every 10 minutes via Vercel cron
- **Alerts:** Slack + email when health degrades

#### `/api/alerts/daily`
- **Purpose:** Daily ops reports + user digests
- **Schedule:** Daily at 8:05 AM UTC via Vercel cron
- **Features:** Combines user digests with ops monitoring

## Environment Variables

```bash
# Slack notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# Email fallback
OPS_ALERT_EMAIL=legal.ops@allowanceguard.com
MAIL_FROM=Allowance Guard <legal.support@allowanceguard.com>

# Cost thresholds
OPS_DB_WARN_GB=1.0           # warn if DB > 1 GB
OPS_RPC_WARN_DAY=75000       # warn if RPC calls today exceed this
OPS_EMAIL_WARN_DAY=500       # warn if emails today exceed this

# Dashboard protection
OPS_DASH_TOKEN=7ae87a7b1881cafd224a16cdc041ed741af746267207d445ed21e4414c4e77fa
```

## Monitoring Features

### Cost Tracking
- **Database size monitoring** with 1GB warning threshold
- **RPC usage tracking** by chain with 75K daily limit
- **Email volume monitoring** with 500 daily limit
- **Scan activity tracking**

### Health Monitoring
- **System health checks** every 10 minutes
- **Multi-channel alerts** (Slack + email)
- **Automatic failure detection**

### Daily Reports
- **Comprehensive ops summary** at 8:05 AM UTC
- **User digest integration** (preserves existing functionality)
- **Threshold warnings** when limits exceeded

## Testing

### Manual Testing
```bash
# Test all ops endpoints
node scripts/test-ops-monitoring.js https://www.allowanceguard.com YOUR_OPS_TOKEN

# Test individual endpoints
curl "https://www.allowanceguard.com/api/ops/metrics?token=YOUR_TOKEN"
curl "https://www.allowanceguard.com/api/alerts/health"
curl "https://www.allowanceguard.com/api/alerts/daily"
```

### Dashboard Access
1. Navigate to `/ops`
2. Enter your `OPS_DASH_TOKEN`
3. Click "Load" to view metrics

## Production Deployment

### 1. Environment Setup
- Set all ops monitoring environment variables in Vercel
- Ensure Redis is configured for metrics collection
- Verify Slack webhook URL is working

### 2. Cron Jobs
Vercel cron jobs are configured in `vercel.json`:
- Health monitoring: Every 10 minutes
- Daily reports: Daily at 8:05 AM UTC

### 3. Security
- `OPS_DASH_TOKEN` protects the dashboard
- All endpoints have proper error handling
- No sensitive data exposed in logs

## Troubleshooting

### Common Issues

**Slack alerts not working:**
- Check `SLACK_WEBHOOK_URL` is correct
- Verify webhook is active in Slack
- Check console logs for errors

**Redis metrics not updating:**
- Verify `REDIS_URL` is configured
- Check Redis connection in logs
- System works without Redis (graceful degradation)

**Dashboard access denied:**
- Verify `OPS_DASH_TOKEN` matches environment variable
- Check token is properly URL-encoded

**Daily reports not sending:**
- Check Vercel cron job status
- Verify email configuration
- Check console logs for errors

### Logs to Monitor
- Redis connection errors
- Slack webhook failures
- Email sending failures
- Database query errors

## Cost Optimization

### Thresholds
- **Database:** 1GB warning (adjust based on Neon limits)
- **RPC calls:** 75K daily (adjust based on provider limits)
- **Emails:** 500 daily (adjust based on provider limits)

### Monitoring
- Daily reports show usage vs thresholds
- Slack alerts when limits exceeded
- Historical tracking via Redis counters

## Integration with Existing Systems

### Preserved Functionality
- User digest emails continue to work
- Slack user notifications preserved
- All existing alert subscriptions maintained

### Enhanced Features
- Ops monitoring added alongside user features
- Combined daily reports (user + ops)
- Better error handling and logging

## Future Enhancements

### Potential Improvements
- Historical metrics storage
- Cost prediction algorithms
- Automated scaling recommendations
- Integration with billing systems

### Monitoring Expansion
- Response time tracking
- Error rate monitoring
- User activity metrics
- Performance analytics

## Support

For ops monitoring issues:
1. Check the runbooks in `docs/runbooks.md`
2. Review console logs for errors
3. Test endpoints manually
4. Verify environment variables
5. Check Vercel cron job status
