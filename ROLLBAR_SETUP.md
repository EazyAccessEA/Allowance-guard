# Rollbar Setup Guide

This project uses the official Rollbar SDK for error monitoring and reporting.

## Installation

The Rollbar SDKs are already installed:
- `@rollbar/react` - For React components and client-side error tracking
- `rollbar` - For server-side error tracking in API routes

## Configuration

### 1. Get Your Access Tokens

1. Sign up at [rollbar.com](https://rollbar.com) (free account)
2. Create a new project
3. Go to [Settings > Access Tokens](https://rollbar.com/settings/access_tokens/)
4. Create two tokens:
   - **Server Token** - for API routes and server-side code
   - **Client Token** - for React components and browser

### 2. Set Environment Variables

Add these to your `.env.local` file:

```bash
# Server-side access token (for API routes and server-side code)
ROLLBAR_ACCESS_TOKEN=your_server_access_token_here

# Client-side access token (for React components and browser)
NEXT_PUBLIC_ROLLBAR_ACCESS_TOKEN=your_client_access_token_here

# Optional: Enable Rollbar in development (default: false)
# ROLLBAR_DEBUG=true
```

### 3. Replace Placeholder Tokens

The configuration files contain placeholder tokens that need to be replaced:

- In `src/lib/rollbar-config.ts`:
  - Replace `YOUR_SERVER_ACCESS_TOKEN_HERE` with your server token
  - Replace `YOUR_CLIENT_ACCESS_TOKEN_HERE` with your client token

## Features

### Automatic Error Tracking
- **Uncaught exceptions** - Automatically captured
- **Unhandled promise rejections** - Automatically captured
- **React component errors** - Captured via ErrorBoundary
- **API route errors** - Captured in server-side code

### Manual Error Reporting
Use the helper functions in your code:

```typescript
import { reportError, reportWarning, reportInfo } from '@/lib/rollbar'

// Server-side (API routes)
reportError(new Error('Something went wrong'), { userId: 123 })
reportWarning('Deprecated API used', { endpoint: '/api/old' })
reportInfo('User action', { action: 'login' })

// Client-side (React components)
import { reportClientError, reportClientWarning, reportClientInfo } from '@/lib/rollbar'

reportClientError(new Error('Client error'), { component: 'MyComponent' })
```

### Development Mode
By default, Rollbar is disabled in development to avoid noise. To enable:

```bash
ROLLBAR_DEBUG=true
```

## Free Tier Limits

- **5,000 errors per month**
- **30 days of error history**
- **Unlimited projects**

## Documentation

- [Rollbar React Documentation](https://docs.rollbar.com/docs/react)
- [Rollbar Node.js Documentation](https://docs.rollbar.com/docs/nodejs)
- [Rollbar Dashboard](https://rollbar.com/dashboard)
