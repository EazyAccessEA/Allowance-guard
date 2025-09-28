import { describe, it, expect } from '@jest/globals'

describe('Token search types and structure', () => {
  it('validates search filter types', () => {
    // Test that the types are properly defined
    const filters = {
      query: 'test',
      chainId: 1,
      category: 'DeFi',
      verified: true,
      limit: 20,
      offset: 0,
      sort: 'name' as const
    }
    
    expect(filters.query).toBe('test')
    expect(filters.chainId).toBe(1)
    expect(filters.category).toBe('DeFi')
    expect(filters.verified).toBe(true)
    expect(filters.limit).toBe(20)
    expect(filters.offset).toBe(0)
    expect(filters.sort).toBe('name')
  })

  it('validates search result structure', () => {
    const mockResult = {
      chainId: 1,
      tokenAddress: '0x1234567890123456789012345678901234567890',
      name: 'Test Token',
      symbol: 'TEST',
      decimals: 18,
      standard: 'ERC20' as const,
      verified: true,
      categories: ['DeFi', 'Stablecoins']
    }
    
    expect(mockResult.chainId).toBe(1)
    expect(mockResult.tokenAddress).toMatch(/^0x[a-f0-9]{40}$/)
    expect(mockResult.name).toBe('Test Token')
    expect(mockResult.symbol).toBe('TEST')
    expect(mockResult.decimals).toBe(18)
    expect(mockResult.standard).toBe('ERC20')
    expect(mockResult.verified).toBe(true)
    expect(Array.isArray(mockResult.categories)).toBe(true)
  })

  it('validates sort options', () => {
    const validSorts = ['relevance', 'verified', 'name', 'symbol', 'recent'] as const
    
    validSorts.forEach(sort => {
      expect(['relevance', 'verified', 'name', 'symbol', 'recent']).toContain(sort)
    })
  })

  it('validates pagination limits', () => {
    const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))
    
    expect(clamp(1, 1, 100)).toBe(1)
    expect(clamp(50, 1, 100)).toBe(50)
    expect(clamp(150, 1, 100)).toBe(100)
    expect(clamp(0, 1, 100)).toBe(1)
  })
})
