#!/usr/bin/env bash
set -euo pipefail

# Production Smoke Test Script for Allowance Guard
# Run this after deploying to production to verify all systems are working

BASE="https://www.allowanceguard.com"
WALLET="0x0000000000000000000000000000000000000000"   # test/view-only wallet
EMAIL_TEST="you@yourdomain.com"

echo "🚀 Starting Allowance Guard Production Smoke Test"
echo "=================================================="
echo "Base URL: $BASE"
echo "Test Wallet: $WALLET"
echo "Test Email: $EMAIL_TEST"
echo ""

# Function to check if jq is available
check_jq() {
    if ! command -v jq &> /dev/null; then
        echo "❌ jq is required but not installed. Please install jq first."
        echo "   macOS: brew install jq"
        echo "   Ubuntu: sudo apt-get install jq"
        exit 1
    fi
}

# Function to make HTTP requests with error handling
make_request() {
    local method="$1"
    local url="$2"
    local data="$3"
    local description="$4"
    
    echo "Testing: $description"
    echo "  $method $url"
    
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$url" \
            -H 'content-type: application/json' \
            --data "$data" 2>/dev/null || echo "CURL_ERROR")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" 2>/dev/null || echo "CURL_ERROR")
    fi
    
    if [ "$response" = "CURL_ERROR" ]; then
        echo "  ❌ Failed to connect to $url"
        return 1
    fi
    
    # Split response and status code
    body=$(echo "$response" | head -n -1)
    status_code=$(echo "$response" | tail -n 1)
    
    if [ "$status_code" -ge 200 ] && [ "$status_code" -lt 300 ]; then
        echo "  ✅ OK ($status_code)"
        if [ -n "$body" ] && echo "$body" | jq . >/dev/null 2>&1; then
            echo "$body" | jq . | head -5
        fi
        return 0
    else
        echo "  ❌ Failed ($status_code)"
        echo "  Response: $body"
        return 1
    fi
}

# Check dependencies
check_jq

echo "1️⃣ Health Check"
echo "----------------"
make_request "GET" "$BASE/api/healthz" "" "Health endpoint"

echo ""
echo "2️⃣ Queue a Scan"
echo "----------------"
scan_data="{\"walletAddress\":\"$WALLET\",\"chains\":[\"eth\",\"arb\",\"base\"]}"
if make_request "POST" "$BASE/api/scan" "$scan_data" "Queue wallet scan"; then
    # Extract job ID if available
    job_id=$(echo "$body" | jq -r '.jobId // empty' 2>/dev/null || echo "")
    if [ -n "$job_id" ]; then
        echo "  Job ID: $job_id"
    else
        echo "  No job ID returned (may already be in progress)"
    fi
fi

echo ""
echo "3️⃣ Process Jobs"
echo "----------------"
make_request "POST" "$BASE/api/jobs/process" "" "Process queued jobs"

echo ""
echo "4️⃣ Get Allowances"
echo "------------------"
make_request "GET" "$BASE/api/allowances?wallet=$WALLET&page=1&pageSize=25" "" "Get paginated allowances"

echo ""
echo "5️⃣ CSV Export"
echo "--------------"
echo "Testing: CSV export"
echo "  GET $BASE/api/export/csv?wallet=$WALLET&riskOnly=true"
csv_response=$(curl -s -w "\n%{http_code}" -o /tmp/allowances.csv "$BASE/api/export/csv?wallet=$WALLET&riskOnly=true" 2>/dev/null || echo "CURL_ERROR")
if [ "$csv_response" != "CURL_ERROR" ]; then
    status_code=$(echo "$csv_response" | tail -n 1)
    if [ "$status_code" -ge 200 ] && [ "$status_code" -lt 300 ]; then
        echo "  ✅ OK ($status_code)"
        ls -lh /tmp/allowances.csv
    else
        echo "  ❌ Failed ($status_code)"
    fi
else
    echo "  ❌ Failed to connect"
fi

echo ""
echo "6️⃣ PDF Export"
echo "--------------"
echo "Testing: PDF export"
echo "  GET $BASE/api/export/pdf?wallet=$WALLET&riskOnly=true"
pdf_response=$(curl -s -w "\n%{http_code}" -o /tmp/allowances.pdf "$BASE/api/export/pdf?wallet=$WALLET&riskOnly=true" 2>/dev/null || echo "CURL_ERROR")
if [ "$pdf_response" != "CURL_ERROR" ]; then
    status_code=$(echo "$pdf_response" | tail -n 1)
    if [ "$status_code" -ge 200 ] && [ "$status_code" -lt 300 ]; then
        echo "  ✅ OK ($status_code)"
        ls -lh /tmp/allowances.pdf
    else
        echo "  ❌ Failed ($status_code)"
    fi
else
    echo "  ❌ Failed to connect"
fi

echo ""
echo "7️⃣ Stripe Webhook Test"
echo "----------------------"
echo "Testing: Stripe webhook (requires stripe CLI)"
if command -v stripe &> /dev/null; then
    echo "  Make sure 'stripe login' is done first"
    echo "  Sending test webhook to: $BASE/api/stripe/webhook"
    if stripe trigger checkout.session.completed --webhook-endpoint "$BASE/api/stripe/webhook" >/dev/null 2>&1; then
        echo "  ✅ Stripe webhook test sent successfully"
    else
        echo "  ❌ Stripe webhook test failed"
    fi
else
    echo "  ⚠️  Stripe CLI not installed - skipping webhook test"
    echo "  Install: https://stripe.com/docs/stripe-cli"
fi

echo ""
echo "8️⃣ Coinbase Webhook Test"
echo "-------------------------"
echo "  ⚠️  Manual test required:"
echo "  1. Go to Coinbase Commerce dashboard"
echo "  2. Set webhook URL: $BASE/api/crypto/coinbase/webhook"
echo "  3. Use 'Send test webhook' button"
echo "  4. Verify 200 OK response"

echo ""
echo "9️⃣ Email Test"
echo "--------------"
email_data="{\"email\":\"$EMAIL_TEST\"}"
make_request "POST" "$BASE/api/auth/magic/request" "$email_data" "Send magic link email"
echo "  Check inbox/spam for email from Postmark/SES"

echo ""
echo "🔟 Cron Endpoints"
echo "-----------------"
make_request "GET" "$BASE/api/alerts/daily" "" "Daily alerts cron"
make_request "GET" "$BASE/api/monitor/run" "" "Monitor run cron"

echo ""
echo "✅ Smoke Test Complete!"
echo "======================"
echo ""
echo "📋 Manual Verification Required:"
echo "  • Check email delivery (inbox/spam)"
echo "  • Test Coinbase webhook in dashboard"
echo "  • Verify cron jobs are running in Vercel dashboard"
echo "  • Test real wallet connection in browser"
echo "  • Verify on-chain revoke functionality"
echo ""
echo "🔗 Useful Links:"
echo "  • Vercel Dashboard: https://vercel.com/dashboard"
echo "  • Vercel Logs: vercel logs --follow"
echo "  • Health Check: $BASE/api/healthz"
echo "  • Main App: $BASE"
