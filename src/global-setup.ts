import fs from 'fs';
import path from 'path';
import { chromium, FullConfig } from '@playwright/test';
import getConfig from './config/environment.config';
import { LoginPage } from './pages/LoginPage';

// Global setup: run once before the test suite. Responsible for creating a
// single `storageState.json` that contains authenticated cookies/localStorage.
// This eliminates per-test login boilerplate and speeds up the suite.

export default async function globalSetup(config: FullConfig) {
  const storageDir = path.join(process.cwd(), 'playwright', '.auth');
  const storagePath = path.join(storageDir, 'storageState.json');

  if (fs.existsSync(storagePath)) {
    // Already created by prior run; skip
    return;
  }

  fs.mkdirSync(storageDir, { recursive: true });

  const env = getConfig(process.env.TEST_ENV);
  if (!env.ADMIN_USER || !env.ADMIN_PASS) {
    // Do not throw here; instead warn and create an empty state so tests can still run locally
    console.warn('Global setup: ADMIN_USER/ADMIN_PASS not set. Creating empty storage state.');
    fs.writeFileSync(storagePath, JSON.stringify({ origins: [] }));
    return;
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const loginPage = new LoginPage(page);
    await page.goto(`${env.baseUrl}/login`);
    await loginPage.login(env.ADMIN_USER, env.ADMIN_PASS);

    // Persist authenticated storage state for reuse across tests
    await context.storageState({ path: storagePath });
  } catch (err) {
    console.warn('Global setup: failed to reach application for login. Creating empty storage state.', err);
    // Create an empty storage state so tests can still run in mocked/offline mode
    fs.writeFileSync(storagePath, JSON.stringify({ origins: [] }));
  }
  await browser.close();
}
