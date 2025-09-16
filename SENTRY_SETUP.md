# Sentry Setup Guide

## Getting Your Sentry Auth Token

To fix the "No auth token provided" warnings, you need to:

### 1. Create a Sentry Account
- Go to [sentry.io](https://sentry.io) and create an account
- Create a new project for "Allowance Guard"

### 2. Generate Auth Token
- Go to Settings → Auth Tokens in your Sentry dashboard
- Click "Create New Token"
- Give it a name like "Allowance Guard Production"
- Select these scopes:
  - `project:releases`
  - `project:write`
  - `org:read`
- Copy the generated token

### 3. Add Environment Variables to Vercel
Add these to your Vercel environment variables:

```
SENTRY_DSN=your_sentry_dsn_here
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
SENTRY_ORG=your_sentry_org_slug
SENTRY_PROJECT=allowance-guard
SENTRY_AUTH_TOKEN=your_generated_auth_token
SENTRY_ENV=production
NEXT_PUBLIC_SENTRY_ENV=production
```

### 4. Optional: Disable Sentry Completely
If you don't want to use Sentry, you can disable it by:

1. Remove the `withSentryConfig` wrapper from `next.config.ts`
2. Delete the Sentry config files
3. Remove `@sentry/nextjs` from package.json

## Current Status
✅ Sentry CLI warnings fixed
✅ Telemetry disabled to reduce noise
✅ Proper instrumentation files created
⚠️ Auth token needed for source map uploads (optional)
