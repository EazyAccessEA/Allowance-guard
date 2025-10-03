# Developer Guide - Allowance Guard

This comprehensive developer guide provides detailed technical information for contributors and maintainers of Allowance Guard.

## 🏗️ Architecture Deep Dive

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (Next.js)     │    │   (API Routes)  │    │   Services      │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • React 19      │    │ • Serverless    │    │ • PostgreSQL    │
│ • Wagmi v2      │    │ • Drizzle ORM   │    │ • Redis         │
│ • Reown AppKit  │    │ • Audit Logging │    │ • RPC Providers │
│ • Tailwind CSS  │    │ • Rate Limiting │    │ • Email Service │
│ • TypeScript    │    │ • Error Handling│    │ • Rollbar       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Database Schema

#### Core Tables
- **`allowances`**: Token approval data with risk scoring
- **`users`**: User accounts and preferences
- **`sessions`**: User session management
- **`jobs`**: Background job queue
- **`audit_logs`**: Comprehensive audit trail
- **`performance_metrics`**: Performance monitoring data

#### Key Relationships
```sql
-- Users can have multiple sessions
users (1) -> (many) sessions

-- Users can have multiple allowances
users (1) -> (many) allowances

-- Jobs process allowance scans
jobs (1) -> (many) allowances

-- Audit logs track all operations
audit_logs -> (references) users, sessions, allowances
```

### API Architecture

#### RESTful Endpoints
```
/api/
├── allowances/          # Allowance management
├── scan/               # Wallet scanning
├── export/             # Data export (CSV/PDF)
├── audit/              # Audit log management
├── analytics/          # Performance metrics
├── alerts/             # Email/Slack notifications
├── ops/                # Operations monitoring
└── healthz/            # Health checks
```

#### Authentication Flow
1. **Wallet Connection**: User connects wallet via Reown AppKit
2. **Session Creation**: Server creates session with wallet address
3. **Token Validation**: JWT token for API authentication
4. **Audit Logging**: All operations logged for security

## 🔧 Development Environment

### Local Development Setup

#### 1. Database Setup
```bash
# Using Docker (recommended)
docker run --name allowance-guard-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=allowance_guard \
  -p 5432:5432 \
  -d postgres:15

# Or use Neon (cloud PostgreSQL)
# Get connection string from https://neon.tech
```

#### 2. Redis Setup (Optional)
```bash
# Using Docker
docker run --name allowance-guard-redis \
  -p 6379:6379 \
  -d redis:7-alpine

# Or use Upstash (cloud Redis)
# Get connection string from https://upstash.com
```

#### 3. Environment Configuration
```bash
# Copy example environment
cp production.env.example .env.local

# Required for development
DATABASE_URL=postgresql://postgres:password@localhost:5432/allowance_guard
REDIS_URL=redis://localhost:6379
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Optional for development
ROLLBAR_ACCESS_TOKEN=your_token
NEXT_PUBLIC_ROLLBAR_ACCESS_TOKEN=your_token
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Development Commands

```bash
# Development server
pnpm dev

# Database operations
pnpm run migrate          # Run migrations
pnpm run migrate:reset    # Reset database
pnpm run db:seed          # Seed test data

# Testing
pnpm test                 # Unit tests
pnpm test:e2e            # E2E tests
pnpm test:ci             # CI test suite

# Code quality
pnpm lint                # ESLint
pnpm lint:fix            # Fix linting issues
pnpm type-check          # TypeScript check

# Production
pnpm build               # Production build
pnpm start               # Production server
```

## 🧪 Testing Strategy

### Test Pyramid

```
    ┌─────────────┐
    │   E2E Tests │  ← Critical user workflows
    │   (Playwright) │
    ├─────────────┤
    │Integration  │  ← API endpoints, database
    │   Tests     │
    ├─────────────┤
    │  Unit Tests │  ← Components, utilities
    │   (Jest)    │
    └─────────────┘
```

### Unit Testing

#### Component Testing
```typescript
// Example: Button component test
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

