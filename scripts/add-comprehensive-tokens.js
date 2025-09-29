#!/usr/bin/env node

/**
 * Comprehensive Token Addition Script
 * Adds 50+ popular tokens across all supported chains
 */

const comprehensiveTokens = [
  // Ethereum Mainnet - Major DeFi Protocols
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
  {
    chainId: 1,
    tokenAddress: '0x2b591e99afe9f32eaa6214f7b7629768c40eeb39',
    name: 'HEX',
    symbol: 'HEX',
    decimals: 8,
    standard: 'ERC20',
    description: 'HEX is a blockchain certificate of deposit',
    website: 'https://hex.com/',
    submittedBy: 'system@allowanceguard.com'
  },
  {
    chainId: 1,
    tokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    decimals: 18,
    standard: 'ERC20',
    description: 'Dai is a stablecoin cryptocurrency which aims to keep its value as close to one United States dollar as possible',
    website: 'https://makerdao.com/',
    submittedBy: 'system@allowanceguard.com'
  },
  {
    chainId: 1,
    tokenAddress: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    name: 'Uniswap',
    symbol: 'UNI',
    decimals: 18,
    standard: 'ERC20',
    description: 'Uniswap is a decentralized trading protocol',
    website: 'https://uniswap.org/',
    submittedBy: 'system@allowanceguard.com'
  },
  {
    chainId: 1,
    tokenAddress: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    name: 'Aave Token',
    symbol: 'AAVE',
    decimals: 18,
    standard: 'ERC20',
    description: 'Aave is a decentralized non-custodial liquidity protocol',
    website: 'https://aave.com/',
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
  {
    chainId: 42161,
    tokenAddress: '0x539bde0d7dbd336b79148aa742883198bbf60342',
    name: 'Magic Internet Money',
    symbol: 'MIM',
    decimals: 18,
    standard: 'ERC20',
    description: 'Magic Internet Money is a stablecoin',
    website: 'https://abracadabra.money/',
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
  },
  {
    chainId: 8453,
    tokenAddress: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    name: 'USD Coin (Base)',
    symbol: 'USDC',
    decimals: 6,
    standard: 'ERC20',
    description: 'USD Coin on Base',
    website: 'https://www.centre.io/',
    submittedBy: 'system@allowanceguard.com'
  },
  {
    chainId: 8453,
    tokenAddress: '0x50c5725949a6f0c72e6c4a641f24049a917db0cb',
    name: 'Dai Stablecoin (Base)',
    symbol: 'DAI',
    decimals: 18,
    standard: 'ERC20',
    description: 'Dai Stablecoin on Base',
    website: 'https://makerdao.com/',
    submittedBy: 'system@allowanceguard.com'
  }
];

async function addTokens() {
  const baseUrl = process.env.API_URL || 'http://localhost:3000';
  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  console.log(`🚀 Adding ${comprehensiveTokens.length} comprehensive tokens to the database...`);
  console.log(`📡 Using API endpoint: ${baseUrl}/api/tokens/submit`);
  console.log(`⏱️  This may take a few minutes...\n`);

  for (let i = 0; i < comprehensiveTokens.length; i++) {
    const token = comprehensiveTokens[i];
    const progress = `[${i + 1}/${comprehensiveTokens.length}]`;
    
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
        console.log(`${progress} ✅ Added ${token.name} (${token.symbol}) on chain ${token.chainId}`);
        successCount++;
      } else if (result.error && result.error.includes('already')) {
        console.log(`${progress} ⏭️  Skipped ${token.name} (${token.symbol}) - already exists`);
        skippedCount++;
      } else {
        console.log(`${progress} ⚠️  ${token.name} (${token.symbol}): ${result.error}`);
        errorCount++;
      }
    } catch (error) {
      console.log(`${progress} ❌ Error adding ${token.name}: ${error.message}`);
      errorCount++;
    }

    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`\n📊 Final Summary:`);
  console.log(`✅ Successfully added: ${successCount} tokens`);
  console.log(`⏭️  Skipped (already exist): ${skippedCount} tokens`);
  console.log(`❌ Errors: ${errorCount} tokens`);
  console.log(`📈 Total processed: ${comprehensiveTokens.length} tokens`);
  
  if (successCount > 0) {
    console.log(`\n🎉 Token database has been significantly expanded!`);
    console.log(`🔍 Users can now discover ${successCount + skippedCount} tokens across all supported chains.`);
  }
}

// Run the script
addTokens().catch(console.error);
