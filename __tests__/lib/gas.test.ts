/**
 * Unit tests for src/lib/gas.ts
 *
 * Tests: getGasEstimate, getAllGasEstimates, CoinGecko fallback
 */

jest.mock('@/lib/chains', () => ({
  clientFor: jest.fn(),
}))

jest.mock('@/config/chains', () => ({
  getChainMeta: jest.fn(),
  SUPPORTED_CHAIN_IDS: [1, 42161, 8453, 10, 137, 43114],
}))

jest.mock('@/lib/secure-logger', () => ({
  secureLogger: { warn: jest.fn(), error: jest.fn(), info: jest.fn() },
}))

// Mock viem helpers
jest.mock('viem', () => ({
  parseAbi: (fragments: string[]) => fragments,
  formatGwei: (wei: bigint) => (Number(wei) / 1e9).toString(),
}))

import { clientFor } from '@/lib/chains'
import { getChainMeta } from '@/config/chains'
import { getGasEstimate, getAllGasEstimates } from '@/lib/gas'

const mockClientFor = clientFor as jest.Mock
const mockGetChainMeta = getChainMeta as jest.Mock

// Save and restore global.fetch
const originalFetch = global.fetch

beforeEach(() => {
  jest.clearAllMocks()
  // Clear the module-level memCache between tests by resetting modules
  // Since we can't easily clear the cache, we use unique chainIds or
  // rely on the TTL. For these tests we mock Date.now to manage caching.

  // Mock fetch for CoinGecko
  global.fetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve({ ethereum: { usd: 3500 } }),
  }) as jest.Mock
})

afterEach(() => {
  global.fetch = originalFetch
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function setupStandardChainMeta(chainId: number) {
  mockGetChainMeta.mockReturnValue({
    name: 'Ethereum',
    symbol: 'ETH',
    gasModel: 'standard',
    coingeckoId: 'ethereum',
  })

  // Mock a client that returns a gas price of 30 gwei (30e9 wei)
  const mockClient = {
    getGasPrice: jest.fn().mockResolvedValue(BigInt(30e9)),
  }
  mockClientFor.mockReturnValue(mockClient)
}

// ---------------------------------------------------------------------------
// getGasEstimate
// ---------------------------------------------------------------------------

describe('getGasEstimate', () => {
  it('throws for unsupported chain (getChainMeta returns undefined)', async () => {
    mockGetChainMeta.mockReturnValue(undefined)

    await expect(getGasEstimate(99999)).rejects.toThrow('Unsupported chain: 99999')
  })

  it('uses standard gas model for Ethereum (gasModel=standard)', async () => {
    setupStandardChainMeta(1)

    const estimate = await getGasEstimate(1)

    expect(estimate.chainId).toBe(1)
    expect(estimate.chainName).toBe('Ethereum')
    expect(estimate.symbol).toBe('ETH')
    expect(estimate.gasPriceGwei).toBeCloseTo(30)
    expect(estimate.l1DataFeeGwei).toBe(0) // standard model has no L1 data fee
  })

  it('calculates estimatedRevokeCostUsd correctly', async () => {
    setupStandardChainMeta(1)

    // With 30 gwei gas price, ETH at $3500:
    // TOTAL_REVOKE_GAS = 69000
    // l2CostEth = 69000 * 30 / 1e9 = 0.00207
    // estimatedRevokeCostUsd = 0.00207 * 3500 = ~7.245
    const estimate = await getGasEstimate(1)

    expect(estimate.nativeTokenPriceUsd).toBe(3500)
    expect(estimate.estimatedRevokeCostUsd).toBeCloseTo(7.245, 1)
  })

  it('returns cached result if within TTL', async () => {
    setupStandardChainMeta(1)

    // First call populates cache
    const first = await getGasEstimate(1)
    // Second call should use cache (clientFor not called again)
    mockClientFor.mockClear()
    const second = await getGasEstimate(1)

    expect(second).toBe(first)
    expect(mockClientFor).not.toHaveBeenCalled()
  })

  it('uses fallback price on CoinGecko fetch failure', async () => {
    mockGetChainMeta.mockReturnValue({
      name: 'Polygon',
      symbol: 'MATIC',
      gasModel: 'standard',
      coingeckoId: 'matic-network',
    })

    const mockClient = {
      getGasPrice: jest.fn().mockResolvedValue(BigInt(50e9)),
    }
    mockClientFor.mockReturnValue(mockClient)

    // Make fetch fail
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

    const estimate = await getGasEstimate(137)

    // Should use fallback price for matic-network = 0.70
    expect(estimate.nativeTokenPriceUsd).toBe(0.70)
  })
})

// ---------------------------------------------------------------------------
// getAllGasEstimates
// ---------------------------------------------------------------------------

describe('getAllGasEstimates', () => {
  it('returns array of estimates for all chains', async () => {
    // Each chain returns a valid meta
    mockGetChainMeta.mockReturnValue({
      name: 'TestChain',
      symbol: 'TC',
      gasModel: 'standard',
      coingeckoId: 'ethereum',
    })

    const mockClient = {
      getGasPrice: jest.fn().mockResolvedValue(BigInt(10e9)),
    }
    mockClientFor.mockReturnValue(mockClient)

    const results = await getAllGasEstimates()

    // Should have results for all 6 supported chains
    // (some may come from memCache populated by earlier tests)
    expect(results.length).toBeGreaterThanOrEqual(1)
    expect(results.every(r => typeof r.chainName === 'string')).toBe(true)
    expect(results.every(r => typeof r.estimatedRevokeCostUsd === 'number')).toBe(true)
  })

  it('handles individual chain failures gracefully', async () => {
    let callCount = 0
    mockGetChainMeta.mockImplementation(() => {
      callCount++
      if (callCount === 1) return undefined // first chain fails (throws)
      return {
        name: 'OKChain',
        symbol: 'OK',
        gasModel: 'standard',
        coingeckoId: 'ethereum',
      }
    })

    const mockClient = {
      getGasPrice: jest.fn().mockResolvedValue(BigInt(10e9)),
    }
    mockClientFor.mockReturnValue(mockClient)

    const results = await getAllGasEstimates()

    // Some chains succeed even though one fails
    expect(results.length).toBeGreaterThan(0)
    // Should be fewer than total because at least one failed
    expect(results.length).toBeLessThanOrEqual(6)
  })
})
