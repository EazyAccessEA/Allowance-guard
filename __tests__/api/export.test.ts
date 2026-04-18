/**
 * @jest-environment node
 */

/**
 * Tests for GET /api/export/csv and GET /api/export/pdf
 */

jest.mock('@/lib/db', () => {
  const mockClient = {
    query: jest.fn(),
    release: jest.fn(),
  }
  return {
    pool: {
      query: jest.fn(),
      connect: jest.fn().mockResolvedValue(mockClient),
    },
    db: { query: jest.fn() },
  }
})

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn().mockResolvedValue({
    user_id: 1,
    email: 'test@example.com',
    session_id: 'test-session',
  }),
  requireUser: jest.fn().mockResolvedValue({
    user_id: 1,
    email: 'test@example.com',
    session_id: 'test-session',
  }),
}))

// Export requires Pro+ via checkFeature. Grant access so we can
// exercise the actual export paths rather than the 403 guard.
jest.mock('@/lib/feature-gate', () => ({
  checkFeature: jest.fn().mockResolvedValue({ allowed: true }),
  checkWalletQuota: jest.fn().mockResolvedValue({ allowed: true }),
  isFeatureAllowed: jest.fn().mockResolvedValue(true),
  checkChainAccess: jest.fn().mockResolvedValue({ allowed: true }),
}))

jest.mock('@/lib/logger', () => ({
  withReq: jest.fn(() => ({ info: jest.fn(), warn: jest.fn(), error: jest.fn() })),
  apiLogger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => Promise.resolve({ get: jest.fn(), set: jest.fn() })),
  headers: jest.fn(() => Promise.resolve(new Map())),
}))

// Mock pg-query-stream for CSV export
jest.mock('pg-query-stream', () => {
  return jest.fn().mockImplementation(() => {
    const { Readable } = require('stream')
    const readable = new Readable({
      objectMode: true,
      read() {
        // Emit one mock row then end
        this.push({
          chain_id: 1,
          token_address: '0xtoken',
          token_symbol: 'USDC',
          token_name: 'USD Coin',
          spender_address: '0xspender',
          spender_label: 'Uniswap',
          standard: 'ERC20',
          allowance_type: 'approve',
          amount: '1000000',
          is_unlimited: false,
          risk_score: 0,
          risk_flags: [],
          last_seen_block: 12345678,
        })
        this.push(null)
      },
    })
    return readable
  })
})

// Mock pdfkit for PDF export
jest.mock('pdfkit', () => {
  const { EventEmitter } = require('events')
  return jest.fn().mockImplementation(() => {
    const doc = new EventEmitter()
    doc.fontSize = jest.fn().mockReturnValue(doc)
    doc.text = jest.fn().mockReturnValue(doc)
    doc.moveDown = jest.fn().mockReturnValue(doc)
    doc.fillColor = jest.fn().mockReturnValue(doc)
    doc.font = jest.fn().mockReturnValue(doc)
    doc.moveTo = jest.fn().mockReturnValue(doc)
    doc.lineTo = jest.fn().mockReturnValue(doc)
    doc.strokeColor = jest.fn().mockReturnValue(doc)
    doc.stroke = jest.fn().mockReturnValue(doc)
    doc.addPage = jest.fn().mockReturnValue(doc)
    doc.image = jest.fn().mockReturnValue(doc)
    doc.rect = jest.fn().mockReturnValue(doc)
    doc.fill = jest.fn().mockReturnValue(doc)
    doc.save = jest.fn().mockReturnValue(doc)
    doc.restore = jest.fn().mockReturnValue(doc)
    doc.pipe = jest.fn().mockReturnValue(doc)
    doc.lineWidth = jest.fn().mockReturnValue(doc)
    doc.circle = jest.fn().mockReturnValue(doc)
    doc.polygon = jest.fn().mockReturnValue(doc)
    doc.path = jest.fn().mockReturnValue(doc)
    doc.opacity = jest.fn().mockReturnValue(doc)
    doc.rotate = jest.fn().mockReturnValue(doc)
    doc.translate = jest.fn().mockReturnValue(doc)
    doc.scale = jest.fn().mockReturnValue(doc)
    doc.x = 40
    doc.y = 100
    doc.end = jest.fn(() => {
      doc.emit('data', Buffer.from('mock-pdf-content'))
      doc.emit('end')
    })
    return doc
  })
})

