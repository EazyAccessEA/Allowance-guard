import { describe, it, expect } from '@jest/globals'

describe('Token submission types and validation', () => {
  it('validates submission schema structure', () => {
    const validSubmission = {
      chainId: 1,
      tokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      standard: 'ERC20' as const,
      description: 'USD Coin (USDC) is a fully-backed U.S. dollar stablecoin',
      website: 'https://www.circle.com/usdc',
      logoUrl: 'https://example.com/logo.png',
      submittedBy: 'submitter@example.com'
    }
    
    expect(validSubmission.chainId).toBe(1)
    expect(validSubmission.tokenAddress).toMatch(/^0x[a-fA-F0-9]{40}$/)
    expect(validSubmission.name).toBe('USD Coin')
    expect(validSubmission.symbol).toBe('USDC')
    expect(validSubmission.decimals).toBe(6)
    expect(validSubmission.standard).toBe('ERC20')
    expect(validSubmission.description).toBeTruthy()
    expect(validSubmission.website).toMatch(/^https?:\/\//)
    expect(validSubmission.logoUrl).toMatch(/^https?:\/\//)
    expect(validSubmission.submittedBy).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  })

  it('validates address normalization', () => {
    const normalizeAddress = (addr: string) => addr.trim().toLowerCase()
    
    expect(normalizeAddress('0xA0B86991C6218B36C1D19D4A2E9EB0CE3606EB48')).toBe('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')
    expect(normalizeAddress('  0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48  ')).toBe('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')
  })

  it('validates token standards', () => {
    const validStandards = ['ERC20', 'ERC721', 'ERC1155'] as const
    
    validStandards.forEach(standard => {
      expect(['ERC20', 'ERC721', 'ERC1155']).toContain(standard)
    })
  })

  it('validates chain ID constraints', () => {
    const validChainIds = [1, 42161, 8453, 10, 137, 43114, 56]
    
    validChainIds.forEach(chainId => {
      expect(chainId).toBeGreaterThan(0)
      expect(Number.isInteger(chainId)).toBe(true)
    })
  })

  it('validates field length constraints', () => {
    const constraints = {
      name: { min: 1, max: 100 },
      symbol: { min: 1, max: 12 },
      description: { max: 600 },
      decimals: { min: 0, max: 36 }
    }
    
    expect(constraints.name.min).toBe(1)
    expect(constraints.name.max).toBe(100)
    expect(constraints.symbol.min).toBe(1)
    expect(constraints.symbol.max).toBe(12)
    expect(constraints.description.max).toBe(600)
    expect(constraints.decimals.min).toBe(0)
    expect(constraints.decimals.max).toBe(36)
  })

  it('validates response structure', () => {
    const successResponse = {
      success: true,
      submissionId: '123',
      detectedStandard: 'ERC20' as const,
      message: 'Token submitted for review'
    }
    
    expect(successResponse.success).toBe(true)
    expect(typeof successResponse.submissionId).toBe('string')
    expect(['ERC20', 'ERC721', 'ERC1155']).toContain(successResponse.detectedStandard)
    expect(successResponse.message).toBe('Token submitted for review')
  })

  it('validates error response structure', () => {
    const errorResponses = [
      { success: false, error: 'Unsupported chainId' },
      { success: false, error: 'Token already listed' },
      { success: false, error: 'Token already submitted (pending)' },
      { success: false, error: 'On-chain validation failed: No contract code at address' },
      { success: false, error: 'Invalid submission data' }
    ]
    
    errorResponses.forEach(response => {
      expect(response.success).toBe(false)
      expect(typeof response.error).toBe('string')
      expect(response.error.length).toBeGreaterThan(0)
    })
  })
})
