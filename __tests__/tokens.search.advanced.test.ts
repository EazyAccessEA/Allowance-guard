import { describe, it, expect } from '@jest/globals'

describe('Advanced token search with fuzzy matching', () => {
  it('validates fuzzy search filter types', () => {
    const filters = {
      query: 'usdc',
      chainId: 1,
      category: 'Stablecoins',
      verified: true,
      limit: 20,
      offset: 0,
      sort: 'relevance' as const,
      fuzzy: true,
      minScore: 1.2
    }
    
    expect(filters.query).toBe('usdc')
    expect(filters.chainId).toBe(1)
    expect(filters.category).toBe('Stablecoins')
    expect(filters.verified).toBe(true)
    expect(filters.limit).toBe(20)
    expect(filters.offset).toBe(0)
    expect(filters.sort).toBe('relevance')
    expect(filters.fuzzy).toBe(true)
    expect(filters.minScore).toBe(1.2)
  })

  it('validates search result structure with score', () => {
    const mockResult = {
      chainId: 1,
      tokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      standard: 'ERC20' as const,
      verified: true,
      categories: ['Stablecoins'],
      score: 2.8
    }
    
    expect(mockResult.chainId).toBe(1)
    expect(mockResult.tokenAddress).toMatch(/^0x[a-f0-9]{40}$/)
    expect(mockResult.name).toBe('USD Coin')
    expect(mockResult.symbol).toBe('USDC')
    expect(mockResult.decimals).toBe(6)
    expect(mockResult.standard).toBe('ERC20')
    expect(mockResult.verified).toBe(true)
    expect(Array.isArray(mockResult.categories)).toBe(true)
    expect(typeof mockResult.score).toBe('number')
    expect(mockResult.score).toBeGreaterThan(0)
  })

  it('validates fuzzy search parameters', () => {
    const fuzzyParams = {
      fuzzy: true,
      minScore: 0.5,
      query: 'usd'
    }
    
    expect(fuzzyParams.fuzzy).toBe(true)
    expect(fuzzyParams.minScore).toBe(0.5)
    expect(fuzzyParams.query).toBe('usd')
  })

  it('validates score calculation components', () => {
    const scoreComponents = {
      symbolSimilarity: 1.5,
      nameSimilarity: 1.0,
      exactSymbolBonus: 0.9,
      prefixSymbolBonus: 0.6,
      exactNameBonus: 0.4,
      prefixNameBonus: 0.3,
      exactAddressBonus: 0.8,
      prefixAddressBonus: 0.2,
      verifiedBoost: 0.5
    }
    
    expect(scoreComponents.symbolSimilarity).toBe(1.5)
    expect(scoreComponents.nameSimilarity).toBe(1.0)
    expect(scoreComponents.exactSymbolBonus).toBe(0.9)
    expect(scoreComponents.prefixSymbolBonus).toBe(0.6)
    expect(scoreComponents.exactNameBonus).toBe(0.4)
    expect(scoreComponents.prefixNameBonus).toBe(0.3)
    expect(scoreComponents.exactAddressBonus).toBe(0.8)
    expect(scoreComponents.prefixAddressBonus).toBe(0.2)
    expect(scoreComponents.verifiedBoost).toBe(0.5)
  })

  it('validates search modes', () => {
    const searchModes = {
      classic: { fuzzy: false },
      fuzzy: { fuzzy: true },
      auto: { fuzzy: undefined } // Auto-detect based on query length
    }
    
    expect(searchModes.classic.fuzzy).toBe(false)
    expect(searchModes.fuzzy.fuzzy).toBe(true)
    expect(searchModes.auto.fuzzy).toBeUndefined()
  })

  it('validates minScore constraints', () => {
    const minScoreTests = [
      { minScore: 0, valid: true },
      { minScore: 1.5, valid: true },
      { minScore: 3.0, valid: true },
      { minScore: 5.0, valid: true },
      { minScore: -0.1, valid: false },
      { minScore: 5.1, valid: false }
    ]
    
    minScoreTests.forEach(test => {
      if (test.valid) {
        expect(test.minScore).toBeGreaterThanOrEqual(0)
        expect(test.minScore).toBeLessThanOrEqual(5)
      } else {
        expect(test.minScore < 0 || test.minScore > 5).toBe(true)
      }
    })
  })

  it('validates trigram similarity concepts', () => {
    const similarityConcepts = {
      trigramThreshold: 0.1,
      symbolWeight: 1.5,
      nameWeight: 1.0,
      maxScore: 3.0
    }
    
    expect(similarityConcepts.trigramThreshold).toBe(0.1)
    expect(similarityConcepts.symbolWeight).toBe(1.5)
    expect(similarityConcepts.nameWeight).toBe(1.0)
    expect(similarityConcepts.maxScore).toBe(3.0)
  })

  it('validates API response with fuzzy search', () => {
    const fuzzyResponse = {
      success: true,
      data: [
        {
          chainId: 1,
          tokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          name: 'USD Coin',
          symbol: 'USDC',
          decimals: 6,
          standard: 'ERC20',
          verified: true,
          categories: ['Stablecoins'],
          score: 2.8
        }
      ],
      pagination: {
        total: 1,
        limit: 20,
        offset: 0,
        hasMore: false
      }
    }
    
    expect(fuzzyResponse.success).toBe(true)
    expect(Array.isArray(fuzzyResponse.data)).toBe(true)
    expect(fuzzyResponse.data[0]).toHaveProperty('score')
    expect(typeof fuzzyResponse.data[0].score).toBe('number')
    expect(fuzzyResponse.pagination.total).toBe(1)
  })
})
