#!/usr/bin/env node

/**
 * Test Token Search API
 * Verifies that the token search functionality is working correctly
 */

async function testTokenSearch() {
  const baseUrl = process.env.API_URL || 'http://localhost:3000';
  
  console.log('🔍 Testing Token Search API...');
  console.log(`📡 Using API endpoint: ${baseUrl}/api/tokens/search\n`);

  const testCases = [
    {
      name: 'Search for USDC',
      query: '?q=USDC&verified=true',
      expected: 'Should find USD Coin'
    },
    {
      name: 'Search for DeFi tokens',
      query: '?category=DeFi&verified=true',
      expected: 'Should find DeFi protocol tokens'
    },
    {
      name: 'Search on Ethereum',
      query: '?chainId=1&verified=true',
      expected: 'Should find Ethereum tokens'
    },
    {
      name: 'Fuzzy search for "uni"',
      query: '?q=uni&fuzzy=true&verified=true',
      expected: 'Should find Uniswap'
    },
    {
      name: 'Search for stablecoins',
      query: '?category=Stablecoins&verified=true',
      expected: 'Should find stablecoin tokens'
    }
  ];

  let passedTests = 0;
  let totalTests = testCases.length;

  for (const testCase of testCases) {
    try {
      console.log(`🧪 Testing: ${testCase.name}`);
      console.log(`   Query: ${testCase.query}`);
      
      const response = await fetch(`${baseUrl}/api/tokens/search${testCase.query}`);
      const result = await response.json();

      if (result.success && result.data && result.data.length > 0) {
        console.log(`   ✅ PASS - Found ${result.data.length} tokens`);
        console.log(`   📊 Total available: ${result.pagination?.total || 'unknown'}`);
        passedTests++;
      } else {
        console.log(`   ❌ FAIL - No results found`);
        console.log(`   📝 Expected: ${testCase.expected}`);
      }
    } catch (error) {
      console.log(`   ❌ ERROR - ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }

  console.log(`📊 Test Results:`);
  console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests} tests`);
  
  if (passedTests === totalTests) {
    console.log(`\n🎉 All tests passed! Token search is working correctly.`);
  } else {
    console.log(`\n⚠️  Some tests failed. Check the API endpoint and database.`);
  }
}

// Run the tests
testTokenSearch().catch(console.error);
