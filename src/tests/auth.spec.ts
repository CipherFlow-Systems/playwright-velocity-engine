import test, { expect } from '../fixtures/page-objects.fixture';

test.describe('Auth flow (using global storageState)', () => {
  test('dashboard is accessible without per-test login', async ({ dashboardPage }) => {
    // Because global-setup created a `storageState.json` and Playwright config uses it,
    // the `page` provided to page objects is already authenticated.
    await dashboardPage.waitForReady();
    await expect(dashboardPage.header).toBeVisible();
  });
});
