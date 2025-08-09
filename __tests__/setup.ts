import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

// Set NODE_ENV to test
process.env.NODE_ENV = 'test';

// Use in-memory database for CI environment, file database for local testing
if (process.env.CI) {
  process.env.DATABASE_URL = ':memory:';
} else {
  process.env.DATABASE_URL = path.resolve(__dirname, '../data/test_database.sqlite');
}

// Mock email service to prevent actual emails in tests
jest.mock('../src/utils/emailService', () => ({
  sendEmail: jest.fn().mockResolvedValue(true)
}));

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
