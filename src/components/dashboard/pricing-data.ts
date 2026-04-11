// Pricing tier data — matches CLAUDE.md plan definitions

export interface PricingTier {
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  badge?: string
  buttonVariant: 'ghost' | 'primary' | 'secondary'
  buttonLabel: string
  features: string[]
  highlighted?: boolean
}

export const TIERS: PricingTier[] = [
  {
    name: 'Free',
    description: 'Core security for every wallet.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    buttonVariant: 'ghost',
    buttonLabel: 'Get Started',
    features: [
      'Scan up to 3 wallets',
      'Single-chain view',
      'Manual revocation',
      'Basic risk labels',
      'Open-source core',
    ],
  },
  {
    name: 'Pro',
    description: 'For power users who don\'t sleep on security.',
    monthlyPrice: 9.99,
    yearlyPrice: 79,
    badge: 'Most Popular',
    buttonVariant: 'primary',
    buttonLabel: 'Upgrade to Pro',
    highlighted: true,
    features: [
      'Unlimited wallets',
      'Multi-chain portfolio (27 chains)',
      'Continuous monitoring',
      'Email & Telegram alerts',
      'Batch revocation',
      'Gas savings display',
      'Historical risk timeline',
      'Export reports (PDF/CSV)',
    ],
  },
  {
    name: 'Sentinel',
    description: 'For teams guarding treasuries.',
    monthlyPrice: 49.99,
    yearlyPrice: 499,
    buttonVariant: 'secondary',
    buttonLabel: 'Contact Sales',
    features: [
      'Everything in Pro',
      'Monitor up to 50 wallets',
      'Automated revocation rules',
      'Team dashboard (RBAC)',
      'Compliance audit logs',
      'Webhook integrations',
      'Priority support',
      'Custom SLA available',
    ],
  },
]

export interface ComparisonFeature {
  name: string
  tooltip?: string
  free: boolean | string
  pro: boolean | string
  sentinel: boolean | string
}

export const COMPARISON_FEATURES: ComparisonFeature[] = [
  { name: 'Wallets', free: '3', pro: 'Unlimited', sentinel: '50 monitored' },
  { name: 'Chains', free: '1', pro: '10', sentinel: '10' },
  { name: 'Manual revocation', free: true, pro: true, sentinel: true },
  { name: 'Batch revocation', free: false, pro: true, sentinel: true },
  { name: 'Risk scoring', free: 'Basic', pro: 'Advanced', sentinel: 'Advanced' },
  {
    name: 'Continuous monitoring',
    tooltip: 'Automatic background scans of your wallets',
    free: false,
    pro: true,
    sentinel: true,
  },
  { name: 'Email alerts', free: false, pro: true, sentinel: true },
  { name: 'Telegram alerts', free: false, pro: true, sentinel: true },
  {
    name: 'Time Machine',
    tooltip: 'Simulate what your risk looks like after revoking',
    free: false,
    pro: true,
    sentinel: true,
  },
  { name: 'Gas savings display', free: false, pro: true, sentinel: true },
  { name: 'Historical timeline', free: false, pro: true, sentinel: true },
  { name: 'Export (PDF/CSV)', free: false, pro: true, sentinel: true },
  { name: 'Automated rules', free: false, pro: false, sentinel: true },
  { name: 'Team dashboard', free: false, pro: false, sentinel: true },
  { name: 'Compliance audit logs', free: false, pro: false, sentinel: true },
  { name: 'Webhook integrations', free: false, pro: false, sentinel: true },
  { name: 'Priority support', free: false, pro: false, sentinel: true },
  { name: 'API access', free: '100/day', pro: '10K/day', sentinel: 'Custom' },
]
