# Contributing to Allowance Guard

Welcome to Allowance Guard! We're excited that you want to contribute to this open-source DeFi security platform. This guide focuses on **technical contributions** - for financial support, please visit our [contribution page](https://www.allowanceguard.com/docs/contributing).

## 💰 Financial Support

**Support Allowance Guard's Development**: Visit [allowanceguard.com/docs/contributing](https://www.allowanceguard.com/docs/contributing) to make financial contributions that directly fund:
- Core development team compensation
- Security audits and bug bounty programs  
- Infrastructure and hosting costs
- Future feature development

Your financial support helps maintain this essential Web3 security infrastructure that protects millions of dollars in user funds.

## 🎯 Project Overview

Allowance Guard is a **production-ready, enterprise-grade** DeFi security platform for monitoring and managing token approvals across multiple blockchain networks.

### Key Features
- **🔍 Real-time Monitoring**: Track token approvals across multiple chains
- **⚠️ Risk Assessment**: Identify unlimited and stale approvals  
- **📧 Email Alerts**: Get notified about risky approvals
- **🔗 Wallet Management**: Save and monitor multiple wallet addresses
- **⚡ One-Click Revoke**: Instantly revoke risky approvals
- **📊 Analytics**: Comprehensive reporting and risk scoring
- **🛡️ Wallet Security**: Comprehensive security dashboard
- **🔓 Open Source**: Full source code available

### Supported Blockchains
- Ethereum (Mainnet)
- Arbitrum
- Base
- Polygon
- Optimism
- Avalanche

## 🚀 Quick Start for Contributors

### Prerequisites
- **Node.js 18+**
- **pnpm** (preferred) or npm
- **Git**
- **PostgreSQL** (for local development)
- **SMTP service** (for email notifications)
- **RPC endpoints** for blockchain access

### Development Setup

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/Allowance-guard.git
cd Allowance-guard

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp production.env.example .env.local
# Edit .env.local with your configuration

# 4. Run database migrations
pnpm run migrate

# 5. Start development server
pnpm run dev
```

### Environment Variables

Copy `production.env.example` to `.env.local` and configure:

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/allowance_guard

# RPC Endpoints (use public endpoints for development)
ETHEREUM_RPC_URLS=https://eth.llamarpc.com,https://rpc.ankr.com/eth
ARBITRUM_RPC_URLS=https://arb1.arbitrum.io/rpc,https://rpc.ankr.com/arbitrum
BASE_RPC_URLS=https://mainnet.base.org,https://rpc.ankr.com/base

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Email (optional for development)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Rollbar (optional for development)
ROLLBAR_ACCESS_TOKEN=your_server_token
NEXT_PUBLIC_ROLLBAR_ACCESS_TOKEN=your_client_token
```

## 🏗️ Architecture & Tech Stack

### Frontend
- **Next.js 15.5.2** with App Router
- **React 19.1.0** with TypeScript
- **Tailwind CSS** for styling
- **Wagmi v2** for blockchain interactions
- **Reown AppKit** for wallet connections

### Backend
- **Next.js API Routes** (serverless functions)
- **PostgreSQL** with connection pooling
- **Drizzle ORM** for database operations
- **Redis** for caching and metrics

### Infrastructure
- **Vercel** for deployment
- **Neon** for PostgreSQL hosting
- **Rollbar** for error monitoring
- **Cron-jobs.org** for scheduled tasks

### Security & Monitoring
- **Comprehensive audit logging**
- **Real-time error monitoring**
- **Performance monitoring**
- **Ops monitoring with cost tracking**

## 🧪 Testing

Allowance Guard has a comprehensive testing framework:

### Running Tests

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# E2E tests with UI
pnpm test:e2e:ui

# Specific test file
pnpm playwright test tests/scan.spec.ts