#### Utility Function Testing
```typescript
// Example: Address formatting test
import { formatAddress } from '@/lib/address-utils'

describe('formatAddress', () => {
  it('formats long addresses correctly', () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678'
    expect(formatAddress(address)).toBe('0x1234...5678')
  })

  it('handles short addresses', () => {
    const address = '0x1234'
    expect(formatAddress(address)).toBe('0x1234')
  })
})
```

### Integration Testing

#### API Route Testing
```typescript
// Example: API endpoint test
import { createMocks } from 'node-mocks-http'
import handler from '@/app/api/allowances/route'

describe('/api/allowances', () => {
  it('returns allowances for valid wallet', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { wallet: '0x1234...5678' }
    })

    await handler(req, res)
    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toHaveProperty('allowances')
  })
})
```

### E2E Testing

#### Critical User Workflows
```typescript
// Example: Wallet connection and scanning
import { test, expect } from '@playwright/test'

test('wallet connection and scanning flow', async ({ page }) => {
  // Navigate to homepage
  await page.goto('/')
  
  // Connect wallet (mocked in test environment)
  await page.click('[data-testid="connect-wallet"]')
  await page.click('[data-testid="wallet-option-metaMask"]')
  
  // Enter wallet address
  await page.fill('[data-testid="wallet-address"]', '0x1234...5678')
  await page.click('[data-testid="scan-button"]')
  
  // Verify results
  await expect(page.locator('[data-testid="allowances-list"]')).toBeVisible()
  await expect(page.locator('[data-testid="allowance-item"]')).toHaveCount.greaterThan(0)
})
```

### Test Data Management

#### Database Seeding
```typescript
// scripts/seed-test-data.ts
export async function seedTestData() {
  const testWallet = '0x1234567890abcdef1234567890abcdef12345678'
  
  // Insert test allowances
  await db.insert(allowances).values([
    {
      wallet_address: testWallet,
      chain_id: 1,
      token_address: '0xA0b86a33E6441b8c4C8C0C8C0C8C0C8C0C8C0C8C',
      spender_address: '0xB1c97a44F7552b9d5D9D1D9D1D9D1D9D1D9D1D9D',
      amount: '1000000000000000000',
      is_unlimited: false,
      risk_score: 5
    }
  ])
}
```

## 🔒 Security Implementation

### Input Validation

#### Zod Schemas
```typescript
// lib/validations.ts
import { z } from 'zod'

export const walletAddressSchema = z.string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address format')

export const scanRequestSchema = z.object({
  wallet: walletAddressSchema,
  chains: z.array(z.number()).optional(),
  includeMetadata: z.boolean().optional()
})

export type ScanRequest = z.infer<typeof scanRequestSchema>
```

#### API Route Validation
```typescript
// app/api/scan/route.ts
import { scanRequestSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = scanRequestSchema.parse(body)
    
    // Process validated data
    const result = await scanWallet(validatedData.wallet, validatedData.chains)
    
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    throw error
  }
}
```

### Rate Limiting

#### Implementation
```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
})

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
})

// Usage in API routes
export async function POST(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1'
  const { success } = await ratelimit.limit(ip)
  
  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    )
  }
  
  // Process request
}
```

### Audit Logging

#### Audit Event Types
```typescript
// lib/audit-enhanced.ts
export interface AuditEvent {
  action: string
  actorType: 'user' | 'system' | 'admin'
  actorId: string | null
  subject: string | null
  category: 'security' | 'data_access' | 'data_modification' | 'system' | 'compliance'
  severity: 'low' | 'medium' | 'high' | 'critical'
  meta: Record<string, unknown>
}

// Usage
await auditEvent({
  action: 'wallet.scan',
  actorType: 'user',
  actorId: walletAddress,
  subject: 'allowances',
  category: 'data_access',
  severity: 'medium',
  meta: { chainIds: [1, 42161], allowanceCount: 15 }
})
```

## 📊 Performance Optimization

### Core Web Vitals

#### Performance Targets
- **LCP (Largest Contentful Paint)**: ≤ 1.8s
- **INP (Interaction to Next Paint)**: ≤ 200ms
- **CLS (Cumulative Layout Shift)**: ≤ 0.1
- **FID (First Input Delay)**: ≤ 100ms

