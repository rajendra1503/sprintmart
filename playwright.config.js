// @ts-check
const { defineConfig } = require('@playwright/test');

// Local runs and GitHub Actions: BASE_URL is unset, so Playwright starts and
// seeds its own throwaway copy of the app (webServer block below).
//
// Jenkins' CD stage sets BASE_URL to point at the persistent "staging"
// Docker container it just built and deployed. In that case there is
// nothing for Playwright to start - it just points at what's already
// running - so the webServer block is skipped entirely.
const baseURL = process.env.BASE_URL || 'http://localhost:3000';

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: true,
  reporter: [
    ['list'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'npm run seed && npm start',
        url: 'http://localhost:3000/products',
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
      },
});