import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

// LoginPage: concrete page object modeling the login flow.
// 2026 Playwright standards: use readonly getters and lazy locators (via `get` accessors).
export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Lazy locators via `get` accessors preserve the locator identity across calls
  // while evaluating against the live `page` instance.
  get usernameField(): Locator {
    // Prefer semantic label lookups for accessibility stability
    return this.getByLabel('Username');
  }

  // If a control is highly dynamic and there is no accessible name, use a test-id fallback.
  // Keep the fallback commented and document the contract so developers can add `data-testid` safely.
  // Example fallback (UNCOMMENT only when necessary):
  // get usernameFieldTestId(): Locator {
  //   return this.page.getByTestId('login-username');
  // }

  get passwordField(): Locator {
    return this.getByLabel('Password');
  }

  get submitButton(): Locator {
    // semantic role-based locator aligns with accessibility: prefer role+name
    return this.getByRole('button', { name: 'Sign in' });
  }

  // Navigate helper that accepts either absolute URL or path fragment
  async goto(loginPath = '/login') {
    await super.goto(loginPath);
  }

  // High-level action combining the low-level primitives
  async login(username: string, password: string) {
    await this.fill(this.usernameField, username);
    await this.fill(this.passwordField, password);
    await this.click(this.submitButton);
  }
}

export default LoginPage;
