// Comprehensive input validation schemas
import { z } from 'zod'

// Common validation patterns
const walletAddressRegex = /^0x[a-fA-F0-9]{40}$/

// Base schemas
export const walletAddressSchema = z.string()
  .regex(walletAddressRegex, 'Invalid wallet address format')
  .min(42, 'Wallet address must be 42 characters')
  .max(42, 'Wallet address must be 42 characters')

export const emailSchema = z.string()
  .email('Invalid email format')
  .max(254, 'Email too long')
  .min(5, 'Email too short')

export const chainIdSchema = z.union([
  z.literal(1),      // Ethereum
  z.literal(42161),  // Arbitrum
  z.literal(8453)    // Base
])

export const chainStringSchema = z.enum(['eth', 'arb', 'base'])

// API request schemas
export const scanRequestSchema = z.object({
  walletAddress: walletAddressSchema,
  chains: z.array(chainStringSchema).optional()
})

export const allowanceRequestSchema = z.object({
  wallet: walletAddressSchema,
  page: z.number().int().min(1).max(1000).default(1),
  pageSize: z.number().int().min(1).max(100).default(25),
  riskOnly: z.boolean().optional()
})

export const revokeRequestSchema = z.object({
  chainId: chainIdSchema,
  tokenAddress: walletAddressSchema,
  spenderAddress: walletAddressSchema,
  allowanceType: z.string().min(1).max(50)
})

export const bulkRevokeRequestSchema = z.object({
  revokes: z.array(revokeRequestSchema).min(1).max(50)
})

export const emailSubscriptionSchema = z.object({
  email: emailSchema,
  walletAddress: walletAddressSchema.optional(),
  preferences: z.object({
    dailyDigest: z.boolean().default(false),
    riskAlerts: z.boolean().default(true),
    weeklyReport: z.boolean().default(false)
  }).optional()
})

export const donationRequestSchema = z.object({
  amount: z.number().positive().max(10000), // Max $10,000
  currency: z.enum(['usd', 'eur', 'gbp']).default('usd'),
  email: emailSchema.optional(),
  message: z.string().max(500).optional()
})

export const cryptoDonationSchema = z.object({
  amount: z.number().positive().max(10000),
  currency: z.enum(['usd', 'eth', 'btc']),
  email: emailSchema.optional()
})

// Validation middleware
export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return async (data: unknown): Promise<{ success: true; data: T } | { success: false; error: string; details?: unknown }> => {
    try {
      const validated = schema.parse(data)
      return { success: true, data: validated }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: 'Validation failed',
          details: error.issues.map((err: z.ZodIssue) => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code
          }))
        }
      }
      return {
        success: false,
        error: 'Invalid request format'
      }
    }
  }
}

// Sanitization functions
export function sanitizeString(input: string, maxLength: number = 1000): string {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Remove potential HTML
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

export function sanitizeWalletAddress(address: string): string {
  return address.toLowerCase().trim()
}

// Security validation
export function isSuspiciousInput(input: string): boolean {
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /eval\s*\(/i,
    /expression\s*\(/i,
    /vbscript:/i,
    /data:text\/html/i,
    /<iframe/i,
    /<object/i,
    /<embed/i
  ]
  
  return suspiciousPatterns.some(pattern => pattern.test(input))
}

// Rate limiting validation
export function validateRateLimit(): boolean {
  // This would integrate with your rate limiting system
  // For now, return true (no rate limit exceeded)
  return true
}

// Export all schemas for use in API routes
export const schemas = {
  walletAddress: walletAddressSchema,
  email: emailSchema,
  chainId: chainIdSchema,
  chainString: chainStringSchema,
  scanRequest: scanRequestSchema,
  allowanceRequest: allowanceRequestSchema,
  revokeRequest: revokeRequestSchema,
  bulkRevokeRequest: bulkRevokeRequestSchema,
  emailSubscription: emailSubscriptionSchema,
  donationRequest: donationRequestSchema,
  cryptoDonation: cryptoDonationSchema
}
