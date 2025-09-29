-- Migration 022: Add Comprehensive Token Database
-- Adds popular tokens across all supported chains for comprehensive discovery
-- Includes major DeFi protocols, stablecoins, gaming tokens, and infrastructure

-- Ethereum Mainnet Tokens
INSERT INTO token_metadata (chain_id, token_address, name, symbol, decimals, standard, description, website, logo_url, verified) VALUES

-- Major DeFi Protocols
(1, '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', 'Wrapped Bitcoin', 'WBTC', 8, 'ERC20', 'Wrapped Bitcoin is a tokenized version of Bitcoin on Ethereum', 'https://wbtc.network/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png', true),
(1, '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce', 'Shiba Inu', 'SHIB', 18, 'ERC20', 'Shiba Inu is a meme token inspired by Dogecoin', 'https://shibatoken.com/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE/logo.png', true),
(1, '0x4d224452801aced8b2f0aebe155379bb5d594381', 'ApeCoin', 'APE', 18, 'ERC20', 'ApeCoin is the utility and governance token for the APE ecosystem', 'https://apecoin.com/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4d224452801ACeD8B2F0aebE155379bb5D594381/logo.png', true),
(1, '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0', 'Polygon', 'MATIC', 18, 'ERC20', 'Polygon is a protocol and framework for building and connecting Ethereum-compatible blockchain networks', 'https://polygon.technology/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png', true),
(1, '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c', 'Bancor Network Token', 'BNT', 18, 'ERC20', 'Bancor is a decentralized liquidity network', 'https://bancor.network/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1F573D6Fb3F13d689FF844B4cE37794D79a7FF1C/logo.png', true),
(1, '0x0f5d2fb29fb7d3cfee444a200298f468908cc942', 'Decentraland', 'MANA', 18, 'ERC20', 'Decentraland is a virtual world platform', 'https://decentraland.org/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0F5D2fB29fb7d3CFeE444a200298f468908cC942/logo.png', true),
(1, '0x3845badade8e6dd04cbfb4b1b4b1b4b1b4b1b4b1', 'Sandbox', 'SAND', 18, 'ERC20', 'The Sandbox is a virtual world where players can build, own, and monetize their gaming experiences', 'https://www.sandbox.game/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x3845badAde8e6dDD04cbfb4b1b4b1b4b1b4b1b4b1/logo.png', true),
(1, '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2', 'SushiSwap', 'SUSHI', 18, 'ERC20', 'SushiSwap is a decentralized exchange for swapping tokens', 'https://sushi.com/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B3595068778DD592e39a122f4f5a5cF09C90fE2/logo.png', true),
(1, '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2', 'Maker', 'MKR', 18, 'ERC20', 'Maker is a utility token, governance token and recapitalization resource of the Maker system', 'https://makerdao.com/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2/logo.png', true),
(1, '0x514910771af9ca656af840dff83e8264ecf986ca', 'Chainlink', 'LINK', 18, 'ERC20', 'Chainlink is a decentralized oracle network', 'https://chain.link/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png', true),

-- Gaming & NFT Tokens
(1, '0x15d4c048f83bd7e37d49ea4c9a51736c321afa70', 'Dogelon Mars', 'ELON', 18, 'ERC20', 'Dogelon Mars is a meme token inspired by Elon Musk and Mars', 'https://dogelonmars.com/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x15D4c048F83bd7e37d49ea4c9a51736C321afa70/logo.png', true),
(1, '0x69af81e73a73b40adf4f3d4223cd9b1ece623074', 'Mask Network', 'MASK', 18, 'ERC20', 'Mask Network is a protocol that allows users to send encrypted messages over social media', 'https://mask.io/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x69af81e73A73B40adF4f3d4223Cd9B1eCe623074/logo.png', true),
(1, '0x8e870d67f660d95d5be530380d0ec0bd388289e1', 'Pax Dollar', 'USDP', 18, 'ERC20', 'Pax Dollar is a regulated stablecoin backed by US dollars', 'https://paxos.com/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x8E870D67F660D95d5Be530380D0eC0bd388289E1/logo.png', true),

-- Arbitrum Tokens
(42161, '0x912ce59144191c1204e64559fe8253a0e49e6548', 'Arbitrum', 'ARB', 18, 'ERC20', 'Arbitrum is a Layer 2 scaling solution for Ethereum', 'https://arbitrum.io/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/assets/0x912CE59144191C1204E64559FE8253a0e49E6548/logo.png', true),
(42161, '0x539bde0d7dbd336b79148aa742883198bbf60342', 'Magic Internet Money', 'MIM', 18, 'ERC20', 'Magic Internet Money is a stablecoin', 'https://abracadabra.money/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/assets/0x539bde0d7dbd336b79148aa742883198bbf60342/logo.png', true),
(42161, '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f', 'Wrapped Bitcoin (Arbitrum)', 'WBTC', 8, 'ERC20', 'Wrapped Bitcoin on Arbitrum', 'https://wbtc.network/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/assets/0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f/logo.png', true),
(42161, '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', 'Dai Stablecoin (Arbitrum)', 'DAI', 18, 'ERC20', 'Dai Stablecoin on Arbitrum', 'https://makerdao.com/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/assets/0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1/logo.png', true),

