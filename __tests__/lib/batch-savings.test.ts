/**
 * Unit tests for src/lib/batch-savings.ts
 *
 * Pure function — no mocking required. Tests pin the gas-model
 * constants + the edge cases (N=1, unsupported chain).
 */

import { computeBatchSavings } from '@/lib/batch-savings'

describe('computeBatchSavings', () => {
  it('returns no batched quote when approvalCount < 2', () => {
    const result = computeBatchSavings({ chainId: 1, approvalCount: 1 })
    expect(result.sequential.gasUnits).toBe(70_000)
    expect(result.batched).toBeNull()
    expect(result.savings).toBeNull()
  })

  it('computes sequential vs batched for N=5 on Ethereum at 20 gwei', () => {
    const result = computeBatchSavings({ chainId: 1, approvalCount: 5 })

    expect(result.chainId).toBe(1)
    expect(result.gasPriceGwei).toBe(20)

    // 5 × 70_000
    expect(result.sequential.gasUnits).toBe(350_000)

    // 34_000 base + 5 × 54_000
    expect(result.batched?.gasUnits).toBe(304_000)

    // 350_000 − 304_000
    expect(result.savings?.gasUnits).toBe(46_000)

    // 46_000 / 350_000 ≈ 0.1314
    expect(result.savings?.fraction).toBeCloseTo(0.1314, 3)
  })

  it('savings fraction grows with N (amortisation)', () => {
    const small = computeBatchSavings({ chainId: 1, approvalCount: 3 })
    const medium = computeBatchSavings({ chainId: 1, approvalCount: 10 })
    const large = computeBatchSavings({ chainId: 1, approvalCount: 25 })

    expect(small.savings!.fraction).toBeLessThan(medium.savings!.fraction)
    expect(medium.savings!.fraction).toBeLessThan(large.savings!.fraction)
  })

  it('honours caller-supplied gasPriceGwei', () => {
    const custom = computeBatchSavings({
      chainId: 42161,
      approvalCount: 5,
      gasPriceGwei: 0.5,
    })
    expect(custom.gasPriceGwei).toBe(0.5)
    // Fee = 350_000 gas × 0.5 gwei = 175_000 gwei = 0.000175 ETH
    expect(custom.sequential.feeEther).toBeCloseTo(0.000175, 6)
  })

  it('falls back to chain-specific default gas price when omitted', () => {
    const l2 = computeBatchSavings({ chainId: 8453, approvalCount: 5 })
    // Base default = 0.01 gwei
    expect(l2.gasPriceGwei).toBe(0.01)

    const l1 = computeBatchSavings({ chainId: 1, approvalCount: 5 })
    expect(l1.gasPriceGwei).toBe(20)
  })

  it('falls back to L1 pricing for unknown chains', () => {
    const unknown = computeBatchSavings({ chainId: 999999, approvalCount: 3 })
    expect(unknown.gasPriceGwei).toBe(20)
  })

  it('rejects non-positive inputs', () => {
    expect(() =>
      computeBatchSavings({ chainId: 1, approvalCount: 0 }),
    ).toThrow('approvalCount')
    expect(() =>
      computeBatchSavings({ chainId: 0, approvalCount: 5 }),
    ).toThrow('chainId')
    expect(() =>
      computeBatchSavings({ chainId: 1, approvalCount: 5, gasPriceGwei: 0 }),
    ).toThrow('gasPriceGwei')
  })

  it('labels results as approximate and carries assumptions', () => {
    const result = computeBatchSavings({ chainId: 1, approvalCount: 5 })
    expect(result.confidence).toBe('approximate')
    expect(result.assumptions.length).toBeGreaterThan(0)
    expect(result.assumptions.some((a) => a.includes('EIP-5792'))).toBe(true)
  })
})
