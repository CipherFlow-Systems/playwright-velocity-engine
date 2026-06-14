import { test as setup, expect } from '@playwright/test';
import { STORAGE_STATE } from '../playwright.config';

setup('authenticate user and cache session state', async ({ page }) => {
  // Navigate to a real, live public sandbox login page
  await page.goto('https://the-internet.herokuapp.com/login');

  // Fill real working demo credentials
  await page.getByRole('textbox', { name: /username/i }).fill('tomsmith');
  await page.getByRole('textbox', { name: /password/i }).fill('SuperSecretPassword!');
  
  // Submit the form
  await page.getByRole('button', { name: /login/i }).click();

  // Assert that we successfully bypassed the gate by checking for the logout button
  await expect(page.getByRole('link', { name: /logout/i })).toBeVisible({ timeout: 10000 });

  // Save the authentic browser context storage state to disk
  await page.context().storageState({ path: STORAGE_STATE });
});
