/**
 * scripts/generate-openapi.ts
 *
 * Regenerates `packages/client/src/types.generated.ts` from the canonical
 * OpenAPI 3.1 document at `src/app/api/v1/openapi.json`.
 *
 * Usage:
 *   pnpm run generate:openapi
 *
 * Requires `openapi-typescript` as a root devDependency (`pnpm install`).
 *
 * Source of truth for the spec itself is `src/app/api/v1/openapi.json`,
 * which is currently hand-authored. A future task is to generate that
 * JSON from the Zod schemas already defined on each `/api/v1/*\/route.ts`
 * via `@asteasolutions/zod-to-openapi` (see
 * docs/architecture/allowance-guard-react-hooks.md, section 5).
 *
 */

/* eslint-disable no-console */

import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const repoRoot = resolve(__dirname, '..')
const specPath = resolve(repoRoot, 'src/app/api/v1/openapi.json')
const outPath = resolve(repoRoot, 'packages/client/src/types.generated.ts')

function main(): number {
  if (!existsSync(specPath)) {
    console.error(`OpenAPI spec not found at ${specPath}`)
    return 1
  }

  const result = spawnSync(
    'pnpm',
    ['exec', '--', 'openapi-typescript', specPath, '-o', outPath],
    { stdio: 'inherit', cwd: repoRoot },
  )

  if (result.status !== 0) {
    console.error(
      'generate-openapi: openapi-typescript failed. Install the root devDependency: pnpm add -Dw openapi-typescript',
    )
    return result.status ?? 1
  }

  console.log(`Wrote ${outPath}`)
  return 0
}

process.exit(main())
