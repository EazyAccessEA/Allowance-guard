/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { validateRequest, validateQuery, validateHeaders } from '@/middleware/validation'

function createMockRequest(body: unknown, url = 'http://localhost/test') {
  return new NextRequest(
    new Request(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }),
  )
}

function createMockGetRequest(url: string) {
  return new NextRequest(new Request(url, { method: 'GET' }))
}

describe('validateRequest', () => {
  const schema = z.object({
    name: z.string().min(1),
    age: z.number().int().positive(),
  })

  it('returns success with valid data', async () => {
    const req = createMockRequest({ name: 'Alice', age: 30 })
    const validator = validateRequest(schema)
    const result = await validator(req)

    expect(result).toEqual({
      success: true,
      data: { name: 'Alice', age: 30 },
    })
  })

  it('returns error with details for invalid data', async () => {
    const req = createMockRequest({ name: '', age: -5 })
    const validator = validateRequest(schema)
    const result = await validator(req)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Invalid request data')
    expect(result.details).toBeDefined()
    expect(Array.isArray(result.details)).toBe(true)
  })

  it('handles JSON parse errors', async () => {
    const req = new NextRequest(
      new Request('http://localhost/test', {
        method: 'POST',
        body: 'not valid json{{{',
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    const validator = validateRequest(schema)
    const result = await validator(req)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Request parsing failed')
    expect(result.details).toBeUndefined()
  })
})

describe('validateQuery', () => {
  const schema = z.object({
    page: z.string(),
    limit: z.string(),
  })

  it('returns success with valid query params', () => {
    const req = createMockGetRequest('http://localhost/test?page=1&limit=10')
    const validator = validateQuery(schema)
    const result = validator(req)

    expect(result).toEqual({
      success: true,
      data: { page: '1', limit: '10' },
    })
  })

  it('returns error with details for invalid params', () => {
    const req = createMockGetRequest('http://localhost/test?page=1')
    const validator = validateQuery(schema)
    const result = validator(req)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Invalid query parameters')
    expect(result.details).toBeDefined()
    expect(Array.isArray(result.details)).toBe(true)
  })
})

describe('validateHeaders', () => {
  const schema = z.object({
    'x-api-key': z.string().min(1),
  })

  it('returns success with valid headers', () => {
    const req = new NextRequest(
      new Request('http://localhost/test', {
        method: 'GET',
        headers: { 'x-api-key': 'my-secret-key' },
      }),
    )
    const validator = validateHeaders(schema)
    const result = validator(req)

    expect(result.success).toBe(true)
    expect(result.data).toMatchObject({ 'x-api-key': 'my-secret-key' })
  })

  it('returns error with details for invalid headers', () => {
    const req = new NextRequest(
      new Request('http://localhost/test', {
        method: 'GET',
        headers: {},
      }),
    )
    const schema2 = z.object({
      'x-api-key': z.string().min(1),
    })
    const validator = validateHeaders(schema2)
    const result = validator(req)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Invalid headers')
    expect(result.details).toBeDefined()
  })
})

describe('return shape consistency', () => {
  it('all validators return { success, data?, error?, details? }', async () => {
    const schema = z.object({ val: z.string() })

    const reqSuccess = createMockRequest({ val: 'ok' })
    const successResult = await validateRequest(schema)(reqSuccess)
    expect(successResult).toHaveProperty('success', true)
    expect(successResult).toHaveProperty('data')

    const reqFail = createMockRequest({ val: 123 })
    const failResult = await validateRequest(schema)(reqFail)
    expect(failResult).toHaveProperty('success', false)
    expect(failResult).toHaveProperty('error')
    expect(failResult).toHaveProperty('details')
  })
})
