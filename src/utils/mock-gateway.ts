import type { Page, Route } from '@playwright/test';

// Lightweight mock gateway utility
// Usage: call `applyMocks(page)` at test start (or from a fixture). It returns
// a cleanup function to remove registered routes.

export async function applyMocks(page: Page) {
  // Example: mock Stripe API
  const stripePattern = /https:\/\/api.stripe.com\//;
  const analyticsPattern = /https:\/\/analytics.example.com\//;

  const stripeHandler = async (route: Route) => {
    // Return a minimal successful response that mimics Stripe's charge intent
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 'ch_mock_123', status: 'succeeded' }),
    });
  };

  const analyticsHandler = async (route: Route) => {
    // No-op analytics endpoint to keep tests fast and deterministic
    await route.fulfill({ status: 204, body: '' });
  };

  // Register routes
  page.route(stripePattern, stripeHandler);
  page.route(analyticsPattern, analyticsHandler);

  // Optionally intercept other slow third-party hosts via regex or function matcher

  // Return cleanup function
  return () => {
    try {
      page.unroute(stripePattern, stripeHandler as any);
      page.unroute(analyticsPattern, analyticsHandler as any);
    } catch (e) {
      // ignore cleanup errors
    }
  };
}

export default applyMocks;
