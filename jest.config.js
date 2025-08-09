module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/app.ts',
    '!src/swaggerConfig.ts',
    '!src/types/index.ts',
    '!src/cronjobs/**',
    '!src/scripts/**',
    '!src/seeds/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  testTimeout: 10000,
  verbose: !process.env.CI,
  silent: process.env.CI === 'true',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  // Ensure tests run sequentially in CI for database consistency
  maxWorkers: process.env.CI ? 1 : '50%',
  // Force exit after tests complete
  forceExit: true,
  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true
};
