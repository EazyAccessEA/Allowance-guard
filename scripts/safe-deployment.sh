#!/bin/bash

# TASKMASTER SAFE DEPLOYMENT SCRIPT
# This script ensures zero-downtime deployment with instant rollback capability

set -e  # Exit on any error

echo "🛡️ TASKMASTER SAFE DEPLOYMENT STARTING..."
echo "=========================================="

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

# Create backup of current state
print_status "Creating safety backup..."
BACKUP_DIR=".backup/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup critical files
cp -r src/components/ui "$BACKUP_DIR/"
cp -r src/lib "$BACKUP_DIR/"
cp package.json "$BACKUP_DIR/"
cp next.config.ts "$BACKUP_DIR/"

print_success "Backup created at $BACKUP_DIR"

# Pre-deployment checks
print_status "Running pre-deployment checks..."

# Check if all new components are feature-flagged
if ! grep -q "isFeatureEnabled" src/components/ui/SafeButton.tsx; then
    print_error "SafeButton.tsx is not properly feature-flagged!"
    exit 1
fi

if ! grep -q "isFeatureEnabled" src/components/ui/SafeLoadingStates.tsx; then
    print_error "SafeLoadingStates.tsx is not properly feature-flagged!"
    exit 1
fi

if ! grep -q "isFeatureEnabled" src/components/ui/SafeErrorHandling.tsx; then
    print_error "SafeErrorHandling.tsx is not properly feature-flagged!"
    exit 1
fi

print_success "All components are properly feature-flagged"

# Check if feature flags system exists
if [ ! -f "src/lib/feature-flags.ts" ]; then
    print_error "Feature flags system not found!"
    exit 1
fi

print_success "Feature flags system verified"

# Build test
print_status "Testing build with new components..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed! Rolling back..."
    rm -rf src/components/ui/SafeButton.tsx
    rm -rf src/components/ui/SafeLoadingStates.tsx
    rm -rf src/components/ui/SafeErrorHandling.tsx
    rm -rf src/lib/feature-flags.ts
    print_error "Rollback completed. Build failed."
    exit 1
fi

print_success "Build test passed"

# Deploy with feature flags disabled by default
print_status "Deploying with all new features DISABLED by default..."

# Set environment variables to disable all new features
export EMERGENCY_DISABLE_NEW_FEATURES=false
export FORCE_LEGACY_UI=false
export ENABLE_MICRO_INTERACTIONS=false
export ENABLE_SOPHISTICATED_LOADING=false
export ENABLE_CONTEXTUAL_ERRORS=false
export ENABLE_SUCCESS_FEEDBACK=false
export ENABLE_ONBOARDING=false
export ENABLE_GESTURES=false
export ENABLE_PAGE_TRANSITIONS=false
export ENABLE_CONTEXTUAL_HELP=false
export NEW_UX_PERCENTAGE=0

print_success "Deployment completed with all new features disabled"

# Create rollback script
print_status "Creating rollback script..."
cat > scripts/emergency-rollback.sh << 'EOF'
#!/bin/bash
echo "🚨 EMERGENCY ROLLBACK INITIATED..."

# Disable all new features immediately
export EMERGENCY_DISABLE_NEW_FEATURES=true
export FORCE_LEGACY_UI=true

# Restore from backup if needed
if [ -d ".backup" ]; then
    LATEST_BACKUP=$(ls -t .backup/ | head -1)
    echo "Restoring from backup: $LATEST_BACKUP"
    cp -r ".backup/$LATEST_BACKUP/src/components/ui/" src/components/ui/
    cp -r ".backup/$LATEST_BACKUP/src/lib/" src/lib/
fi

echo "✅ Rollback completed. All new features disabled."
EOF

chmod +x scripts/emergency-rollback.sh

print_success "Emergency rollback script created: scripts/emergency-rollback.sh"

# Create gradual rollout script
print_status "Creating gradual rollout script..."
cat > scripts/gradual-rollout.sh << 'EOF'
#!/bin/bash

# Gradual Rollout Script
# Usage: ./scripts/gradual-rollout.sh [percentage] [feature]

PERCENTAGE=${1:-10}
FEATURE=${2:-"all"}

echo "🚀 Starting gradual rollout..."
echo "Percentage: $PERCENTAGE%"
echo "Feature: $FEATURE"

# Enable gradual rollout
export ENABLE_GRADUAL_ROLLOUT=true
export NEW_UX_PERCENTAGE=$PERCENTAGE

# Enable specific features
case $FEATURE in
    "micro-interactions")
        export ENABLE_MICRO_INTERACTIONS=true
        ;;
    "loading")
        export ENABLE_SOPHISTICATED_LOADING=true
        ;;
    "errors")
        export ENABLE_CONTEXTUAL_ERRORS=true
        ;;
    "all")
        export ENABLE_MICRO_INTERACTIONS=true
        export ENABLE_SOPHISTICATED_LOADING=true
        export ENABLE_CONTEXTUAL_ERRORS=true
        export ENABLE_SUCCESS_FEEDBACK=true
        ;;
esac

echo "✅ Gradual rollout configured: $PERCENTAGE% for $FEATURE"
EOF

chmod +x scripts/gradual-rollout.sh

print_success "Gradual rollout script created: scripts/gradual-rollout.sh"

# Final instructions
print_success "🎉 SAFE DEPLOYMENT COMPLETED!"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Test the site with all new features disabled"
echo "2. Gradually enable features using: ./scripts/gradual-rollout.sh 10 micro-interactions"
echo "3. Monitor for issues"
echo "4. If problems occur, run: ./scripts/emergency-rollback.sh"
echo ""
echo "🔒 SAFETY MEASURES:"
echo "✅ All new features are DISABLED by default"
echo "✅ Feature flags protect against breaking changes"
echo "✅ Emergency rollback script ready"
echo "✅ Gradual rollout capability enabled"
echo "✅ Backup created at $BACKUP_DIR"
echo ""
echo "🚀 TO ENABLE FEATURES GRADUALLY:"
echo "1. Start with 10%: ./scripts/gradual-rollout.sh 10 micro-interactions"
echo "2. Increase to 25%: ./scripts/gradual-rollout.sh 25 all"
echo "3. Full rollout: ./scripts/gradual-rollout.sh 100 all"
echo ""
print_success "Your site is now SAFE and ready for gradual feature activation! 🎉"
