/**
 * Unit tests for src/lib/permit2.ts
 *
 * Tests: PERMIT2_ADDRESS, labelForSpender, permit2RiskScore,
 *        scanPermit2Allowances
 */

jest.mock('./chains', () => ({
  clientFor: jest.fn(),
}))

jest.mock('@/config/chains', () => ({
  SUPPORTED_CHAIN_IDS: [1, 42161, 8453, 10, 137, 43114],
}))

// Mock viem — we only need getAddress (passthrough) and parseAbi
jest.mock('viem', () => ({
  getAddress: (addr: string) => addr,
  parseAbi: (fragments: string[]) => fragments,
}))

import { clientFor } from './chains'
import {
  PERMIT2_ADDRESS,
  KNOWN_PERMIT2_SPENDERS,
  labelForSpender,
  permit2RiskScore,
  scanPermit2Allowances,
  type Permit2Allowance,
} from '@/lib/permit2'

const mockClientFor = clientFor as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

// ---------------------------------------------------------------------------
// PERMIT2_ADDRESS
// ---------------------------------------------------------------------------

describe('PERMIT2_ADDRESS', () => {
  it('has the correct canonical address', () => {
    expect(PERMIT2_ADDRESS).toBe('0x000000000022D473030F116dDEE9F6B43aC78BA3')
  })
})

// ---------------------------------------------------------------------------
// labelForSpender
// ---------------------------------------------------------------------------

describe('labelForSpender', () => {
  it("returns 'Uniswap Universal Router' for known address on chain 1", () => {
    const addr = '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD'
    expect(labelForSpender(addr as `0x${string}`, 1)).toBe('Uniswap Universal Router')
  })

  it('returns null for unknown address', () => {
    const addr = '0x0000000000000000000000000000000000000001'
    expect(labelForSpender(addr as `0x${string}`, 1)).toBeNull()
  })

  it('matches case-insensitively', () => {
    const addr = '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad'
    expect(labelForSpender(addr as `0x${string}`, 1)).toBe('Uniswap Universal Router')
  })

  it('returns null when spender exists on different chain', () => {
    // CoW Protocol is only on chains 1 and 42161
    const addr = '0x9008D19f58AAbD9eD0D60971565AA8510560ab41'
    expect(labelForSpender(addr as `0x${string}`, 137)).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// permit2RiskScore
// ---------------------------------------------------------------------------

describe('permit2RiskScore', () => {
  function makeAllowance(overrides: Partial<Permit2Allowance> = {}): Permit2Allowance {
    return {
      chainId: 1,
      token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as `0x${string}`,
      spender: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD' as `0x${string}`,
      spenderLabel: 'Uniswap Universal Router',
      amount: BigInt(1000),
      expiration: Math.floor(Date.now() / 1000) + 86400, // future
      nonce: 0,
      isExpired: false,
      isUnlimited: false,
      riskLevel: 'low',
      ...overrides,
    }
  }

  it('returns 0 for an empty array', () => {
    expect(permit2RiskScore([])).toBe(0)
  })

  it('skips expired allowances', () => {
    const allowances = [makeAllowance({ isExpired: true, riskLevel: 'critical' })]
    expect(permit2RiskScore(allowances)).toBe(0)
  })

  it('scores critical = 45', () => {
    const allowances = [makeAllowance({ riskLevel: 'critical' })]
    expect(permit2RiskScore(allowances)).toBe(45)
  })

  it('scores high = 35', () => {
    const allowances = [makeAllowance({ riskLevel: 'high' })]
    expect(permit2RiskScore(allowances)).toBe(35)
  })

  it('scores medium = 20', () => {
    const allowances = [makeAllowance({ riskLevel: 'medium' })]
    expect(permit2RiskScore(allowances)).toBe(20)
  })

  it('scores low = 5', () => {
    const allowances = [makeAllowance({ riskLevel: 'low' })]
    expect(permit2RiskScore(allowances)).toBe(5)
  })

  it('sums multiple non-expired allowances', () => {
    const allowances = [
      makeAllowance({ riskLevel: 'critical' }),
      makeAllowance({ riskLevel: 'high' }),
      makeAllowance({ isExpired: true, riskLevel: 'critical' }),
    ]
    expect(permit2RiskScore(allowances)).toBe(45 + 35)
  })
})

// ---------------------------------------------------------------------------
// scanPermit2Allowances
// ---------------------------------------------------------------------------

describe('scanPermit2Allowances', () => {
  it('returns empty array for unsupported chain', async () => {
    const result = await scanPermit2Allowances(
      '0xowner' as `0x${string}`,
      999, // unsupported
      ['0xtoken' as `0x${string}`],
    )
    expect(result).toEqual([])
    expect(mockClientFor).not.toHaveBeenCalled()
  })

  it('returns empty array for empty tokens list', async () => {
    const result = await scanPermit2Allowances(
      '0xowner' as `0x${string}`,
      1,
      [],
    )
    expect(result).toEqual([])
  })

  it('processes multicall results correctly', async () => {
    const now = Math.floor(Date.now() / 1000)
    const futureExpiry = now + 86400

    const mockMulticall = jest.fn().mockResolvedValue([
      {
        status: 'success',
        result: [BigInt(5000), futureExpiry, 1],
      },
      // Second result: zero amount, should be skipped
      {
        status: 'success',
        result: [BigInt(0), futureExpiry, 0],
      },
      // Third result: failure
      {
        status: 'failure',
        error: new Error('revert'),
      },
    ])

    mockClientFor.mockReturnValue({ multicall: mockMulticall })

    const result = await scanPermit2Allowances(
      '0xOwner' as `0x${string}`,
      1,
      ['0xTokenA' as `0x${string}`],
    )

    // Only the first result (non-zero, success) should be included
    expect(result).toHaveLength(1)
    expect(result[0].amount).toBe(BigInt(5000))
    expect(result[0].chainId).toBe(1)
    expect(result[0].isExpired).toBe(false)
  })
})
