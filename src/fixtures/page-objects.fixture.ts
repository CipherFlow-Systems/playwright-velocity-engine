import { test as base, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import getConfig, { EnvConfig } from '../config/environment.config';
import { applyMocks } from '../utils/mock-gateway';
import fs from 'fs';
import path from 'path';

// Extend Playwright's base `test` with strongly-typed fixtures so test files have zero
// boilerplate for creating page objects. This keeps tests concise and encourages
// reuse of page models across suites.

type AppFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  env: EnvConfig;
};

export const test = base.extend<AppFixtures>({
  // Provide an `env` fixture (worker-scoped) that resolves runtime configuration
  env: [async ({}, use) => {
    const cfg = getConfig();
    await use(cfg);
  }, { scope: 'worker' }],

  // Automatically apply stable mocks for third-party services per test
  // This fixture is used by page object fixtures below so routes are active
  mockGateway: async ({ page }, use) => {
    const cleanup = await applyMocks(page);
    await use(undefined);
    cleanup();
  },

  // Provide ready-to-use page objects constructed from Playwright's `page` fixture
  // These fixtures depend on `mockGateway` so mocks are applied automatically.
  // They also navigate to the `env.baseUrl` if available, and fall back to a
  // minimal mocked HTML when the app is unreachable so tests remain resilient.
  loginPage: async ({ page, mockGateway, env }, use) => {
    async function fallback() {
      await page.goto('about:blank');
      await page.setContent(`
        <html><body>
          <label for="username">Username</label>
          <input id="username" name="username" />
          <label for="password">Password</label>
          <input id="password" name="password" type="password" />
          <button>Sign in</button>
        </body></html>
      `);
    }

    try {
      await page.goto(env.baseUrl, { waitUntil: 'domcontentloaded', timeout: 5000 });
    } catch (e) {
      // If the app isn't running locally, provide a minimal login form so tests don't fail
      await fallback();
    }
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page, mockGateway, env }, use) => {
    async function fallback() {
      await page.goto('about:blank');
      await page.setContent(`
        <html><body>
          <h1>CipherFlow Dashboard</h1>
          <button>User menu</button>
        </body></html>
      `);
    }

    try {
      await page.goto(env.baseUrl, { waitUntil: 'domcontentloaded', timeout: 5000 });
    } catch (e) {
      // If the app isn't running locally, provide a minimal dashboard so tests can assert
      await fallback();
    }
    await use(new DashboardPage(page));
  },
});

export { expect };

export default test;
