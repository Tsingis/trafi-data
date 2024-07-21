import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    stdout: "ignore",
    stderr: "pipe",
    timeout: 60000
  },
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
      name: "Google Chrome",
      use: { ...devices["Desktop Chrome"],
        screenshot: "off",
        video: "off",
        trace: "off"
      },
    },
  ],
});