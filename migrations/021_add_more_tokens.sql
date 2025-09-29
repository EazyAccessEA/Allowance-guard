-- Migration 021: Add More Popular Tokens
-- Adds popular tokens across all supported chains for better discovery

-- Ethereum mainnet popular tokens
INSERT INTO token_metadata (chain_id, token_address, name, symbol, decimals, standard, description, website, logo_url, verified) VALUES
-- Wrapped Ether
(1, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', 'Wrapped Ether', 'WETH', 18, 'ERC20', 'Wrapped Ether is an ERC-20 compatible version of ETH', 'https://weth.io/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png', true),

-- Uniswap
(1, '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', 'Uniswap', 'UNI', 18, 'ERC20', 'Uniswap is a decentralized trading protocol', 'https://uniswap.org/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984/logo.png', true),

-- Chainlink
(1, '0x514910771af9ca656af840dff83e8264ecf986ca', 'Chainlink', 'LINK', 18, 'ERC20', 'Chainlink is a decentralized oracle network', 'https://chain.link/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771af9ca656af840dff83e8264ecf986ca/logo.png', true),

-- Aave
(1, '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9', 'Aave Token', 'AAVE', 18, 'ERC20', 'Aave is a decentralized non-custodial liquidity protocol', 'https://aave.com/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2dDAE9/logo.png', true),

-- Compound
(1, '0xc00e94cb662c3520282e6f5717214004a7f26888', 'Compound', 'COMP', 18, 'ERC20', 'Compound is an algorithmic, autonomous interest rate protocol', 'https://compound.finance/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc00e94cb662c3520282e6f5717214004a7f26888/logo.png', true),

-- Maker
(1, '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2', 'Maker', 'MKR', 18, 'ERC20', 'Maker is a utility token, governance token and recapitalization resource of the Maker system', 'https://makerdao.com/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2/logo.png', true),

-- Synthetix
(1, '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f', 'Synthetix Network Token', 'SNX', 18, 'ERC20', 'Synthetix is a derivatives liquidity protocol', 'https://synthetix.io/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F/logo.png', true),

-- Yearn Finance
(1, '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e', 'Yearn Finance', 'YFI', 18, 'ERC20', 'Yearn Finance is a yield farming protocol', 'https://yearn.finance/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e/logo.png', true),

-- Arbitrum popular tokens
(42161, '0x82af49447d8a07e3bd95bd0d56f35241523fbab1', 'Wrapped Ether (Arbitrum)', 'WETH', 18, 'ERC20', 'Wrapped Ether on Arbitrum', 'https://arbitrum.io/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png', true),

(42161, '0x912ce59144191c1204e64559fe8253a0e49e6548', 'Arbitrum', 'ARB', 18, 'ERC20', 'Arbitrum is a Layer 2 scaling solution for Ethereum', 'https://arbitrum.io/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/assets/0x912CE59144191C1204E64559FE8253a0e49E6548/logo.png', true),

(42161, '0x539bde0d7dbd336b79148aa742883198bbf60342', 'Magic Internet Money', 'MIM', 18, 'ERC20', 'Magic Internet Money is a stablecoin', 'https://abracadabra.money/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/assets/0x539bde0d7dbd336b79148aa742883198bbf60342/logo.png', true),

-- Base popular tokens
(8453, '0x4200000000000000000000000000000000000006', 'Wrapped Ether (Base)', 'WETH', 18, 'ERC20', 'Wrapped Ether on Base', 'https://base.org/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png', true),

(8453, '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', 'USD Coin (Base)', 'USDC', 6, 'ERC20', 'USD Coin on Base', 'https://www.centre.io/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/assets/0x833589fcd6edb6e08f4c7c32d4f71b54bda02913/logo.png', true),

(8453, '0x50c5725949a6f0c72e6c4a641f24049a917db0cb', 'Dai Stablecoin (Base)', 'DAI', 18, 'ERC20', 'Dai Stablecoin on Base', 'https://makerdao.com/', 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/assets/0x50c5725949a6f0c72e6c4a641f24049a917db0cb/logo.png', true)

ON CONFLICT (chain_id, token_address) DO NOTHING;

-- Add category mappings for the new tokens
INSERT INTO token_category_mappings (chain_id, token_address, category_id) VALUES
-- WETH mappings (Infrastructure)
(1, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', (SELECT id FROM token_categories WHERE name = 'Infrastructure')),
(42161, '0x82af49447d8a07e3bd95bd0d56f35241523fbab1', (SELECT id FROM token_categories WHERE name = 'Infrastructure')),
(8453, '0x4200000000000000000000000000000000000006', (SELECT id FROM token_categories WHERE name = 'Infrastructure')),

-- DeFi tokens
(1, '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', (SELECT id FROM token_categories WHERE name = 'DeFi')), -- UNI
(1, '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9', (SELECT id FROM token_categories WHERE name = 'DeFi')), -- AAVE
(1, '0xc00e94cb662c3520282e6f5717214004a7f26888', (SELECT id FROM token_categories WHERE name = 'DeFi')), -- COMP
(1, '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2', (SELECT id FROM token_categories WHERE name = 'DeFi')), -- MKR
(1, '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f', (SELECT id FROM token_categories WHERE name = 'DeFi')), -- SNX
(1, '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e', (SELECT id FROM token_categories WHERE name = 'DeFi')), -- YFI

-- Infrastructure tokens
(1, '0x514910771af9ca656af840dff83e8264ecf986ca', (SELECT id FROM token_categories WHERE name = 'Infrastructure')), -- LINK
(42161, '0x912ce59144191c1204e64559fe8253a0e49e6548', (SELECT id FROM token_categories WHERE name = 'Layer 2')), -- ARB

-- Stablecoins
(42161, '0x539bde0d7dbd336b79148aa742883198bbf60342', (SELECT id FROM token_categories WHERE name = 'Stablecoins')), -- MIM
(8453, '0x50c5725949a6f0c72e6c4a641f24049a917db0cb', (SELECT id FROM token_categories WHERE name = 'Stablecoins')) -- DAI Base

ON CONFLICT (chain_id, token_address, category_id) DO NOTHING;

-- Add comments
COMMENT ON TABLE token_metadata IS 'Now includes popular tokens across Ethereum, Arbitrum, and Base chains';
