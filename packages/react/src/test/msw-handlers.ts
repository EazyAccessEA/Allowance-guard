import { http, HttpResponse } from 'msw'
import { TEST_API_BASE } from './constants'

export const allowanceGuardHandlers = [
  http.get(`${TEST_API_BASE}/chains`, () =>
    HttpResponse.json({
      chains: [
        {
          chainId: 1,
          name: 'Ethereum',
          symbol: 'ETH',
          explorer: 'https://etherscan.io',
        },
      ],
      count: 1,
    }),
  ),

  http.get(`${TEST_API_BASE}/allowances`, ({ request }) => {
    const url = new URL(request.url)
    if (!url.searchParams.get('wallet')) {
      return HttpResponse.json({ error: 'wallet required' }, { status: 400 })
    }
    return HttpResponse.json({
      allowances: [],
      pagination: { page: 1, pageSize: 50, total: 0, totalPages: 0 },
    })
  }),

  http.post(`${TEST_API_BASE}/scan`, async ({ request }) => {
    const body = (await request.json()) as { wallet: string; chains?: number[] }
    return HttpResponse.json({
      scanId: 42,
      wallet: body.wallet,
      chains: body.chains ?? [1],
      status: 'pending' as const,
      statusUrl: '/api/v1/scan/42',
    })
  }),
]
