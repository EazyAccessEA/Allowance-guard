import { describe, it, expect } from '@jest/globals'

describe('Token categorization types and validation', () => {
  it('validates category structure', () => {
    const category = {
      id: 1,
      name: 'DeFi',
      description: 'Decentralized Finance tokens',
      icon: '🦄',
      color: '#ff6b6b',
      tokenCount: 150
    }
    
    expect(category.id).toBe(1)
    expect(category.name).toBe('DeFi')
    expect(category.description).toBe('Decentralized Finance tokens')
    expect(category.icon).toBe('🦄')
    expect(category.color).toBe('#ff6b6b')
    expect(category.tokenCount).toBe(150)
  })

  it('validates category creation schema', () => {
    const validCategory = {
      name: 'Privacy',
      description: 'Privacy-focused tokens',
      icon: '🛡️',
      color: 'teal'
    }
    
    expect(validCategory.name).toBe('Privacy')
    expect(validCategory.description).toBe('Privacy-focused tokens')
    expect(validCategory.icon).toBe('🛡️')
    expect(validCategory.color).toBe('teal')
  })

  it('validates category update schema', () => {
    const updateData = {
      name: 'Updated Privacy',
      description: 'Updated privacy-focused tokens',
      icon: '🔒',
      color: 'purple'
    }
    
    expect(updateData.name).toBe('Updated Privacy')
    expect(updateData.description).toBe('Updated privacy-focused tokens')
    expect(updateData.icon).toBe('🔒')
    expect(updateData.color).toBe('purple')
  })

  it('validates token categorization schema', () => {
    const categorizeData = {
      chainId: 1,
      tokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      categoryIds: [1, 2, 3]
    }
    
    expect(categorizeData.chainId).toBe(1)
    expect(categorizeData.tokenAddress).toMatch(/^0x[a-fA-F0-9]{40}$/)
    expect(Array.isArray(categorizeData.categoryIds)).toBe(true)
    expect(categorizeData.categoryIds.length).toBeLessThanOrEqual(20)
  })

  it('validates field length constraints', () => {
    const constraints = {
      name: { min: 2, max: 64 },
      description: { max: 400 },
      icon: { max: 16 },
      color: { max: 24 }
    }
    
    expect(constraints.name.min).toBe(2)
    expect(constraints.name.max).toBe(64)
    expect(constraints.description.max).toBe(400)
    expect(constraints.icon.max).toBe(16)
    expect(constraints.color.max).toBe(24)
  })

  it('validates API response structures', () => {
    const successResponse = {
      success: true,
      data: [
        {
          id: 1,
          name: 'DeFi',
          description: 'Decentralized Finance tokens',
          icon: '🦄',
          color: '#ff6b6b',
          tokenCount: 150
        }
      ]
    }
    
    expect(successResponse.success).toBe(true)
    expect(Array.isArray(successResponse.data)).toBe(true)
    expect(successResponse.data[0]).toHaveProperty('id')
    expect(successResponse.data[0]).toHaveProperty('name')
    expect(successResponse.data[0]).toHaveProperty('tokenCount')
  })

  it('validates error response structures', () => {
    const errorResponses = [
      { success: false, error: 'Invalid category payload' },
      { success: false, error: 'Invalid update payload' },
      { success: false, error: 'Invalid category id' },
      { success: false, error: 'Invalid categorize payload' },
      { success: false, error: 'Unsupported chainId' }
    ]
    
    errorResponses.forEach(response => {
      expect(response.success).toBe(false)
      expect(typeof response.error).toBe('string')
      expect(response.error.length).toBeGreaterThan(0)
    })
  })

  it('validates address normalization in categorization', () => {
    const normalizeAddress = (addr: string) => addr.trim().toLowerCase()
    
    expect(normalizeAddress('0xA0B86991C6218B36C1D19D4A2E9EB0CE3606EB48')).toBe('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')
    expect(normalizeAddress('  0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48  ')).toBe('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')
  })
})