# Test coverage
pnpm test --coverage
```

### Test Coverage Requirements
- **Minimum 80% code coverage** for new features
- **All API routes** must have integration tests
- **Critical user workflows** must have E2E tests
- **Accessibility compliance** (WCAG 2.0 AA)

### Test Types
- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright with accessibility testing
- **Integration Tests**: API endpoint testing
- **Performance Tests**: Core Web Vitals monitoring

## 📝 Development Guidelines

### Code Quality Standards

#### TypeScript
- **Strict mode enabled** - no `any` types without justification
- **Proper type definitions** for all functions and components
- **Interface definitions** for complex objects
- **Generic types** for reusable components

#### React Best Practices
- **Functional components** with hooks
- **Proper error boundaries** for error handling
- **Memoization** for performance optimization
- **Accessibility** attributes and semantic HTML

#### API Development
- **Proper error handling** with meaningful messages
- **Input validation** using Zod schemas
- **Rate limiting** for security
- **Audit logging** for all operations

### File Organization

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── (pages)/           # Public pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
│   ├── ui/               # Base UI components
│   └── [feature]/        # Feature-specific components
├── lib/                  # Utility functions and configurations
├── hooks/                # Custom React hooks
├── context/              # React context providers
└── styles/               # Global styles and CSS
```

