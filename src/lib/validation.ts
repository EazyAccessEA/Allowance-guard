import { z } from 'zod'

// Enhanced validation schemas
export const walletAddressSchema = z.string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address format')
  .transform(addr => addr.toLowerCase())

export const chainIdSchema = z.number()
  .int()
  .positive()
  .refine(id => [1, 42161, 8453].includes(id), 'Unsupported chain ID')

export const paginationSchema = z.object({
  page: z.number().int().min(1).max(1000).default(1),
  pageSize: z.number().int().min(1).max(100).default(25)
})

export const scanRequestSchema = z.object({
  walletAddress: walletAddressSchema,
  chains: z.array(z.enum(['eth', 'arb', 'base'])).optional()
})

export const allowanceQuerySchema = z.object({
  wallet: walletAddressSchema,
  riskOnly: z.boolean().optional(),
  ...paginationSchema.shape
})

export const contributionRequestSchema = z.object({
  amount: z.number().min(1).max(10000),
  email: z.string().email().optional(),
  name: z.string().max(100).optional(),
  message: z.string().max(500).optional()
})

export const emailSchema = z.string()
  .email('Invalid email format')
  .max(254, 'Email too long')

export const tokenAddressSchema = z.string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid token address format')
  .transform(addr => addr.toLowerCase())

export const spenderAddressSchema = z.string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid spender address format')
  .transform(addr => addr.toLowerCase())

// Input sanitization
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .slice(0, 1000) // Limit length
}

export function sanitizeNumber(input: string | number): number {
  const num = typeof input === 'string' ? parseFloat(input) : input
  if (isNaN(num) || !isFinite(num)) {
    throw new Error('Invalid number')
  }
  return num
}