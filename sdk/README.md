# AllowanceGuard SDK

Official Node.js SDK for the AllowanceGuard API. Protect your users from risky token approvals with comprehensive wallet security analysis.

## Features

- 🛡️ **Complete API Coverage**: Access all AllowanceGuard endpoints
- 🔄 **Built-in Retry Logic**: Automatic retry with exponential backoff
- 📊 **Risk Assessment**: Comprehensive risk analysis for token approvals
- 📈 **Data Export**: Export allowances to CSV/PDF formats
- 🔍 **Wallet Scanning**: Trigger comprehensive wallet scans
- ⚡ **High Performance**: Optimized for production use
- 🛠️ **TypeScript Support**: Full type definitions included

## Installation

```bash
npm install allowance-guard-sdk
```

## Quick Start

```javascript
const AllowanceGuardSDK = require('allowance-guard-sdk')

// Initialize the SDK
const sdk = new AllowanceGuardSDK({
  apiKey: 'your-api-key-here', // Optional: for higher rate limits
  timeout: 30000,
  retryAttempts: 3
})

// Get token allowances for a wallet
async function checkWallet(walletAddress) {
  try {
    const allowances = await sdk.getAllowances(walletAddress, {
      riskOnly: true,
      pageSize: 50
    })
    
    console.log(`Found ${allowances.data.length} risky allowances`)
    
    // Assess risk for specific approval
    const risk = await sdk.assessRisk(
      walletAddress,
      '0xA0b86a33E6441b8c4C8C0C8C0C8C0C8C0C8C0C8C',
      '0x1234567890123456789012345678901234567890'
    )
    
    console.log(`Risk level: ${risk.riskLevel}`)
    console.log(`Recommendation: ${risk.recommendation}`)
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

checkWallet('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
```

## API Reference

### Constructor

```javascript
const sdk = new AllowanceGuardSDK(options)
```

**Options:**
- `baseURL` (string): API base URL (default: 'https://www.allowanceguard.com/api')
- `apiKey` (string): API key for higher rate limits (optional)
- `timeout` (number): Request timeout in milliseconds (default: 30000)
- `retryAttempts` (number): Number of retry attempts (default: 3)
- `retryDelay` (number): Initial retry delay in milliseconds (default: 1000)

### Methods

#### `getAllowances(walletAddress, options)`

Get token allowances for a wallet address.

**Parameters:**
- `walletAddress` (string): The wallet address to query
- `options` (object): Query options
  - `page` (number): Page number (default: 1)
  - `pageSize` (number): Items per page (default: 25)
  - `riskOnly` (boolean): Show only risky allowances (default: false)
  - `chainId` (number): Filter by chain ID (optional)

**Returns:** Promise resolving to allowances data

```javascript
const allowances = await sdk.getAllowances('0x...', {
  page: 1,
  pageSize: 25,
  riskOnly: true,
  chainId: 1
})
```

#### `assessRisk(walletAddress, tokenAddress, spenderAddress, chainId)`

Get risk assessment for a specific token approval.

**Parameters:**
- `walletAddress` (string): The wallet address
- `tokenAddress` (string): The token contract address
- `spenderAddress` (string): The spender contract address
- `chainId` (number): The blockchain chain ID (default: 1)

**Returns:** Promise resolving to risk assessment data

```javascript
const risk = await sdk.assessRisk(
  '0x...',
  '0xA0b86a33E6441b8c4C8C0C8C0C8C0C8C0C8C0C8C',
  '0x1234567890123456789012345678901234567890',
  1
)
```

#### `scanWallet(walletAddress, chains)`

Initiate a comprehensive wallet scan.

**Parameters:**
- `walletAddress` (string): The wallet address to scan
- `chains` (array): Array of chain IDs to scan (default: [1, 42161, 8453])

**Returns:** Promise resolving to scan job information

```javascript
const scanResult = await sdk.scanWallet('0x...', [1, 42161, 8453])
console.log('Scan job ID:', scanResult.jobId)
```

#### `getScanStatus(jobId)`

Get the status of a scan job.

**Parameters:**
- `jobId` (string): The scan job ID

**Returns:** Promise resolving to job status

```javascript
const status = await sdk.getScanStatus('job-123')
console.log('Status:', status.status)
```

#### `exportAllowances(walletAddress, format, options)`

