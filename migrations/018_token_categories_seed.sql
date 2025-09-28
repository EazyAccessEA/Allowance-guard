-- Migration 018: Seed Default Token Categories
-- Adds default categories for token organization and discovery

-- Insert default token categories
INSERT INTO token_categories (name, description, icon, color) VALUES
('DeFi', 'Decentralized Finance tokens including DEX, lending, and yield farming protocols', '🦄', '#ff6b6b'),
('Stablecoins', 'Stable value tokens pegged to fiat currencies or other assets', '💰', '#4ecdc4'),
('Gaming', 'Gaming and NFT tokens for play-to-earn and gaming ecosystems', '🎮', '#45b7d1'),
('Infrastructure', 'Infrastructure tokens for blockchain networks, oracles, and developer tools', '⚙️', '#96ceb4'),
('Meme', 'Community-driven meme tokens and viral cryptocurrencies', '🐕', '#feca57'),
('Layer 2', 'Layer 2 scaling solution tokens and bridge tokens', '🌉', '#ff9ff3'),
('Privacy', 'Privacy-focused tokens and anonymous cryptocurrencies', '🔒', '#54a0ff'),
('AI & ML', 'Artificial Intelligence and Machine Learning related tokens', '🤖', '#5f27cd'),
('Real Estate', 'Real estate and property tokenization tokens', '🏠', '#00d2d3'),
('Social', 'Social media and community platform tokens', '👥', '#ff9f43'),
('Energy', 'Energy and sustainability focused tokens', '⚡', '#10ac84'),
('Gambling', 'Gaming and gambling platform tokens', '🎲', '#ee5a24'),
('Cross-Chain', 'Cross-chain bridge and interoperability tokens', '🔗', '#0984e3'),
('Insurance', 'DeFi insurance and risk management tokens', '🛡️', '#6c5ce7'),
('Metaverse', 'Virtual world and metaverse platform tokens', '🌐', '#a29bfe'),
('Storage', 'Decentralized storage and data management tokens', '💾', '#fd79a8'),
('Oracle', 'Data oracle and price feed tokens', '🔮', '#fdcb6e'),
('Governance', 'DAO and governance tokens for protocol management', '🗳️', '#e17055'),
('Launchpad', 'Token launch and fundraising platform tokens', '🚀', '#74b9ff'),
('Education', 'Educational and learning platform tokens', '📚', '#00b894')
ON CONFLICT (name) DO NOTHING;

-- Add some example verified tokens for major chains
-- Ethereum mainnet examples
INSERT INTO token_metadata (chain_id, token_address, name, symbol, decimals, standard, description, website, verified) VALUES
(1, '0xa0b86a33e6c3c5c5c5c5c5c5c5c5c5c5c5c5c5c5', 'USD Coin', 'USDC', 6, 'ERC20', 'USD Coin (USDC) is a fully-backed U.S. dollar stablecoin', 'https://www.centre.io/', true),
(1, '0xdac17f958d2ee523a2206206994597c13d831ec7', 'Tether USD', 'USDT', 6, 'ERC20', 'Tether gives you the joint benefits of open blockchain technology and traditional currency', 'https://tether.to/', true),
(1, '0x6b175474e89094c44da98b954eedeac495271d0f', 'Dai Stablecoin', 'DAI', 18, 'ERC20', 'Dai is a stablecoin cryptocurrency which aims to keep its value as close to one United States dollar as possible', 'https://makerdao.com/', true)
ON CONFLICT (chain_id, token_address) DO NOTHING;

-- Arbitrum examples
INSERT INTO token_metadata (chain_id, token_address, name, symbol, decimals, standard, description, website, verified) VALUES
(42161, '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', 'USD Coin (Arbitrum)', 'USDC', 6, 'ERC20', 'USD Coin bridged to Arbitrum', 'https://www.centre.io/', true),
(42161, '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', 'Tether USD (Arbitrum)', 'USDT', 6, 'ERC20', 'Tether USD bridged to Arbitrum', 'https://tether.to/', true)
ON CONFLICT (chain_id, token_address) DO NOTHING;

-- Base examples
INSERT INTO token_metadata (chain_id, token_address, name, symbol, decimals, standard, description, website, verified) VALUES
(8453, '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', 'USD Coin (Base)', 'USDC', 6, 'ERC20', 'USD Coin on Base', 'https://www.centre.io/', true)
ON CONFLICT (chain_id, token_address) DO NOTHING;

-- Add category mappings for the example tokens
INSERT INTO token_category_mappings (chain_id, token_address, category_id) VALUES
-- USDC mappings
(1, '0xa0b86a33e6c3c5c5c5c5c5c5c5c5c5c5c5c5c5c5', (SELECT id FROM token_categories WHERE name = 'Stablecoins')),
(42161, '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', (SELECT id FROM token_categories WHERE name = 'Stablecoins')),
(8453, '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', (SELECT id FROM token_categories WHERE name = 'Stablecoins')),
-- USDT mappings
(1, '0xdac17f958d2ee523a2206206994597c13d831ec7', (SELECT id FROM token_categories WHERE name = 'Stablecoins')),
(42161, '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', (SELECT id FROM token_categories WHERE name = 'Stablecoins')),
-- DAI mappings
(1, '0x6b175474e89094c44da98b954eedeac495271d0f', (SELECT id FROM token_categories WHERE name = 'Stablecoins')),
(1, '0x6b175474e89094c44da98b954eedeac495271d0f', (SELECT id FROM token_categories WHERE name = 'DeFi'))
ON CONFLICT (chain_id, token_address, category_id) DO NOTHING;

-- Add comments
COMMENT ON TABLE token_categories IS 'Pre-seeded with 20 default categories for token organization';
COMMENT ON TABLE token_metadata IS 'Includes example verified tokens for major chains (Ethereum, Arbitrum, Base)';
COMMENT ON TABLE token_category_mappings IS 'Example mappings between tokens and categories for testing';
