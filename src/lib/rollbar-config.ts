// Rollbar Configuration
// Official Rollbar SDK configuration for Next.js
// Documentation: https://docs.rollbar.com/docs/react

// Client-side configuration for React components
export const rollbarClientConfig = {
  accessToken: process.env.NEXT_PUBLIC_ROLLBAR_ACCESS_TOKEN || '',
  environment: process.env.NODE_ENV || 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
  // Additional client-side options - disabled to prevent infinite loops
  autoInstrument: {
    network: false,
    log: false,
    dom: false,
    navigation: false,
  },
  // Filter out development noise and missing tokens
  filter: {
    filter: (payload: unknown) => {
      // Don't send errors if no access token is configured
      if (!process.env.NEXT_PUBLIC_ROLLBAR_ACCESS_TOKEN) {
        return false;
      }
      // Don't send errors in development unless explicitly enabled
      if (process.env.NODE_ENV === 'development' && !process.env.ROLLBAR_DEBUG) {
        return false;
      }
      // Prevent Rollbar from capturing its own errors (infinite loop protection)
      if (payload && typeof payload === 'object' && payload !== null) {
        const payloadObj = payload as Record<string, unknown>;
        if (payloadObj.body && typeof payloadObj.body === 'object' && payloadObj.body !== null) {
          const body = payloadObj.body as Record<string, unknown>;
          if (body.trace && typeof body.trace === 'object' && body.trace !== null) {
            const trace = body.trace as Record<string, unknown>;
            if (trace.frames && Array.isArray(trace.frames)) {
              const frames = trace.frames as Array<Record<string, unknown>>;
              for (const frame of frames) {
                if (frame.filename && typeof frame.filename === 'string' && frame.filename.includes('rollbar')) {
                  return false;
                }
              }
            }
          }
        }
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
    filter: (payload: unknown) => {
      // Don't send errors if no access token is configured
      if (!process.env.ROLLBAR_ACCESS_TOKEN) {
        return false;
      }
      // Don't send errors in development unless explicitly enabled
      if (process.env.NODE_ENV === 'development' && !process.env.ROLLBAR_DEBUG) {
        return false;
      }
      // Prevent Rollbar from capturing its own errors (infinite loop protection)
      if (payload && typeof payload === 'object' && payload !== null) {
        const payloadObj = payload as Record<string, unknown>;
        if (payloadObj.body && typeof payloadObj.body === 'object' && payloadObj.body !== null) {
          const body = payloadObj.body as Record<string, unknown>;
          if (body.trace && typeof body.trace === 'object' && body.trace !== null) {
            const trace = body.trace as Record<string, unknown>;
            if (trace.frames && Array.isArray(trace.frames)) {
              const frames = trace.frames as Array<Record<string, unknown>>;
              for (const frame of frames) {
                if (frame.filename && typeof frame.filename === 'string' && frame.filename.includes('rollbar')) {
                  return false;
                }
              }
            }
          }
        }
      }
      return true;
    }
  }
};