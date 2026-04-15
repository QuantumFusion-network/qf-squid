import { defineConfig } from "vitest/config"

import viteConfig from "./vite.config"

export default defineConfig({
  ...viteConfig,
  test: {
    include: ["src/**/*.test.ts"],
    exclude: ["e2e/**"],
  },
})