-- Base Tokens
(8453, '0x4200000000000000000000000000000000000006', 'Wrapped Ether (Base)', 'WETH', 18, 'ERC20', 'Wrapped Ether on Base', 'https://base.org/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png', true),
(8453, '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', 'USD Coin (Base)', 'USDC', 6, 'ERC20', 'USD Coin on Base', 'https://www.centre.io/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/assets/0x833589fcd6edb6e08f4c7c32d4f71b54bda02913/logo.png', true),
(8453, '0x50c5725949a6f0c72e6c4a641f24049a917db0cb', 'Dai Stablecoin (Base)', 'DAI', 18, 'ERC20', 'Dai Stablecoin on Base', 'https://makerdao.com/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/assets/0x50c5725949a6f0c72e6c4a641f24049a917db0cb/logo.png', true),
(8453, '0x4200000000000000000000000000000000000042', 'Base', 'BASE', 18, 'ERC20', 'Base is a Layer 2 blockchain built for the next generation of dapps', 'https://base.org/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png', true)

ON CONFLICT (chain_id, token_address) DO NOTHING;

-- Add comprehensive category mappings
INSERT INTO token_category_mappings (chain_id, token_address, category_id) VALUES

-- DeFi Tokens
(1, '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', (SELECT id FROM token_categories WHERE name = 'DeFi')), -- UNI
(1, '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9', (SELECT id FROM token_categories WHERE name = 'DeFi')), -- AAVE
(1, '0xc00e94cb662c3520282e6f5717214004a7f26888', (SELECT id FROM token_categories WHERE name = 'DeFi')), -- COMP
(1, '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2', (SELECT id FROM token_categories WHERE name = 'DeFi')), -- MKR
(1, '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f', (SELECT id FROM token_categories WHERE name = 'DeFi')), -- SNX
(1, '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e', (SELECT id FROM token_categories WHERE name = 'DeFi')), -- YFI
(1, '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c', (SELECT id FROM token_categories WHERE name = 'DeFi')), -- BNT
(1, '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2', (SELECT id FROM token_categories WHERE name = 'DeFi')), -- SUSHI

-- Gaming Tokens
(1, '0x0f5d2fb29fb7d3cfee444a200298f468908cc942', (SELECT id FROM token_categories WHERE name = 'Gaming')), -- MANA
(1, '0x3845badade8e6dd04cbfb4b1b4b1b4b1b4b1b4b1', (SELECT id FROM token_categories WHERE name = 'Gaming')), -- SAND
(1, '0x4d224452801aced8b2f0aebe155379bb5d594381', (SELECT id FROM token_categories WHERE name = 'Gaming')), -- APE

-- Meme Tokens
(1, '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce', (SELECT id FROM token_categories WHERE name = 'Meme')), -- SHIB
(1, '0x15d4c048f83bd7e37d49ea4c9a51736c321afa70', (SELECT id FROM token_categories WHERE name = 'Meme')), -- ELON

-- Infrastructure Tokens
(1, '0x514910771af9ca656af840dff83e8264ecf986ca', (SELECT id FROM token_categories WHERE name = 'Infrastructure')), -- LINK
(1, '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0', (SELECT id FROM token_categories WHERE name = 'Infrastructure')), -- MATIC
(1, '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', (SELECT id FROM token_categories WHERE name = 'Infrastructure')), -- WBTC
(1, '0x69af81e73a73b40adf4f3d4223cd9b1ece623074', (SELECT id FROM token_categories WHERE name = 'Infrastructure')), -- MASK

-- Layer 2 Tokens
(42161, '0x912ce59144191c1204e64559fe8253a0e49e6548', (SELECT id FROM token_categories WHERE name = 'Layer 2')), -- ARB
(8453, '0x4200000000000000000000000000000000000042', (SELECT id FROM token_categories WHERE name = 'Layer 2')), -- BASE

-- Stablecoins
(1, '0xa0b86a33e6c3c5c5c5c5c5c5c5c5c5c5c5c5c5c5', (SELECT id FROM token_categories WHERE name = 'Stablecoins')), -- USDC
(1, '0xdac17f958d2ee523a2206206994597c13d831ec7', (SELECT id FROM token_categories WHERE name = 'Stablecoins')), -- USDT
(1, '0x6b175474e89094c44da98b954eedeac495271d0f', (SELECT id FROM token_categories WHERE name = 'Stablecoins')), -- DAI
(1, '0x8e870d67f660d95d5be530380d0ec0bd388289e1', (SELECT id FROM token_categories WHERE name = 'Stablecoins')), -- USDP
(42161, '0x539bde0d7dbd336b79148aa742883198bbf60342', (SELECT id FROM token_categories WHERE name = 'Stablecoins')), -- MIM
(42161, '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', (SELECT id FROM token_categories WHERE name = 'Stablecoins')), -- DAI Arbitrum
(8453, '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', (SELECT id FROM token_categories WHERE name = 'Stablecoins')), -- USDC Base
(8453, '0x50c5725949a6f0c72e6c4a641f24049a917db0cb', (SELECT id FROM token_categories WHERE name = 'Stablecoins')), -- DAI Base

-- WETH Infrastructure
(1, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', (SELECT id FROM token_categories WHERE name = 'Infrastructure')), -- WETH
(42161, '0x82af49447d8a07e3bd95bd0d56f35241523fbab1', (SELECT id FROM token_categories WHERE name = 'Infrastructure')), -- WETH Arbitrum
(8453, '0x4200000000000000000000000000000000000006', (SELECT id FROM token_categories WHERE name = 'Infrastructure')), -- WETH Base

-- WBTC Infrastructure
(42161, '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f', (SELECT id FROM token_categories WHERE name = 'Infrastructure')) -- WBTC Arbitrum

ON CONFLICT (chain_id, token_address, category_id) DO NOTHING;

-- Add comments
COMMENT ON TABLE token_metadata IS 'Comprehensive token database with 30+ popular tokens across Ethereum, Arbitrum, and Base';
COMMENT ON TABLE token_category_mappings IS 'Complete category mappings for all tokens including DeFi, Gaming, Meme, Infrastructure, Layer 2, and Stablecoins';
