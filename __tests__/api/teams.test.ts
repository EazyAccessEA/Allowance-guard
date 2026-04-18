/**
 * @jest-environment node
 */

/**
 * Tests for GET/POST/PUT /api/teams
 */

jest.mock('@/lib/db', () => {
  const mockClient = {
    query: jest.fn().mockResolvedValue({ rows: [{ id: 1, name: 'Team', description: null }] }),
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
  getSession: jest.fn(),
  requireUser: jest.fn(),
}))

jest.mock('@/lib/feature-gate', () => ({
  checkFeature: jest.fn(),
  checkWalletQuota: jest.fn(),
  isFeatureAllowed: jest.fn(),
}))

jest.mock('@/lib/billing', () => ({
  getUserSubscription: jest.fn(),
  createCheckoutSession: jest.fn(),
  createPortalSession: jest.fn(),
  syncSubscription: jest.fn(),
  stripe: { webhooks: { constructEvent: jest.fn() } },
}))

jest.mock('@/lib/logger', () => ({
  withReq: jest.fn(() => ({ info: jest.fn(), warn: jest.fn(), error: jest.fn() })),
  apiLogger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

jest.mock('@/lib/audit', () => ({ auditUser: jest.fn() }))

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => Promise.resolve({ get: jest.fn(), set: jest.fn() })),
  headers: jest.fn(() => Promise.resolve(new Map())),
}))

import { requireUser } from '@/lib/auth'
import { checkFeature } from '@/lib/feature-gate'
import { pool } from '@/lib/db'

const mockRequireUser = requireUser as jest.Mock
const mockCheckFeature = checkFeature as jest.Mock
const mockPool = pool as { query: jest.Mock; connect: jest.Mock }

function createRequest(method: string, url: string, body?: unknown) {
  const init: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
  if (body) init.body = JSON.stringify(body)
  return new Request(url, init)
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('GET /api/teams', () => {
  test('requires authentication', async () => {
    mockRequireUser.mockRejectedValue(new Error('UNAUTHENTICATED'))

    const { GET } = await import('@/app/api/teams/route')

    try {
      const res = await GET()
      expect(res.status).toBe(401)
    } catch (e: unknown) {
      // requireUser throws and is not caught in GET
      expect((e as Error).message).toBe('UNAUTHENTICATED')
    }
  })

  test('returns teams list for authenticated user', async () => {
    mockRequireUser.mockResolvedValue({ user_id: 1, email: 'test@example.com' })
    mockPool.query.mockResolvedValue({
      rows: [
        {
          id: 1,
          name: 'Security Team',
          description: 'Main team',
          role: 'owner',
          member_count: 3,
          wallet_count: 5,
        },
      ],
    })

    const { GET } = await import('@/app/api/teams/route')
    const res = await GET()
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.teams).toHaveLength(1)
    expect(json.teams[0].name).toBe('Security Team')
  })
})

describe('POST /api/teams', () => {
  test('requires authentication', async () => {
    mockRequireUser.mockRejectedValue(new Error('UNAUTHENTICATED'))

    const { POST } = await import('@/app/api/teams/route')
    const req = createRequest('POST', 'http://localhost:3000/api/teams', {
      name: 'New Team',
    })

    try {
      const res = await POST(req as any)
      expect(res.status).toBe(401)
    } catch (e: unknown) {
      expect((e as Error).message).toBe('UNAUTHENTICATED')
    }
  })

  test('requires sentinel plan - returns 403 for free user', async () => {
    mockRequireUser.mockResolvedValue({ user_id: 1, email: 'test@example.com' })
    mockCheckFeature.mockResolvedValue({ allowed: false, requiredPlan: 'sentinel' })

    const { POST } = await import('@/app/api/teams/route')
    const req = createRequest('POST', 'http://localhost:3000/api/teams', {
      name: 'New Team',
    })
    const res = await POST(req as any)

    expect(res.status).toBe(403)
    const json = await res.json()
    expect(json.requiredPlan).toBe('sentinel')
  })

  test('creates team with valid data for sentinel user', async () => {
    mockRequireUser.mockResolvedValue({ user_id: 1, email: 'test@example.com' })
    mockCheckFeature.mockResolvedValue({ allowed: true })

    // Route uses pool.query directly (3 sequential calls: INSERT team,
    // INSERT member, INSERT activity) — no client transaction any more.
    mockPool.query
      .mockResolvedValueOnce({ rows: [{ id: 10, name: 'My Team', description: 'A team' }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })

    const { POST } = await import('@/app/api/teams/route')
    const req = createRequest('POST', 'http://localhost:3000/api/teams', {
      name: 'My Team',
      description: 'A team',
    })
    const res = await POST(req as any)
    const json = await res.json()

    expect(res.status).toBe(201)
    expect(json.ok).toBe(true)
    expect(json.team.name).toBe('My Team')
  })

  test('returns 400 when team name is missing', async () => {
    mockRequireUser.mockResolvedValue({ user_id: 1, email: 'test@example.com' })
    mockCheckFeature.mockResolvedValue({ allowed: true })

    const { POST } = await import('@/app/api/teams/route')
    const req = createRequest('POST', 'http://localhost:3000/api/teams', {})
    const res = await POST(req as any)

    expect(res.status).toBe(400)
  })
})

describe('PUT /api/teams', () => {
  test('requires authentication', async () => {
    mockRequireUser.mockRejectedValue(new Error('UNAUTHENTICATED'))

    const { PUT } = await import('@/app/api/teams/route')
    const req = createRequest('PUT', 'http://localhost:3000/api/teams', {
      teamId: 1,
      name: 'Updated',
    })

    try {
      const res = await PUT(req as any)
      expect(res.status).toBe(401)
    } catch (e: unknown) {
      expect((e as Error).message).toBe('UNAUTHENTICATED')
    }
  })

  test('requires owner or admin role - returns 403 for member', async () => {
    mockRequireUser.mockResolvedValue({ user_id: 1, email: 'test@example.com' })
    mockPool.query.mockResolvedValue({ rows: [{ role: 'member' }] })

    const { PUT } = await import('@/app/api/teams/route')
    const req = createRequest('PUT', 'http://localhost:3000/api/teams', {
      teamId: 1,
      name: 'Updated',
    })
    const res = await PUT(req as any)

    expect(res.status).toBe(403)
  })

  test('allows owner to update team', async () => {
    mockRequireUser.mockResolvedValue({ user_id: 1, email: 'test@example.com' })
    mockPool.query
      .mockResolvedValueOnce({ rows: [{ role: 'owner' }] }) // role check
      .mockResolvedValueOnce({ rows: [] }) // update
      .mockResolvedValueOnce({ rows: [] }) // activity log

    const { PUT } = await import('@/app/api/teams/route')
    const req = createRequest('PUT', 'http://localhost:3000/api/teams', {
      teamId: 1,
      name: 'Updated Name',
    })
    const res = await PUT(req as any)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.ok).toBe(true)
  })
})
