// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: true,
  reporter: [
    ['list'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  // Playwright starts the app itself (reseeding first) and waits for it to
  // respond before running any test - both locally and in CI. Locally, if
  // you already have `npm start` running in another terminal, it reuses
  // that server instead of starting a second one.
  webServer: {
    command: 'npm run seed && npm start',
    url: 'http://localhost:3000/products',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
