import { defineConfig, devices } from '@playwright/test';
import path from 'path';

// Define explicit path references to avoid cross-platform path issues in Linux CI containers
export const STORAGE_STATE = path.join(__dirname, 'playwright/.auth/user.json');

export default defineConfig({
  // Point to your tests root directory
  testDir: './tests',
  
  // Prevent tests from running longer than 30 seconds
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  
  // Enforce parallel test runner settings
  fullyParallel: true,
  
  // Fail the build in CI if a developer accidentally leaves test.only in code
  forbidOnly: !!process.env.CI,
  
  // Retries set to 2 in CI to account for genuine transient network drops, 0 locally
  retries: process.env.CI ? 2 : 0,
  
  // Run fewer workers in CI to optimize container CPU overhead
  workers: process.env.CI ? 2 : undefined,
  
  // Use HTML reporter for visual diagnostics tracking
  reporter: 'html',
  
  use: {
    // Base URL context path for short navigation commands (e.g. page.goto('/dashboard'))
    baseUrl: 'https://app.cipherflowsystems.com',
    
    // Capture visual traces on failure for rapid debugging
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  /* Configure the isolated project dependency map */
  projects: [
    // 1. The Isolated Global Authentication setup phase
    {
      name: 'setup',
      // Explicitly matches only setup files, keeping regular tests clean
      testMatch: /.*\.setup\.ts/,
    },

    // 2. Main E2E Testing Engine (Chromium)
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Explicitly injects the cached session file state 
        storageState: STORAGE_STATE,
      },
      // Forces Playwright to block until the setup job passes completely
      dependencies: ['setup'],
      // Prevents the main suite from running the setup script twice
      testIgnore: /.*\.setup\.ts/,
    },
  ],
});
