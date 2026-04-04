/**
 * Supported chain definitions for parameterised E2E tests.
 * Each chain has an id, slug (used in API calls), and display name.
 */
export interface ChainDef {
  id: number
  slug: string
  name: string
}

export const SUPPORTED_CHAINS: ChainDef[] = [
  { id: 1, slug: 'ethereum', name: 'Ethereum' },
  { id: 42161, slug: 'arbitrum', name: 'Arbitrum' },
  { id: 8453, slug: 'base', name: 'Base' },
  { id: 137, slug: 'polygon', name: 'Polygon' },
  { id: 10, slug: 'optimism', name: 'Optimism' },
  { id: 43114, slug: 'avalanche', name: 'Avalanche' },
  { id: 56, slug: 'bsc', name: 'BNB Smart Chain' },
  { id: 250, slug: 'fantom', name: 'Fantom' },
  { id: 324, slug: 'zksync', name: 'zkSync Era' },
  { id: 1101, slug: 'polygon-zkevm', name: 'Polygon zkEVM' },
]

/** Test wallet address used across all chain tests */
export const TEST_WALLET = '0x1111111111111111111111111111111111111111'
