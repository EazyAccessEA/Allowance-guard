# Stripe Webhook Setup Guide

This guide covers setting up the complete Stripe webhook system for local testing and production deployment.

## 🚀 Local Testing Setup

### 1. Install Stripe CLI
```bash
# On macOS
brew install stripe/stripe-cli/stripe

# Login to your Stripe account
stripe login
```

### 2. Start Local Development Server
```bash
npm run dev
```

### 3. Start Webhook Forwarding (in a separate terminal)
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

The Stripe CLI will output something like:
```
Ready! Your webhook signing secret is: whsec_XXXXXXXXXXXX
```

### 4. Add Webhook Secret to Environment
Copy the webhook secret from the CLI output and add it to your `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXX
```

### 5. Restart Development Server
```bash
# Stop and restart npm run dev to load the new environment variable
npm run dev
```

### 6. Test the Complete Flow
1. Open http://localhost:3000/donate
2. Enter an amount (e.g., 10.00)
3. Click "Contribute"
4. Complete Stripe Checkout with test card: `4242 4242 4242 4242`
5. Watch the webhook terminal for `checkout.session.completed` events
6. Verify you're redirected to `/thank-you?session_id=cs_test_...`
7. Confirm the thank-you page shows "Payment Confirmed" with the amount

## 🌐 Production Setup

### 1. Stripe Dashboard Configuration
1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → Developers → Webhooks
2. Click "Add endpoint"
3. Set endpoint URL: `https://www.allowanceguard.com/api/stripe/webhook`
4. Select events to send: `checkout.session.completed`
5. Click "Add endpoint"

### 2. Get Production Webhook Secret
1. In the webhook endpoint details, click "Reveal" next to "Signing secret"
2. Copy the secret (starts with `whsec_live_`)

### 3. Add to Vercel Environment Variables
1. Go to [Vercel Dashboard](https://vercel.com) → Your Project → Settings → Environment Variables
2. Add new variable:
   - **Name**: `STRIPE_WEBHOOK_SECRET`
   - **Value**: `whsec_live_XXXXXXXXXXXX` (from step 2)
   - **Environment**: Production
3. Click "Save"

### 4. Redeploy
```bash
vercel --prod
```

## 🔍 Testing Production Webhooks

### 1. Test with Live Payments
1. Go to https://www.allowanceguard.com/donate
2. Make a small test contribution with a real card
3. Check Vercel function logs for webhook events
4. Verify thank-you page shows confirmed payment

### 2. Monitor Webhook Events
- **Stripe Dashboard**: Developers → Webhooks → Your endpoint → Recent deliveries
- **Vercel Dashboard**: Functions → View logs for webhook endpoint
- **Local Testing**: Terminal running `stripe listen` shows all events

## 🛠️ Troubleshooting

### Common Issues

#### Webhook Signature Verification Failed
- **Cause**: Wrong webhook secret or environment variable not loaded
- **Fix**: Verify `STRIPE_WEBHOOK_SECRET` is correct and restart dev server

#### No Webhook Events Received
- **Cause**: Webhook forwarding not running or wrong URL
- **Fix**: Ensure `stripe listen` is running and pointing to correct endpoint

#### Thank-You Page Shows "Verification Failed"
- **Cause**: API error or invalid session ID
- **Fix**: Check browser console and Vercel function logs for errors

#### Production Webhook Not Working
- **Cause**: Wrong endpoint URL or missing environment variable
- **Fix**: Verify endpoint URL in Stripe Dashboard and `STRIPE_WEBHOOK_SECRET` in Vercel

### Debug Commands
```bash
# Check webhook events locally
stripe listen --forward-to localhost:3000/api/stripe/webhook --print-json

# Test webhook endpoint directly
curl -X POST http://localhost:3000/api/stripe/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# Check environment variables
echo $STRIPE_WEBHOOK_SECRET
```

## 📊 Webhook Event Flow

1. **User completes payment** → Stripe processes payment
2. **Stripe sends webhook** → `checkout.session.completed` event
3. **Webhook endpoint receives** → Validates signature and processes event
4. **User redirected** → `/thank-you?session_id=cs_...`
5. **Thank-you page loads** → Calls verification API
6. **Verification API** → Retrieves session from Stripe
7. **Page updates** → Shows confirmed payment status

## 🔒 Security Notes

- **Webhook secrets are different** for test and live modes
- **Never commit webhook secrets** to version control
- **Use environment variables** for all sensitive data
- **Webhook signature verification** prevents unauthorized requests
- **Node.js runtime required** for raw body verification

## 📝 Next Steps

After webhook setup is complete:
1. **Add database persistence** for contribution records
2. **Implement Slack notifications** for new contributions
3. **Add contribution analytics** and reporting
4. **Set up automated testing** for webhook flows
5. **Monitor webhook reliability** and retry failed events
