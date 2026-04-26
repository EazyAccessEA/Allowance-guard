// API Client with retry logic and error handling for wallet scanning
import { isOverloadStatus, parseRetryAfter } from './retry'

const MAX_OVERLOAD_WAIT_MS = 30_000

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

        // Overload / throttling: retry with backoff, respecting Retry-After.
        if (isOverloadStatus(response.status) && attempt < maxRetries) {
          const waitMs = parseRetryAfter(response.headers.get('retry-after'))
            ?? computeBackoffMs(attempt)
          await new Promise(resolve => setTimeout(resolve, Math.min(waitMs, MAX_OVERLOAD_WAIT_MS)))
          continue
        }

        // Don't retry on client errors (4xx, excluding 429 handled above).
        if (response.status >= 400 && response.status < 500) {
          try {
            const errorData = await response.json()
            console.error('API Error Details:', errorData)
            throw new Error(`Client error: ${response.status} - ${errorData.error || 'Unknown error'}`)
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

        await new Promise(resolve => setTimeout(resolve, computeBackoffMs(attempt)))
      }
    }

    throw lastError || new Error('Request failed after retries')
  }

  static async getAllowances(wallet: string, page: number = 1, pageSize: number = 25) {
    if (typeof window === 'undefined') {
      throw new Error('API calls only available on client side')
    }

    const params = new URLSearchParams({
      wallet,
      page: page.toString(),
      pageSize: pageSize.toString()
    })

    const response = await this.fetchWithRetry(
      `/api/allowances?${params.toString()}`
    )

    return response.json()
  }

  static async startScan(walletAddress: string, chains?: string[]) {
    if (typeof window === 'undefined') {
      throw new Error('API calls only available on client side')
    }

    const response = await this.fetchWithRetry('/api/scan', {
      method: 'POST',
      body: JSON.stringify({ walletAddress, ...(chains?.length ? { chains } : {}) })
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
      body: JSON.stringify({ wallet })
    })

    return response.json()
  }

  static async enrichData(wallet: string) {
    if (typeof window === 'undefined') {
      throw new Error('API calls only available on client side')
    }

    const response = await this.fetchWithRetry('/api/enrich', {
      method: 'POST',
      body: JSON.stringify({ wallet })
    })

    return response.json()
  }
}

function computeBackoffMs(attempt: number): number {
  const exp = Math.pow(2, attempt) * 1000
  const jitter = Math.random() * exp * 0.3
  return Math.min(MAX_OVERLOAD_WAIT_MS, exp + jitter)
}
