import { neon, type NeonQueryFunction } from '@neondatabase/serverless'
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http'

// Lazy-initialise so the module can be imported without crashing when
// DATABASE_URL is absent (e.g. during Next.js build page data collection).
let _sql: NeonQueryFunction<false, false> | null = null
let _db: NeonHttpDatabase | null = null

function getSql(): NeonQueryFunction<false, false> {
  if (!_sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set')
    }
    _sql = neon(process.env.DATABASE_URL)
  }
  return _sql
}

function getDb(): NeonHttpDatabase {
  if (!_db) {
    _db = drizzle(getSql())
  }
  return _db
}

// Proxy-based lazy exports: callers use `db.select()...` and `sql`
// as before, but the underlying connection is only created on first use.
export const sql: NeonQueryFunction<false, false> = new Proxy(
  (() => {}) as unknown as NeonQueryFunction<false, false>,
  {
    apply(_target, _thisArg, args: unknown[]) {
      return getSql()(...(args as Parameters<NeonQueryFunction<false, false>>))
    },
    get(_target, prop, receiver) {
      return Reflect.get(getSql(), prop, receiver)
    },
  }
)

export const db: NeonHttpDatabase = new Proxy(
  {} as NeonHttpDatabase,
  {
    get(_target, prop, receiver) {
      return Reflect.get(getDb(), prop, receiver)
    },
  }
)
