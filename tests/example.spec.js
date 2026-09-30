const { test, expect } = require('@playwright/test');

// This is a single example test showing the project's convention - it is
// NOT the automation suite for this phase. Writing that suite (from the
// user stories in docs/PHASE_1_USER_STORIES.md) is the exercise itself.
//
// Notice this test uses user-facing locators (getByRole, getByLabel) and
// relative paths (baseURL is set in playwright.config.js) rather than CSS
// selectors or full URLs.

test('the shop page loads and shows the catalog', async ({ page }) => {
  await page.goto('/products');

  await expect(page.getByRole('heading', { name: 'Shop' })).toBeVisible();
  await expect(page.getByRole('link', { name: /2-Person Tent/ })).toBeVisible();
});
