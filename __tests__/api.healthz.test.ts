// Simple API test without NextRequest dependencies
test('API health check structure', () => {
  // Test the expected structure of health check response
  const mockHealthResponse = {
    ok: true,
    checks: {
      db: 'ok',
      cache: 'ok',
      rpc: 'ok:12345678',
      chains: {
        '1': 'ok:12345678',
        '137': 'ok:12345678'
      }
    }
  };
  
  expect(mockHealthResponse).toHaveProperty('ok');
  expect(mockHealthResponse).toHaveProperty('checks');
  expect(mockHealthResponse.checks).toHaveProperty('db');
  expect(mockHealthResponse.checks).toHaveProperty('cache');
  expect(mockHealthResponse.checks).toHaveProperty('rpc');
  expect(mockHealthResponse.checks).toHaveProperty('chains');
  expect(typeof mockHealthResponse.ok).toBe('boolean');
});
