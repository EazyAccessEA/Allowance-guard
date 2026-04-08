import { describe, expect, it, vi } from 'vitest'
import { AllowanceGuardClient, createClient } from '../client'
import {
  ApiError,
  AuthError,
  NetworkError,
  RateLimitError,
  ValidationError,
} from '../errors'

function jsonResponse(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  })
}

function mockFetch(impl: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>) {
  return vi.fn(impl) as unknown as typeof fetch
}

describe('AllowanceGuardClient constructor', () => {
  it('requires an apiKey', () => {
    // @ts-expect-error — testing runtime validation
    expect(() => new AllowanceGuardClient({})).toThrow(AuthError)
  })

  it('accepts a public key', () => {
    const client = new AllowanceGuardClient({
      apiKey: 'ag_pub_test',
      fetch: mockFetch(async () => jsonResponse(200, {})),
    })
    expect(client.isPublicKey).toBe(true)
  })

  it('accepts a secret key in server context', () => {
    // Ensure no `window` exists for this test.
    const hadWindow = 'window' in globalThis
    // @ts-expect-error — deleting optional global
    if (hadWindow) delete (globalThis as { window?: unknown }).window

    const client = new AllowanceGuardClient({
      apiKey: 'ag_live_test',
      fetch: mockFetch(async () => jsonResponse(200, {})),
    })
    expect(client.isPublicKey).toBe(false)
  })

  it('throws when given a secret key in browser context', () => {
    ;(globalThis as { window?: unknown }).window = {}
    try {
      expect(
        () =>
          new AllowanceGuardClient({
            apiKey: 'ag_live_xxx',
            fetch: mockFetch(async () => jsonResponse(200, {})),
          }),
      ).toThrow(AuthError)
    } finally {
      delete (globalThis as { window?: unknown }).window
    }
  })

  it('createClient factory returns an instance', () => {
    const c = createClient({ apiKey: 'ag_pub_x', fetch: mockFetch(async () => jsonResponse(200, {})) })
    expect(c).toBeInstanceOf(AllowanceGuardClient)
  })

  it('normalises trailing slashes on baseUrl', () => {
    const c = new AllowanceGuardClient({
      apiKey: 'ag_pub_x',
      baseUrl: 'https://example.com/api/v1///',
      fetch: mockFetch(async () => jsonResponse(200, {})),
    })
    expect(c.baseUrl).toBe('https://example.com/api/v1')
  })
})

describe('AllowanceGuardClient.request', () => {
  it('sends bearer auth and accept headers', async () => {
    const fetchMock = mockFetch(async (_input, init) => {
      const headers = new Headers(init?.headers)
      expect(headers.get('authorization')).toBe('Bearer ag_pub_k')
      expect(headers.get('accept')).toBe('application/json')
      return jsonResponse(200, { chains: [], count: 0 })
    })
    const client = new AllowanceGuardClient({ apiKey: 'ag_pub_k', fetch: fetchMock })
    await client.getChains()
    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('serialises query params and skips undefined values', async () => {
    const fetchMock = mockFetch(async (input) => {
      const url = new URL(String(input))
      expect(url.pathname).toBe('/api/v1/allowances')
      expect(url.searchParams.get('wallet')).toBe('0xabc')
      expect(url.searchParams.get('riskOnly')).toBe('true')
      expect(url.searchParams.get('chainId')).toBeNull() // omitted
      return jsonResponse(200, { allowances: [], pagination: { page: 1, pageSize: 25, total: 0, totalPages: 0 } })
    })
    const client = new AllowanceGuardClient({
      apiKey: 'ag_pub_k',
      baseUrl: 'https://example.com/api/v1',
      fetch: fetchMock,
    })
    await client.listAllowances({ wallet: '0xabc', riskOnly: true })
  })

  it('unwraps { data } envelopes and returns bare payloads otherwise', async () => {
    const wrapped = mockFetch(async () =>
      jsonResponse(200, { data: { chains: [{ chainId: 1, name: 'Ethereum', symbol: 'ETH', explorer: 'https://etherscan.io' }], count: 1 } }),
    )
    const c1 = new AllowanceGuardClient({ apiKey: 'ag_pub_k', fetch: wrapped })
    const r1 = await c1.getChains()
    expect(r1).toHaveLength(1)
    expect(r1[0]?.name).toBe('Ethereum')

    const bare = mockFetch(async () =>
      jsonResponse(200, { chains: [{ chainId: 2, name: 'Base', symbol: 'ETH', explorer: 'https://basescan.org' }], count: 1 }),
    )
    const c2 = new AllowanceGuardClient({ apiKey: 'ag_pub_k', fetch: bare })
    const r2 = await c2.getChains()
    expect(r2[0]?.name).toBe('Base')
  })
})

describe('error translation', () => {
  const base = { apiKey: 'ag_pub_k' }

  it('401 → AuthError', async () => {
    const c = new AllowanceGuardClient({
      ...base,
      fetch: mockFetch(async () => jsonResponse(401, { error: { message: 'bad key' } })),
    })
    await expect(c.getChains()).rejects.toBeInstanceOf(AuthError)
  })

  it('400 → ValidationError', async () => {
    const c = new AllowanceGuardClient({
      ...base,
      fetch: mockFetch(async () => jsonResponse(400, { error: { message: 'bad input' } })),
    })
    await expect(c.getChains()).rejects.toBeInstanceOf(ValidationError)
  })

  it('429 → RateLimitError with retryAfter', async () => {
    const c = new AllowanceGuardClient({
      ...base,
      fetch: mockFetch(async () => jsonResponse(429, { error: { message: 'slow down' } }, { 'retry-after': '17' })),
    })
    await expect(c.getChains()).rejects.toMatchObject({
      name: 'RateLimitError',
      retryAfterSeconds: 17,
    })
  })

  it('500 → generic ApiError', async () => {
    const c = new AllowanceGuardClient({
      ...base,
      fetch: mockFetch(async () => jsonResponse(500, { error: { message: 'boom' } })),
    })
    await expect(c.getChains()).rejects.toBeInstanceOf(ApiError)
  })

  it('fetch rejection → NetworkError', async () => {
    const c = new AllowanceGuardClient({
      ...base,
      fetch: mockFetch(async () => {
        throw new TypeError('connection refused')
      }),
    })
    await expect(c.getChains()).rejects.toBeInstanceOf(NetworkError)
  })

  it('error messages never leak the API key', async () => {
    const c = new AllowanceGuardClient({
      ...base,
      fetch: mockFetch(async () => jsonResponse(401, { error: { message: 'bad key' } })),
    })
    try {
      await c.getChains()
      throw new Error('should have thrown')
    } catch (err) {
      expect((err as Error).message).not.toContain('ag_pub_k')
    }
  })
})
