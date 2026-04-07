/**
 * scripts/generate-openapi.ts
 *
 * STUB — not yet wired up. Tracked as a blocking dependency in
 * docs/architecture/allowance-guard-react-hooks.md §11.
 *
 * Intended pipeline:
 *
 *   1. Walk every route under `src/app/api/v1/**\/route.ts`.
 *   2. Each route already defines a Zod schema (`querySchema` or
 *      `bodySchema`). Register those schemas with `@asteasolutions/zod-to-openapi`.
 *   3. Hand-annotate the response shapes per route (one-time cost;
 *      response types are already defined in `src/app/api/v1/*\/route.ts`).
 *   4. Emit a single OpenAPI 3.1 document to `src/app/api/v1/openapi.json`.
 *   5. `packages/client`'s build step consumes that JSON via
 *      `openapi-typescript` to generate `src/types.generated.ts`, which
 *      replaces the hand-authored `src/types.ts`.
 *
 * Why a stub? Until the backend team greenlights installing
 * `@asteasolutions/zod-to-openapi` as a devDep and committing to
 * annotating responses, shipping a half-wired generator would break
 * `pnpm build` for every contributor. This file documents the
 * intended shape so the next person can finish it in one sitting.
 *
 * Acceptance criteria (copied from §14 of the plan):
 *   - OpenAPI spec exists at `src/app/api/v1/openapi.json`
 *   - Spec is generated from Zod schemas in CI (not hand-edited)
 *   - `packages/client` build consumes the spec and regenerates types
 *   - CI fails if the committed spec drifts from the Zod schemas
 */

/* eslint-disable no-console */

async function main(): Promise<void> {
  console.error(
    'scripts/generate-openapi.ts: not yet implemented. ' +
      'See docs/architecture/allowance-guard-react-hooks.md §5 and §11.',
  )
  process.exit(1)
}

void main()
