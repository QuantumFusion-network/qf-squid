import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  fullyParallel: false,
  reporter: "list",
  outputDir: "/tmp/qf-squid-client-playwright",
  use: {
    baseURL: "http://127.0.0.1:4175",
    headless: true,
    trace: "retain-on-failure",
  },
  webServer: {
    command: "VITE_USE_MOCK=true npm run dev -- --host 127.0.0.1 --port 4175",
    url: "http://127.0.0.1:4175",
    reuseExistingServer: true,
    timeout: 30_000,
  },
})
