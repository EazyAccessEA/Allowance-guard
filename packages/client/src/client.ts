/**
 * AllowanceGuardClient — the framework-agnostic transport layer.
 *
 * Responsibilities:
 *   1. Hold the API key + base URL.
 *   2. Refuse secret keys in browser contexts (security — see §4 of the plan).
 *   3. Translate fetch responses into typed errors.
 *   4. Expose one method per REST resource. Methods are thin — all heavy
 *      lifting lives in src/methods/*.ts so this file stays under ~200 lines.
 */

import { ApiError, AuthError, NetworkError, RateLimitError, ValidationError } from './errors'
import { getChains } from './methods/chains'
import { listAllowances, type ListAllowancesArgs } from './methods/allowances'
import { getRiskScore, getPortfolioRisk, riskCheck, type GetRiskScoreArgs } from './methods/risk'
import { triggerScan, type ScanArgs } from './methods/scan'
import { simulateRevoke } from './methods/simulate'
import type {
  AllowancesResponse,
  Chain,
  PortfolioRiskResponse,
  RiskCheckRequest,
  RiskCheckResponse,
  RiskScoreResponse,
  ScanResponse,
  SimulateResponse,
  SimulateRevokeArgs,
  Address,
} from './types'

const DEFAULT_BASE_URL = 'https://www.allowanceguard.com/api/v1'
const SECRET_KEY_PREFIX = 'ag_live_'
const PUBLIC_KEY_PREFIX = 'ag_pub_'

export interface ClientOptions {
  /** API key. Public keys (`ag_pub_*`) only in browser contexts. */
  apiKey: string
  /** Override the base URL. Defaults to production. */
  baseUrl?: string
  /** Custom fetch implementation. Defaults to global fetch. */
  fetch?: typeof fetch
  /** User-Agent header to send. Defaults to `allowance-guard-client/0.0.1`. */
  userAgent?: string
}

export interface RequestOptions {
  signal?: AbortSignal
}

export class AllowanceGuardClient {
  public readonly baseUrl: string
  private readonly apiKey: string
  private readonly fetchImpl: typeof fetch
  private readonly userAgent: string

  constructor(options: ClientOptions) {
    if (!options.apiKey || typeof options.apiKey !== 'string') {
      throw new AuthError('AllowanceGuardClient: `apiKey` is required.')
    }

    // Hard-fail if a secret key is handed to browser code. See §4 of the plan.
    if (typeof window !== 'undefined' && options.apiKey.startsWith(SECRET_KEY_PREFIX)) {
      throw new AuthError(
        '@allowance-guard/client: secret keys (ag_live_*) cannot be used in the ' +
          'browser. Use a public key (ag_pub_*) or proxy requests through your server.',
      )
    }

    this.apiKey = options.apiKey
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, '')
    this.fetchImpl = options.fetch ?? globalThis.fetch
    this.userAgent = options.userAgent ?? 'allowance-guard-client/0.0.1'

    if (typeof this.fetchImpl !== 'function') {
      throw new AllowanceGuardClient.FetchUnavailable()
    }
  }

  /**
   * Thrown at construction when no fetch implementation is available.
   * Exposed as a nested class so consumers can instanceof-check it.
   */
  static FetchUnavailable = class extends NetworkError {
    constructor() {
      super(
        '@allowance-guard/client: global `fetch` is not available. ' +
          'Pass a `fetch` option, or upgrade to Node 18+.',
      )
    }
  }

  /** Is this key a public (browser-safe) key? */
  get isPublicKey(): boolean {
    return this.apiKey.startsWith(PUBLIC_KEY_PREFIX)
  }

  /**
   * Low-level request method. Used by all method modules.
   * Handles auth header, error translation, and JSON parsing.
   */
  async request<T>(
    path: string,
    init: RequestInit & { query?: Record<string, string | number | boolean | undefined> } = {},
  ): Promise<T> {
    const { query, headers, ...rest } = init
    const url = new URL(this.baseUrl + path)
    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (v !== undefined) url.searchParams.set(k, String(v))
      }
    }

    let response: Response
    try {
      response = await this.fetchImpl(url.toString(), {
        ...rest,
        headers: {
          'accept': 'application/json',
          'authorization': `Bearer ${this.apiKey}`,
          'user-agent': this.userAgent,
          ...(rest.body ? { 'content-type': 'application/json' } : {}),
          ...headers,
        },
      })
    } catch (cause) {
      throw new NetworkError(
        'Network request to AllowanceGuard API failed.',
        cause,
      )
    }

    return this.parseResponse<T>(response)
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const text = await response.text()
    let body: unknown = null
    if (text) {
      try {
        body = JSON.parse(text)
      } catch {
        // Non-JSON error body (rare — upstream proxy errors, etc.)
      }
    }

    if (response.ok) {
      return (body as { data?: T })?.data ?? (body as T)
    }

    const errorBody = body as { error?: { message?: string; details?: unknown } } | null
    const message = errorBody?.error?.message ?? `HTTP ${response.status}`
    const details = errorBody?.error?.details

    switch (response.status) {
      case 400:
        throw new ValidationError(message, details)
      case 401:
      case 403:
        throw new AuthError(message, response.status, details)
      case 429: {
        const retryAfter = response.headers.get('retry-after')
        const retryAfterSeconds = retryAfter ? Number(retryAfter) : null
        throw new RateLimitError(
          message,
          Number.isFinite(retryAfterSeconds) ? retryAfterSeconds : null,
          details,
        )
      }
      default:
        throw new ApiError(message, response.status, 'API_ERROR', details)
    }
  }

  // === Resource methods ======================================================

  getChains(opts?: RequestOptions): Promise<Chain[]> {
    return getChains(this, opts)
  }

  listAllowances(args: ListAllowancesArgs, opts?: RequestOptions): Promise<AllowancesResponse> {
    return listAllowances(this, args, opts)
  }

  getRiskScore(args: GetRiskScoreArgs, opts?: RequestOptions): Promise<RiskScoreResponse> {
    return getRiskScore(this, args, opts)
  }

  getPortfolioRisk(args: { wallet: Address }, opts?: RequestOptions): Promise<PortfolioRiskResponse> {
    return getPortfolioRisk(this, args, opts)
  }

  riskCheck(args: RiskCheckRequest, opts?: RequestOptions): Promise<RiskCheckResponse> {
    return riskCheck(this, args, opts)
  }

  triggerScan(args: ScanArgs, opts?: RequestOptions): Promise<ScanResponse> {
    return triggerScan(this, args, opts)
  }

  simulateRevoke(args: SimulateRevokeArgs, opts?: RequestOptions): Promise<SimulateResponse> {
    return simulateRevoke(this, args, opts)
  }
}

/** Convenience factory. Mirrors `createClient()` idioms from Wagmi/Viem. */
export function createClient(options: ClientOptions): AllowanceGuardClient {
  return new AllowanceGuardClient(options)
}