#### Implementation
```typescript
// lib/performance.ts
export function reportWebVitals(metric: any) {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics
    fetch('/api/analytics/performance', {
      method: 'POST',
      body: JSON.stringify(metric)
    })
  }
}

// Component optimization
const ExpensiveComponent = React.memo(({ data }: { data: any }) => {
  const memoizedData = useMemo(() => {
    return processData(data)
  }, [data])
  
  return <div>{memoizedData}</div>
})
```

### Database Optimization

#### Query Optimization
```typescript
// Optimized allowance query
export async function getAllowances(walletAddress: string, options: QueryOptions) {
  const query = db
    .select()
    .from(allowances)
    .where(
      and(
        eq(allowances.wallet_address, walletAddress),
        options.chainId ? eq(allowances.chain_id, options.chainId) : undefined,
        options.riskyOnly ? gt(allowances.risk_score, 0) : undefined
      )
    )
    .orderBy(desc(allowances.risk_score), desc(allowances.amount))
    .limit(options.limit || 50)
    .offset(options.offset || 0)
  
  return query
}
```

#### Indexing Strategy
```sql
-- Performance indexes
CREATE INDEX idx_allowances_wallet_chain ON allowances(wallet_address, chain_id);
CREATE INDEX idx_allowances_risk ON allowances(wallet_address, risk_score DESC);
CREATE INDEX idx_allowances_risk_flags_gin ON allowances USING GIN (risk_flags);
```

## 🚀 Deployment & DevOps

### Vercel Configuration

#### vercel.json
```json
{
  "regions": ["lhr1"],
  "functions": {
    "app/**/route.ts": { "maxDuration": 60 }
  },
  "headers": [
    {
      "source": "/api/alerts/daily",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

#### Environment Variables
```bash
# Production environment variables
NEXT_PUBLIC_APP_URL=https://www.allowanceguard.com
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
ROLLBAR_ACCESS_TOKEN=...
NEXT_PUBLIC_ROLLBAR_ACCESS_TOKEN=...
SLACK_WEBHOOK_URL=...
OPS_ALERT_EMAIL=...
```

### Monitoring & Alerting

#### Health Checks
```typescript
// app/api/healthz/route.ts
export async function GET() {
  const checks = {
    db: await checkDatabase(),
    cache: await checkRedis(),
    rpc: await checkRpcEndpoints(),
    chains: await checkChainHealth()
  }
  
  const healthy = Object.values(checks).every(check => check.status === 'ok')
  
  return NextResponse.json({
    ok: healthy,
    checks,
    timestamp: new Date().toISOString()
  })
}
```

#### Error Monitoring
```typescript
// lib/rollbar-config.ts
export const rollbarConfig = {
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
  environment: process.env.NODE_ENV,
  captureUncaught: true,
  captureUnhandledRejections: true,
  filter: {
    filter: () => {
      // Don't send errors in development
      if (process.env.NODE_ENV === 'development' && !process.env.ROLLBAR_DEBUG) {
        return false
      }
      return true
    }
  }
}
```

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check database connection
pnpm run db:check

# Reset database
pnpm run migrate:reset
pnpm run migrate
```

#### Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Type check
pnpm type-check
```

#### E2E Test Issues
```bash
# Install Playwright browsers
pnpm exec playwright install

# Run tests in headed mode
pnpm test:e2e --headed

# Debug specific test
pnpm test:e2e --debug tests/scan.spec.ts
```

### Debug Mode

#### Development Debugging
```bash
# Enable debug logging
DEBUG=allowance-guard:* pnpm dev

# Enable Rollbar in development
ROLLBAR_DEBUG=true pnpm dev
```

#### Production Debugging
```bash
# Check Vercel logs
vercel logs --follow

# Check specific deployment
vercel logs [deployment-url]
```

## 📚 Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Tools
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Neon Console](https://console.neon.tech)
- [Rollbar Dashboard](https://rollbar.com/dashboard)
- [Upstash Console](https://console.upstash.com)

### Community
- [GitHub Discussions](https://github.com/EazyAccessEA/Allowance-guard/discussions)
- [Twitter](https://twitter.com/allowanceguard)

---

*This developer guide is maintained by the Allowance Guard team. For questions or suggestions, please open an issue on GitHub.*
