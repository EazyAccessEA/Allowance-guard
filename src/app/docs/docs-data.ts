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
]

export const alertFeatures = [
  { type: 'Email Alerts', description: 'Daily digests with risk-only filtering and customisable preferences.', features: ['Risk-only filtering', 'HTML templates', 'Customisable preferences'] },
  { type: 'Slack Integration', description: 'Real-time webhook notifications for your team channels.', features: ['Team collaboration', 'Custom webhooks', 'Rich formatting'] },
  { type: 'Autonomous Monitoring', description: 'Scheduled wallet rescans with instant drift detection.', features: ['Configurable frequency', 'Instant drift alerts', 'Duplicate prevention'] },
  { type: 'Job Processing', description: 'Automated background scanning on 5-minute intervals.', features: ['Queue management', 'Status tracking', 'Auto-retry'] },
]

export const apiEndpoints = [
  { endpoint: '/api/scan', method: 'POST', description: 'Queue wallet scan job' },
  { endpoint: '/api/allowances', method: 'GET', description: 'Get paginated allowances' },
  { endpoint: '/api/jobs/[id]', method: 'GET', description: 'Check job status' },
  { endpoint: '/api/alerts/subscribe', method: 'POST', description: 'Subscribe to alerts' },
  { endpoint: '/api/alerts/daily', method: 'GET', description: 'Trigger daily digest' },
  { endpoint: '/api/jobs/process', method: 'GET', description: 'Process queued jobs' },
  { endpoint: '/api/monitor', method: 'GET/POST', description: 'Manage monitoring settings' },
  { endpoint: '/api/monitor/run', method: 'GET', description: 'Trigger due monitor scans' },
  { endpoint: '/api/auth/magic/request', method: 'POST', description: 'Request magic link' },
  { endpoint: '/api/auth/magic/verify', method: 'GET', description: 'Verify magic link' },
  { endpoint: '/api/auth/me', method: 'GET', description: 'Current user info' },
  { endpoint: '/api/auth/signout', method: 'POST', description: 'Sign out' },
  { endpoint: '/api/teams', method: 'GET/POST', description: 'List or create teams' },
  { endpoint: '/api/teams/wallets', method: 'GET/POST', description: 'Manage team wallets' },
  { endpoint: '/api/teams/invite', method: 'POST', description: 'Send team invitation' },
  { endpoint: '/api/invites/accept', method: 'POST', description: 'Accept invitation' },
]

export const faqItems = [
  { question: 'How does AllowanceGuard work?', answer: 'AllowanceGuard scans your wallet across 10 supported networks using direct RPC calls. It identifies ERC-20 and ERC-721 approvals, calculates risk scores, and provides one-click revocation through your connected wallet.' },
  { question: 'What makes an approval risky?', answer: 'Unlimited approvals (+50 points) and stale approvals (+10 points) are the main risk factors. The system also considers token value and spender reputation for comprehensive risk assessment.' },
  { question: 'How do I revoke approvals?', answer: "Click the 'Revoke' button next to any approval in your dashboard. This constructs a transaction to set the allowance to zero, which you sign and pay gas for." },
  { question: 'Are my private keys safe?', answer: 'Yes. AllowanceGuard never accesses your private keys. All transactions are signed locally by your wallet. We only read public blockchain data.' },
  { question: 'How often should I check my approvals?', answer: 'Set up autonomous monitoring for continuous protection. The system automatically rescans your wallet and notifies you of new risky approvals as they appear.' },
  { question: 'What if a scan fails?', answer: 'Scans are processed via a background job queue. If a scan fails, you can retry it. The system also automatically retries failed jobs.' },
  { question: 'How do teams work?', answer: 'Teams enable collaborative wallet security with role-based access control. Create a team, add wallets, and invite members with different permission levels (owner, admin, editor, viewer).' },
]

export const headingsMap: Record<string, Heading[]> = {
  overview: [
    { level: 2, text: 'Overview', id: 'overview' },
    { level: 3, text: 'What is AllowanceGuard?', id: 'what-is-allowanceguard' },
    { level: 3, text: 'Key Features', id: 'key-features' },
    { level: 3, text: 'How It Works', id: 'how-it-works' },
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
