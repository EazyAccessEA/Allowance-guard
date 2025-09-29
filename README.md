# Allowance Guard

**Version 1.14.0** - Open Source Token Approval Security Platform

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

## 🛡️ Overview

Allowance Guard is an open source security platform for monitoring and managing token approvals across multiple blockchain networks. Built for the DeFi community with a focus on security and transparency.

### Key Features

- **🔍 Real-time Monitoring**: Track token approvals across multiple chains
- **⚠️ Risk Assessment**: Identify unlimited and stale approvals
- **📧 Email Alerts**: Get notified about risky approvals
- **🔗 Wallet Management**: Save and monitor multiple wallet addresses
- **⚡ One-Click Revoke**: Instantly revoke risky approvals
- **📊 Analytics**: Comprehensive reporting and risk scoring
- **🔍 Error Monitoring**: Real-time error tracking with Rollbar
- **🛡️ Wallet Security**: Comprehensive security dashboard for connected wallets
- **🔍 Token Discovery**: Search and verify tokens before granting approvals
- **📚 Educational Content**: Learn about token security and best practices
- **🎨 PuredgeOS Design**: Modern, minimalist design system with Mobbin-style animations
- **📱 Mobile-First**: Responsive design optimized for all devices
- **🔓 Open Source**: Full source code available

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Database (PostgreSQL recommended)
- SMTP service for email notifications
- RPC endpoints for blockchain access
- WalletConnect project
- Rollbar account (free) for error monitoring

### Installation

```bash
# Clone the repository
git clone https://github.com/EazyAccessEA/Allowance-guard.git
cd Allowance-guard

# Install dependencies
pnpm install

# Set up environment variables
cp production.env.example .env.local

# Run database migrations
pnpm run migrate

# Start development server
pnpm run dev
```

### Environment Variables

Copy `production.env.example` to `.env.local` and configure:

- Database connection string
- SMTP credentials for email notifications
- RPC endpoints for blockchain access
- WalletConnect project ID
- Other service credentials

## 🏗️ Architecture

- **Frontend**: Next.js 15 with TypeScript
- **Database**: PostgreSQL with connection pooling
- **Authentication**: WalletConnect integration
- **Email**: SMTP service integration
- **Deployment**: Vercel-ready configuration

## 🔒 Security

This project implements wallet-focused security features:

### Wallet Security Features
- **🛡️ Wallet Security Dashboard**: Comprehensive security overview for connected wallets
- **📊 Risk Assessment**: Real-time risk scoring based on token allowances
- **⚠️ High-Risk Detection**: Identify and flag dangerous token approvals
- **🔍 Security Monitoring**: Continuous monitoring of wallet security status
- **📈 Security Analytics**: Detailed security metrics and trends

### Token Discovery & Security
- **🔍 Token Search**: Comprehensive database of verified tokens across multiple chains
- **📚 Educational Content**: Learn about token security before granting approvals
- **⚠️ Security Warnings**: Clear indicators for unverified or risky tokens
- **🔗 Category Filtering**: Organize tokens by DeFi, stablecoins, gaming, infrastructure, etc.
- **✅ Verification Status**: Check if tokens are verified and legitimate
- **🌐 Official Links**: Direct links to token websites and documentation

### Technical Security
- Input validation and sanitization
- Rate limiting on API endpoints
- CSRF protection
- Security headers
- Environment variable protection
- No sensitive data in source code
- Wallet-only authentication (no email/password required)

**⚠️ CRITICAL SECURITY NOTICE**: 
- This is open source software provided for educational purposes
- **DO NOT use in production without comprehensive security audit**
- Users are responsible for their own security assessments
- The authors assume no liability for security breaches or fund loss
- Always use testnet environments for development and testing
- Keep all secrets and private keys secure and never commit them to version control

**For security issues**: Contact legal.support@allowanceguard.com

## 📖 Documentation

### For Users
- [User Documentation](https://www.allowanceguard.com/docs)
- [API Documentation](https://www.allowanceguard.com/docs/api)
- [Integration Guide](https://www.allowanceguard.com/docs/integration)

### For Contributors
- [Financial Support](https://www.allowanceguard.com/docs/contributing) - Support development with donations
- [Technical Contributing Guide](CONTRIBUTING.md) - Complete guide for code contributors
- [Developer Guide](docs/developer-guide.md) - Technical deep dive for developers
- [Testing Policy](TESTING_POLICY.md) - Comprehensive testing standards
- [Operations Monitoring](docs/ops-monitoring.md) - Production monitoring setup

### Deployment & Setup
- [Rollbar Error Monitoring Setup](ROLLBAR_SETUP.md)
- [Vercel Deployment Guide](VERCEL_ROLLBAR_SETUP.md)
- [Production Deployment Checklist](PRODUCTION_DEPLOYMENT_CHECKLIST.md)

## 🤝 Contributing

We welcome all types of contributions! Choose how you'd like to help:

### 💰 Financial Support
**[Support Development](https://www.allowanceguard.com/docs/contributing)** - Your donations directly fund:
- Core development team compensation
- Security audits and infrastructure costs  
- Future feature development
- Essential Web3 security infrastructure

### 💻 Technical Contributions
- **[Technical Contributing Guide](CONTRIBUTING.md)** - Complete guide for code contributors
- **[Developer Guide](docs/developer-guide.md)** - Technical deep dive for developers
- **[Testing Policy](TESTING_POLICY.md)** - Comprehensive testing standards

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Testing

Allowance Guard includes a comprehensive testing framework for developers:

```bash
# Run E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui

# Run specific test file
pnpm playwright test tests/scan.spec.ts
```

**Test Coverage:**
- ✅ End-to-End testing with Playwright
- ✅ Accessibility testing (WCAG 2.0 AA)
- ✅ API endpoint testing
- ✅ Payment flow testing
- ✅ User workflow testing

See `TESTING_POLICY.md` in the repository for detailed testing documentation.

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](https://github.com/EazyAccessEA/Allowance-guard/blob/main/LICENSE) file for details.

## ⚠️ Disclaimer

This software is provided "as is" without warranty. Use at your own risk. The authors are not responsible for any loss of funds or security breaches.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/EazyAccessEA/Allowance-guard/issues)
- **Email**: legal.support@allowanceguard.com
- **Documentation**: [Project Docs](https://www.allowanceguard.com/docs)

---

**Built with ❤️ for the DeFi community**