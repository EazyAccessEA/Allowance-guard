/**
 * Unit tests for src/lib/risk-factors.ts
 *
 * Tests: factorUnlimited, factorStale, factorKnownExploit,
 *        factorPermit2Unlimited, evaluateSyncFactors,
 *        aggregateScore, overallSeverity
 */

jest.mock('@/lib/db', () => ({
  pool: { query: jest.fn() },
}))

jest.mock('./chains', () => ({
  clientFor: jest.fn(),
}))

jest.mock('@/config/chains', () => ({
  blocksForDuration: jest.fn(),
}))

import { blocksForDuration } from '@/config/chains'
import {
  factorUnlimited,
  factorStale,
  factorKnownExploit,
  factorPermit2Unlimited,
  evaluateSyncFactors,
  aggregateScore,
  overallSeverity,
  type RiskInput,
} from '@/lib/risk-factors'

const mockBlocksForDuration = blocksForDuration as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

// ---------------------------------------------------------------------------
// Helper: create a base RiskInput
// ---------------------------------------------------------------------------
function makeInput(overrides: Partial<RiskInput> = {}): RiskInput {
  return {
    chainId: 1,
    tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    spenderAddress: '0x1234567890abcdef1234567890abcdef12345678',
    amount: '1000000',
    isUnlimited: false,
    lastSeenBlock: '19000000',
    currentBlock: BigInt(19_100_000),
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// factorUnlimited
// ---------------------------------------------------------------------------

describe('factorUnlimited', () => {
  it('returns null when isUnlimited is false', () => {
    expect(factorUnlimited(makeInput({ isUnlimited: false }))).toBeNull()
  })

  it('returns score 50 when isUnlimited is true', () => {
    const result = factorUnlimited(makeInput({ isUnlimited: true }))
    expect(result).not.toBeNull()
    expect(result!.score).toBe(50)
    expect(result!.id).toBe('unlimited')
    expect(result!.severity).toBe('high')
  })
})

// ---------------------------------------------------------------------------
// factorStale
// ---------------------------------------------------------------------------

describe('factorStale', () => {
  it('returns null when approval is within 90 days', () => {
    // 90 days at ~12s/block = ~648000 blocks
    mockBlocksForDuration.mockReturnValue(BigInt(648_000))

    const input = makeInput({
      lastSeenBlock: '19000000',
      currentBlock: BigInt(19_100_000), // 100k blocks < 648k threshold
    })

    expect(factorStale(input)).toBeNull()
  })

  it('returns score 10 when approval is stale (> 90 days)', () => {
    mockBlocksForDuration.mockReturnValue(BigInt(648_000))

    const input = makeInput({
      lastSeenBlock: '18000000',
      currentBlock: BigInt(19_000_000), // 1M blocks > 648k
      amount: '1000000',
    })

    const result = factorStale(input)
    expect(result).not.toBeNull()
    expect(result!.score).toBe(10)
    expect(result!.id).toBe('stale')
  })

  it('returns null when amount is 0 (even if stale)', () => {
    mockBlocksForDuration.mockReturnValue(BigInt(648_000))

    const input = makeInput({
      lastSeenBlock: '18000000',
      currentBlock: BigInt(19_000_000),
      amount: '0',
    })

    expect(factorStale(input)).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// factorKnownExploit
// ---------------------------------------------------------------------------

describe('factorKnownExploit', () => {
  it('returns score 100 for a known exploit address', () => {
    const input = makeInput({
      spenderAddress: '0x098b716b8aaf21512996dc57eb0615e2383e2f96',
    })
    const result = factorKnownExploit(input)
    expect(result).not.toBeNull()
    expect(result!.score).toBe(100)
    expect(result!.severity).toBe('critical')
  })

  it('returns null for an unknown address', () => {
    const input = makeInput({
      spenderAddress: '0x0000000000000000000000000000000000000001',
    })
    expect(factorKnownExploit(input)).toBeNull()
  })

  it('matches case-insensitively', () => {
    // The set stores lowercase; input with mixed case should still match
    const input = makeInput({
      spenderAddress: '0x098B716B8AAF21512996DC57EB0615E2383E2F96',
    })
    const result = factorKnownExploit(input)
    expect(result).not.toBeNull()
    expect(result!.score).toBe(100)
  })
})

// ---------------------------------------------------------------------------
// factorPermit2Unlimited
// ---------------------------------------------------------------------------

describe('factorPermit2Unlimited', () => {
  const MAX_UINT160 = (BigInt(1) << BigInt(160)) - BigInt(1)
  const MAX_UINT48 = (BigInt(1) << BigInt(48)) - BigInt(1)

  it('returns null when permit2Amount is undefined (no permit2 data)', () => {
    const input = makeInput()
    expect(factorPermit2Unlimited(input)).toBeNull()
  })

  it('returns score 35 when unlimited amount and no expiry', () => {
    const input = makeInput({
      permit2Amount: MAX_UINT160,
      permit2Expiration: 0,
    })
    const result = factorPermit2Unlimited(input)
    expect(result).not.toBeNull()
    expect(result!.score).toBe(35)
    expect(result!.id).toBe('permit2_unlimited_no_expiry')
  })

  it('returns null when has expiry even if unlimited amount', () => {
    const input = makeInput({
      permit2Amount: MAX_UINT160,
      permit2Expiration: 1700000000, // a real expiration timestamp
    })
    expect(factorPermit2Unlimited(input)).toBeNull()
  })

  it('returns null when amount is below unlimited threshold', () => {
    const input = makeInput({
      permit2Amount: BigInt(1000),
      permit2Expiration: 0,
    })
    expect(factorPermit2Unlimited(input)).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// evaluateSyncFactors
// ---------------------------------------------------------------------------

describe('evaluateSyncFactors', () => {
  it('returns array of triggered sync factors', () => {
    mockBlocksForDuration.mockReturnValue(BigInt(648_000))

    const input = makeInput({
      isUnlimited: true,
      spenderAddress: '0x098b716b8aaf21512996dc57eb0615e2383e2f96',
      lastSeenBlock: '18000000',
      currentBlock: BigInt(19_000_000),
      amount: '1000000',
    })

    const factors = evaluateSyncFactors(input)
    const ids = factors.map(f => f.id)

    expect(ids).toContain('unlimited')
    expect(ids).toContain('stale')
    expect(ids).toContain('known_exploit')
  })
})

// ---------------------------------------------------------------------------
// aggregateScore
// ---------------------------------------------------------------------------

describe('aggregateScore', () => {
  it('sums scores correctly', () => {
    const factors = [
      { id: 'a', label: '', description: '', score: 50, severity: 'high' as const },
      { id: 'b', label: '', description: '', score: 10, severity: 'low' as const },
      { id: 'c', label: '', description: '', score: 100, severity: 'critical' as const },
    ]
    expect(aggregateScore(factors)).toBe(160)
  })

  it('returns 0 for an empty array', () => {
    expect(aggregateScore([])).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// overallSeverity
// ---------------------------------------------------------------------------

describe('overallSeverity', () => {
  it("returns 'critical' when any factor is critical", () => {
    const factors = [
      { id: 'a', label: '', description: '', score: 10, severity: 'low' as const },
      { id: 'b', label: '', description: '', score: 100, severity: 'critical' as const },
    ]
    expect(overallSeverity(factors)).toBe('critical')
  })

  it("returns 'info' for an empty array", () => {
    expect(overallSeverity([])).toBe('info')
  })

  it("returns 'high' when highest severity is high", () => {
    const factors = [
      { id: 'a', label: '', description: '', score: 10, severity: 'low' as const },
      { id: 'b', label: '', description: '', score: 50, severity: 'high' as const },
      { id: 'c', label: '', description: '', score: 20, severity: 'medium' as const },
    ]
    expect(overallSeverity(factors)).toBe('high')
  })
})
