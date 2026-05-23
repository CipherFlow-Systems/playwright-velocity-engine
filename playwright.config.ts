import { defineConfig, devices } from '@playwright/test';
import os from 'os';
import path from 'path';

/**
 * Production-quality Playwright config for CipherFlow Systems
 * - Test sources live in `src/tests`
 * - Global storageState is created once by `global-setup` and reused
 * - CI: retries=2, workers tuned for CI runners
 * - Traces/snapshots retained only on failure to save space
 */
export default defineConfig({
  testDir: 'src/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? Math.max(1, Math.floor(os.cpus().length / 2)) : os.cpus().length,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    // Use the shared storage state produced by global-setup to avoid repeated logins
    storageState: path.join(__dirname, 'playwright', '.auth', 'storageState.json'),
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 0,
    navigationTimeout: 30_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  // Global setup will perform a single login and persist `storageState.json`
  globalSetup: require.resolve('./src/global-setup.ts'),
});
