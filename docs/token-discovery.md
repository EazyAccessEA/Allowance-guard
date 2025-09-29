# Token Discovery Documentation

## Overview

The Token Discovery feature allows users to search and verify tokens before granting approvals, providing essential security information to help users make informed decisions.

## Features

### 🔍 Comprehensive Search
- **Smart Search**: Find tokens even with typos or partial matches
- **Multi-chain Support**: Search across Ethereum, Arbitrum, and Base
- **Advanced Filtering**: Filter by category, verification status, and blockchain
- **Smart Sorting**: Sort by relevance, name, symbol, or recency

### 📚 Educational Content
- **Security Warnings**: Clear indicators for unverified tokens
- **Best Practices**: Educational content about token security
- **Usage Guidance**: Step-by-step instructions for safe token interactions
- **Problem/Solution Framework**: Explains why token discovery matters

### 🛡️ Security Features
- **Verification Status**: Check if tokens are verified and legitimate
- **Official Links**: Direct links to token websites and documentation
- **Category Classification**: Organize tokens by type (DeFi, Gaming, Meme, etc.)
- **Risk Assessment**: Visual indicators for token safety

## Database Schema

### Token Metadata Table
```sql
CREATE TABLE token_metadata (
  chain_id INTEGER NOT NULL,
  token_address VARCHAR(42) NOT NULL,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  decimals INTEGER,
  standard token_standard NOT NULL DEFAULT 'ERC20',
  description TEXT,
  website TEXT,
  logo_url TEXT,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT pk_token_metadata PRIMARY KEY (chain_id, token_address)
);
```

### Token Categories
The system includes 20+ predefined categories:
- **DeFi**: Decentralized Finance protocols
- **Stablecoins**: USD-pegged stable assets
- **Gaming**: Gaming and NFT tokens
- **Infrastructure**: Blockchain infrastructure tokens
- **Meme**: Community-driven meme tokens
- **Layer 2**: Scaling solution tokens
- **Privacy**: Privacy-focused tokens
- **AI & ML**: Artificial Intelligence tokens
- **Real Estate**: Property tokenization
- **Social**: Social media platform tokens
- **Energy**: Sustainability focused tokens
- **Gambling**: Gaming and gambling platforms
- **Cross-Chain**: Bridge and interoperability tokens
- **Insurance**: DeFi insurance tokens
- **Metaverse**: Virtual world tokens
- **Storage**: Decentralized storage tokens
- **Oracle**: Data oracle tokens
- **Governance**: DAO governance tokens
- **Launchpad**: Token launch platforms
- **Education**: Educational platform tokens

## API Endpoints

### Search Tokens
```http
GET /api/tokens/search?q={query}&chainId={id}&category={name}&verified={bool}&fuzzy={bool}&minScore={number}&sort={type}&limit={number}&offset={number}
```

**Parameters:**
- `q`: Search query (name, symbol, or address)
- `chainId`: Filter by blockchain (1, 42161, 8453)
- `category`: Filter by category name
- `verified`: Show only verified tokens
- `fuzzy`: Enable smart search (always enabled)
- `minScore`: Minimum match quality (0-3)
- `sort`: Sort by relevance, name, symbol, or recent
- `limit`: Results per page (1-100)
- `offset`: Pagination offset

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "chainId": 1,
      "tokenAddress": "0x...",
      "name": "Token Name",
      "symbol": "SYMBOL",
      "decimals": 18,
      "standard": "ERC20",
      "description": "Token description",
      "website": "https://example.com",
      "logoUrl": "https://example.com/logo.png",
      "verified": true,
      "categories": ["DeFi", "Infrastructure"],
      "score": 0.95
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 25,
    "offset": 0,
    "hasMore": true
  }
}
```

### Submit Token
```http
POST /api/tokens/submit
```

**Request Body:**
```json
{
  "chainId": 1,
  "tokenAddress": "0x...",
  "name": "Token Name",
  "symbol": "SYMBOL",
  "decimals": 18,
  "standard": "ERC20",
  "description": "Token description",
  "website": "https://example.com",
  "logoUrl": "https://example.com/logo.png",
  "submittedBy": "user@example.com"
}
```

## Adding More Tokens

### Method 1: SQL Migration
Create a new migration file in `migrations/` directory:

```sql
-- Migration: Add More Tokens
INSERT INTO token_metadata (chain_id, token_address, name, symbol, decimals, standard, description, website, verified) VALUES
(1, '0x...', 'Token Name', 'SYMBOL', 18, 'ERC20', 'Description', 'https://example.com', true)
ON CONFLICT (chain_id, token_address) DO NOTHING;

