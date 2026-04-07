// src/lib/env.ts — Runtime validation of all environment variables at startup
import { z } from 'zod'

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // Redis (optional — rate limiter fails closed when unavailable)
  REDIS_URL: z.string().optional(),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.string().optional(),

  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required'),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, 'STRIPE_WEBHOOK_SECRET is required'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),

  // Coinbase Commerce
  COINBASE_COMMERCE_API_KEY: z.string().optional(),
  COINBASE_COMMERCE_WEBHOOK_SECRET: z.string().optional(),

  // WalletConnect / Reown
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().min(1, 'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is required'),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url('NEXT_PUBLIC_APP_URL must be a valid URL'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Email (optional — email features disabled when absent)
  // Preferred: Resend. Fallbacks: Postmark, then SMTP.
  RESEND_API_KEY: z.string().optional(),
  POSTMARK_SERVER_TOKEN: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  // Monitoring (optional)
  ROLLBAR_ACCESS_TOKEN: z.string().optional(),
  SLACK_WEBHOOK_URL: z.string().optional(),

  // RPC overrides (optional)
  ETHEREUM_RPC_URL: z.string().optional(),
  ARBITRUM_RPC_URL: z.string().optional(),
  BASE_RPC_URL: z.string().optional(),
  POLYGON_RPC_URL: z.string().optional(),
  OPTIMISM_RPC_URL: z.string().optional(),
  AVALANCHE_RPC_URL: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>

let _env: Env | null = null

/**
 * Validate and return all environment variables.
 * Throws with a clear error listing missing/invalid variables on first call.
 * Subsequent calls return the cached result.
 */
export function getEnv(): Env {
  if (_env) return _env

  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    const issues = result.error.issues
      .map((i: { path: PropertyKey[]; message: string }) => `  - ${i.path.join('.')}: ${i.message}`)
      .join('\n')
    throw new Error(
      `\n❌ Environment variable validation failed:\n${issues}\n\nPlease check your .env.local or deployment environment.\n`
    )
  }

  _env = result.data
  return _env
}

/**
 * Quick access to validated env. Use this instead of process.env directly.
 * Falls back to raw process.env access for optional vars not in the schema.
 */
export const env = new Proxy({} as Env, {
  get(_target, prop: string) {
    try {
      const validated = getEnv()
      return validated[prop as keyof Env]
    } catch {
      // During build time, env vars may not be available yet.
      // Fall back to process.env for build-time access.
      return process.env[prop]
    }
  },
})
