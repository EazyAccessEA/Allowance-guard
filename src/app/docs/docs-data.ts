import {
  FileText,
  Rocket,
  Shield,
  Wrench,
  Settings,
  Puzzle,
  HelpCircle,
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
  { id: 'getting-started', title: 'Getting Started', icon: Rocket },
  { id: 'core-concepts', title: 'Core Concepts', icon: Shield },
  { id: 'usage-guides', title: 'Usage Guides', icon: Wrench },
  { id: 'advanced-topics', title: 'Advanced Topics', icon: Settings },
  { id: 'browser-extension', title: 'Browser Extension', icon: Puzzle },
  { id: 'troubleshooting', title: 'Troubleshooting', icon: HelpCircle },
]

export const supportedNetworks = [
  { name: 'Ethereum', chainId: 1, status: 'Full Support' },
  { name: 'Arbitrum', chainId: 42161, status: 'Full Support' },
  { name: 'Base', chainId: 8453, status: 'Full Support' },
]

export const alertFeatures = [
  { type: 'Email Alerts', description: 'Daily digests via Microsoft SMTP', features: ['Risk-only filtering', 'HTML templates', 'Customizable preferences'] },
  { type: 'Slack Integration', description: 'Real-time webhook notifications', features: ['Team collaboration', 'Custom webhooks', 'Rich formatting'] },
  { type: 'Autonomous Monitoring', description: 'Scheduled wallet rescans with drift detection', features: ['Configurable frequency', 'Instant drift alerts', 'Duplicate prevention'] },
  { type: 'Job Processing', description: 'Automated background scanning', features: ['5-minute intervals', 'Queue management', 'Status tracking'] },
]

export const apiEndpoints = [
  { endpoint: '/api/scan', method: 'POST', description: 'Queue wallet scan job' },
  { endpoint: '/api/allowances', method: 'GET', description: 'Get paginated allowances' },
  { endpoint: '/api/jobs/[id]', method: 'GET', description: 'Check job status' },
  { endpoint: '/api/alerts/subscribe', method: 'POST', description: 'Subscribe to alerts' },
  { endpoint: '/api/alerts/daily', method: 'GET', description: 'Trigger daily digest' },
  { endpoint: '/api/jobs/process', method: 'GET', description: 'Process queued jobs' },
  { endpoint: '/api/monitor', method: 'GET/POST', description: 'Manage wallet monitoring settings' },
  { endpoint: '/api/monitor/run', method: 'GET', description: 'Trigger due monitor scans' },
  { endpoint: '/api/auth/magic/request', method: 'POST', description: 'Request magic link for sign in' },
  { endpoint: '/api/auth/magic/verify', method: 'GET', description: 'Verify magic link and create session' },
  { endpoint: '/api/auth/me', method: 'GET', description: 'Get current user information' },
  { endpoint: '/api/auth/signout', method: 'POST', description: 'Sign out and clear session' },
  { endpoint: '/api/teams', method: 'GET/POST', description: 'List teams or create new team' },
  { endpoint: '/api/teams/wallets', method: 'GET/POST', description: 'List team wallets or add wallet to team' },
  { endpoint: '/api/teams/invite', method: 'POST', description: 'Send team invitation email' },
  { endpoint: '/api/invites/accept', method: 'POST', description: 'Accept team invitation' },
]

