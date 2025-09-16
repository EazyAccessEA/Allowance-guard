# Allowance Guard

**Version 1.6.0** - Open Source Token Approval Security Platform

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
- **🔓 Open Source**: Full source code available

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Database (PostgreSQL recommended)
- SMTP service for email notifications
- RPC endpoints for blockchain access
- WalletConnect project

### Installation

```bash
# Clone the repository
git clone https://github.com/EazyAccessEA/Allowance-guard.git
cd Allowance-guard

# Install dependencies
npm install

# Set up environment variables
cp production.env.example .env.local

# Run database migrations
npm run migrate

# Start development server
npm run dev
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

This project implements multiple security layers:

- Input validation and sanitization
- Rate limiting on API endpoints
- CSRF protection
- Security headers
- Environment variable protection
- No sensitive data in source code

**⚠️ CRITICAL SECURITY NOTICE**: 
- This is open source software provided for educational purposes
- **DO NOT use in production without comprehensive security audit**
- Users are responsible for their own security assessments
- The authors assume no liability for security breaches or fund loss
- Always use testnet environments for development and testing
- Keep all secrets and private keys secure and never commit them to version control

**For security issues**: Contact legal.support@allowanceguard.com

## 📖 Documentation

- [API Documentation](/docs/api)
- [Integration Guide](/docs/integration)
- [Contributing Guidelines](/docs/contributing)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](/docs/contributing) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This software is provided "as is" without warranty. Use at your own risk. The authors are not responsible for any loss of funds or security breaches.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/EazyAccessEA/Allowance-guard/issues)
- **Email**: legal.support@allowanceguard.com
- **Documentation**: [Project Docs](/docs)

---

**Built with ❤️ for the DeFi community**