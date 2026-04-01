// scripts/migrate.ts — Migration runner with rollback, locking, and checksum validation
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { createHash } from 'crypto'
import { Client } from 'pg'

// Load .env.local file
function loadEnvFile() {
  try {
    const envContent = readFileSync('.env.local', 'utf8')
    const lines = envContent.split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '')
          process.env[key] = value
        }
      }
    }
  } catch {
    console.log('No .env.local file found, using system environment variables')
  }
}

function sha256(content: string): string {
  return createHash('sha256').update(content).digest('hex')
}

const LOCK_ID = 123456789 // Advisory lock ID for migrations

async function ensureMigrationsTable(client: Client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT UNIQUE NOT NULL,
      checksum TEXT NOT NULL,
      applied_at TIMESTAMP DEFAULT NOW()
    )
  `)
}

async function acquireLock(client: Client): Promise<boolean> {
  const { rows } = await client.query('SELECT pg_try_advisory_lock($1) AS locked', [LOCK_ID])
  return rows[0].locked === true
}

async function releaseLock(client: Client) {
  await client.query('SELECT pg_advisory_unlock($1)', [LOCK_ID])
}

async function getAppliedMigrations(client: Client): Promise<Map<string, string>> {
  const { rows } = await client.query('SELECT filename, checksum FROM schema_migrations ORDER BY id')
  const map = new Map<string, string>()
  for (const row of rows) {
    map.set(row.filename, row.checksum)
  }
  return map
}

function parseMigration(content: string): { up: string; down: string } {
  // Convention: split on "-- DOWN" marker
  const downMarker = '-- DOWN'
  const idx = content.indexOf(downMarker)
  if (idx === -1) {
    return { up: content, down: '' }
  }
  return {
    up: content.substring(0, idx).trim(),
    down: content.substring(idx + downMarker.length).trim(),
  }
}

async function migrateUp(client: Client, dir: string) {
  const applied = await getAppliedMigrations(client)
  const files = readdirSync(dir).filter(f => f.endsWith('.sql')).sort()

  let appliedCount = 0
  for (const f of files) {
    const content = readFileSync(join(dir, f), 'utf8')
    const checksum = sha256(content)

    if (applied.has(f)) {
      // Check for modifications
      const existingChecksum = applied.get(f)
      if (existingChecksum !== checksum) {
        console.error(`❌ Migration ${f} has been modified after being applied!`)
        console.error(`   Expected checksum: ${existingChecksum}`)
        console.error(`   Current checksum:  ${checksum}`)
        console.error('   Aborting. Do not modify applied migrations.')
        process.exit(1)
      }
      continue // Already applied
    }

    const { up } = parseMigration(content)
    console.log(`⬆ Applying ${f}…`)
    await client.query('BEGIN')
    try {
      await client.query(up)
      await client.query(
        'INSERT INTO schema_migrations (filename, checksum) VALUES ($1, $2)',
        [f, checksum]
      )
      await client.query('COMMIT')
      appliedCount++
    } catch (err) {
      await client.query('ROLLBACK')
      console.error(`❌ Failed to apply ${f}:`, err)
      process.exit(1)
    }
  }

  if (appliedCount === 0) {
    console.log('✅ No new migrations to apply.')
  } else {
    console.log(`✅ Applied ${appliedCount} migration(s).`)
  }
}

async function migrateDown(client: Client, dir: string) {
  const applied = await getAppliedMigrations(client)
  if (applied.size === 0) {
    console.log('No migrations to roll back.')
    return
  }

  // Get the last applied migration
  const { rows } = await client.query(
    'SELECT filename FROM schema_migrations ORDER BY id DESC LIMIT 1'
  )
  const lastFile = rows[0].filename
  const content = readFileSync(join(dir, lastFile), 'utf8')
  const { down } = parseMigration(content)

  if (!down) {
    console.error(`❌ Migration ${lastFile} has no rollback (-- DOWN section).`)
    console.error('   Cannot roll back automatically.')
    process.exit(1)
  }

  console.log(`⬇ Rolling back ${lastFile}…`)
  await client.query('BEGIN')
  try {
    await client.query(down)
    await client.query('DELETE FROM schema_migrations WHERE filename = $1', [lastFile])
    await client.query('COMMIT')
    console.log(`✅ Rolled back ${lastFile}.`)
  } catch (err) {
    await client.query('ROLLBACK')
    console.error(`❌ Failed to roll back ${lastFile}:`, err)
    process.exit(1)
  }
}

async function main() {
  loadEnvFile()

  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL missing')

  const command = process.argv[2] || 'up'
  if (!['up', 'down', 'status'].includes(command)) {
    console.error('Usage: migrate [up|down|status]')
    process.exit(1)
  }

  const client = new Client({ connectionString: url })
  await client.connect()

  await ensureMigrationsTable(client)

  // Acquire advisory lock to prevent concurrent migrations
  const locked = await acquireLock(client)
  if (!locked) {
    console.error('❌ Could not acquire migration lock. Another migration may be running.')
    await client.end()
    process.exit(1)
  }

  const dir = join(process.cwd(), 'migrations')

  try {
    if (command === 'up') {
      await migrateUp(client, dir)
    } else if (command === 'down') {
      await migrateDown(client, dir)
    } else if (command === 'status') {
      const applied = await getAppliedMigrations(client)
      const files = readdirSync(dir).filter(f => f.endsWith('.sql')).sort()
      console.log('Migration status:')
      for (const f of files) {
        const status = applied.has(f) ? '✅' : '⏳'
        console.log(`  ${status} ${f}`)
      }
    }
  } finally {
    await releaseLock(client)
    await client.end()
  }
}

main().catch(e => { console.error(e); process.exit(1) })
