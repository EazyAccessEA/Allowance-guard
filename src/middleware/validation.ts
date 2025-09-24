import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return async (request: NextRequest) => {
    try {
      const body = await request.json()
      const validated = schema.parse(body)
      return { success: true, data: validated }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: 'Invalid request data',
          details: error.issues
        }
      }
      return {
        success: false,
        error: 'Request parsing failed'
      }
    }
  }
}

export function validateQuery<T>(schema: z.ZodSchema<T>) {
  return (request: NextRequest) => {
    try {
      const { searchParams } = new URL(request.url)
      const params = Object.fromEntries(searchParams.entries())
      const validated = schema.parse(params)
      return { success: true, data: validated }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: 'Invalid query parameters',
          details: error.issues
        }
      }
      return {
        success: false,
        error: 'Query parsing failed'
      }
    }
  }
}

export function validateHeaders<T>(schema: z.ZodSchema<T>) {
  return (request: NextRequest) => {
    try {
      const headers = Object.fromEntries(request.headers.entries())
      const validated = schema.parse(headers)
      return { success: true, data: validated }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: 'Invalid headers',
          details: error.issues
        }
      }
      return {
        success: false,
        error: 'Header parsing failed'
      }
    }
  }
}
