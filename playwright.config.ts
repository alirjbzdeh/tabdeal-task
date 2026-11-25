import { defineConfig, devices } from '@playwright/test'

const PORT = 3100
const MOCK_API_PORT = 3101

export default defineConfig({
  testDir: 'test/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: [
    {
      command: 'node test/e2e/mock-api.mjs',
      env: { PORT: String(MOCK_API_PORT) },
      url: `http://localhost:${MOCK_API_PORT}/health`,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run build && node .output/server/index.mjs',
      env: {
        PORT: String(PORT),
        NUXT_API_BASE: `http://localhost:${MOCK_API_PORT}/api`,
      },
      url: `http://localhost:${PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
  ],
})
