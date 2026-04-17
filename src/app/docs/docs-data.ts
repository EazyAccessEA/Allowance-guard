import {
  FileText, Rocket, Shield, Wrench, Settings, Puzzle, HelpCircle,
  Bell, Activity, Users, RotateCcw, Code2, MessageCircle,
  type LucideIcon,
} from 'lucide-react'

export interface MenuItem {
  id: string
  title: string
  icon: LucideIcon
}

export interface Heading {
  level: number
  text: string
  id: string
}

export const menuItems: MenuItem[] = [
  { id: 'overview', title: 'Overview', icon: FileText },
  { id: 'getting-started', title: 'Quick Start', icon: Rocket },
  { id: 'core-concepts', title: 'Core Concepts', icon: Shield },
  { id: 'usage-guides', title: 'Usage Guides', icon: Wrench },
  { id: 'revoking', title: 'Revoking Approvals', icon: RotateCcw },
  { id: 'alerts', title: 'Alerts', icon: Bell },
  { id: 'monitoring', title: 'Monitoring', icon: Activity },
  { id: 'teams', title: 'Teams', icon: Users },
  { id: 'advanced-topics', title: 'Architecture', icon: Settings },
  { id: 'api', title: 'API & Settings', icon: Code2 },
  { id: 'browser-extension', title: 'Extension', icon: Puzzle },
  { id: 'troubleshooting', title: 'Troubleshooting', icon: HelpCircle },
  { id: 'faq', title: 'FAQ', icon: MessageCircle },
]

export const supportedNetworks = [
  { name: 'Ethereum', chainId: 1, status: 'Full Support' },
  { name: 'Arbitrum', chainId: 42161, status: 'Full Support' },
  { name: 'Base', chainId: 8453, status: 'Full Support' },
  { name: 'Polygon', chainId: 137, status: 'Full Support' },
  { name: 'Optimism', chainId: 10, status: 'Full Support' },
  { name: 'Avalanche', chainId: 43114, status: 'Full Support' },
  { name: 'BNB Chain', chainId: 56, status: 'Full Support' },
  { name: 'Fantom', chainId: 250, status: 'Full Support' },
  { name: 'zkSync Era', chainId: 324, status: 'Full Support' },
  { name: 'Polygon zkEVM', chainId: 1101, status: 'Full Support' },
  { name: 'Mantle', chainId: 5000, status: 'Full Support' },
  { name: 'Gnosis', chainId: 100, status: 'Full Support' },
  { name: 'Linea', chainId: 59144, status: 'Full Support' },
  { name: 'Scroll', chainId: 534352, status: 'Full Support' },
  { name: 'Celo', chainId: 42220, status: 'Full Support' },
]

export const alertFeatures = [
  { type: 'Email Alerts', description: 'Daily digests filtered to risky approvals only. Configurable preferences per wallet.', features: ['Risk-only filtering', 'HTML templates', 'Per-wallet preferences'] },
  { type: 'Slack Integration', description: 'Webhook notifications to your team channels when risk conditions are met.', features: ['Team channels', 'Custom webhooks', 'Rich formatting'] },
  { type: 'Autonomous Monitoring', description: 'Scheduled rescans that detect approval drift and alert immediately.', features: ['Configurable frequency', 'Drift detection', 'Duplicate prevention'] },
  { type: 'Job Processing', description: 'Background scan queue with 5-minute intervals and automatic retries.', features: ['Queue management', 'Status tracking', 'Auto-retry'] },
]

// Public B2B API surface. All endpoints require Authorization: Bearer ag_live_*
// (or ag_pub_* for read-only browser use). Full reference: /docs/api-reference.
export const apiEndpoints = [
  { endpoint: '/api/v1/health', method: 'GET', description: 'Service health and dependency status. Public, no auth.' },
  { endpoint: '/api/v1/chains', method: 'GET', description: 'List the 27 supported chains.' },
  { endpoint: '/api/v1/allowances', method: 'GET', description: 'Paginated token approvals for a wallet.' },
  { endpoint: '/api/v1/risk-score', method: 'GET', description: 'Aggregated wallet risk score.' },
  { endpoint: '/api/v1/portfolio-risk', method: 'GET', description: 'Cross-chain portfolio risk with per-chain breakdown.' },
  { endpoint: '/api/v1/risk-check', method: 'POST', description: 'Pre-signing assessment of a proposed approval.' },
  { endpoint: '/api/v1/scan', method: 'POST', description: 'Trigger a wallet scan. Returns scanId + statusUrl.' },
  { endpoint: '/api/v1/scan/{id}', method: 'GET', description: 'Poll scan job status. Ownership-enforced.' },
  { endpoint: '/api/v1/simulate', method: 'POST', description: 'Time-machine: simulate revoking approvals.' },
  { endpoint: '/api/v1/batch-savings', method: 'GET', description: 'Gas savings estimate for batched revocation on EIP-5792 wallets.' },
]

