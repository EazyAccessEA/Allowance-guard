#!/usr/bin/env node

/**
 * Test script for ops monitoring endpoints
 * Usage: node scripts/test-ops-monitoring.js [base-url] [ops-token]
 */

const baseUrl = process.argv[2] || 'http://localhost:3000'
const opsToken = process.argv[3] || process.env.OPS_DASH_TOKEN || 'test-token'

async function testEndpoint(name, url, expectedStatus = 200) {
  console.log(`\n🧪 Testing ${name}...`)
  console.log(`   URL: ${url}`)
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Ops-Monitoring-Test/1.0'
      }
    })
    
    const data = await response.json().catch(() => ({ error: 'Failed to parse JSON' }))
    
    if (response.status === expectedStatus) {
      console.log(`   ✅ Status: ${response.status} (expected ${expectedStatus})`)
      console.log(`   📊 Response:`, JSON.stringify(data, null, 2).substring(0, 200) + '...')
    } else {
      console.log(`   ❌ Status: ${response.status} (expected ${expectedStatus})`)
      console.log(`   📊 Response:`, JSON.stringify(data, null, 2))
    }
    
    return { success: response.status === expectedStatus, data }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function runTests() {
  console.log('🚀 Starting Ops Monitoring Tests')
  console.log(`📍 Base URL: ${baseUrl}`)
  console.log(`🔑 OPS Token: ${opsToken.substring(0, 8)}...`)
  
  const tests = [
    {
      name: 'Health Check',
      url: `${baseUrl}/api/healthz`,
      expectedStatus: 200
    },
    {
      name: 'Health Alert (should work without token)',
      url: `${baseUrl}/api/alerts/health`,
      expectedStatus: 200
    },
    {
      name: 'Daily Alert (should work without token)',
      url: `${baseUrl}/api/alerts/daily`,
      expectedStatus: 200
    },
    {
      name: 'Ops Metrics (without token - should fail)',
      url: `${baseUrl}/api/ops/metrics`,
      expectedStatus: 403
    },
    {
      name: 'Ops Metrics (with token - should work)',
      url: `${baseUrl}/api/ops/metrics?token=${opsToken}`,
      expectedStatus: 200
    }
  ]
  
  let passed = 0
  let total = tests.length
  
  for (const test of tests) {
    const result = await testEndpoint(test.name, test.url, test.expectedStatus)
    if (result.success) passed++
  }
  
  console.log(`\n📊 Test Results: ${passed}/${total} passed`)
  
  if (passed === total) {
    console.log('🎉 All tests passed! Ops monitoring is ready for production.')
  } else {
    console.log('⚠️  Some tests failed. Check the configuration.')
    process.exit(1)
  }
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test runner failed:', error)
  process.exit(1)
})
