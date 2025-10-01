# Deployment Guide

This guide covers the general deployment process for Allowance Guard.

## Prerequisites

- Node.js 18+ installed
- Database (PostgreSQL recommended)
- Environment variables configured
- Vercel CLI installed (for Vercel deployment)

## Environment Setup

1. Copy `.env.template` to `.env.local`
2. Fill in your environment variables
3. Never commit actual environment variables to version control

## Database Setup

1. Create a PostgreSQL database
2. Run migrations: `npm run migrate`
3. Verify database connection

## Deployment Options

### Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Configure environment variables in Vercel dashboard

### Other Platforms

- **Netlify**: Use `netlify deploy`
- **Railway**: Connect your GitHub repository
- **DigitalOcean**: Use App Platform

## Post-Deployment

1. Verify all environment variables are set
2. Test core functionality
3. Monitor error logs
4. Set up monitoring and alerts

## Security Notes

- Never commit secrets to version control
- Use environment variables for all sensitive data
- Regularly rotate API keys and tokens
- Monitor for security vulnerabilities

## Support

For deployment issues, check the troubleshooting section in the main README.
