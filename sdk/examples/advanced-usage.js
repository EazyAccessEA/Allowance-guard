/**
 * Advanced Usage Example - AllowanceGuard SDK
 * 
 * This example demonstrates advanced features of the AllowanceGuard SDK
 * including wallet scanning, data export, and batch operations.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const AllowanceGuardSDK = require('../allowance-guard-sdk')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path')

async function advancedUsageExample() {
  console.log('🛡️ AllowanceGuard SDK - Advanced Usage Example\n')

  // Initialize the SDK with API key for higher rate limits
  const sdk = new AllowanceGuardSDK({
    // apiKey: process.env.ALLOWANCE_GUARD_API_KEY, // Set this in your environment
    timeout: 60000, // Longer timeout for scanning operations
    retryAttempts: 5
  })

  const walletAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'

  try {
    // 1. Initiate wallet scan
    console.log('1. Initiating comprehensive wallet scan...')
    const scanResult = await sdk.scanWallet(walletAddress, [1, 42161, 8453]) // Ethereum, Arbitrum, Base
    
    console.log('📊 Scan initiated:')
    console.log(`   Job ID: ${scanResult.jobId}`)
    console.log(`   Status: ${scanResult.status}`)
    console.log(`   Chains: ${scanResult.chains.join(', ')}`)
    console.log()

    // 2. Monitor scan progress
    console.log('2. Monitoring scan progress...')
    let scanComplete = false
    let attempts = 0
    const maxAttempts = 30 // 5 minutes max

    while (!scanComplete && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 10000)) // Wait 10 seconds
      
      try {
        const status = await sdk.getScanStatus(scanResult.jobId)
        console.log(`   Attempt ${attempts + 1}: ${status.status}`)
        
        if (status.status === 'completed') {
          scanComplete = true
          console.log('✅ Scan completed successfully!')
        } else if (status.status === 'failed') {
          throw new Error('Scan failed: ' + (status.error || 'Unknown error'))
        }
      } catch (error) {
        console.log(`   Attempt ${attempts + 1}: Error checking status - ${error.message}`)
      }
      
      attempts++
    }

    if (!scanComplete) {
      console.log('⏰ Scan is taking longer than expected. Continuing with existing data...')
    }
    console.log()

    // 3. Get comprehensive allowance data
    console.log('3. Fetching comprehensive allowance data...')
    const allAllowances = await sdk.getAllowances(walletAddress, {
      page: 1,
      pageSize: 100 // Get more data
    })

    console.log(`📋 Total allowances found: ${allAllowances.totalCount}`)
    console.log(`📄 Current page: ${allAllowances.page}`)
    console.log(`📊 Has more pages: ${allAllowances.hasMore}`)
    console.log()

    // 4. Analyze risk distribution
    console.log('4. Analyzing risk distribution...')
    const riskDistribution = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    }

    allAllowances.data.forEach(allowance => {
      switch (allowance.riskLevel) {
        case 1:
          riskDistribution.low++
          break
        case 2:
          riskDistribution.medium++
          break
        case 3:
          riskDistribution.high++
          break
        case 4:
          riskDistribution.critical++
          break
      }
    })

    console.log('📊 Risk Distribution:')
    console.log(`   Low Risk: ${riskDistribution.low}`)
    console.log(`   Medium Risk: ${riskDistribution.medium}`)
    console.log(`   High Risk: ${riskDistribution.high}`)
    console.log(`   Critical Risk: ${riskDistribution.critical}`)
    console.log()

    // 5. Export data to CSV
    console.log('5. Exporting data to CSV...')
    try {
      const csvData = await sdk.exportAllowances(walletAddress, 'csv', {
        includeRiskOnly: false,
        format: 'detailed'
      })

      const outputPath = path.join(__dirname, `allowances_${walletAddress.slice(0, 8)}.csv`)
      fs.writeFileSync(outputPath, csvData)
      console.log(`✅ CSV exported to: ${outputPath}`)
    } catch (error) {
      console.log(`⚠️ CSV export failed: ${error.message}`)
    }
    console.log()

    // 6. Batch risk assessment for multiple approvals
    console.log('6. Performing batch risk assessments...')
    const batchSize = 5
    const allowancesToAssess = allAllowances.data.slice(0, batchSize)
    
    const batchResults = await Promise.allSettled(
      allowancesToAssess.map(allowance => 
        sdk.assessRisk(
          walletAddress,
          allowance.tokenAddress,
          allowance.spenderAddress,
          allowance.chainId
        )
      )
    )

    console.log(`🔍 Batch assessment results (${batchResults.length} items):`)
    batchResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const riskInfo = sdk.getRiskLevelInfo(result.value.riskLevel)
        console.log(`   ${index + 1}. ${allowancesToAssess[index].tokenName} - ${riskInfo.label}`)
      } else {
        console.log(`   ${index + 1}. Failed - ${result.reason.message}`)
      }
    })
    console.log()

    // 7. Generate security report
    console.log('7. Generating security report...')
    const criticalAllowances = allAllowances.data.filter(a => a.riskLevel >= 3)
    const totalValue = allAllowances.data.reduce((sum, allowance) => {
      const amount = parseFloat(allowance.allowance)
      return sum + (isNaN(amount) ? 0 : amount)
    }, 0)

    console.log('📊 Security Report Summary:')
    console.log(`   Total Allowances: ${allAllowances.data.length}`)
    console.log(`   High/Critical Risk: ${criticalAllowances.length}`)
    console.log(`   Risk Percentage: ${((criticalAllowances.length / allAllowances.data.length) * 100).toFixed(1)}%`)
    console.log(`   Total Exposure: ${sdk.formatAllowance(totalValue.toString())}`)
    console.log()

    if (criticalAllowances.length > 0) {
      console.log('⚠️ Critical Risk Allowances:')
      criticalAllowances.forEach((allowance, index) => {
        const riskInfo = sdk.getRiskLevelInfo(allowance.riskLevel)
        console.log(`   ${index + 1}. ${allowance.tokenName} to ${allowance.spenderName}`)
        console.log(`      Amount: ${sdk.formatAllowance(allowance.allowance)}`)
        console.log(`      Risk: ${riskInfo.label}`)
      })
    }

    console.log('\n✅ Advanced usage example completed successfully!')

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

// Run the example
if (require.main === module) {
  advancedUsageExample()
}

module.exports = advancedUsageExample
