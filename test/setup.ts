import '@testing-library/jest-dom';

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
