// Rollbar Configuration
// Official Rollbar SDK configuration for Next.js
// Documentation: https://docs.rollbar.com/docs/react

// Client-side configuration for React components
export const rollbarClientConfig = {
  accessToken: process.env.NEXT_PUBLIC_ROLLBAR_ACCESS_TOKEN || '',
  environment: process.env.NODE_ENV || 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
  // Additional client-side options
  autoInstrument: {
    network: true,
    log: true,
    dom: true,
    navigation: true,
  },
  // Filter out development noise and missing tokens
  filter: {
    filter: () => {
      // Don't send errors if no access token is configured
      if (!process.env.NEXT_PUBLIC_ROLLBAR_ACCESS_TOKEN) {
        return false;
      }
      // Don't send errors in development unless explicitly enabled
      if (process.env.NODE_ENV === 'development' && !process.env.ROLLBAR_DEBUG) {
        return false;
      }
      return true;
    }
  }
};

// Server-side configuration for API routes and server-side code
export const rollbarServerConfig = {
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN || '',
  environment: process.env.NODE_ENV || 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
  // Server-specific options - removed process.cwd() for Edge Runtime compatibility
  root: '/',
  // Filter out development noise and missing tokens
  filter: {
    filter: () => {
      // Don't send errors if no access token is configured
      if (!process.env.ROLLBAR_ACCESS_TOKEN) {
        return false;
      }
      // Don't send errors in development unless explicitly enabled
      if (process.env.NODE_ENV === 'development' && !process.env.ROLLBAR_DEBUG) {
        return false;
      }
      return true;
    }
  }
};