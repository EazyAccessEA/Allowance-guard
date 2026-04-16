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
    { level: 2, text: 'Quick Start', id: 'getting-started' },
    { level: 3, text: 'Token Allowances', id: 'what-are-token-allowances' },
    { level: 3, text: 'What This Tool Does', id: 'what-this-tool-does' },
    { level: 3, text: 'Connect Your Wallet', id: 'connect-your-wallet' },
  ],
  'core-concepts': [
    { level: 2, text: 'Core Concepts', id: 'core-concepts' },
    { level: 3, text: 'Revocation Process', id: 'revocation-process' },
    { level: 3, text: 'Data Privacy', id: 'data-privacy' },
    { level: 3, text: 'Non-Custodial Security', id: 'non-custodial' },
  ],
  'usage-guides': [
    { level: 2, text: 'Usage Guides', id: 'usage-guides' },
    { level: 3, text: 'Dashboard', id: 'dashboard' },
    { level: 3, text: 'Single Revoke', id: 'single-revoke' },
    { level: 3, text: 'Batch Revoke', id: 'batch-revoke' },
  ],
  revoking: [
    { level: 2, text: 'Revoking Approvals', id: 'how-to-revoke-approvals' },
    { level: 3, text: 'Using the Dashboard', id: 'using-the-dashboard' },
    { level: 3, text: 'Manual Revocation', id: 'manual-revocation' },
    { level: 3, text: 'Bulk Operations', id: 'bulk-operations' },
  ],
  alerts: [
    { level: 2, text: 'Alerts & Notifications', id: 'alerts-notifications' },
  ],
  monitoring: [
    { level: 2, text: 'Autonomous Monitoring', id: 'autonomous-monitoring' },
    { level: 3, text: 'How It Works', id: 'how-it-works' },
    { level: 3, text: 'Drift Detection', id: 'drift-detection' },
    { level: 3, text: 'Configuration', id: 'configuration' },
  ],
  teams: [
    { level: 2, text: 'Teams & Collaboration', id: 'teams-collaboration' },
    { level: 3, text: 'Team Roles', id: 'team-roles' },
    { level: 3, text: 'Getting Started', id: 'getting-started-with-teams' },
    { level: 3, text: 'Team Features', id: 'team-features' },
  ],
  'advanced-topics': [
    { level: 2, text: 'Architecture', id: 'architecture' },
    { level: 3, text: 'System Layers', id: 'system-layers' },
    { level: 3, text: 'Smart Contracts', id: 'smart-contracts' },
  ],
  api: [
    { level: 2, text: 'API & Settings', id: 'settings-configuration' },
    { level: 3, text: 'API Endpoints', id: 'api-endpoints' },
    { level: 3, text: 'Authentication', id: 'authentication' },
    { level: 3, text: 'Rate Limits', id: 'rate-limits' },
  ],
  'browser-extension': [
    { level: 2, text: 'Browser Extension', id: 'browser-extension' },
  ],
  troubleshooting: [
    { level: 2, text: 'Troubleshooting', id: 'common-issues-solutions' },
    { level: 3, text: 'Connection Issues', id: 'connection-issues' },
    { level: 3, text: 'Scan Problems', id: 'scan-problems' },
    { level: 3, text: 'Revocation Failures', id: 'revocation-failures' },
  ],
  faq: [{ level: 2, text: 'FAQ', id: 'frequently-asked-questions' }],
}
