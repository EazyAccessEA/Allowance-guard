// scripts/migrate.ts
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { Client } from 'pg'

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL missing')
  const client = new Client({ connectionString: url })
  await client.connect()
  const dir = join(process.cwd(), 'migrations')
  const files = readdirSync(dir).filter(f => f.endsWith('.sql')).sort()
  for (const f of files) {
    const sql = readFileSync(join(dir, f), 'utf8')
    console.log(`Applying ${f}…`)
    await client.query(sql)
  }
  await client.end()
  console.log('Migrations complete.')
}

main().catch(e => { console.error(e); process.exit(1) })
