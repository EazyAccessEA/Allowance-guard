# Allowance Guard

**Web3 Wallet Security Platform** — Monitor, assess, and revoke token approvals across multiple blockchain networks.

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

**Website**: [allowanceguard.com](https://www.allowanceguard.com) | **Docs**: [allowanceguard.com/docs](https://www.allowanceguard.com/docs) | **API**: [allowanceguard.com/docs/api-reference](https://www.allowanceguard.com/docs/api-reference)

---

## What is Allowance Guard???

Every time you interact with a DeFi protocol, you grant it permission to move your tokens. These **token approvals** persist indefinitely — even after you stop using the protocol. If that contract is compromised, your tokens are at risk.

Allowance Guard scans your wallet, scores the risk of every active approval, and lets you revoke dangerous ones — individually or in batch.

### Core Features

- **Multi-Chain Scanning** — Ethereum, Arbitrum, Base, Polygon, Optimism, Avalanche
- **Intelligent Risk Assessment** — Risk scoring across 2M+ analysed allowances
- **Batch Revocation** — Revoke multiple approvals in one transaction with gas savings
- **Time Machine Simulation** — Preview the impact of revoking approvals before committing on-chain
- **Continuous Monitoring** — Email and Slack alerts when new risky approvals appear
- **Team Dashboards** — Multi-wallet monitoring for DAOs and treasury managers
- **Compliance Audit Logs** — Timestamped, exportable records for institutional users
- **Non-Custodial** — Read-only access. You sign every transaction. No private keys stored.

## Plans

| Feature | Free | Pro | Sentinel |
|---------|------|-----|----------|
| Wallets | 3 | Unlimited | 50 monitored |
| Chains | All 6 | All 6 | All 6 |
| Risk scanning | Basic | Full | Full + automated rules |
| Batch revoke | - | Included | Included |
| Monitoring alerts | - | Email + Slack | Email + Slack + Webhooks |
| Historical timeline | - | Included | Included |
| Export (CSV/PDF) | - | Included | Compliance-grade |
| Team dashboard | - | - | Included |
| Automated revocation rules | - | - | Included |
| Priority support | - | - | Included |
| **Price** | **Free** | **$9.99/mo** | **$49.99/mo** |

The core scanner is **free and open source**. Always.

### API Access 

Build wallet security into your product with the AllowanceGuard API.

| Tier | Calls/day | Price |
|------|-----------|-------|
| Free | 100 | $0 |
| Developer | 10,000 | $39/mo |
| Growth | 100,000 | $149/mo |
| Enterprise | Custom | Contact us |

See [API Documentation](https://www.allowanceguard.com/docs/api-reference) for endpoints, authentication, and code examples.

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL (Neon recommended for serverless)
- Redis (Upstash recommended)
- Stripe account (for billing)
- WalletConnect project ID

### Installation

```bash
# Clone the repository
git clone https://github.com/EazyAccessEA/Allowance-guard.git
cd Allowance-guard

# Install dependencies
pnpm install

# Configure environment
cp production.env.example .env.local
# Edit .env.local with your credentials

# Run database migrations
pnpm run migrate

# Start development server
pnpm dev
```

### Environment Variables

Copy `production.env.example` to `.env.local` and configure:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `REDIS_URL` | Yes | Redis connection (Upstash recommended) |
| `STRIPE_SECRET_KEY` | Yes | Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Yes | WalletConnect project ID |
| `NEXT_PUBLIC_APP_URL` | Yes | Your app URL |
| `POSTMARK_SERVER_TOKEN` | No | Email delivery (or use SMTP_* vars) |
| `COINBASE_COMMERCE_API_KEY` | No | Coinbase Commerce payments |
| `SLACK_WEBHOOK_URL` | No | Slack notifications |
| `ROLLBAR_ACCESS_TOKEN` | No | Error monitoring |

## Architecture

```
Next.js 15 (App Router)
├── React 19 + TypeScript
├── Tailwind CSS (Serum Teal design system)
├── Drizzle ORM → Neon PostgreSQL
├── Redis (Upstash) — caching & rate limiting
├── Stripe — subscriptions & billing
├── Wagmi + Viem — blockchain interaction
├── Reown AppKit — wallet connection
└── Vercel — deployment
```

### Key Directories

```
src/
├── app/api/          # API routes (35+ endpoints)
│   ├── v1/           # Public B2B API
│   ├── billing/      # Subscription management
│   ├── scan/         # Wallet scanning
│   └── ...
├── components/       # React components (50+)
│   ├── ui/           # Design system primitives
│   └── ...
├── db/schema/        # Database table definitions
├── lib/              # Shared utilities
│   ├── plans.ts      # Plan definitions & limits
│   ├── feature-gate.ts # Tier-based access control
│   ├── billing.ts    # Stripe billing helpers
│   └── api-keys.ts   # API key management
└── design/           # Design tokens & documentation
```

## Supported Networks

| Chain | Status |
|-------|--------|
| Ethereum | Live |
| Arbitrum | Live |
| Base | Live |
| Polygon | Live |
| Optimism | Live |
| Avalanche | Live |

## Security

Allowance Guard is **non-custodial by design**:

- **No private keys** — We never ask for or store private keys
- **Read-only scanning** — Wallet scans use public blockchain data
- **User-signed transactions** — Every revocation requires your explicit signature
- **Open source** — Full source code available for audit

### Technical Security
- Input validation with Zod schemas on all API endpoints
- Rate limiting (IP-based + per-user/API-key)
- CSRF protection and security headers (CSP, HSTS, X-Frame-Options)
- Webhook idempotency guards (Stripe + Coinbase)
- API keys stored as hashes (prefix-only identification)
- No sensitive data in source code

**Security issues**: Contact security@allowanceguard.com

## Development

### Commands

```bash
pnpm dev              # Dev server with Turbopack
pnpm build            # Production build
pnpm start            # Production server
pnpm test:e2e         # Playwright E2E tests
pnpm test:e2e:ui      # Tests with Playwright UI
pnpm run migrate      # Database migrations
```

### Testing

```bash
# Run full E2E suite
pnpm test:e2e

# Run specific test
pnpm playwright test tests/scan.spec.ts

# Test with mock payments
E2E_FAKE_PAYMENTS=true pnpm test:e2e
```

**Test coverage**: E2E workflows, accessibility (WCAG AA), API endpoints, payment flows.

See [TESTING_POLICY.md](TESTING_POLICY.md) for full testing documentation.

## Contributing

We welcome contributions to the open-source core.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run tests (`pnpm test:e2e`)
5. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines and [docs/developer-guide.md](docs/developer-guide.md) for the technical deep dive.

### Financial Support

Allowance Guard is built by a small independent team. If you find the tool valuable, consider [supporting development](https://www.allowanceguard.com/contribute) with a contribution. Funds go directly to development, security audits, and infrastructure.

## Documentation

| Resource | Description |
|----------|-------------|
| [User Docs](https://www.allowanceguard.com/docs) | How to use Allowance Guard |
| [API Reference](https://www.allowanceguard.com/docs/api-reference) | B2B API documentation |
| [Integration Guide](https://www.allowanceguard.com/docs/integration) | Embed AG in your product |
| [Widget Docs](https://www.allowanceguard.com/docs/widget) | Embeddable widget |
| [Developer Guide](docs/developer-guide.md) | Technical deep dive |
| [Ops Monitoring](docs/ops-monitoring.md) | Production monitoring |
| [Rollbar Setup](ROLLBAR_SETUP.md) | Error monitoring config |

## Roadmap

### Now
- Subscription billing (Stripe) with Pro and Sentinel tiers
- Public REST API v1 with API key authentication
- Pricing page and account management dashboard

### Next
- Continuous monitoring service with real-time alerts
- Historical approval timeline
- Automated revocation rules engine
- Browser extension (Chrome)

### Later
- Institutional compliance suite
- White-label widget for wallet providers
- Additional chain support
- Mobile app

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE).

The open-source core is free to use, modify, and distribute. Premium features and managed services are available through [allowanceguard.com](https://www.allowanceguard.com/pricing).

## Disclaimer

This software is provided "as is" without warranty. Users are responsible for their own security assessments. The authors are not liable for any loss of funds. Always verify approvals independently before revoking.

---

**Built for the DeFi community by [EazyAccess](https://github.com/EazyAccessEA)**
