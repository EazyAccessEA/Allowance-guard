# Cron Jobs Setup - cron-jobs.org

This document outlines the external cron job configuration using cron-jobs.org for Allowance Guard.

## Overview

Since we're using Vercel's Hobby plan which has limitations on cron jobs, we use external cron job service cron-jobs.org to trigger our scheduled tasks.

## Required Cron Jobs

### 1. Daily Alerts Digest
- **URL**: `https://www.allowanceguard.com/api/alerts/daily`
- **Method**: `GET` or `POST`
- **Schedule**: `5 8 * * *` (Daily at 8:05 AM UTC)
- **Purpose**: Send daily email and Slack digests to subscribed users + ops monitoring
- **Response**: JSON with sent counts and status

### 2. Health Monitoring
- **URL**: `https://www.allowanceguard.com/api/alerts/health`
- **Method**: `GET`
- **Schedule**: `*/10 * * * *` (Every 10 minutes)
- **Purpose**: Monitor system health and send alerts if degraded
- **Response**: JSON with health status

### 3. Job Processing
- **URL**: `https://www.allowanceguard.com/api/jobs/process`
- **Method**: `GET` or `POST`
- **Schedule**: `*/5 * * * *` (Every 5 minutes)
- **Purpose**: Process queued wallet scan jobs
- **Response**: JSON with processed job counts

## cron-jobs.org Configuration

### Setup Steps

1. **Create Account**: Sign up at [cron-jobs.org](https://cron-jobs.org)
2. **Add New Cron Job**: Click "Add New Cron Job"
3. **Configure Each Job**:

#### Daily Alerts Job
```
Title: Allowance Guard Daily Alerts
URL: https://www.allowanceguard.com/api/alerts/daily
Method: GET
Schedule: 5 8 * * *
Timeout: 300 seconds
```

#### Health Monitoring Job
```
Title: Allowance Guard Health Monitoring
URL: https://www.allowanceguard.com/api/alerts/health
Method: GET
Schedule: */10 * * * *
Timeout: 60 seconds
```

#### Job Processing Job
```
Title: Allowance Guard Job Processing
URL: https://www.allowanceguard.com/api/jobs/process
Method: GET
Schedule: */5 * * * *
Timeout: 300 seconds
```

### Advanced Settings

- **Timeout**: Set to 300 seconds (5 minutes) for daily alerts and job processing, 60 seconds for health monitoring
- **Retry**: Enable retry on failure (3 attempts)
- **Notifications**: Configure email notifications for failures
- **Logging**: Enable detailed logging for monitoring

## API Endpoints

### Daily Alerts Endpoint
```typescript
// GET/POST /api/alerts/daily
{
  "ok": true,
  "message": "Sent 15 email digests and 3 Slack digests",
  "email": {
    "sent": 15,
    "failed": 0
  },
  "slack": {
    "sent": 3,
    "failed": 0
  },
  "ops": {
    "db_gb": "0.45",
    "rpc_total": 1250,
    "emails_sent": 15,
    "scans": 8
  }
}
```

### Health Monitoring Endpoint
```typescript
// GET /api/alerts/health
{
  "ok": true,
  "health": {
    "ok": true,
    "checks": {
      "db": "ok",
      "cache": "ok",
      "rpc": "ok:18500000",
      "chains": {
        "1": "ok:18500000",
        "42161": "ok:18500000",
        "8453": "ok:18500000"
      }
    }
  },
  "timestamp": "2024-12-19T08:00:00.000Z"
}
```

### Job Processing Endpoint
```typescript
// GET/POST /api/jobs/process
{
  "ok": true,
  "claimed": 2,
  "processed": 2
}
```

## Monitoring

### Health Checks
- Monitor cron job execution logs in cron-jobs.org dashboard
- Check API endpoint responses for success/failure
- Set up email notifications for job failures

### Logging
- All cron job executions are logged in the application
- Use Vercel function logs to monitor performance
- Set up alerts for repeated failures

## Troubleshooting

### Common Issues

1. **Timeout Errors**
   - Increase timeout in cron-jobs.org settings
   - Optimize API endpoint performance
   - Check database connection issues

2. **Authentication Errors**
   - Ensure URLs are publicly accessible
   - Check CORS headers configuration
   - Verify API endpoint security

3. **Job Processing Failures**
   - Monitor database connectivity
   - Check RPC endpoint availability
   - Review job queue status

### Debugging Steps

1. **Test Endpoints Manually**
   ```bash
   curl -X GET https://www.allowanceguard.com/api/alerts/daily
   curl -X GET https://www.allowanceguard.com/api/jobs/process
   ```

2. **Check Vercel Logs**
   ```bash
   vercel logs --follow
   ```

3. **Monitor Database**
   - Check job queue status
   - Verify alert subscriptions
   - Monitor email delivery

## Security Considerations

- **Rate Limiting**: API endpoints have built-in rate limiting
- **Authentication**: No authentication required for cron endpoints (internal use)
- **CORS**: Configured to allow external cron service access
- **Logging**: All requests are logged for security monitoring

## Cost Optimization

- **Free Tier**: cron-jobs.org offers free tier with limited executions
- **Paid Plans**: Consider upgrade for higher frequency jobs
- **Alternative**: Can switch to other cron services if needed

## Backup Plan

If cron-jobs.org becomes unavailable:
1. **Manual Triggers**: Can manually trigger endpoints
2. **Alternative Services**: Easy to switch to other cron services
3. **Vercel Pro**: Upgrade to Vercel Pro for built-in cron jobs

## Environment Variables

Ensure these are set in production:
```bash
# Database
DATABASE_URL=postgresql://...

# SMTP
SMTP_HOST=smtp.office365.com
SMTP_USER=no_reply@allowanceguard.com
SMTP_PASS=your_app_password

# Slack (optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
```

## Support

For issues with cron job setup:
- Check cron-jobs.org documentation
- Review Vercel function logs
- Contact support with specific error messages
