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
  testTimeout: 30000,
  verbose: false,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  // Run tests sequentially to avoid database conflicts
  maxWorkers: 1,
  // Force exit after tests complete
  forceExit: true,
  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,
  // Detect open handles
  detectOpenHandles: true
};
