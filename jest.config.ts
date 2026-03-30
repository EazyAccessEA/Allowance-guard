import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  roots: ['<rootDir>'],
  moduleFileExtensions: ['ts','tsx','js','jsx','json'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx'
      },
      transpilation: true,
      diagnostics: false
    }],
  },
  moduleNameMapper: {
    // Support path aliases from tsconfig.json if you use them
    '^@/(.*)$': '<rootDir>/$1',
    // Stub out CSS/asset imports
    '\\.(css|less|scss|sass)$': '<rootDir>/test/styleStub.js',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/dist/',
    '/tests/', // Exclude Playwright tests
  ],
};

export default config;
