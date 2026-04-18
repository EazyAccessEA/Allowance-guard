# E2E Testing Setup - Day 23

This document describes the End-to-End (E2E) testing setup for Allowance Guard using Playwright.

## Overview

The E2E testing setup includes:
- **Playwright** for browser automation
- **@axe-core/playwright** for accessibility testing
- **Test mode switches** to avoid external dependencies
- **Fake payment/email modes** for isolated testing
- **GitHub Actions** for CI/CD integration

## Environment Variables

Add these to your environment for E2E testing:

```bash
# E2E toggle (never enable in production)
NEXT_PUBLIC_E2E=1
E2E_FAKE_PAYMENTS=1
E2E_FAKE_EMAIL=1
```

## Test Mode Features

### 1. Test Wallet Connection
- When `NEXT_PUBLIC_E2E=1`, a "Connect Test Wallet" button appears
- Uses a fixed test wallet address: `0x1111111111111111111111111111111111111111`
- No real wallet connection required

### 2. Fake Payments
- When `E2E_FAKE_PAYMENTS=1`:
  - Stripe endpoints return fake session IDs
  - Coinbase endpoints return fake hosted URLs
  - No real payment processing occurs

### 3. Fake Email
- When `E2E_FAKE_EMAIL=1`:
  - Email sending is mocked
  - Logs email details to console instead
  - No real emails are sent

## Test Structure

### Tests Directory
```
tests/
├── a11y.spec.ts      # Accessibility tests
├── scan.spec.ts      # Wallet scanning flow
├── export.spec.ts    # CSV/PDF export endpoints
└── donations.spec.ts # Payment flow tests
```

### Test Categories

1. **Accessibility Tests** (`a11y.spec.ts`)
   - WCAG 2.0 AA compliance
   - Basic accessibility smoke tests

2. **Scan Flow Tests** (`scan.spec.ts`)
   - Test wallet connection
   - Scan initiation and completion
   - Data display and filtering

3. **Export Tests** (`export.spec.ts`)
   - CSV export functionality
   - PDF export functionality
   - Response validation

4. **Donation Tests** (`donations.spec.ts`)
   - Stripe payment flow (fake mode)
   - Coinbase payment flow (fake mode)
   - Endpoint response validation

## Running Tests

### Local Development

1. **Set environment variables:**
   ```bash
   export NEXT_PUBLIC_E2E=1
   export E2E_FAKE_PAYMENTS=1
   export E2E_FAKE_EMAIL=1
   ```

2. **Run tests:**
   ```bash
   # Run all tests
   pnpm test:e2e
   
   # Run with UI
   pnpm test:e2e:ui
   
   # Run specific test file
   pnpm playwright test tests/scan.spec.ts
   ```

3. **Using the test script:**
   ```bash
   ./scripts/test-e2e.sh
   ```

### CI/CD (GitHub Actions)

Tests run automatically on:
- Pull requests
- Pushes to main branch

The workflow:
1. Sets up Node.js and pnpm
2. Installs dependencies
3. Installs Playwright browsers
4. Builds the application
5. Runs E2E tests

## Test Data

### Seed Endpoint
- **URL:** `/api/test/seed`
- **Method:** POST
- **Purpose:** Populates test data for E2E tests
- **Security:** Only works when `NEXT_PUBLIC_E2E=1`

### Test Wallet Data
The seed endpoint creates test allowances for wallet `0x1111111111111111111111111111111111111111`:
- Unlimited allowance (risky)
- Limited allowance (safe)
- Cross-chain allowances

## Configuration

### Playwright Config (`playwright.config.ts`)
- **Timeout:** 60 seconds
- **Retries:** 2 in CI, 0 locally
- **Browser:** Chromium only
- **Base URL:** `http://localhost:3000` (or `E2E_BASE_URL`)
- **Auto-start:** Builds and starts app if no `E2E_BASE_URL`

### Test Environment
- **Database:** Uses same DB as development (with test data)
- **Redis:** Optional (can be skipped in tests)
- **External APIs:** All mocked in test mode

## Best Practices

1. **Never enable E2E mode in production**
2. **Use fake modes for all external dependencies**
3. **Keep tests isolated and independent**
4. **Use data-testid attributes for reliable selectors**
5. **Test both happy path and error scenarios**

## Troubleshooting

### Common Issues

1. **Tests fail to start app:**
   - Check if port 3000 is available
   - Verify build succeeds: `pnpm build`

2. **Database connection issues:**
   - Ensure `DATABASE_URL` is set
   - Check database is accessible

3. **Test timeouts:**
   - Increase timeout in `playwright.config.ts`
   - Check for slow operations in tests

4. **Accessibility violations:**
   - Review violations in test output
   - Fix issues in components
   - Update tests if violations are acceptable

### Debug Mode

Run tests in debug mode:
```bash
pnpm playwright test --debug
```

This opens Playwright Inspector for step-by-step debugging.

## Security Notes

- E2E mode is **NEVER** enabled in production
- Test endpoints are protected by environment checks
- Fake payment/email modes prevent external API calls
- Test data is isolated and doesn't affect production

## Definition of Done

✅ **NEXT_PUBLIC_E2E test mode renders Test Connect button**  
✅ **Seed route populates a fixture wallet for tests**  
✅ **Playwright runs locally and in CI: a11y, scan list, exports, donations**  
✅ **No external dependencies needed during tests (wallet/RPC/email/payments mocked)**
