# Webhook Setup Guide

This guide covers setting up webhooks for Allowance Guard.

## Stripe Webhooks

### Local Development

1. Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
2. Login: `stripe login`
3. Start webhook forwarding: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
4. Copy the webhook secret to your `.env.local`

### Production

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events: `checkout.session.completed`
4. Copy webhook secret to environment variables

## Coinbase Commerce Webhooks

1. Go to Coinbase Commerce Dashboard
2. Set webhook URL: `https://yourdomain.com/api/crypto/coinbase/webhook`
3. Copy shared secret to environment variables

## Testing

- Use test cards for Stripe: `4242 4242 4242 4242`
- Monitor webhook events in respective dashboards
- Check application logs for webhook processing

## Security

- Always verify webhook signatures
- Use HTTPS endpoints only
- Never expose webhook secrets
- Implement replay protection

## Troubleshooting

- Check webhook endpoint URLs
- Verify environment variables
- Monitor error logs
- Test with webhook testing tools
