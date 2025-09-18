#!/bin/bash

# Allowance Guard v1.8.0 - Production Deployment Script
# This script prepares and deploys Allowance Guard to production

set -e  # Exit on any error

echo "🚀 Allowance Guard v1.8.0 - Production Deployment"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI not found. Please install it with: npm i -g vercel"
    exit 1
fi

# Check if logged into Vercel
if ! vercel whoami &> /dev/null; then
    print_error "Not logged into Vercel. Please run: vercel login"
    exit 1
fi

print_status "Starting production deployment process..."

# Step 1: Pre-deployment checks
print_status "Running pre-deployment checks..."

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    print_warning ".env.production not found. Please create it from production.env.example"
    print_status "Copying production.env.example to .env.production..."
    cp production.env.example .env.production
    print_warning "Please edit .env.production with your production values before continuing."
    read -p "Press Enter when you've configured .env.production..."
fi

# Check if all required environment variables are set
print_status "Checking environment variables..."
source .env.production

required_vars=(
    "DATABASE_URL"
    "NEXT_PUBLIC_APP_URL"
    "OPS_DASH_TOKEN"
    "SLACK_WEBHOOK_URL"
    "OPS_ALERT_EMAIL"
)

missing_vars=()
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    print_error "Missing required environment variables:"
    for var in "${missing_vars[@]}"; do
        echo "  - $var"
    done
    exit 1
fi

print_success "All required environment variables are set"

# Step 2: Build and test
print_status "Building application..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed. Please fix the errors and try again."
    exit 1
fi

print_success "Build completed successfully"

# Step 3: Run tests
print_status "Running tests..."
npm run test:e2e

if [ $? -ne 0 ]; then
    print_warning "Some tests failed. Continue anyway? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        print_error "Deployment cancelled due to test failures."
        exit 1
    fi
fi

# Step 4: Deploy to Vercel
print_status "Deploying to Vercel production..."
vercel --prod

if [ $? -ne 0 ]; then
    print_error "Vercel deployment failed."
    exit 1
fi

print_success "Deployed to Vercel successfully"

# Step 5: Post-deployment verification
print_status "Running post-deployment verification..."

# Get the deployment URL
DEPLOYMENT_URL=$(vercel ls --prod | grep allowance-guard | head -1 | awk '{print $2}')
if [ -z "$DEPLOYMENT_URL" ]; then
    print_warning "Could not determine deployment URL. Please check manually."
else
    print_status "Testing deployment at: https://$DEPLOYMENT_URL"
    
    # Test health endpoint
    if curl -f -s "https://$DEPLOYMENT_URL/api/healthz" > /dev/null; then
        print_success "Health check passed"
    else
        print_warning "Health check failed. Please verify manually."
    fi
    
    # Test ops monitoring
    if curl -f -s "https://$DEPLOYMENT_URL/api/alerts/health" > /dev/null; then
        print_success "Ops monitoring health check passed"
    else
        print_warning "Ops monitoring health check failed. Please verify manually."
    fi
fi

# Step 6: Final instructions
print_success "Deployment completed!"
echo ""
echo "📋 Post-deployment checklist:"
echo "1. Verify all environment variables are set in Vercel dashboard"
echo "2. Test the ops dashboard at: https://$DEPLOYMENT_URL/ops"
echo "3. Check Slack webhook is receiving alerts"
echo "4. Verify daily reports are scheduled"
echo "5. Test core functionality (wallet connection, scanning, etc.)"
echo ""
echo "🔗 Useful links:"
echo "- Production URL: https://$DEPLOYMENT_URL"
echo "- Ops Dashboard: https://$DEPLOYMENT_URL/ops"
echo "- Health Check: https://$DEPLOYMENT_URL/api/healthz"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
echo ""
echo "📊 Monitoring:"
echo "- Check Vercel logs: vercel logs"
echo "- Monitor Slack for alerts"
echo "- Review daily ops reports"
echo ""
print_success "Allowance Guard v1.8.0 is now live in production! 🎉"
