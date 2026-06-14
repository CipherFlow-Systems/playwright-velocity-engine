import { test, expect } from '@playwright/test';

test('verify analytics dashboard loads instantly using cached session', async ({ page }) => {
  // Directly navigate straight to internal, protected pages
  await page.goto('https://app.cipherflowsystems.com/dashboard/analytics');

  // The browser instance is already logged in behind the scenes
  await expect(page.getByRole('region', { name: /metrics summary/i })).toBeVisible();
});

