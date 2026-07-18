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
- **Schedule:** Every 10 minutes via cron-job.org — **must use `?fast=1`** (see Neon compute guardrails below)
- **Alerts:** Slack + email when health degrades
- **Modes:** `?fast=1` checks app liveness only (no database/cache/RPC); without it, a deep check runs `SELECT 1` against Neon and sweeps all chain RPCs. Deep checks at most hourly.

#### `/api/alerts/daily`
- **Purpose:** Daily ops reports + user digests
- **Schedule:** Daily at 8:05 AM UTC via cron-job.org
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

**Vercel Cron** (`vercel.json`) — all frequent jobs fire in the same aligned minutes (:00/:15/:30/:45) so Neon wakes in one shared window per 15 minutes:
- `/api/jobs/process` — every 15 min (fallback only; scans are kicked on-demand at enqueue time via `lib/job-kick.ts`)
- `/api/monitor/cron` — every 15 min
- `/api/rules/evaluate` — every 15 min
- `/api/webhooks/process` — every 15 min (retries only; first delivery is inline)
- `/api/email/cron` — daily 10:00 UTC
- `/api/jobs/cleanup` — daily 03:00 UTC

**External pingers** (cron-job.org was retired in favour of Vercel Cron — see
`projects/allowanceguard/decisions/0003-vercel-cron.md`; anything still pointed
at these routes must obey the guardrails below):
- Health monitoring: Every 10 minutes → **must target `/api/alerts/health?fast=1`** (liveness only)
- Optional deep health check: hourly at :00 → `/api/alerts/health` (no param)
- Daily reports: Daily at 8:05 AM UTC → `/api/alerts/daily`

## Neon Compute Guardrails

**Incident (July 2026):** the Neon free-plan project ran out of its 100 CU-hour
monthly compute allowance mid-month (80% alert July 14, 100% July 17). Neon
bills for every minute the endpoint is awake and autosuspends after 5 idle
minutes. A 1-minute `jobs/process` cron plus a 10-minute deep health ping meant
the database never got 5 quiet minutes: awake 24/7 at the 0.25 CU minimum ≈
180 CU-hours/month — exhausting 100 CU-hours on day ~17. It was idle polling,
not user traffic.

**Rules — hold these invariants or the allowance burns again:**

1. **No schedule that touches the database may run more often than every
   15 minutes.** This includes Vercel crons, cron-job.org jobs, and uptime
   pingers hitting deep health checks.
2. **Align all frequent schedules to the same minutes** (:00/:15/:30/:45).
   Each wake-up costs ~5 awake minutes (the autosuspend timeout); staggered
   schedules multiply wake windows, aligned ones share them.
3. **Job processing is event-driven, not polled.** Routes that enqueue scans
   call `kickJobProcessor()` (`src/lib/job-kick.ts`); the 15-minute cron is
   only a safety net for lost kicks.
4. **Frequent health pings use `?fast=1`.** The deep check (`SELECT 1` +
   cache + 27 RPC probes) is for humans and at-most-hourly monitors.
5. **Client-side pollers must never hit a database-touching endpoint.** The
   in-app `RpcStatusBanner` (mounted in the root layout, so it runs in *every*
   visitor tab) polls `/api/healthz?checks=rpc` — RPC only, no `SELECT 1`. A
   single tab left open on the deep endpoint would keep Neon awake indefinitely.
6. **Know which endpoints wake Neon.** Database-touching (do not poll frequently
   or from clients): `/api/healthz` (deep, no param), `/api/readiness`
   (`SELECT 1`, no fast mode — human/probe use only), `/api/ops/metrics`, and
   every cron listed above. Non-waking: `/api/healthz?fast=1` and
   `/api/healthz?checks=rpc`.

**Budget math** (0.25 CU minimum compute, 5-minute autosuspend): one aligned
15-minute schedule ≈ 5.5 awake min per 15 ≈ 37% duty ≈ **~65–70 CU-hours/month**
worst case (varies with month length), before on-demand scan activity. Within the 100 CU-hour free
allowance, but with limited headroom — if usage grows, either upgrade to the
Launch plan or stretch fallback schedules to every 30 minutes (halves the
idle duty cycle; monitor freshness bound becomes 30 min).

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

**Upstash metrics not updating:**
- Verify `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set
- Check `[metrics]` warnings in logs for Upstash call failures
- System works without Upstash (graceful degradation — counters silently drop, cache falls back to the Postgres `cache` table)

**Dashboard access denied:**
- Verify `OPS_DASH_TOKEN` matches environment variable
- Check token is properly URL-encoded

**Daily reports not sending:**
- Check cron-job.org job status
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
5. Check cron-job.org job status