import { pool } from '@/lib/db'

const mockPool = pool as { query: jest.Mock; connect: jest.Mock }

const VALID_WALLET = '0x1234567890abcdef1234567890abcdef12345678'

function createRequest(url: string) {
  return new Request(url, { method: 'GET' })
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('GET /api/export/csv', () => {
  test('returns CSV content-type with valid wallet', async () => {
    // The current CSV route fetches all rows via pool.query (not the
    // streamed pg-query-stream path), then serialises in memory.
    mockPool.query.mockResolvedValue({ rows: [] })

    const mockClient = {
      query: jest.fn().mockReturnValue(
        new (require('pg-query-stream'))(),
      ),
      release: jest.fn(),
    }
    mockPool.connect.mockResolvedValue(mockClient)

    const { GET } = await import('@/app/api/export/csv/route')
    const req = createRequest(
      `http://localhost:3000/api/export/csv?wallet=${VALID_WALLET}`,
    )
    const res = await GET(req)

    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('text/csv')
    expect(res.headers.get('content-disposition')).toContain('allowances_')
  })

  test('returns 400 on invalid wallet', async () => {
    const { GET } = await import('@/app/api/export/csv/route')
    const req = createRequest(
      'http://localhost:3000/api/export/csv?wallet=invalid',
    )
    const res = await GET(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain('Invalid wallet')
  })

  test('returns 400 when wallet is missing', async () => {
    const { GET } = await import('@/app/api/export/csv/route')
    const req = createRequest('http://localhost:3000/api/export/csv')
    const res = await GET(req)

    expect(res.status).toBe(400)
  })
})

describe('GET /api/export/pdf', () => {
  test('returns PDF content-type with valid wallet', async () => {
    mockPool.query.mockResolvedValue({ rows: [] })

    const { GET } = await import('@/app/api/export/pdf/route')
    const req = createRequest(
      `http://localhost:3000/api/export/pdf?wallet=${VALID_WALLET}`,
    )
    const res = await GET(req)

    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('application/pdf')
    expect(res.headers.get('content-disposition')).toContain('allowances_')
  })

  test('returns 400 on invalid wallet', async () => {
    const { GET } = await import('@/app/api/export/pdf/route')
    const req = createRequest(
      'http://localhost:3000/api/export/pdf?wallet=invalid',
    )
    const res = await GET(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain('Invalid wallet')
  })

  test('returns 400 when wallet is missing', async () => {
    const { GET } = await import('@/app/api/export/pdf/route')
    const req = createRequest('http://localhost:3000/api/export/pdf')
    const res = await GET(req)

    expect(res.status).toBe(400)
  })

  test('generates PDF with allowance rows', async () => {
    mockPool.query.mockResolvedValue({
      rows: [
        {
          chain_id: 1,
          token_address: '0xtoken',
          token_symbol: 'USDC',
          token_name: 'USD Coin',
          spender_address: '0xspender',
          spender_label: 'Uniswap',
          standard: 'ERC20',
          allowance_type: 'approve',
          amount: '1000000',
          is_unlimited: true,
          risk_score: 5,
          risk_flags: ['STALE'],
        },
      ],
    })

    const { GET } = await import('@/app/api/export/pdf/route')
    const req = createRequest(
      `http://localhost:3000/api/export/pdf?wallet=${VALID_WALLET}`,
    )
    const res = await GET(req)

    expect(res.status).toBe(200)
    // The response body should contain buffer data
    const buffer = await res.arrayBuffer()
    expect(buffer.byteLength).toBeGreaterThan(0)
  })
})
