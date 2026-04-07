/**
 * scripts/generate-openapi.ts
 *
 * Regenerates `packages/client/src/types.generated.ts` from the canonical
 * OpenAPI 3.1 document at `src/app/api/v1/openapi.json`.
 *
 * Usage:
 *   pnpm dlx openapi-typescript src/app/api/v1/openapi.json -o packages/client/src/types.generated.ts
 *
 * Or, once `openapi-typescript` is committed as a devDependency of the
 * repo root, run this script directly with `tsx scripts/generate-openapi.ts`.
 *
 * Source of truth for the spec itself is `src/app/api/v1/openapi.json`,
 * which is currently hand-authored. A future task is to generate that
 * JSON from the Zod schemas already defined on each `/api/v1/*\/route.ts`
 * via `@asteasolutions/zod-to-openapi` (see
 * docs/architecture/allowance-guard-react-hooks.md §5).
 *
 * Until `openapi-typescript` is installed, running this script emits a
 * helpful error instead of silently succeeding.
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

  // Prefer a locally-installed openapi-typescript; fall back to `pnpm dlx`.
  const result = spawnSync(
    'pnpm',
    ['dlx', 'openapi-typescript', specPath, '-o', outPath],
    { stdio: 'inherit', cwd: repoRoot },
  )

  if (result.status !== 0) {
    console.error(
      'generate-openapi: openapi-typescript failed. If this is the first ' +
        'run, install it with: pnpm add -Dw openapi-typescript',
    )
    return result.status ?? 1
  }

  console.log(`Wrote ${outPath}`)
  return 0
}

process.exit(main())
