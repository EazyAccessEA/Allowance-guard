// Rollbar Configuration
// Official Rollbar SDK configuration for Next.js
// Documentation: https://docs.rollbar.com/docs/react

// Client-side configuration for React components
export const rollbarClientConfig = {
  accessToken: process.env.NEXT_PUBLIC_ROLLBAR_ACCESS_TOKEN || 'YOUR_CLIENT_ACCESS_TOKEN_HERE',
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
  // Filter out development noise
  filter: {
    filter: (payload: unknown) => {
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
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN || 'YOUR_SERVER_ACCESS_TOKEN_HERE',
  environment: process.env.NODE_ENV || 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
  // Server-specific options
  root: process.cwd(),
  // Filter out development noise
  filter: {
    filter: (payload: unknown) => {
      // Don't send errors in development unless explicitly enabled
      if (process.env.NODE_ENV === 'development' && !process.env.ROLLBAR_DEBUG) {
        return false;
      }
      return true;
    }
  }
};
