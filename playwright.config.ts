import { defineConfig, devices } from "@playwright/test";

const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "html",
  use: {
    baseURL: "http://127.0.0.1:4173",
    headless: process.env.PW_HEADED === "1" ? false : undefined,
    launchOptions: process.env.PW_HEADED === "1" ? { slowMo: 250 } : undefined,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: isCI ? "chromium" : "chrome",
      use: isCI
        ? { ...devices["Desktop Chrome"] }
        : { ...devices["Desktop Chrome"], channel: "chrome" },
    },
  ],
  webServer: {
    command: "pnpm dev --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173/trade",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
