// Test for token curation schema
import { 
  tokenMetadata, 
  tokenSubmissions, 
  tokenCategories, 
  tokenCategoryMappings,
  tokenStandard,
  curationStatus 
} from '../src/db/schema/tokens'

describe('token curation schema', () => {
  it('exports all required tables', () => {
    expect(tokenMetadata).toBeDefined()
    expect(tokenSubmissions).toBeDefined()
    expect(tokenCategories).toBeDefined()
    expect(tokenCategoryMappings).toBeDefined()
  })

  it('exports all required enums', () => {
    expect(tokenStandard).toBeDefined()
    expect(curationStatus).toBeDefined()
  })

  it('tokenMetadata has correct structure', () => {
    expect(tokenMetadata.chainId).toBeDefined()
    expect(tokenMetadata.tokenAddress).toBeDefined()
    expect(tokenMetadata.name).toBeDefined()
    expect(tokenMetadata.symbol).toBeDefined()
    expect(tokenMetadata.standard).toBeDefined()
    expect(tokenMetadata.verified).toBeDefined()
  })

  it('tokenSubmissions has correct structure', () => {
    expect(tokenSubmissions.id).toBeDefined()
    expect(tokenSubmissions.chainId).toBeDefined()
    expect(tokenSubmissions.tokenAddress).toBeDefined()
    expect(tokenSubmissions.submittedBy).toBeDefined()
    expect(tokenSubmissions.status).toBeDefined()
  })

  it('tokenCategories has correct structure', () => {
    expect(tokenCategories.id).toBeDefined()
    expect(tokenCategories.name).toBeDefined()
    expect(tokenCategories.description).toBeDefined()
  })

  it('tokenCategoryMappings has correct structure', () => {
    expect(tokenCategoryMappings.chainId).toBeDefined()
    expect(tokenCategoryMappings.tokenAddress).toBeDefined()
    expect(tokenCategoryMappings.categoryId).toBeDefined()
  })
})