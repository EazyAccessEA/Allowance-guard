# Stack Detection Report - Allowance Guard

**Generated:** 2024-12-19  
**Audit Version:** Taskmaster v1.0

## Actual Stack Detected

### Core Framework & Runtime
- **Next.js:** 15.5.2 (App Router)
- **React:** 19.1.0
- **TypeScript:** 5.x
- **Node.js:** Runtime (API routes)

### Database & ORM
- **Database:** PostgreSQL (Neon serverless)
- **ORM:** Drizzle ORM 0.44.5
- **Connection:** @neondatabase/serverless 1.0.1
- **Migrations:** Custom migration system with SQL files

### Blockchain & Web3
- **Web3 Library:** Viem 2.37.4
- **Wallet Integration:** Wagmi 2.16.9 + @reown/appkit 1.8.2
- **Supported Chains:** Ethereum (1), Arbitrum (42161), Base (8453)
- **RPC Management:** Multi-endpoint with failover and rate limiting

### Authentication & Security
- **Auth:** WalletConnect-based (no traditional auth)
- **Rate Limiting:** @upstash/ratelimit 2.0.6
- **CSRF Protection:** Custom implementation
- **Security Headers:** Comprehensive CSP and security headers

### Payments & Donations
- **Stripe:** 18.5.0 (card payments)
- **Coinbase Commerce:** 1.0.4 (crypto donations)
- **Webhook Security:** Signature verification for both providers

### Monitoring & Observability
- **Error Tracking:** Rollbar 2.26.4
- **Performance:** Custom Lighthouse integration
- **Logging:** Custom logger with structured logging
- **Metrics:** Custom metrics collection

### Caching & Performance
- **Redis:** @upstash/redis 1.35.3 (optional)
- **Caching:** Custom cache implementation
- **Image Optimization:** Next.js built-in with WebP/AVIF
- **Bundle Optimization:** Webpack optimization with code splitting

### Email & Notifications
- **SMTP:** Nodemailer 7.0.6
- **Providers:** Postmark (primary) or Amazon SES
- **Email Templates:** Custom HTML templates

### Testing & Quality
- **E2E Testing:** Playwright 1.55.0
- **Unit Testing:** Jest 30.1.3
- **A11y Testing:** @axe-core/playwright 4.10.2
- **Type Checking:** TypeScript strict mode

### Deployment & Infrastructure
- **Platform:** Vercel (primary)
- **Environment:** Production-ready with comprehensive env vars
- **CI/CD:** GitHub Actions (inferred)
- **Domain:** allowanceguard.com

## Core Application Flows

### 1. Primary User Journey
1. **Connect Wallet** → WalletConnect integration
2. **Scan Wallet** → Queue blockchain scan job
3. **View Results** → Display allowances with risk scoring
4. **Revoke Approvals** → One-click or batch revocation
5. **Monitor** → Email alerts for new risky approvals

### 2. Risk Assessment Flow
1. **Data Collection** → Scan multiple chains for token approvals
2. **Risk Scoring** → Analyze unlimited approvals, known malicious contracts
3. **Enrichment** → Add token metadata, spender labels
4. **Alerting** → Email notifications for high-risk items

### 3. Payment Flow
1. **Donation Initiation** → Stripe or Coinbase Commerce
2. **Payment Processing** → Webhook verification
3. **Receipt Generation** → Email confirmation
4. **Admin Dashboard** → Donation tracking and reporting

## Architecture Patterns

### Data Flow
- **Client-Side:** React with Wagmi for wallet interaction
- **API Layer:** Next.js API routes with rate limiting
- **Job Queue:** Custom job system for blockchain scanning
- **Database:** PostgreSQL with connection pooling
- **Caching:** Redis-based caching for performance

### Security Model
- **Non-Custodial:** No private key access
- **Read-Only:** Blockchain data only
- **Rate Limited:** API protection
- **Webhook Security:** Signature verification
- **Input Validation:** Zod schemas throughout

### Performance Strategy
- **Static Generation:** ISR with 1-hour revalidation
- **Code Splitting:** Route and component-level splitting
- **Image Optimization:** Next.js built-in optimization
- **Caching:** Multi-layer caching strategy
- **Bundle Optimization:** Webpack optimization

## Key Dependencies Analysis

### Critical Dependencies
- **@neondatabase/serverless:** Database connectivity
- **viem:** Blockchain interaction
- **@reown/appkit:** Wallet connection
- **drizzle-orm:** Database operations
- **stripe:** Payment processing

### Security Dependencies
- **@upstash/ratelimit:** API protection
- **rollbar:** Error monitoring
- **zod:** Input validation

### Performance Dependencies
- **@upstash/redis:** Caching layer
- **next:** Framework optimization
- **playwright:** E2E testing

## Environment Configuration

### Required Environment Variables
- `DATABASE_URL`: PostgreSQL connection
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Wallet connection
- `STRIPE_SECRET_KEY`: Payment processing
- `POSTMARK_SERVER_TOKEN`: Email delivery

### Optional Environment Variables
- `REDIS_URL`: Caching (performance boost)
- `SLACK_WEBHOOK_URL`: Operations alerts
- `ROLLBAR_ACCESS_TOKEN`: Error monitoring

## Deployment Readiness

### Production Configuration
- ✅ Environment variables documented
- ✅ Security headers configured
- ✅ Rate limiting implemented
- ✅ Error monitoring setup
- ✅ Performance optimizations enabled

### Missing/Incomplete
- ⚠️ CI/CD pipeline not fully documented
- ⚠️ Backup and recovery procedures
- ⚠️ Monitoring dashboards setup
- ⚠️ Load testing results

## Risk Assessment

### High Risk Areas
1. **Database Dependencies:** Single point of failure
2. **RPC Endpoints:** External dependency on blockchain nodes
3. **Payment Processing:** Financial transaction handling
4. **Wallet Integration:** Security-critical user interaction

### Mitigation Strategies
1. **Database:** Connection pooling, backup strategy
2. **RPC:** Multiple endpoints, failover logic
3. **Payments:** Webhook verification, idempotency
4. **Wallet:** Non-custodial design, input validation

## Next Steps for Audit

1. **Security Review:** STRIDE threat modeling
2. **Performance Analysis:** Bundle size, Core Web Vitals
3. **Accessibility Audit:** WCAG 2.2 AA compliance
4. **UX Review:** Nielsen heuristics evaluation
5. **Testing Coverage:** Unit, integration, E2E gaps
6. **Documentation Review:** Developer experience
7. **Cost Analysis:** Infrastructure and operational costs
