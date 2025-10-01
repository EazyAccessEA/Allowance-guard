// URL Optimization for Token Discovery
// Creates SEO-friendly, user-friendly URLs with semantic meaning

export interface OptimizedSearchParams {
  // Core search parameters
  query?: string
  chain?: string
  category?: string
  verified?: boolean
  
  // Sorting and filtering
  sort?: 'relevance' | 'name' | 'symbol' | 'recent'
  page?: number
  
  // Advanced filters (hidden from URL when default)
  fuzzy?: boolean
  minScore?: number
  limit?: number
}

export interface URLMapping {
  // Chain ID to slug mapping
  chains: Record<number, string>
  // Category ID to slug mapping  
  categories: Record<number, string>
  // Sort options to slug mapping
  sorts: Record<string, string>
}

/**
 * Generate SEO-friendly URL for token discovery
 */
export function generateOptimizedURL(params: OptimizedSearchParams, mapping: URLMapping): string {
  const segments: string[] = ['/tokens']
  const queryParams: string[] = []
  
  // Add semantic path segments
  if (params.query) {
    // URL-encode the query and add as path segment
    const encodedQuery = encodeURIComponent(params.query.toLowerCase().replace(/\s+/g, '-'))
    segments.push('search', encodedQuery)
  }
  
  if (params.chain && mapping.chains[parseInt(params.chain)]) {
    segments.push('on', mapping.chains[parseInt(params.chain)])
  }
  
  if (params.category && mapping.categories[parseInt(params.category)]) {
    segments.push('in', mapping.categories[parseInt(params.category)])
  }
  
  // Add query parameters for non-default values
  if (params.verified === true) {
    queryParams.push('verified=true')
  }
  
  if (params.sort && params.sort !== 'relevance') {
    queryParams.push(`sort=${params.sort}`)
  }
  
  if (params.page && params.page > 1) {
    queryParams.push(`page=${params.page}`)
  }
  
  // Build final URL
  let url = segments.join('/')
  if (queryParams.length > 0) {
    url += '?' + queryParams.join('&')
  }
  
  return url
}

/**
 * Parse optimized URL back to search parameters
 */
export function parseOptimizedURL(pathname: string, searchParams: URLSearchParams, mapping: URLMapping): OptimizedSearchParams {
  const segments = pathname.split('/').filter(Boolean)
  const params: OptimizedSearchParams = {}
  
  // Parse path segments
  let segmentIndex = 1 // Skip 'tokens'
  
  if (segments[segmentIndex] === 'search' && segments[segmentIndex + 1]) {
    params.query = decodeURIComponent(segments[segmentIndex + 1]).replace(/-/g, ' ')
    segmentIndex += 2
  }
  
  if (segments[segmentIndex] === 'on' && segments[segmentIndex + 1]) {
    const chainSlug = segments[segmentIndex + 1]
    const chainId = Object.entries(mapping.chains).find(([_, slug]) => slug === chainSlug)?.[0]
    if (chainId) {
      params.chain = chainId
    }
    segmentIndex += 2
  }
  
  if (segments[segmentIndex] === 'in' && segments[segmentIndex + 1]) {
    const categorySlug = segments[segmentIndex + 1]
    const categoryId = Object.entries(mapping.categories).find(([_, slug]) => slug === categorySlug)?.[0]
    if (categoryId) {
      params.category = categoryId
    }
    segmentIndex += 2
  }
  
  // Parse query parameters
  if (searchParams.get('verified') === 'true') {
    params.verified = true
  }
  
  const sort = searchParams.get('sort')
  if (sort && ['relevance', 'name', 'symbol', 'recent'].includes(sort)) {
    params.sort = sort as OptimizedSearchParams['sort']
  }
  
  const page = searchParams.get('page')
  if (page) {
    const pageNum = parseInt(page)
    if (pageNum > 1) {
      params.page = pageNum
    }
  }
  
  return params
}

/**
 * Convert legacy URL parameters to optimized format
 */
export function convertLegacyParams(legacyParams: Record<string, any>): OptimizedSearchParams {
  return {
    query: legacyParams.q,
    chain: legacyParams.chainId?.toString(),
    category: legacyParams.category,
    verified: legacyParams.verified === 'true' || legacyParams.verified === true,
    sort: legacyParams.sort || 'relevance',
    page: legacyParams.offset ? Math.floor(legacyParams.offset / 20) + 1 : 1,
    fuzzy: legacyParams.fuzzy !== false, // Default to true
    minScore: legacyParams.minScore || 0,
    limit: legacyParams.limit || 20
  }
}

/**
 * Generate canonical URL for SEO
 */
export function generateCanonicalURL(params: OptimizedSearchParams, mapping: URLMapping): string {
  const baseUrl = 'https://www.allowanceguard.com'
  return baseUrl + generateOptimizedURL(params, mapping)
}

/**
 * Generate meta description for SEO
 */
export function generateMetaDescription(params: OptimizedSearchParams, mapping: URLMapping): string {
  const parts: string[] = []
  
  if (params.query) {
    parts.push(`Search results for "${params.query}"`)
  } else {
    parts.push('Discover and verify tokens')
  }
  
  if (params.chain) {
    const chainName = Object.entries(mapping.chains).find(([id]) => id === params.chain)?.[1]
    if (chainName) {
      parts.push(`on ${chainName}`)
    }
  }
  
  if (params.category) {
    const categoryName = Object.entries(mapping.categories).find(([id]) => id === params.category)?.[1]
    if (categoryName) {
      parts.push(`in ${categoryName} category`)
    }
  }
  
  if (params.verified) {
    parts.push('(verified tokens only)')
  }
  
  parts.push('- Allowance Guard')
  
  return parts.join(' ')
}

/**
 * Generate structured data for SEO
 */
export function generateStructuredData(params: OptimizedSearchParams, mapping: URLMapping) {
  return {
    "@context": "https://schema.org",
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.allowanceguard.com/tokens/search/{search_term_string}",
      "actionPlatform": [
        "https://schema.org/DesktopWebPlatform",
        "https://schema.org/MobileWebPlatform"
      ]
    },
    "query-input": "required name=search_term_string",
    "description": "Search for verified tokens across multiple blockchains"
  }
}
