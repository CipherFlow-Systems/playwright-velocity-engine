import { test as setup, expect } from '@playwright/test';

// Define where the authenticated browser session state will be saved
const authFile = 'playwright/.auth/user.json';

setup('authenticate user and cache session state', async ({ page }) => {
  // 1. Navigate to your application's login endpoint
  await page.goto('https://app.cipherflowsystems.com/login');

  // 2. Use resilient semantic locators to fill credentials
  await page.getByRole('textbox', { name: /email/i }).fill('engineering-test@cipherflowsystems.com');
  await page.getByRole('textbox', { name: /password/i }).fill('SecureFramework2026!');
  
  // 3. Submit the form
  await page.getByRole('button', { name: /sign in/i }).click();

  // 4. Critical: Assert a unique landing page element exists to guarantee successful login before caching
  await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible({ timeout: 10000 });

  // 5. Save storage state (cookies and localStorage) to disk
  await page.context().storageState({ path: authFile });
});

