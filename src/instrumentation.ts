import { reportError } from '@/lib/rollbar'

export async function register() {
  // Rollbar is initialized in the rollbar.ts file
}

export function onRequestError(
  err: unknown,
  request: {
    path: string
    method: string
    headers: Record<string, string | string[] | undefined>
  },
  requestContext: {
    route: string
    routeType: string
    routerKind: string
    routePath: string
  }
) {
  if (err instanceof Error) {
    reportError(err, { request, requestContext })
  } else {
    reportError(new Error(String(err)), { request, requestContext })
  }
}