Export allowances data to CSV or PDF.

**Parameters:**
- `walletAddress` (string): The wallet address
- `format` (string): Export format ('csv' or 'pdf')
- `options` (object): Export options

**Returns:** Promise resolving to Buffer containing exported data

```javascript
const csvData = await sdk.exportAllowances('0x...', 'csv')
fs.writeFileSync('allowances.csv', csvData)
```

#### `getNetworks()`

Get supported networks and roadmap.

**Returns:** Promise resolving to networks data

```javascript
const networks = await sdk.getNetworks()
console.log('Supported networks:', networks.data.supported.length)
```

#### `getChains()`

Get chain information.

**Returns:** Promise resolving to chain data

```javascript
const chains = await sdk.getChains()
console.log('Available chains:', chains.chains.length)
```

#### `getHealth()`

Get API health status.

**Returns:** Promise resolving to health status

```javascript
const health = await sdk.getHealth()
console.log('API Status:', health.status)
```

### Utility Methods

#### `formatAllowance(allowance, decimals)`

Format allowance amount for display.

```javascript
const formatted = sdk.formatAllowance('1000000000000000000', 18)
console.log(formatted) // "1.0 tokens"
```

#### `getRiskLevelInfo(riskLevel)`

Get risk level information.

```javascript
const riskInfo = sdk.getRiskLevelInfo(3)
console.log(riskInfo.label) // "High Risk"
console.log(riskInfo.description) // "High risk, consider revoking"
```

## Examples

### Basic Usage

```javascript
const AllowanceGuardSDK = require('allowance-guard-sdk')

const sdk = new AllowanceGuardSDK()

async function basicExample() {
  // Get allowances
  const allowances = await sdk.getAllowances('0x...')
  console.log('Allowances:', allowances.data.length)
  
  // Assess risk
  const risk = await sdk.assessRisk('0x...', '0x...', '0x...')
  console.log('Risk level:', risk.riskLevel)
}
```

### Advanced Usage

```javascript
async function advancedExample() {
  // Scan wallet
  const scan = await sdk.scanWallet('0x...', [1, 42161, 8453])
  
  // Monitor scan progress
  let completed = false
  while (!completed) {
    await new Promise(resolve => setTimeout(resolve, 10000))
    const status = await sdk.getScanStatus(scan.jobId)
    
    if (status.status === 'completed') {
      completed = true
      console.log('Scan completed!')
    }
  }
  
  // Export data
  const csvData = await sdk.exportAllowances('0x...', 'csv')
  fs.writeFileSync('report.csv', csvData)
}
```

### Error Handling

```javascript
async function errorHandlingExample() {
  try {
    const allowances = await sdk.getAllowances('invalid-address')
  } catch (error) {
    if (error.message.includes('Invalid wallet address')) {
      console.log('Please provide a valid wallet address')
    } else if (error.message.includes('HTTP error')) {
      console.log('API request failed, please try again')
    } else {
      console.log('Unexpected error:', error.message)
    }
  }
}
```

## Rate Limits

- **Public API**: 5 requests per minute per IP
- **API Key**: Higher limits available (contact us)
- **Automatic Retry**: Built-in retry logic with exponential backoff

## Error Handling

The SDK includes comprehensive error handling:

- **Validation Errors**: Invalid addresses or parameters
- **Network Errors**: Connection timeouts, DNS failures
- **API Errors**: HTTP status codes, rate limiting
- **Retry Logic**: Automatic retry for transient failures

## TypeScript Support

```typescript
import AllowanceGuardSDK from 'allowance-guard-sdk'

interface AllowanceData {
  id: string
  tokenAddress: string
  tokenName: string
  spenderAddress: string
  allowance: string
  riskLevel: number
}

const sdk = new AllowanceGuardSDK({
  apiKey: process.env.ALLOWANCE_GUARD_API_KEY
})

const allowances: AllowanceData[] = await sdk.getAllowances('0x...')
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [AllowanceGuard Docs](https://www.allowanceguard.com/docs)
- **Issues**: [GitHub Issues](https://github.com/EazyAccessEA/Allowance-guard/issues)
- **Discord**: [AllowanceGuard Community](https://discord.gg/allowanceguard)

## Changelog

### v1.0.0
- Initial release
- Complete API coverage
- Built-in retry logic
- TypeScript support
- Comprehensive examples
