#!/usr/bin/env node

/**
 * Script to add popular tokens to the database
 * Usage: node scripts/add-tokens.js
 */

const tokens = [
  // Ethereum mainnet
  {
    chainId: 1,
    tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    name: 'Wrapped Ether',
    symbol: 'WETH',
    decimals: 18,
    standard: 'ERC20',
    description: 'Wrapped Ether is an ERC-20 compatible version of ETH',
    website: 'https://weth.io/',
    logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    submittedBy: 'admin@allowanceguard.com'
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
    logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984/logo.png',
    submittedBy: 'admin@allowanceguard.com'
  },
  {
    chainId: 1,
    tokenAddress: '0x514910771af9ca656af840dff83e8264ecf986ca',
    name: 'Chainlink',
    symbol: 'LINK',
    decimals: 18,
    standard: 'ERC20',
    description: 'Chainlink is a decentralized oracle network',
    website: 'https://chain.link/',
    logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771af9ca656af840dff83e8264ecf986ca/logo.png',
    submittedBy: 'admin@allowanceguard.com'
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
    logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2dDAE9/logo.png',
    submittedBy: 'admin@allowanceguard.com'
  },
  {
    chainId: 1,
    tokenAddress: '0xc00e94cb662c3520282e6f5717214004a7f26888',
    name: 'Compound',
    symbol: 'COMP',
    decimals: 18,
    standard: 'ERC20',
    description: 'Compound is an algorithmic, autonomous interest rate protocol',
    website: 'https://compound.finance/',
    logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc00e94cb662c3520282e6f5717214004a7f26888/logo.png',
    submittedBy: 'admin@allowanceguard.com'
  },
  {
    chainId: 1,
    tokenAddress: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
    name: 'Maker',
    symbol: 'MKR',
    decimals: 18,
    standard: 'ERC20',
    description: 'Maker is a utility token, governance token and recapitalization resource of the Maker system',
    website: 'https://makerdao.com/',
    logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2/logo.png',
    submittedBy: 'admin@allowanceguard.com'
  },
  {
    chainId: 1,
    tokenAddress: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
    name: 'Synthetix Network Token',
    symbol: 'SNX',
    decimals: 18,
    standard: 'ERC20',
    description: 'Synthetix is a derivatives liquidity protocol',
    website: 'https://synthetix.io/',
    logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F/logo.png',
    submittedBy: 'admin@allowanceguard.com'
  },
  {
    chainId: 1,
    tokenAddress: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
    name: 'Yearn Finance',
    symbol: 'YFI',
    decimals: 18,
    standard: 'ERC20',
    description: 'Yearn Finance is a yield farming protocol',
    website: 'https://yearn.finance/',
    logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e/logo.png',
    submittedBy: 'admin@allowanceguard.com'
  },
  // Arbitrum
  {
    chainId: 42161,
    tokenAddress: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    name: 'Wrapped Ether (Arbitrum)',
    symbol: 'WETH',
    decimals: 18,
    standard: 'ERC20',
    description: 'Wrapped Ether on Arbitrum',
    website: 'https://arbitrum.io/',
    logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png',
    submittedBy: 'admin@allowanceguard.com'
  },
  {
    chainId: 42161,
    tokenAddress: '0x912ce59144191c1204e64559fe8253a0e49e6548',
    name: 'Arbitrum',
    symbol: 'ARB',
    decimals: 18,
    standard: 'ERC20',
    description: 'Arbitrum is a Layer 2 scaling solution for Ethereum',
    website: 'https://arbitrum.io/',
    logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/assets/0x912CE59144191C1204E64559FE8253a0e49E6548/logo.png',
    submittedBy: 'admin@allowanceguard.com'
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
    logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/assets/0x539bde0d7dbd336b79148aa742883198bbf60342/logo.png',
    submittedBy: 'admin@allowanceguard.com'
  },
  // Base
  {
    chainId: 8453,
    tokenAddress: '0x4200000000000000000000000000000000000006',
    name: 'Wrapped Ether (Base)',
    symbol: 'WETH',
    decimals: 18,
    standard: 'ERC20',
    description: 'Wrapped Ether on Base',
    website: 'https://base.org/',
    logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png',
    submittedBy: 'admin@allowanceguard.com'
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
    logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/assets/0x50c5725949a6f0c72e6c4a641f24049a917db0cb/logo.png',
    submittedBy: 'admin@allowanceguard.com'
  }
];

async function addTokens() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  console.log('🚀 Adding tokens to the database...');
  
  for (const token of tokens) {
    try {
      console.log(`Adding ${token.name} (${token.symbol}) on chain ${token.chainId}...`);
      
      const response = await fetch(`${baseUrl}/api/tokens/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(token),
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ ${token.name} added successfully (ID: ${result.submissionId})`);
      } else {
        console.log(`⚠️  ${token.name} - ${result.error}`);
      }
    } catch (error) {
      console.error(`❌ Error adding ${token.name}:`, error.message);
    }
  }
  
  console.log('🎉 Token addition process completed!');
}

// Run the script
addTokens().catch(console.error);
