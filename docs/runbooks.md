# Runbooks

## RPC degraded
- Check /api/healthz → chains map.
- If one chain failing, confirm fallback banned first endpoint (logs).
- If all failing, swap first RPC in env to a healthy URL and redeploy.

## Webhook failing
- Check provider dashboard for retries.
- Inspect server logs (filter by `stripe.webhook` or `coinbase.webhook`).
- Replay event with provider CLI / "Send test" and confirm 200.
- If replay guard blocked: verify event.id changed between attempts.

## DB hot / too large
- Check /ops → topTables. Investigate biggest tables.
- Run `VACUUM (ANALYZE)` if bloat suspected.
- Ensure TTL/cleanup jobs run; drop obsolete data if needed.

## Email delivery
- Verify provider status page.
- Check DKIM/DMARC.
- Fall back to Slack alerts temporarily.
