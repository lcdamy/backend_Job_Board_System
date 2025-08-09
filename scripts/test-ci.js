#!/usr/bin/env node

// Simple test runner for CI environments
const { spawn } = require('child_process');

// Set environment variables for CI
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = ':memory:';
process.env.CI = 'true';

// Run Jest with CI-specific options
const jest = spawn('npx', [
  'jest',
  '--passWithNoTests',
  '--silent',
  '--ci',
  '--coverage',
  '--watchAll=false',
  '--maxWorkers=1',
  '--forceExit'
], {
  stdio: 'inherit',
  env: process.env
});

jest.on('close', (code) => {
  process.exit(code);
});

jest.on('error', (error) => {
  console.error('Test execution failed:', error);
  process.exit(1);
});
