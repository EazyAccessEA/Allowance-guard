# Cron Jobs Setup - cron-jobs.org

> ⚠️ **SUPERSEDED — do not follow the schedules below verbatim.**
> Scheduling moved to **Vercel Cron** (`vercel.json`); the external cron-job.org
> scheduler was retired (see `projects/allowanceguard/decisions/0003-vercel-cron.md`).
> This file is kept for historical reference only.
>
> **If any external pinger is still in use, it MUST obey the Neon compute
> guardrails** (`docs/ops-monitoring.md` → "Neon Compute Guardrails"):
> - **Never poll a database-touching endpoint more often than every 15 minutes.**
>   The 1-minute `jobs/process` poll and 10-minute deep health ping this doc once
>   described are exactly what exhausted the Neon free-plan compute allowance in
>   July 2026.
> - `/api/jobs/process` is **not** externally polled any more — it runs on a
>   15-minute Vercel Cron fallback and is kicked on-demand when a scan is enqueued
>   (`src/lib/job-kick.ts`). Do not re-add a frequent external poll.
> - A frequent health pinger must target `/api/alerts/health?fast=1` (liveness
>   only, no database check). Deep checks (`/api/alerts/health` with no param)
>   run at most hourly.

## Overview

Historically, on Vercel's Hobby plan, an external cron service (cron-job.org)
triggered scheduled tasks. The project now runs on Vercel Cron; the sections
below are retained only to document the original setup.

## Required Cron Jobs

### 1. Daily Alerts Digest
- **URL**: `https://www.allowanceguard.com/api/alerts/daily`
- **Method**: `GET` or `POST`
- **Schedule**: `5 8 * * *` (Daily at 8:05 AM UTC)
- **Purpose**: Send daily email and Slack digests to subscribed users + ops monitoring
- **Response**: JSON with sent counts and status

### 2. Health Monitoring
- **URL**: `https://www.allowanceguard.com/api/alerts/health?fast=1` (liveness only — the `?fast=1` is mandatory for any sub-hourly poll; without it each ping runs `SELECT 1` against Neon)
- **Method**: `GET`
- **Schedule**: `*/10 * * * *` (Every 10 minutes) — deep checks (no `?fast=1`) hourly at most
- **Purpose**: Monitor app liveness and send alerts if degraded
- **Response**: JSON with health status

### 3. Job Processing
- **Now handled by Vercel Cron + on-demand kicks — do NOT add an external poll.**
- The `/api/jobs/process` route runs on a 15-minute Vercel Cron fallback
  (`vercel.json`) and is triggered on-demand whenever a scan is enqueued
  (`src/lib/job-kick.ts`). A frequent external poll would keep Neon compute
  awake around the clock; that is the regression this guardrail exists to prevent.

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
URL: https://www.allowanceguard.com/api/alerts/health?fast=1
Method: GET
Schedule: */10 * * * *
Timeout: 60 seconds
```
> `?fast=1` is required: it skips the Neon-waking database check. A sub-15-minute
> poll of the deep (no-param) endpoint will exhaust the compute allowance.

#### Job Processing Job
> **Removed.** `/api/jobs/process` is driven by Vercel Cron + on-demand kicks
> (see the note in "Required Cron Jobs" above). Do not configure an external
> poll for it.

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
