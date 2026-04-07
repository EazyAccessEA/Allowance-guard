# @allowance-guard/client

> Framework-agnostic TypeScript client for the [AllowanceGuard](https://www.allowanceguard.com) REST API.

**Status:** `0.0.x` — pre-alpha scaffold. The API surface is **not frozen**. See
[`docs/architecture/allowance-guard-react-hooks.md`](../../docs/architecture/allowance-guard-react-hooks.md)
for the full architecture plan and roadmap to 1.0.

This package is the transport layer that powers:

- `@allowance-guard/react` — React hooks
- future `@allowance-guard/vue` / `@allowance-guard/svelte` adapters
- direct use from Node.js backends, Cloudflare Workers, Deno, and Bun

## Install

```bash
npm install @allowance-guard/client
# or
pnpm add @allowance-guard/client
```

Node **18+** required (uses the global `fetch`).

## Quickstart

```ts
import { createClient } from '@allowance-guard/client'

const client = createClient({
  apiKey: process.env.ALLOWANCE_GUARD_API_KEY!, // ag_live_* on the server, ag_pub_* in the browser
})

const chains = await client.getChains()

const { allowances, pagination } = await client.listAllowances({
  wallet: '0xabc...',
  riskOnly: true,
})

const risk = await client.getRiskScore({ wallet: '0xabc...' })
```

## Auth model

Two key tiers:

| Prefix     | Where                 | Purpose                             |
| ---------- | --------------------- | ----------------------------------- |
| `ag_live_` | **server only**       | Full quota, mutations, private data |
| `ag_pub_`  | browser-safe          | Read-only, IP-rate-limited          |

Passing a secret key (`ag_live_*`) from browser code throws at client
construction. This is a safety rail, not a substitute for proxying sensitive
calls through your own backend.

## Errors

All thrown errors extend `AllowanceGuardError`:

- `NetworkError` — fetch itself failed
- `ApiError` — non-2xx response
- `AuthError` — 401/403
- `RateLimitError` — 429 (has `retryAfterSeconds`)
- `ValidationError` — 400

API keys are **never** included in error messages.

## License

GPL-3.0-or-later. Commercial licensing available — `legal.support@allowanceguard.com`.
