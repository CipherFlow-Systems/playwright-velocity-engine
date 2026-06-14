import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'html',
  
  projects: [
    // Define the isolated Setup Project first
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // Main E2E testing project that consumes the cached state
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // This injects the cookies/tokens instantly into every test instance
        storageState: 'playwright/.auth/user.json',
      },
      // This tells Playwright it cannot run until the 'setup' project succeeds
      dependencies: ['setup'],
    },
  ],
});
