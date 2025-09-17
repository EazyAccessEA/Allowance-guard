#!/bin/bash

# E2E Test Setup Script
echo "Setting up E2E test environment..."

# Set E2E environment variables
export NEXT_PUBLIC_E2E=1
export E2E_FAKE_PAYMENTS=1
export E2E_FAKE_EMAIL=1

echo "Environment variables set:"
echo "NEXT_PUBLIC_E2E=$NEXT_PUBLIC_E2E"
echo "E2E_FAKE_PAYMENTS=$E2E_FAKE_PAYMENTS"
echo "E2E_FAKE_EMAIL=$E2E_FAKE_EMAIL"

echo "Building application..."
pnpm build

echo "Starting application in background..."
pnpm start -p 3000 &
APP_PID=$!

# Wait for app to start
echo "Waiting for application to start..."
sleep 10

echo "Running E2E tests..."
pnpm playwright test

# Clean up
echo "Stopping application..."
kill $APP_PID

echo "E2E test setup complete!"
