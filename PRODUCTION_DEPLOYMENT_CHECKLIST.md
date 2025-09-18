# Production Deployment Checklist - v1.9.0 Wallet-First Security

## 🚀 Launch Readiness & Production Deploy

This checklist ensures all systems are ready for production deployment of Allowance Guard v1.9.0 with simplified wallet-first authentication.

### 🎯 New Features in v1.9.0
- **Wallet-Only Authentication**: Connect wallet → Immediate access to everything
- **Wallet Security Dashboard**: Real-time risk assessment and security monitoring
- **Simplified User Flow**: No more confusing magic link authentication
- **Integrated Security**: Security dashboard accessible immediately after wallet connection
- **DeFi-Native Experience**: Intuitive flow for crypto users

---

## 1. Production Environment Variables

### ✅ Environment Setup

- [ ] Create `.env.production` locally (never commit)
- [ ] Configure all required environment variables
- [ ] Push environment variables to Vercel

### Required Environment Variables

```bash
# ——— App ———
NEXT_PUBLIC_APP_URL=https://www.allowanceguard.com
NODE_ENV=production

# ——— Database (Neon) ———
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require

# ——— Redis (optional but recommended) ———
REDIS_URL=redis://default:<password>@<host>:<port>

# ——— Email (choose ONE: Postmark OR Amazon SES) ———
# Postmark (recommended for ease)
POSTMARK_SERVER_TOKEN=<pm-server-token>
MAIL_FROM=Allowance Guard <support@allowanceguard.com>

# OR Amazon SES (if you prefer AWS)
# SES_ACCESS_KEY_ID=<aws_access_key_id>
# SES_SECRET_ACCESS_KEY=<aws_secret_access_key>
# SES_REGION=eu-west-1
# MAIL_FROM=Allowance Guard <support@allowanceguard.com>

# ——— Stripe (cards donations) ———
STRIPE_SECRET_KEY=sk_live_***
STRIPE_WEBHOOK_SECRET=whsec_***
DONATION_SUCCESS_URL=/success?provider=stripe&session_id={CHECKOUT_SESSION_ID}
DONATION_CANCEL_URL=/cancel?provider=stripe

# ——— Coinbase Commerce (crypto donations) ———
COINBASE_COMMERCE_API_KEY=***
COINBASE_COMMERCE_WEBHOOK_SECRET=***
COINBASE_COMMERCE_CURRENCY=USD
COINBASE_COMMERCE_ALLOWED_COINS=BTC,ETH,USDC
COINBASE_COMMERCE_ENV=prod
COINBASE_COMMERCE_SUCCESS_URL=/success?provider=coinbase&charge_id={CHARGE_ID}
COINBASE_COMMERCE_CANCEL_URL=/cancel?provider=coinbase
COINBASE_COMMERCE_CHARGES_ENDPOINT=/api/crypto/coinbase/charge
COINBASE_COMMERCE_WEBHOOK_ENDPOINT=/api/crypto/coinbase/webhook

# ——— RPCs & Chains ———
ETHEREUM_RPC_URLS=https://eth.llamarpc.com,https://rpc.ankr.com/eth,https://cloudflare-eth.com
ARBITRUM_RPC_URLS=https://arb1.arbitrum.io/rpc,https://rpc.ankr.com/arbitrum
BASE_RPC_URLS=https://mainnet.base.org,https://rpc.ankr.com/base
DISABLED_CHAINS=

# ——— Security ———
# No additional security environment variables needed for wallet-only auth

# ——— Error Monitoring (Rollbar) ———
ROLLBAR_ACCESS_TOKEN=<server_access_token>
NEXT_PUBLIC_ROLLBAR_ACCESS_TOKEN=<client_access_token>
```

### Vercel Environment Variables

```bash
# Add each variable to Vercel production environment
vercel env add NEXT_PUBLIC_APP_URL production
vercel env add DATABASE_URL production
vercel env add REDIS_URL production
vercel env add POSTMARK_SERVER_TOKEN production
vercel env add MAIL_FROM production
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
vercel env add COINBASE_COMMERCE_API_KEY production
vercel env add COINBASE_COMMERCE_WEBHOOK_SECRET production
vercel env add ETHEREUM_RPC_URLS production
vercel env add ARBITRUM_RPC_URLS production
vercel env add BASE_RPC_URLS production
# vercel env add BETTER_AUTH_SECRET production  # Not needed for wallet-only auth
vercel env add ROLLBAR_ACCESS_TOKEN production
vercel env add NEXT_PUBLIC_ROLLBAR_ACCESS_TOKEN production
```

