import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

// Set NODE_ENV to test
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = '../../data/test_database.sqlite';

// Global test setup
beforeAll(async () => {
  // Any global setup code here
});

afterAll(async () => {
  // Any global cleanup code here
});

// Mock console methods in tests to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
