import { createContext, useContext, useMemo, type ReactNode } from 'react'
import {
  AllowanceGuardClient,
  createClient,
  type ClientOptions,
} from '@allowance-guard/client'

const ClientContext = createContext<AllowanceGuardClient | null>(null)

export interface AllowanceGuardProviderProps extends ClientOptions {
  children: ReactNode
  /**
   * Pass an existing client instance instead of constructing a new one from
   * options. Useful when sharing a client between React and non-React code.
   */
  client?: AllowanceGuardClient
}

/**
 * Provides an `AllowanceGuardClient` instance to descendant hooks.
 *
 * IMPORTANT: this provider does NOT create a `QueryClient`. Consumers must
 * mount their own `QueryClientProvider` above this one. Most Web3 apps
 * already do this via wagmi, so reusing the same QueryClient gives unified
 * invalidation and devtools for free.
 */
export function AllowanceGuardProvider(props: AllowanceGuardProviderProps) {
  const { children, client, ...clientOptions } = props

  const resolved = useMemo<AllowanceGuardClient>(() => {
    if (client) return client
    return createClient(clientOptions)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, clientOptions.apiKey, clientOptions.baseUrl])

  return <ClientContext.Provider value={resolved}>{children}</ClientContext.Provider>
}

/**
 * Retrieves the `AllowanceGuardClient` from context. Throws a clear error
 * if called outside a provider so failures happen at first render, not
 * deep inside a request.
 */
export function useAllowanceGuardClient(): AllowanceGuardClient {
  const client = useContext(ClientContext)
  if (!client) {
    throw new Error(
      '@allowance-guard/react: useAllowanceGuardClient must be used inside ' +
        '<AllowanceGuardProvider>. Wrap your app with the provider and pass an apiKey.',
    )
  }
  return client
}
