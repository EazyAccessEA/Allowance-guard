/**
 * Basic Usage Example - AllowanceGuard SDK
 * 
 * This example demonstrates the basic usage of the AllowanceGuard SDK
 * for fetching token allowances and assessing risks.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const AllowanceGuardSDK = require('../allowance-guard-sdk')

async function basicUsageExample() {
  console.log('🛡️ AllowanceGuard SDK - Basic Usage Example\n')

  // Initialize the SDK
  const sdk = new AllowanceGuardSDK({
    // apiKey: 'your-api-key-here', // Optional: for higher rate limits
    timeout: 30000,
    retryAttempts: 3
  })

  // Example wallet address (Vitalik's wallet)
  const walletAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'

  try {
    // 1. Check API health
    console.log('1. Checking API health...')
    const health = await sdk.getHealth()
    console.log('✅ API Status:', health.status)
    console.log('📊 Uptime:', health.uptime)
    console.log()

    // 2. Get supported networks
    console.log('2. Fetching supported networks...')
    const networks = await sdk.getNetworks()
    console.log('🌐 Supported networks:', networks.data.supported.length)
    console.log('📅 Planned networks:', networks.data.planned.length)
    console.log()

    // 3. Get token allowances
    console.log('3. Fetching token allowances...')
    const allowances = await sdk.getAllowances(walletAddress, {
      page: 1,
      pageSize: 5,
      riskOnly: false
    })

    console.log(`📋 Found ${allowances.data.length} allowances:`)
    allowances.data.forEach((allowance, index) => {
      const riskInfo = sdk.getRiskLevelInfo(allowance.riskLevel)
      const formattedAmount = sdk.formatAllowance(allowance.allowance)
      
      console.log(`   ${index + 1}. ${allowance.tokenName} (${allowance.tokenSymbol})`)
      console.log(`      Spender: ${allowance.spenderName}`)
      console.log(`      Amount: ${formattedAmount}`)
      console.log(`      Risk: ${riskInfo.label} (Level ${allowance.riskLevel})`)
      console.log()
    })

    // 4. Assess risk for a specific approval (if we have allowances)
    if (allowances.data.length > 0) {
      const firstAllowance = allowances.data[0]
      console.log('4. Assessing risk for specific approval...')
      
      const riskAssessment = await sdk.assessRisk(
        walletAddress,
        firstAllowance.tokenAddress,
        firstAllowance.spenderAddress,
        firstAllowance.chainId
      )

      console.log('🔍 Risk Assessment:')
      console.log(`   Risk Level: ${riskAssessment.riskLevel}`)
      console.log(`   Risk Score: ${riskAssessment.riskScore}`)
      console.log(`   Recommendation: ${riskAssessment.recommendation}`)
      
      if (riskAssessment.issues && riskAssessment.issues.length > 0) {
        console.log('   Issues Found:')
        riskAssessment.issues.forEach(issue => {
          console.log(`     - ${issue}`)
        })
      }
      console.log()
    }

    // 5. Get only risky allowances
    console.log('5. Fetching only risky allowances...')
    const riskyAllowances = await sdk.getAllowances(walletAddress, {
      riskOnly: true,
      pageSize: 10
    })

    console.log(`⚠️ Found ${riskyAllowances.data.length} risky allowances:`)
    riskyAllowances.data.forEach((allowance, index) => {
      const riskInfo = sdk.getRiskLevelInfo(allowance.riskLevel)
      console.log(`   ${index + 1}. ${allowance.tokenName} - ${riskInfo.label}`)
    })
    console.log()

    console.log('✅ Basic usage example completed successfully!')

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

// Run the example
if (require.main === module) {
  basicUsageExample()
}

module.exports = basicUsageExample