export const faqItems = [
  { question: 'How does AllowanceGuard work?', answer: 'Scans your wallet across 27 chains via direct RPC calls. Identifies ERC-20 and ERC-721 approvals, scores each for risk, and lets you revoke with one click — all from your own wallet.' },
  { question: 'What makes an approval risky?', answer: 'Unlimited amounts (+50 points), stale approvals (+10 points), unverified contracts, and known malicious addresses. Token value and spender reputation also factor into the score.' },
  { question: 'How do I revoke?', answer: 'Click Revoke next to any approval. We construct the transaction, you sign it in your wallet and pay the gas fee. The approval is set to zero on-chain.' },
  { question: 'Are my private keys safe?', answer: 'Yes. We never access your keys. All transactions sign locally in your wallet. We read public blockchain data only.' },
  { question: 'How often should I scan?', answer: 'After interacting with new protocols, or set up monitoring (Pro) to scan automatically and alert you when new risky approvals appear.' },
  { question: 'What if a scan fails?', answer: 'Scans run in a background queue with automatic retries. If it still fails, retry manually or contact support.' },
  { question: 'How do teams work?', answer: 'Create a team, add wallets, invite members with role-based access (owner, admin, editor, viewer). Shared dashboard for DAOs, treasuries, and organisations.' },
]

export const headingsMap: Record<string, Heading[]> = {
  overview: [
    { level: 2, text: 'Start here', id: 'overview' },
    { level: 3, text: 'What it does', id: 'what-it-does' },
    { level: 3, text: 'How it works', id: 'how-it-works' },
  ],
  'getting-started': [
    { level: 2, text: 'Token allowances', id: 'getting-started' },
    { level: 3, text: 'What this tool does', id: 'what-this-tool-does' },
    { level: 3, text: 'Connect your wallet', id: 'connect-your-wallet' },
  ],
  'core-concepts': [
    { level: 2, text: 'Core concepts', id: 'core-concepts' },
    { level: 3, text: 'Revocation', id: 'revocation-process' },
    { level: 3, text: 'Data privacy', id: 'data-privacy' },
    { level: 3, text: 'Non-custodial', id: 'non-custodial' },
  ],
  'usage-guides': [
    { level: 2, text: 'How-to guides', id: 'usage-guides' },
    { level: 3, text: 'Read your dashboard', id: 'dashboard' },
    { level: 3, text: 'Revoke one', id: 'single-revoke' },
    { level: 3, text: 'Revoke many', id: 'batch-revoke' },
    { level: 3, text: 'Find tokens', id: 'token-discovery' },
  ],
  revoking: [
    { level: 2, text: 'Revoking', id: 'how-to-revoke-approvals' },
    { level: 3, text: 'Using the dashboard', id: 'using-the-dashboard' },
    { level: 3, text: 'Bulk operations', id: 'bulk-operations' },
    { level: 3, text: 'Before you revoke', id: 'important-notes' },
  ],
  alerts: [
    { level: 2, text: 'Alerts', id: 'alerts-notifications' },
  ],
  monitoring: [
    { level: 2, text: 'Continuous monitoring', id: 'autonomous-monitoring' },
    { level: 3, text: 'How it works', id: 'how-it-works' },
    { level: 3, text: 'What counts as drift', id: 'drift-detection' },
    { level: 3, text: 'Configuration', id: 'configuration' },
  ],
  teams: [
    { level: 2, text: 'Teams', id: 'teams-collaboration' },
    { level: 3, text: 'Four roles', id: 'team-roles' },
    { level: 3, text: 'Getting started', id: 'getting-started-with-teams' },
    { level: 3, text: 'Team features', id: 'team-features' },
  ],
  'advanced-topics': [
    { level: 2, text: 'Architecture', id: 'architecture' },
    { level: 3, text: 'Four layers', id: 'system-layers' },
    { level: 3, text: 'Smart contracts', id: 'smart-contracts' },
    { level: 3, text: 'API v1', id: 'api-v1' },
  ],
  api: [
    { level: 2, text: 'Settings', id: 'settings-configuration' },
    { level: 3, text: 'Email alerts', id: 'email-alerts' },
    { level: 3, text: 'Risk policy', id: 'risk-policy' },
    { level: 3, text: 'Slack', id: 'slack' },
    { level: 3, text: 'Public share links', id: 'public-share-links' },
    { level: 3, text: 'API keys', id: 'authentication' },
  ],
  'browser-extension': [
    { level: 2, text: 'Browser extension', id: 'browser-extension' },
    { level: 3, text: 'Where it runs', id: 'availability' },
    { level: 3, text: 'What it does', id: 'what-it-does' },
    { level: 3, text: 'How to install', id: 'how-to-install' },
  ],
  troubleshooting: [
    { level: 2, text: 'Troubleshooting', id: 'common-issues-solutions' },
    { level: 3, text: 'Common issues', id: 'common-issues' },
    { level: 3, text: 'Glossary', id: 'glossary' },
    { level: 3, text: 'Getting help', id: 'getting-help' },
  ],
  faq: [{ level: 2, text: 'FAQ', id: 'frequently-asked-questions' }],
}
