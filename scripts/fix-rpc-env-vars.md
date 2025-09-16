# RPC Environment Variables Fix

## Current Issue
The health check is failing because of environment variable naming inconsistencies and missing RPC configurations.

## Environment Variables to Add to Vercel

Based on your current setup, you need to add these environment variables to Vercel:

### 1. ETHEREUM_RPC_URLS (plural)
```
ETHEREUM_RPC_URLS=https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY,https://rpc.ankr.com/eth,https://cloudflare-eth.com
```

### 2. ARBITRUM_RPC_URLS (plural)
```
ARBITRUM_RPC_URLS=https://arb-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY,https://arb1.arbitrum.io/rpc,https://rpc.ankr.com/arbitrum
```

### 3. BASE_RPC_URLS (plural)
```
BASE_RPC_URLS=https://base-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY,https://mainnet.base.org,https://rpc.ankr.com/base
```

## Steps to Fix:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add the three variables above with your actual Alchemy API keys
3. Make sure they're set for "All Environments" (Production, Preview, Development)
4. Redeploy the application

## Alternative: Use Single RPC URLs
If you prefer to keep using single RPC URLs, you can modify the networks.ts to use the singular versions:

```typescript
// In networks.ts, change the envList calls to use singular versions:
rpcs: envList('ETHEREUM_RPC_URL', ['https://eth.llamarpc.com']),
rpcs: envList('ARBITRUM_RPC_URL', ['https://arb1.arbitrum.io/rpc']),
rpcs: envList('BASE_RPC_URL', ['https://mainnet.base.org']),
```

## Test After Fix:
Visit `/api/healthz` to verify all RPC checks pass.
