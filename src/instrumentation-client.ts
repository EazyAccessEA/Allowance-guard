import { rollbarClient } from '@/lib/rollbar'

export const onRouterTransitionStart = () => {
  // Router transition tracking can be added here if needed
  if (rollbarClient) {
    rollbarClient.info('Router transition started')
  }
}
