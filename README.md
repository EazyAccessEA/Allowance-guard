# Allowance Guard

**Version 1.1.0** - Free & Open Source Token Approval Security Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Open Source](https://img.shields.io/badge/Open%20Source-100%25-green.svg)](https://github.com/allowance-guard/allowance-guard)

## 🛡️ Overview

Allowance Guard is a **completely free and open source** security platform for monitoring and managing token approvals across multiple blockchain networks. Built for the DeFi community with no premium features, no paywalls, and no subscriptions.

### Key Features

- **🔍 Real-time Monitoring**: Track token approvals across Ethereum, Arbitrum, and Base
- **⚠️ Risk Assessment**: Advanced algorithms identify unlimited and stale approvals
- **📧 Email Alerts**: Get notified about risky approvals via Microsoft SMTP
- **🔗 Wallet Management**: Save and monitor multiple wallet addresses
- **⚡ One-Click Revoke**: Instantly revoke risky approvals with gas optimization
- **📊 Analytics**: Comprehensive reporting and risk scoring
- **💝 100% Free**: No premium features, no paywalls, no subscriptions
- **🔓 Open Source**: Full source code available on GitHub

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Upstash PostgreSQL (or other managed database)
- Microsoft SMTP account
- RPC endpoints (Alchemy, Infura, or QuickNode)
- WalletConnect project

### Installation

```bash
# Clone the repository
git clone https://github.com/allowance-guard/allowance-guard.git
cd allowance-guard

# Install dependencies
npm install

# Set up environment variables
cp production.env.example .env.local

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

### Environment Setup

Create a `.env.local` file with the following variables:

```bash
# Database (Upstash)
DATABASE_URL=postgresql://username:password@your-upstash-host:5432/allowance_guard

# RPC URLs
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
ARBITRUM_RPC_URL=https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY
BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/YOUR_KEY

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Microsoft SMTP
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your_email@outlook.com
SMTP_PASS=your_app_password
ALERTS_FROM_EMAIL=your_email@outlook.com
ALERTS_FROM_NAME=Allowance Guard
```

## 🏗️ Production Deployment

### Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

For production, use the `production.env.example` as a template and configure:

- **Database**: Upstash PostgreSQL connection string
- **RPC URLs**: Production-grade endpoints
- **SMTP**: Microsoft 365 Business account
- **Security**: Strong secrets and keys

## 📋 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # Run TypeScript checks
npm run migrate      # Run database migrations
npm run test:smtp    # Test SMTP configuration
npm run analyze      # Analyze bundle size
```

## 🏛️ Architecture

### Frontend
- **Next.js 15.5.2** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Reown/WalletConnect** for wallet integration
- **Viem** for blockchain interactions

### Backend
- **Next.js API Routes** for serverless functions
- **Upstash PostgreSQL** for data persistence
- **Microsoft SMTP** for email alerts
- **Rate limiting** and security headers

### Infrastructure
- **Vercel** serverless hosting
- **Upstash** managed database
- **SSL/TLS** encryption (automatic)
- **CDN** and edge functions

## 🔧 Configuration

### Database Schema

The application uses two main tables:

- **`allowances`**: Stores token approval data with risk scores
- **`alert_subscriptions`**: Manages email alert preferences

### Supported Networks

- **Ethereum Mainnet** (Chain ID: 1)
- **Arbitrum One** (Chain ID: 42161)
- **Base** (Chain ID: 8453)

### Risk Assessment

The platform evaluates approvals based on:

- **Unlimited approvals** (highest risk)
- **Stale approvals** (unused for extended periods)
- **High-value tokens** (significant financial exposure)
- **Unknown spenders** (unverified contracts)

## 📧 Email Alerts

Configured with Microsoft SMTP for reliable delivery:

- **Daily digests** of risky approvals
- **Real-time alerts** for critical issues
- **Customizable preferences** per wallet
- **Professional formatting** with HTML templates

## 🔒 Security

### Implemented Security Measures

- **Rate limiting** on API endpoints
- **Input validation** with Zod schemas
- **SQL injection** prevention
- **XSS protection** headers
- **CSRF protection**
- **Secure headers** configuration

### Best Practices

- Use strong, unique passwords
- Enable 2FA on all accounts
- Regularly update dependencies
- Monitor for security vulnerabilities
- Use HTTPS in production

## 📊 Monitoring

### Health Checks

- **Database connectivity**
- **RPC endpoint status**
- **SMTP configuration**
- **Application performance**

### Logging

- **Structured logging** with context
- **Error tracking** and reporting
- **Performance metrics**
- **Security event monitoring**

## 💝 Supporting Allowance Guard

Allowance Guard is **completely free and open source**. We rely on community donations to keep the service running and improve it for everyone.

### Why Donate?

- **Keep it free**: Help us maintain the service without ads or paywalls
- **Infrastructure**: Cover server costs and database hosting
- **Development**: Support new features and blockchain networks
- **Community**: Help the open source DeFi security ecosystem

### How to Support

- **Donate**: Use the "Support Us" button on our website
- **Contribute**: Submit pull requests and report issues
- **Share**: Tell others about Allowance Guard
- **Star**: Give us a star on GitHub

## 🤝 Contributing

We welcome contributions from the community! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/allowance-guard.git
cd allowance-guard

# Install dependencies
npm install

# Set up environment variables
cp production.env.example .env.local

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.allowanceguard.com](https://docs.allowanceguard.com)
- **Issues**: [GitHub Issues](https://github.com/allowance-guard/allowance-guard/issues)
- **Email**: support@allowanceguard.com
- **Discord**: [Join our community](https://discord.gg/allowanceguard) (coming soon)

## 🗺️ Roadmap

### Version 1.1.0
- [ ] Additional blockchain networks
- [ ] Advanced analytics dashboard
- [ ] Mobile app support
- [ ] API rate limiting improvements

### Version 1.2.0
- [ ] Multi-signature wallet support
- [ ] Custom risk rules
- [ ] Integration with popular DeFi protocols
- [ ] Advanced notification channels

---

**Built with ❤️ by the Allowance Guard Team**