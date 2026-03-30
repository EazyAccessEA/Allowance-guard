import { reportClientInfo } from '@/lib/rollbar'

export const onRouterTransitionStart = () => {
  // Router transition tracking can be added here if needed
  reportClientInfo('Router transition started')
}
