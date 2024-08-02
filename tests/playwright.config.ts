import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: ".",
  fullyParallel: true,
  reporter: "list",
  timeout: 60_000,
  expect: {
    timeout: 30_000
  },
  webServer: [{
    command: "npm run http",
    reuseExistingServer: !process.env.CI,
    stdout: "ignore",
    stderr: "pipe",
    timeout: 60_000
  },
  {
    command: "npm run dev",
    reuseExistingServer: !process.env.CI,
    stdout: "ignore",
    stderr: "pipe",
    timeout: 60_000
  },
],
  projects: [
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"],
        screenshot: "off",
        video: "off",
        trace: "off"
      },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"],
        screenshot: "off",
        video: "off",
        trace: "off"
      },
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"],
        screenshot: "off",
        video: "off",
        trace: "off"
      },
    },
  ],
});