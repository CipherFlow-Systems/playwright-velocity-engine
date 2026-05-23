import type { Page, Locator } from '@playwright/test';

// BasePage: lightweight, framework-level wrapper for common interactions.
// Architectural goals:
// - Provide consistent, test-friendly helper primitives (navigate, role/label-based helpers)
// - Keep methods small and composable so page objects remain thin and focused

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigate to a path (accepts absolute URL or path relative to a configured baseUrl)
  async goto(urlOrPath: string) {
    await this.page.goto(urlOrPath);
  }

  // Utility: get a locator by ARIA role (semantic, accessibility-first)
  protected getByRole(role: Parameters<Page['getByRole']>[0], options?: Parameters<Page['getByRole']>[1]): Locator {
    return this.page.getByRole(role as any, options);
  }

  // Utility: get a locator by label (forms accessibility)
  protected getByLabel(text: string, options?: { exact?: boolean }): Locator {
    return this.page.getByLabel(text, options);
  }

  // Generic click wrapper that waits for the element to be actionable
  async click(locator: Locator) {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  // Generic fill wrapper with built-in visibility wait
  async fill(locator: Locator, value: string) {
    await locator.waitFor({ state: 'visible' });
    await locator.fill(value);
  }
}

export default BasePage;