---

## 2. Database Migration & Cleanup

### ✅ Database Migration for Simplified Auth
- [ ] Run database migration: `npm run migrate`
- [ ] Verify authentication tables are removed:
  - `trusted_devices` table removed
  - `security_events` table removed
  - `login_attempts` table removed
  - Authentication columns removed from `users` and `sessions` tables
- [ ] Confirm all existing data is preserved
- [ ] Test wallet security features in staging environment

### ✅ Wallet Security Features Verification
- [ ] Wallet connection working properly
- [ ] Security dashboard displaying correctly
- [ ] Risk assessment calculations working
- [ ] Security metrics updating in real-time
- [ ] Tab navigation between Allowances and Security working

---

## 3. Vercel Configuration

### ✅ vercel.json Setup

- [ ] Regions configured: `["lhr1"]` (single region for Hobby plan)
- [ ] Function memory: 1024MB
- [ ] Function timeout: 60 seconds
- [ ] CORS headers configured for cron endpoints

### ✅ Cron Jobs Setup (cron-jobs.org)

- [ ] `/api/jobs/process` - Every 5 minutes (`*/5 * * * *`)
- [ ] `/api/monitor/run` - Every 30 minutes (`*/30 * * * *`)
- [ ] `/api/alerts/daily` - Daily at 8:05 AM (`5 8 * * *`)
- [ ] All cron jobs configured in cron-jobs.org dashboard
- [ ] Test webhooks sent and verified

---

## 4. Email Deliverability

### ✅ Postmark Setup (Recommended)

- [ ] Domain verified in Postmark
- [ ] SPF record added: `v=spf1 include:spf.mtasv.net ~all`
- [ ] DKIM records added (2 CNAMEs from Postmark)
- [ ] Return-Path CNAME added
- [ ] Test email sent and received

### ✅ Amazon SES Setup (Alternative)

- [ ] Domain verified in SES console
- [ ] DKIM CNAMEs added (3 records)
- [ ] SPF record updated: `v=spf1 include:amazonses.com ~all`
- [ ] Out of sandbox mode (if needed)
- [ ] Test email sent and received

### ✅ DMARC Setup (Recommended)

- [ ] DMARC record added: `_dmarc.allowanceguard.com`
- [ ] Policy: `v=DMARC1; p=quarantine; rua=mailto:dmarc@allowanceguard.com; ruf=mailto:dmarc@allowanceguard.com; fo=1; adkim=s; aspf=s`

---

## 5. Webhook Configuration

### ✅ Stripe Webhooks

- [ ] Webhook endpoint added: `https://www.allowanceguard.com/api/stripe/webhook`
- [ ] Event subscribed: `checkout.session.completed`
- [ ] Webhook secret copied to `STRIPE_WEBHOOK_SECRET`
- [ ] Test webhook sent and verified

```bash
# Test Stripe webhook
stripe login
stripe trigger checkout.session.completed \
  --webhook-endpoint https://www.allowanceguard.com/api/stripe/webhook
```

### ✅ Coinbase Commerce Webhooks

- [ ] Webhook URL set: `https://www.allowanceguard.com/api/crypto/coinbase/webhook`
- [ ] Shared secret copied to `COINBASE_COMMERCE_WEBHOOK_SECRET`
- [ ] Test webhook sent via dashboard
- [ ] 200 OK response verified

---

## 6. Database & Backups

### ✅ Neon Database

- [ ] Production database created
- [ ] PITR enabled (7-30 days retention)
- [ ] Connection string configured
- [ ] Migrations run successfully

### ✅ Backup Strategy

- [ ] PITR enabled and tested
- [ ] Recovery drill completed
- [ ] Backup documentation created
- [ ] Monitoring alerts configured

---

## 7. Deployment

### ✅ Vercel Deployment

```bash
# Deploy to production
vercel --prod
```

- [ ] Build successful
- [ ] All environment variables loaded
- [ ] Application accessible at production URL
- [ ] Performance metrics within acceptable range

---

## 8. Smoke Testing

### ✅ Automated Smoke Test

```bash
# Run production smoke test
./scripts/smoke-test-prod.sh
```

