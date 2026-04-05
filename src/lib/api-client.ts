/**
 * APIClient — centralised fetch wrapper with retry + backoff.
 * Extracted from page.tsx so both the homepage and /dashboard can reuse it.
 */
export class APIClient {
  private static async fetchWithRetry(
    url: string,
    options: RequestInit = {},
    maxRetries: number = 3
  ): Promise<Response> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        })

        if (response.ok) {
          return response
        }

        // Don't retry on client errors (4xx)
        if (response.status >= 400 && response.status < 500) {
          try {
            const errorData = await response.json()
            console.error('API Error Details:', errorData)
            throw new Error(
              `Client error: ${response.status} - ${errorData.error || 'Unknown error'}`
            )
          } catch {
            throw new Error(`Client error: ${response.status}`)
          }
        }

        throw new Error(`Server error: ${response.status}`)
      } catch (error) {
        lastError = error as Error

        if (attempt === maxRetries) {
          break
        }

        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }

    throw lastError || new Error('Request failed after retries')
  }

  static async getAllowances(
    wallet: string,
    page: number = 1,
    pageSize: number = 25
  ) {
    if (typeof window === 'undefined') {
      throw new Error('API calls only available on client side')
    }

    const params = new URLSearchParams({
      wallet,
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    const response = await this.fetchWithRetry(
      `/api/allowances?${params.toString()}`
    )
    return response.json()
  }

  static async startScan(
    walletAddress: string,
    chains: string[] = ['eth', 'arb', 'base']
  ) {
    if (typeof window === 'undefined') {
      throw new Error('API calls only available on client side')
    }

    const response = await this.fetchWithRetry('/api/scan', {
      method: 'POST',
      body: JSON.stringify({ walletAddress, chains }),
    })
    return response.json()
  }

  static async getJobStatus(jobId: number) {
    if (typeof window === 'undefined') {
      throw new Error('API calls only available on client side')
    }

    const response = await this.fetchWithRetry(`/api/jobs/${jobId}`)
    return response.json()
  }

  static async refreshRisk(wallet: string) {
    if (typeof window === 'undefined') {
      throw new Error('API calls only available on client side')
    }

    const response = await this.fetchWithRetry('/api/risk/refresh', {
      method: 'POST',
      body: JSON.stringify({ wallet }),
    })
    return response.json()
  }

  static async enrichData(wallet: string) {
    if (typeof window === 'undefined') {
      throw new Error('API calls only available on client side')
    }

    const response = await this.fetchWithRetry('/api/enrich', {
      method: 'POST',
      body: JSON.stringify({ wallet }),
    })
    return response.json()
  }
}