export const faqItems = [
  { question: 'How does AllowanceGuard work?', answer: 'AllowanceGuard scans your wallet across Ethereum, Arbitrum, and Base networks using direct RPC calls. It identifies ERC-20 and ERC-721 approvals, calculates risk scores, and provides one-click revocation through your connected wallet.' },
  { question: 'What makes an approval risky?', answer: 'Unlimited approvals (+50 points) and stale approvals (+10 points) are the main risk factors. The system also considers token value and spender reputation to provide comprehensive risk assessment.' },
  { question: 'How do I revoke approvals?', answer: "Click the 'Revoke' button next to any approval in your dashboard. This will construct a transaction to set the allowance to zero, which you'll need to sign and pay gas for." },
  { question: 'Are my private keys safe?', answer: 'Yes. AllowanceGuard never sees your private keys. All transactions are signed locally by your wallet, and we only read public blockchain data.' },
  { question: 'How often should I check my approvals?', answer: 'We recommend setting up autonomous monitoring for continuous protection. The system can automatically rescan your wallet and notify you of new risky approvals as they\'re detected.' },
  { question: 'What if a scan fails?', answer: 'Scans are processed in the background using a job queue system. If a scan fails, you\'ll see an error message and can retry. The system automatically retries failed jobs.' },
  { question: 'How do teams work in AllowanceGuard?', answer: 'Teams allow you to collaborate on wallet security with role-based access control. Create a team, add wallet addresses, and invite members with different permission levels (owner, admin, editor, viewer).' },
]

export const headingsMap: Record<string, Heading[]> = {
  overview: [
    { level: 2, text: 'Overview', id: 'overview' },
    { level: 3, text: 'What is AllowanceGuard?', id: 'what-is-allowanceguard' },
    { level: 3, text: 'Key Features', id: 'key-features' },
    { level: 3, text: 'How It Works', id: 'how-it-works' },
  ],
  'getting-started': [
    { level: 2, text: 'Getting Started', id: 'getting-started' },
    { level: 3, text: 'Connect Your Wallet', id: 'connect-your-wallet' },
    { level: 3, text: 'Scan Your Approvals', id: 'scan-your-approvals' },
    { level: 3, text: 'Review Risk Scores', id: 'review-risk-scores' },
    { level: 3, text: 'Revoke Risky Approvals', id: 'revoke-risky-approvals' },
  ],
  networks: [{ level: 2, text: 'Supported Networks', id: 'supported-networks' }],
  'risk-scoring': [{ level: 2, text: 'Risk Scoring System', id: 'risk-scoring-system' }],
  alerts: [{ level: 2, text: 'Alerts & Notifications', id: 'alerts-notifications' }],
  monitoring: [
    { level: 2, text: 'Autonomous Monitoring', id: 'autonomous-monitoring' },
    { level: 3, text: 'How It Works', id: 'how-it-works' },
    { level: 3, text: 'Drift Detection', id: 'drift-detection' },
    { level: 3, text: 'Configuration', id: 'configuration' },
  ],
  teams: [
    { level: 2, text: 'Teams & Collaboration', id: 'teams-collaboration' },
    { level: 3, text: 'Team Roles', id: 'team-roles' },
    { level: 3, text: 'Getting Started with Teams', id: 'getting-started-with-teams' },
    { level: 3, text: 'Team Features', id: 'team-features' },
  ],
  revoking: [
    { level: 2, text: 'How to Revoke Approvals', id: 'how-to-revoke-approvals' },
    { level: 3, text: 'Using the Dashboard', id: 'using-the-dashboard' },
    { level: 3, text: 'Manual Revocation', id: 'manual-revocation' },
    { level: 3, text: 'Bulk Operations', id: 'bulk-operations' },
  ],
  api: [
    { level: 2, text: 'Settings & Configuration', id: 'settings-configuration' },
    { level: 3, text: 'API Endpoints', id: 'api-endpoints' },
    { level: 3, text: 'Authentication', id: 'authentication' },
    { level: 3, text: 'Rate Limits', id: 'rate-limits' },
  ],
  troubleshooting: [
    { level: 2, text: 'Common Issues & Solutions', id: 'common-issues-solutions' },
    { level: 3, text: 'Connection Issues', id: 'connection-issues' },
    { level: 3, text: 'Scan Problems', id: 'scan-problems' },
    { level: 3, text: 'Revocation Failures', id: 'revocation-failures' },
  ],
  faq: [{ level: 2, text: 'Frequently Asked Questions', id: 'frequently-asked-questions' }],
}