- [ ] Health check passes
- [ ] Scan queue works
- [ ] Job processing works
- [ ] Allowances API responds
- [ ] CSV export works
- [ ] PDF export works
- [ ] Email sending works
- [ ] Cron endpoints respond

### ✅ Manual Verification

- [ ] Real wallet connection works
- [ ] On-chain revoke functionality works
- [ ] Email delivery confirmed
- [ ] Webhook signatures verified
- [ ] Replay protection confirmed

---

## 9. Final Checks (Definition of Done)

### ✅ Green Deploy
- [ ] Vercel build succeeded
- [ ] App loads fast in production
- [ ] No critical errors in logs

### ✅ Cron Routes Live (via cron-jobs.org)
- [ ] `/api/jobs/process` runs every 5 minutes
- [ ] `/api/monitor/run` runs every 30 minutes
- [ ] `/api/alerts/daily` runs at 08:05 Europe/London
- [ ] `/api/alerts/health` runs every 60 minutes

### ✅ Region Configuration
- [ ] `lhr1/dub1/cdg1` selected in vercel.json
- [ ] Close to Neon eu-west region

### ✅ Email Deliverability
- [ ] SPF, DKIM, DMARC valid
- [ ] Test email lands in inbox
- [ ] No spam folder issues

### ✅ Webhooks
- [ ] Stripe & Coinbase point to prod URLs
- [ ] Signatures verified
- [ ] Replay guard confirmed (second send returns replay=true)

### ✅ Backups
- [ ] PITR enabled
- [ ] Recovery drill completed and documented
- [ ] Monitoring in place

### ✅ Smoke Tests
- [ ] Scan → process → list → CSV/PDF workflow
- [ ] Donations webhook confirms contributions row
- [ ] All critical paths verified

---

## 10. Post-Deployment Monitoring

### ✅ Monitoring Setup

- [ ] Vercel analytics enabled
- [ ] Error tracking configured (Sentry)
- [ ] Database monitoring active
- [ ] Email delivery monitoring
- [ ] Webhook success rate monitoring

### ✅ Alerting

- [ ] Critical error alerts
- [ ] Database connection alerts
- [ ] Email delivery failure alerts
- [ ] Webhook failure alerts
- [ ] Performance degradation alerts
- [ ] Ops monitoring alerts (Slack + email)
- [ ] Cost threshold warnings
- [ ] Health degradation alerts

---

## 11. Ops Monitoring Setup

### ✅ Ops Environment Variables

- [ ] `SLACK_WEBHOOK_URL` configured with working webhook
- [ ] `OPS_ALERT_EMAIL` set to ops team email
- [ ] `OPS_DASH_TOKEN` set to secure random token
- [ ] `OPS_DB_WARN_GB=1.0` (adjust based on Neon limits)
- [ ] `OPS_RPC_WARN_DAY=75000` (adjust based on RPC provider limits)
- [ ] `OPS_EMAIL_WARN_DAY=500` (adjust based on email provider limits)

### ✅ Ops Monitoring Testing

- [ ] Health check endpoint responds correctly
- [ ] Daily alert endpoint works (combines user digests + ops)
- [ ] Ops metrics endpoint requires token authentication
- [ ] Slack webhook receives test messages
- [ ] Email alerts work as fallback
- [ ] Ops dashboard accessible with correct token

### ✅ Cost Monitoring

- [ ] Database size tracking active
- [ ] RPC usage counters working
- [ ] Email volume tracking active
- [ ] Scan activity monitoring working
- [ ] Threshold warnings configured
- [ ] Daily reports include cost metrics

---

## 12. Documentation

### ✅ Documentation Updated

- [ ] README.md updated with production info
- [ ] API documentation current
- [ ] Deployment guide complete
- [ ] Backup procedures documented
- [ ] Troubleshooting guide available

---

## 🎉 Launch Complete!

Once all items are checked, Allowance Guard is ready for production use.

### Quick Links

- **Production URL**: https://www.allowanceguard.com
- **Health Check**: https://www.allowanceguard.com/api/healthz
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Neon Dashboard**: https://console.neon.tech
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Coinbase Commerce**: https://commerce.coinbase.com

### Support Contacts

- **Technical Issues**: Development team
- **Infrastructure**: DevOps team
- **Business**: Product team

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Version**: 1.0.0
**Next Review**: _______________
