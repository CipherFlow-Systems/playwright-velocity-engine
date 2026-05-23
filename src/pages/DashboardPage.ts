import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

// DashboardPage: models a landing/dashboard after auth
// Keep the page object focused on user-facing interactions and assertions
export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Example: application banner/logo exposed as an ARIA role
  get header(): Locator {
    // Strongly prefer ARIA role+name for stability and accessibility checks
    return this.getByRole('heading', { name: 'CipherFlow Dashboard' });
  }

  get profileMenu(): Locator {
    return this.getByRole('button', { name: 'User menu' });
  }

  async waitForReady() {
    await this.header.waitFor({ state: 'visible' });
  }
}

export default DashboardPage;
