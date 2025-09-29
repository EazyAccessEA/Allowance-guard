#!/bin/bash

# Test script to add a single token via API
# Usage: ./scripts/test-add-token.sh

echo "🚀 Testing token addition via API..."

curl -X POST http://localhost:3000/api/tokens/submit \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 1,
    "tokenAddress": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    "name": "Wrapped Ether",
    "symbol": "WETH",
    "decimals": 18,
    "standard": "ERC20",
    "description": "Wrapped Ether is an ERC-20 compatible version of ETH",
    "website": "https://weth.io/",
    "logoUrl": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
    "submittedBy": "admin@allowanceguard.com"
  }' | jq .

echo "✅ Test completed!"