### Naming Conventions
- **Components**: PascalCase (`UserDashboard.tsx`)
- **Files**: kebab-case (`user-dashboard.tsx`)
- **Functions**: camelCase (`getUserData`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Types/Interfaces**: PascalCase (`UserData`)

## 🔒 Security Guidelines

### Security Requirements
- **Input validation** on all user inputs
- **SQL injection prevention** using parameterized queries
- **XSS prevention** with proper sanitization
- **CSRF protection** for state-changing operations
- **Rate limiting** on all API endpoints
- **Audit logging** for security events

### Sensitive Data Handling
- **Never commit** environment variables or secrets
- **Use environment variables** for all configuration
- **Sanitize logs** to prevent data exposure
- **Validate all inputs** before processing

### Wallet Security
- **Read-only operations** - never request private keys
- **Proper wallet connection** using established libraries
- **Transaction validation** before execution
- **User confirmation** for all transactions

## 🚀 Deployment & Production

### Production Readiness Checklist

Before deploying to production, ensure:

- [ ] **All tests pass** (unit, integration, E2E)
- [ ] **No linting errors** or warnings
- [ ] **TypeScript compilation** successful
- [ ] **Environment variables** properly configured
- [ ] **Database migrations** run successfully
- [ ] **Security headers** implemented
- [ ] **Error monitoring** configured
- [ ] **Performance monitoring** active

### Deployment Process

```bash
# 1. Run full test suite
pnpm test:ci

# 2. Build for production
pnpm build

# 3. Deploy to Vercel
vercel --prod

# 4. Verify deployment
curl https://your-domain.com/api/healthz
```

### Environment Configuration

#### Required Environment Variables
```bash
# Application
NEXT_PUBLIC_APP_URL=https://www.allowanceguard.com
NODE_ENV=production

# Database
DATABASE_URL=postgresql://...

# RPC Endpoints
ETHEREUM_RPC_URLS=https://...
ARBITRUM_RPC_URLS=https://...
BASE_RPC_URLS=https://...

# Email
SMTP_HOST=smtp.office365.com
SMTP_USER=no_reply@allowanceguard.com
SMTP_PASS=your_app_password

# Security
ROLLBAR_ACCESS_TOKEN=your_server_token
NEXT_PUBLIC_ROLLBAR_ACCESS_TOKEN=your_client_token

# Monitoring
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
OPS_ALERT_EMAIL=legal.ops@allowanceguard.com
OPS_DASH_TOKEN=your_secure_token
```

## 🐛 Bug Reports

### Before Reporting
1. **Check existing issues** on GitHub
2. **Search closed issues** for similar problems
3. **Test on latest version** of the codebase
4. **Verify environment** setup is correct

### Bug Report Template
```markdown
**Bug Description**
A clear description of what the bug is.

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Environment**
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 1.9.1]

**Additional Context**
Any other context about the problem.
```

## 💡 Feature Requests

### Before Requesting
1. **Check existing feature requests**
2. **Consider the project's scope** (DeFi security focus)
3. **Think about implementation complexity**
4. **Consider user impact and adoption**

### Feature Request Template
```markdown
**Feature Description**
A clear description of the feature you'd like to see.

**Problem Statement**
What problem does this feature solve?

**Proposed Solution**
How would you like this feature to work?

**Alternatives Considered**
Any alternative solutions you've considered.

**Additional Context**
Any other context about the feature request.
```

## 🔄 Pull Request Process

### Before Submitting
1. **Fork the repository** and create a feature branch
2. **Write tests** for your changes
3. **Ensure all tests pass** locally
4. **Update documentation** if needed
5. **Follow coding standards** and conventions

### Pull Request Template
```markdown
**Description**
Brief description of changes.

**Type of Change**
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

**Testing**
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

**Checklist**
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process
1. **Automated checks** must pass (tests, linting, build)
2. **Code review** by maintainers
3. **Security review** for sensitive changes
4. **Performance review** for optimization changes
5. **Documentation review** for user-facing changes

## 📚 Documentation

### Documentation Standards
- **Clear and concise** explanations
- **Code examples** for complex concepts
- **Up-to-date** with current implementation
- **User-focused** language and examples

### Types of Documentation
- **API Documentation**: Endpoint specifications and examples
- **User Guides**: How to use features
- **Developer Guides**: How to contribute and extend
- **Deployment Guides**: How to deploy and maintain

## 🏆 Recognition

### Contributor Recognition
- **Contributors listed** in README.md
- **Release notes** credit for significant contributions
- **GitHub contributor** recognition
- **Community appreciation** for valuable contributions

### Types of Contributions

#### Technical Contributions
- **Code contributions** (features, bug fixes, optimizations)
- **Documentation** improvements
- **Testing** and quality assurance
- **Security research** and vulnerability reports

#### Community Contributions
- **Community advocacy** - Share your positive experiences on social media
- **Feedback and testing** - Participate in beta testing and provide detailed feedback
- **Issue triage** - Help identify and categorize issues
- **User support** - Help other users in Discord and GitHub discussions

#### Financial Contributions
- **One-time donations** via [Stripe or Coinbase Commerce](https://www.allowanceguard.com/docs/contributing)
- **Recurring contributions** for ongoing project sustainability
- **Transparency reports** published quarterly showing fund usage

## 🆘 Getting Help

### Resources
- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and community discussion
- **Documentation**: Comprehensive guides and API docs
- **Email**: legal.support@allowanceguard.com for urgent issues

### Community Guidelines
- **Be respectful** and inclusive
- **Help others** when you can
- **Follow the code of conduct**
- **Provide constructive feedback**

## 📜 Contributor License Agreement (CLA)

AllowanceGuard uses a dual license model (AGPL-3.0 + Commercial). To make this possible, all contributors must agree to our [Contributor License Agreement](./CLA.md).

### What the CLA Does

- Grants AllowanceGuard the right to distribute your contributions under both AGPL-3.0 and our commercial license
- Grants a patent license covering your contributed code
- Includes a warranty disclaimer and indemnification clause for corporate contributors
- **You retain full copyright ownership** of your contributions

### How to Sign

**By submitting a pull request, you agree to the CLA.** To create a binding record, include this statement in your PR description or as a comment:

> I confirm that I have read and agree to the AllowanceGuard CLA v1.1 for this Contribution and all future Contributions.

A bot will remind you if you forget.

**Contributing on behalf of an organization?** An authorized representative must comment on the PR with:

> I have read and agree to the AllowanceGuard Contributor License Agreement v1.1 on behalf of [Organization Name]. I confirm that the organisation has granted the necessary permissions.

### Why a CLA?

Dual licensing requires the project maintainer to have the right to offer code under both licenses. Without a CLA, each contributor retains exclusive copyright, making the commercial license legally impossible. The CLA solves this while letting you keep ownership of your work.

For full details, read the complete [CLA](./CLA.md).

## 📄 License

This project is licensed under **AGPL-3.0-or-later** with a commercial dual-license option. By contributing, you agree that your contributions will be licensed under the terms described in the [CLA](./CLA.md). See [LICENSE_STRATEGY.md](./LICENSE_STRATEGY.md) for details.

## 🎉 Thank You!

Thank you for contributing to AllowanceGuard! Your contributions help make DeFi safer for everyone. Together, we're building a more secure and transparent DeFi ecosystem.

---

**Ready to contribute?** Start by forking the repository and checking out our [good first issues](https://github.com/EazyAccessEA/Allowance-guard/labels/good%20first%20issue)!

*Last updated: April 2026*
