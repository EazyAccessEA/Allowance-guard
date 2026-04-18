# Testing Policy & Standards

## Overview

This document outlines the testing policies, standards, and procedures for the Allowance Guard project. All contributors must adhere to these standards to ensure code quality, reliability, and security.

## Testing Philosophy

We believe in testing early, testing often, and testing comprehensively. Our testing strategy is built on the principle that quality is not an afterthought but an integral part of the development process.

## Test Types & Coverage Requirements

### 1. End-to-End (E2E) Testing
- **Tool**: Playwright with @axe-core/playwright
- **Coverage**: All critical user workflows
- **Requirements**:
  - Wallet connection and scanning flows
  - Payment processing (Stripe & Coinbase)
  - Export functionality (CSV/PDF)
  - Accessibility compliance (WCAG 2.0 AA)
  - Email notification flows

### 2. Unit Testing
- **Tool**: Jest with React Testing Library
- **Coverage**: Individual components and utility functions
- **Requirements**:
  - Minimum 80% code coverage for new features
  - All utility functions must have unit tests
  - Component rendering and interaction tests

### 3. Integration Testing
- **Tool**: Supertest with MSW
- **Coverage**: API endpoints and service integrations
- **Requirements**:
  - All API routes must have integration tests
  - Database operation testing
  - External service mocking

### 4. Accessibility Testing
- **Tool**: @axe-core/playwright
- **Coverage**: All UI components
- **Requirements**:
  - WCAG 2.0 AA compliance
  - Screen reader compatibility
  - Keyboard navigation testing
  - Color contrast verification

## Testing Standards

### Code Quality Standards
- All tests must be deterministic and repeatable
- Tests should not depend on external services
- Use descriptive test names and clear assertions
- Mock external dependencies appropriately
- Tests must run in parallel when possible

### Security Testing Requirements
- Input validation testing for all endpoints
- Authentication and authorization testing
- Rate limiting verification
- SQL injection and XSS prevention testing
- Sensitive data must never be exposed in test outputs

### Performance Standards
- E2E tests must complete within 60 seconds
- Unit tests must complete within 10 seconds
- No memory leaks in test execution
- Performance regression testing for critical paths

## E2E Testing Framework

### Test Mode Features
Our E2E testing framework includes sophisticated mocking capabilities:

- **Environment Variables**:
  - `NEXT_PUBLIC_E2E=1`: Enables test mode UI elements
  - `E2E_FAKE_PAYMENTS=1`: Mocks payment processing
  - `E2E_FAKE_EMAIL=1`: Mocks email sending

- **Fake Payment Modes**:
  - Stripe fake sessions with test IDs
  - Coinbase fake charges with test URLs
  - No external API calls during testing

- **Fake Email Mode**:
  - Console logging instead of real emails
  - Fake success responses
  - No SMTP server required

- **Test Data Seeding**:
  - Controlled test wallet addresses
  - Sample allowance data
  - Database seeding endpoint (`/api/test/seed`)

### Running E2E Tests

```bash
# Set environment variables
export NEXT_PUBLIC_E2E=1
export E2E_FAKE_PAYMENTS=1
export E2E_FAKE_EMAIL=1

# Run all tests
pnpm test:e2e

# Run with UI
pnpm test:e2e:ui

# Run specific test file
pnpm playwright test tests/scan.spec.ts

# Using convenience script
./scripts/test-e2e.sh
```

## CI/CD Integration

### GitHub Actions Workflow
- E2E tests run on every pull request and push to main
- Tests run in Ubuntu environment with Node.js 18
- Browser dependencies installed automatically
- Test reports generated and stored as artifacts

### Deployment Gates
- All E2E tests must pass before deployment
- Accessibility tests are mandatory
- Build must complete successfully
- No critical security vulnerabilities allowed

### Test Reports
- HTML reports with screenshots and videos
- Accessibility violation reports
- Performance metrics
- Code coverage analysis

## File Organization

### Test File Naming
- E2E Tests: `tests/[feature].spec.ts` (e.g., `scan.spec.ts`)
- Unit Tests: `[component].test.tsx` or `[function].test.ts`
- Integration Tests: `[endpoint].integration.test.ts`

### Test Structure
```typescript
// E2E Test Structure
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test.beforeAll(async ({ request, baseURL }) => {
    // Setup test data
  })

  test('should perform expected behavior', async ({ page }) => {
    // Test implementation
  })
})
```

## Troubleshooting

### Common Issues
1. **Tests Fail to Start**: Check port availability and build success
2. **Database Connection Issues**: Verify DATABASE_URL environment variable
3. **Test Timeouts**: Increase timeout in playwright.config.ts
4. **Accessibility Violations**: Review and fix violations in components

### Debug Mode
```bash
# Run tests in debug mode
pnpm playwright test --debug

# Show test report
pnpm exec playwright show-report
```

## Quality Gates

### Pre-commit Requirements
- All tests must pass locally
- Code coverage must meet minimum requirements
- No linting errors
- No TypeScript errors

### Pull Request Requirements
- All CI tests must pass
- Code review approval required
- Security review for sensitive changes
- Documentation updates for new features

### Release Requirements
- Full test suite passes
- Performance benchmarks met
- Security audit completed
- Accessibility compliance verified

## Security Considerations

### Test Data Security
- Never use real wallet addresses in tests
- Use test-specific database schemas
- Mock all external API calls
- Sanitize all test outputs

### Environment Isolation
- Tests run in isolated environments
- No access to production data
- Separate test databases
- Mocked external services

## Monitoring & Reporting

### Test Metrics
- Test execution time tracking
- Flaky test identification
- Coverage trend analysis
- Performance regression detection

### Reporting
- Weekly test health reports
- Monthly coverage analysis
- Quarterly security test reviews
- Annual accessibility compliance audit

## Support & Resources

### Documentation
- [Testing Documentation](/docs/testing)
- [API Documentation](/docs/api)
- [Contributing Guidelines](/docs/contributing)

### Getting Help
- GitHub Issues for bug reports
- Discord community for discussions
- Email: legal.support@allowanceguard.com for urgent issues

## Policy Updates

This testing policy is reviewed quarterly and updated as needed. All contributors are responsible for staying current with policy changes.

**Last Updated**: September 2024
**Next Review**: December 2024

---

*This policy ensures that Allowance Guard maintains the highest standards of quality, security, and accessibility while providing a reliable testing framework for all contributors.*
