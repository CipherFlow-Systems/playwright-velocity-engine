import { test, expect } from '@playwright/test';

test('verify secure dashboard loads instantly using cached session', async ({ page }) => {
  // Navigate straight back to the internal secure page 
  await page.goto('https://the-internet.herokuapp.com/secure');

  // The browser instance bypasses the form because it is already logged in!
  await expect(page.locator('h2')).toContainText('Secure Area');
});
