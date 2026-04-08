/**
 * Default MSW handlers for the @allowance-guard/react test suite.
 *
 * Every handler returns a happy-path response. Tests that need error
 * cases call `server.use(...)` to override with a failure handler.
 */
import { http, HttpResponse } from 'msw'

export const TEST_BASE_URL = 'https://api.test.allowanceguard.com/api/v1'

export const defaultHandlers = [
  http.get(`${TEST_BASE_URL}/chains`, () =>
    HttpResponse.json({
      chains: [
        { chainId: 1, name: 'Ethereum', symbol: 'ETH', explorer: 'https://etherscan.io' },
        { chainId: 42161, name: 'Arbitrum One', symbol: 'ETH', explorer: 'https://arbiscan.io' },
      ],
      count: 2,
    }),
  ),

  http.get(`${TEST_BASE_URL}/allowances`, ({ request }) => {
    const url = new URL(request.url)
    const wallet = url.searchParams.get('wallet')
    return HttpResponse.json({
      allowances: [
        {
          chain_id: 1,
          token_address: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          spender_address: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
          standard: 'ERC20',
          allowance_type: 'unlimited',
          amount: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
          is_unlimited: true,
          last_seen_block: 19000000,
          risk_score: 85,
          risk_flags: ['unlimited'],
          token_name: 'Test Token',
          token_symbol: 'TST',
          token_decimals: 18,
          spender_label: null,
          spender_trust: null,
        },
      ],
      pagination: { page: 1, pageSize: 25, total: 1, totalPages: 1 },
      _echo: { wallet },
    })
  }),

  http.get(`${TEST_BASE_URL}/risk-score`, ({ request }) => {
    const url = new URL(request.url)
    return HttpResponse.json({
      wallet: url.searchParams.get('wallet'),
      chainId: 'all',
      riskScore: 72,
      riskLevel: 'high',
      breakdown: {
        totalAllowances: 4,
        unlimitedAllowances: 2,
        highRisk: 1,
        mediumRisk: 1,
        lowRisk: 0,
        maxIndividualScore: 85,
        avgRiskScore: 60,
        chainsWithAllowances: 2,
      },
      topRisks: [],
    })
  }),

  http.post(`${TEST_BASE_URL}/scan`, async ({ request }) => {
    const body = (await request.json()) as { wallet: string; chains?: number[] }
    return HttpResponse.json(
      {
        scanId: 42,
        wallet: body.wallet,
        chains: body.chains ?? [1, 42161],
        status: 'pending',
        statusUrl: '/api/v1/scan/42',
      },
      { status: 201 },
    )
  }),
]
