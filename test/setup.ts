import '@testing-library/jest-dom';

// Env-var stubs for tests that import modules which validate env at load.
// Production env lives in Vercel; tests only need non-empty values so the
// module-level guards pass. Individual tests can override via process.env
// before import or by mocking the relevant module.
process.env.DATABASE_URL ??= 'postgres://test:test@localhost:5432/test';
process.env.STRIPE_SECRET_KEY ??= 'sk_test_fake_for_jest';
process.env.STRIPE_WEBHOOK_SECRET ??= 'whsec_fake_for_jest';
process.env.NEXT_PUBLIC_APP_URL ??= 'https://www.allowanceguard.com';
process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ??= 'test_project_id';
process.env.OTP_SECRET ??= 'test_otp_secret_at_least_32_chars_long_for_jest_envs';
// Upstash configured-and-working state; the global @upstash/redis mock
// below returns canned responses so no real HTTP call is made.
process.env.UPSTASH_REDIS_REST_URL ??= 'https://fake.upstash.io';
process.env.UPSTASH_REDIS_REST_TOKEN ??= 'fake_upstash_token_for_jest';

// Global stub for @upstash/redis. The package ships ESM syntax that
// ts-jest fails to parse at module load, so every test that imports
// src/lib/cache.ts or src/lib/ratelimit.ts would crash before its own
// mocks get a chance to run. Tests that need real control over the
// client (ratelimit.test.ts, rate-limit.test.ts) call jest.mock with
// their own implementation; this global stub catches everything else.
jest.mock('@upstash/redis', () => ({
  Redis: jest.fn().mockImplementation(() => ({
    incr: jest.fn().mockResolvedValue(1),
    expire: jest.fn().mockResolvedValue(true),
    ttl: jest.fn().mockResolvedValue(60),
    ping: jest.fn().mockResolvedValue('PONG'),
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
    scan: jest.fn().mockResolvedValue([0, []]),
    hincrby: jest.fn().mockResolvedValue(1),
    hgetall: jest.fn().mockResolvedValue({}),
  })),
}));

// If your app uses next/navigation or next/router in components:
jest.mock('next/navigation', () => {
  const actual = jest.requireActual('next/navigation');
  return {
    ...actual,
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
    }),
  };
});
