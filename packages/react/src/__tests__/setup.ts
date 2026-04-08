/**
 * Vitest global setup for @allowance-guard/react.
 *
 * Starts an MSW (Mock Service Worker) node server before the test suite,
 * resets handlers between tests, and shuts the server down after the suite.
 *
 * Individual tests override handlers with `server.use(...)` to simulate
 * success / error / rate-limit responses for specific endpoints.
 */
import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { defaultHandlers } from './handlers'

export const server = setupServer(...defaultHandlers)

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
