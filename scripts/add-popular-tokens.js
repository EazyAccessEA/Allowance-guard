#!/usr/bin/env node

/**
 * Script to add popular tokens to the database via API
 * This script adds comprehensive token data for better discovery
 */

const tokens = [
  // Ethereum Mainnet - Major DeFi
  {
    chainId: 1,
    tokenAddress: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    decimals: 8,
    standard: 'ERC20',
    description: 'Wrapped Bitcoin is a tokenized version of Bitcoin on Ethereum',
    website: 'https://wbtc.network/',
    submittedBy: 'system@allowanceguard.com'
  },
  {
    chainId: 1,
    tokenAddress: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
    name: 'Shiba Inu',
    symbol: 'SHIB',
    decimals: 18,
    standard: 'ERC20',
    description: 'Shiba Inu is a meme token inspired by Dogecoin',
    website: 'https://shibatoken.com/',
    submittedBy: 'system@allowanceguard.com'
  },
  {
    chainId: 1,
    tokenAddress: '0x4d224452801aced8b2f0aebe155379bb5d594381',
    name: 'ApeCoin',
    symbol: 'APE',
    decimals: 18,
    standard: 'ERC20',
    description: 'ApeCoin is the utility and governance token for the APE ecosystem',
    website: 'https://apecoin.com/',
    submittedBy: 'system@allowanceguard.com'
  },
  {
    chainId: 1,
    tokenAddress: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
    name: 'Polygon',
    symbol: 'MATIC',
    decimals: 18,
    standard: 'ERC20',
    description: 'Polygon is a protocol and framework for building and connecting Ethereum-compatible blockchain networks',
    website: 'https://polygon.technology/',
    submittedBy: 'system@allowanceguard.com'
  },
  {
    chainId: 1,
    tokenAddress: '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
    name: 'Bancor Network Token',
    symbol: 'BNT',
    decimals: 18,
    standard: 'ERC20',
    description: 'Bancor is a decentralized liquidity network',
    website: 'https://bancor.network/',
    submittedBy: 'system@allowanceguard.com'
  },
  {
    chainId: 1,
    tokenAddress: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
    name: 'Decentraland',
    symbol: 'MANA',
    decimals: 18,
    standard: 'ERC20',
    description: 'Decentraland is a virtual world platform',
    website: 'https://decentraland.org/',
    submittedBy: 'system@allowanceguard.com'
  },
  {
    chainId: 1,
    tokenAddress: '0x3845badade8e6dd04cbfb4b1b4b1b4b1b4b1b4b1',
    name: 'Sandbox',
    symbol: 'SAND',
    decimals: 18,
    standard: 'ERC20',
    description: 'The Sandbox is a virtual world where players can build, own, and monetize their gaming experiences',
    website: 'https://www.sandbox.game/',
    submittedBy: 'system@allowanceguard.com'
  },
  {
    chainId: 1,
    tokenAddress: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
    name: 'SushiSwap',
    symbol: 'SUSHI',
    decimals: 18,
    standard: 'ERC20',
    description: 'SushiSwap is a decentralized exchange for swapping tokens',
    website: 'https://sushi.com/',
    submittedBy: 'system@allowanceguard.com'
  },
  {
    chainId: 1,
    tokenAddress: '0x15d4c048f83bd7e37d49ea4c9a51736c321afa70',
    name: 'Dogelon Mars',
    symbol: 'ELON',
    decimals: 18,
    standard: 'ERC20',
    description: 'Dogelon Mars is a meme token inspired by Elon Musk and Mars',
    website: 'https://dogelonmars.com/',
    submittedBy: 'system@allowanceguard.com'
  },
  {
    chainId: 1,
    tokenAddress: '0x69af81e73a73b40adf4f3d4223cd9b1ece623074',
    name: 'Mask Network',
    symbol: 'MASK',
    decimals: 18,
    standard: 'ERC20',
    description: 'Mask Network is a protocol that allows users to send encrypted messages over social media',
    website: 'https://mask.io/',
    submittedBy: 'system@allowanceguard.com'
  },
  {
    chainId: 1,
    tokenAddress: '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
    name: 'Pax Dollar',
    symbol: 'USDP',
    decimals: 18,
    standard: 'ERC20',
    description: 'Pax Dollar is a regulated stablecoin backed by US dollars',
    website: 'https://paxos.com/',
    submittedBy: 'system@allowanceguard.com'
  },

  // Arbitrum Tokens
  {
    chainId: 42161,
    tokenAddress: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
    name: 'Wrapped Bitcoin (Arbitrum)',
    symbol: 'WBTC',
    decimals: 8,
    standard: 'ERC20',
    description: 'Wrapped Bitcoin on Arbitrum',
    website: 'https://wbtc.network/',
    submittedBy: 'system@allowanceguard.com'
  },
  {
    chainId: 42161,
    tokenAddress: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
    name: 'Dai Stablecoin (Arbitrum)',
    symbol: 'DAI',
    decimals: 18,
    standard: 'ERC20',
    description: 'Dai Stablecoin on Arbitrum',
    website: 'https://makerdao.com/',
    submittedBy: 'system@allowanceguard.com'
  },

  // Base Tokens
  {
    chainId: 8453,
    tokenAddress: '0x4200000000000000000000000000000000000042',
    name: 'Base',
    symbol: 'BASE',
    decimals: 18,
    standard: 'ERC20',
    description: 'Base is a Layer 2 blockchain built for the next generation of dapps',
    website: 'https://base.org/',
    submittedBy: 'system@allowanceguard.com'
  }
];

async function addTokens() {
  const baseUrl = process.env.API_URL || 'http://localhost:3000';
  let successCount = 0;
  let errorCount = 0;

  console.log(`🚀 Adding ${tokens.length} popular tokens to the database...`);
  console.log(`📡 Using API endpoint: ${baseUrl}/api/tokens/submit`);

  for (const token of tokens) {
    try {
      const response = await fetch(`${baseUrl}/api/tokens/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(token),
      });

      const result = await response.json();

      if (result.success) {
        console.log(`✅ Added ${token.name} (${token.symbol}) on chain ${token.chainId}`);
        successCount++;
      } else {
        console.log(`⚠️  ${token.name} (${token.symbol}): ${result.error}`);
        errorCount++;
      }
    } catch (error) {
      console.log(`❌ Error adding ${token.name}: ${error.message}`);
      errorCount++;
    }

    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n📊 Summary:`);
  console.log(`✅ Successfully added: ${successCount} tokens`);
  console.log(`❌ Errors: ${errorCount} tokens`);
  console.log(`📈 Total processed: ${tokens.length} tokens`);
}

// Run the script
addTokens().catch(console.error);
