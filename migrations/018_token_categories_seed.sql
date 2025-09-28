-- Migration 018: Seed Default Token Categories
-- Adds default categories for token organization and discovery

-- Insert default token categories
INSERT INTO token_categories (name, description, icon, color) VALUES
('stablecoins', 'USD-pegged stable assets', '💵', 'green'),
('defi',        'Decentralized finance protocols', '🏦', 'blue'),
('nft',         'Non-fungible token collections', '🖼️', 'purple'),
('governance',  'DAO and governance tokens', '🗳️', 'orange'),
('meme',        'Community-driven meme tokens', '🐕', 'pink'),
('layer1',      'Base layer blockchain tokens', '⛓️', 'gray'),
('layer2',      'Scaling solution tokens', '⚡', 'cyan')
ON CONFLICT (name) DO NOTHING;

-- Add comments
COMMENT ON TABLE token_categories IS 'Pre-seeded with 7 core categories for token organization';