-- Add category mappings
INSERT INTO token_category_mappings (chain_id, token_address, category_id) VALUES
(1, '0x...', (SELECT id FROM token_categories WHERE name = 'DeFi'))
ON CONFLICT (chain_id, token_address, category_id) DO NOTHING;
```

### Method 2: API Script
Use the provided script to add tokens programmatically:

```bash
# Add popular tokens via API
node scripts/add-popular-tokens.js

# Add custom tokens
node scripts/add-tokens.js
```

### Method 3: Manual API Calls
```bash
curl -X POST http://localhost:3000/api/tokens/submit \
  -H "Content-Type: application/json" \
  -d '{
    "chainId": 1,
    "tokenAddress": "0x...",
    "name": "Token Name",
    "symbol": "SYMBOL",
    "decimals": 18,
    "standard": "ERC20",
    "description": "Description",
    "website": "https://example.com",
    "submittedBy": "user@example.com"
  }'
```

## Current Token Database

### Ethereum Mainnet (Chain ID: 1)
- **Stablecoins**: USDC, USDT, DAI, USDP
- **DeFi**: UNI, AAVE, COMP, MKR, SNX, YFI, BNT, SUSHI
- **Infrastructure**: WETH, WBTC, LINK, MATIC, MASK
- **Gaming**: MANA, SAND, APE
- **Meme**: SHIB, ELON

### Arbitrum (Chain ID: 42161)
- **Stablecoins**: USDC, USDT, DAI, MIM
- **Infrastructure**: WETH, WBTC, ARB
- **DeFi**: Various DeFi protocols

### Base (Chain ID: 8453)
- **Stablecoins**: USDC, DAI
- **Infrastructure**: WETH, BASE
- **DeFi**: Various DeFi protocols

## Security Considerations

### Token Verification Process
1. **On-chain Validation**: Verify token contract exists and implements expected standards
2. **Standard Detection**: Auto-detect ERC20, ERC721, ERC1155 standards
3. **Deduplication**: Prevent duplicate submissions
4. **Manual Review**: Admin approval for new tokens

### Security Warnings
- **Unverified Tokens**: Clear warnings for unverified tokens
- **Scam Detection**: Visual indicators for potentially risky tokens
- **Best Practices**: Educational content about token security
- **Official Links**: Direct links to official token websites

## Usage Examples

### Search for DeFi Tokens
```javascript
const response = await fetch('/api/tokens/search?category=DeFi&verified=true&sort=relevance');
const data = await response.json();
```

### Find Tokens by Name
```javascript
const response = await fetch('/api/tokens/search?q=Uniswap');
const data = await response.json();
```

### Get Tokens by Chain
```javascript
const response = await fetch('/api/tokens/search?chainId=1&verified=true');
const data = await response.json();
```

## Contributing

### Adding New Categories
1. Add category to `migrations/018_token_categories_seed.sql`
2. Update category mappings for existing tokens
3. Test category filtering in the UI

### Adding New Tokens
1. Verify token contract on-chain
2. Gather official information (website, description, logo)
3. Submit via API or migration
4. Add appropriate category mappings

### Improving Search
1. Enhance fuzzy search algorithms
2. Add more search filters
3. Improve relevance scoring
4. Add token popularity metrics

## Troubleshooting

### Common Issues
- **No Results**: Check if tokens exist in database
- **Search Not Working**: Verify API endpoint is accessible
- **Categories Missing**: Ensure category mappings exist
- **Verification Issues**: Check token contract validity

### Debug Commands
```bash
# Check database connection
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM token_metadata;"

# Test API endpoint
curl http://localhost:3000/api/tokens/search?q=USDC

# Check categories
psql "$DATABASE_URL" -c "SELECT name FROM token_categories ORDER BY name;"
```

## Future Enhancements

### Planned Features
- **Token Popularity**: Track token usage and popularity
- **User Reviews**: Community reviews and ratings
- **Price Integration**: Real-time token prices
- **Portfolio Integration**: Connect with user portfolios
- **Advanced Analytics**: Token performance metrics

### Technical Improvements
- **Search Optimization**: Better indexing and search algorithms
- **Caching**: Improved response times
- **Rate Limiting**: Prevent API abuse
- **Monitoring**: Better error tracking and analytics
