// Dashboard mock data — realistic token names, addresses, risk levels, chains

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export interface Approval {
  id: string
  token: string
  tokenSymbol: string
  spender: string
  spenderLabel?: string
  amount: string
  isUnlimited: boolean
  risk: RiskLevel
  chain: string
  lastActive: string
  lastActiveDate: Date
  valueUsd: number
}

export const CHAINS = [
  'All',
  'Ethereum',
  'Polygon',
  'Arbitrum',
  'Base',
  'Optimism',
  'Avalanche',
] as const

export type Chain = (typeof CHAINS)[number]

export const CHAIN_COLORS: Record<string, string> = {
  Ethereum: '#627EEA',
  Polygon: '#8247E5',
  Arbitrum: '#28A0F0',
  Base: '#0052FF',
  Optimism: '#FF0420',
  Avalanche: '#E84142',
}

export const RISK_CONFIG: Record<
  RiskLevel,
  { label: string; icon: string; className: string }
> = {
  low: {
    label: 'Low',
    icon: '✓',
    className:
      'bg-semantic-success-50 text-semantic-success-700 border-semantic-success-200 dark:bg-semantic-success-900/30 dark:text-semantic-success-300 dark:border-semantic-success-800',
  },
  medium: {
    label: 'Medium',
    icon: '⚠',
    className:
      'bg-semantic-warning-50 text-semantic-warning-700 border-semantic-warning-200 dark:bg-semantic-warning-900/30 dark:text-semantic-warning-300 dark:border-semantic-warning-800',
  },
  high: {
    label: 'High',
    icon: '▲',
    className:
      'bg-semantic-error-50 text-semantic-error-700 border-semantic-error-200 dark:bg-semantic-error-900/30 dark:text-semantic-error-300 dark:border-semantic-error-800',
  },
  critical: {
    label: 'Critical',
    icon: '✕',
    className:
      'bg-semantic-error-100 text-semantic-error-800 border-semantic-error-300 dark:bg-semantic-error-900/50 dark:text-semantic-error-200 dark:border-semantic-error-700',
  },
}

export const MOCK_APPROVALS: Approval[] = [
  {
    id: '1',
    token: 'USD Coin',
    tokenSymbol: 'USDC',
    spender: '0x7a25...8f3D',
    spenderLabel: 'Uniswap V3',
    amount: 'Unlimited',
    isUnlimited: true,
    risk: 'critical',
    chain: 'Ethereum',
    lastActive: '3 days ago',
    lastActiveDate: new Date(Date.now() - 3 * 86400000),
    valueUsd: 12500,
  },
  {
    id: '2',
    token: 'Wrapped Ether',
    tokenSymbol: 'WETH',
    spender: '0x3fC9...1a2E',
    spenderLabel: 'Aave V3',
    amount: '5,000',
    isUnlimited: false,
    risk: 'low',
    chain: 'Ethereum',
    lastActive: '1 day ago',
    lastActiveDate: new Date(Date.now() - 86400000),
    valueUsd: 9400,
  },
  {
    id: '3',
    token: 'Dai Stablecoin',
    tokenSymbol: 'DAI',
    spender: '0xDef1...C0dE',
    spenderLabel: '0x Exchange',
    amount: 'Unlimited',
    isUnlimited: true,
    risk: 'high',
    chain: 'Polygon',
    lastActive: '2 months ago',
    lastActiveDate: new Date(Date.now() - 60 * 86400000),
    valueUsd: 3200,
  },
  {
    id: '4',
    token: 'Uniswap',
    tokenSymbol: 'UNI',
    spender: '0x8B3a...5e7F',
    amount: '1,200',
    isUnlimited: false,
    risk: 'medium',
    chain: 'Arbitrum',
    lastActive: '2 weeks ago',
    lastActiveDate: new Date(Date.now() - 14 * 86400000),
    valueUsd: 7800,
  },
  {
    id: '5',
    token: 'Chainlink',
    tokenSymbol: 'LINK',
    spender: '0x1234...aBcD',
    amount: 'Unlimited',
    isUnlimited: true,
    risk: 'critical',
    chain: 'Base',
    lastActive: '6 months ago',
    lastActiveDate: new Date(Date.now() - 180 * 86400000),
    valueUsd: 4500,
  },
  {
    id: '6',
    token: 'Aave',
    tokenSymbol: 'AAVE',
    spender: '0x9f2B...4d8A',
    spenderLabel: 'Compound',
    amount: '800',
    isUnlimited: false,
    risk: 'low',
    chain: 'Optimism',
    lastActive: '5 hours ago',
    lastActiveDate: new Date(Date.now() - 5 * 3600000),
    valueUsd: 6200,
  },
  {
    id: '7',
    token: 'Curve DAO',
    tokenSymbol: 'CRV',
    spender: '0xBe4F...7c1E',
    spenderLabel: 'Curve Finance',
    amount: '25,000',
    isUnlimited: false,
    risk: 'medium',
    chain: 'Avalanche',
    lastActive: '1 month ago',
    lastActiveDate: new Date(Date.now() - 30 * 86400000),
    valueUsd: 2100,
  },
  {
    id: '8',
    token: 'Wrapped Bitcoin',
    tokenSymbol: 'WBTC',
    spender: '0x5a6B...2f9C',
    amount: 'Unlimited',
    isUnlimited: true,
    risk: 'high',
    chain: 'Ethereum',
    lastActive: '3 months ago',
    lastActiveDate: new Date(Date.now() - 90 * 86400000),
    valueUsd: 45000,
  },
]

export function getStats(approvals: Approval[]) {
  const total = approvals.length
  const atRisk = approvals.filter(
    (a) => a.risk === 'high' || a.risk === 'critical'
  ).length
  const valueExposed = approvals.reduce((sum, a) => sum + a.valueUsd, 0)
  return { total, atRisk, valueExposed }
}
