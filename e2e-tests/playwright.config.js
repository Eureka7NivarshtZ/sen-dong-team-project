// @ts-check
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  
  /* Cấu hình test ổn định */
  timeout: 5000,
  fullyParallel: false,
  workers: 1, 
  
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  
  /* Reporter to use */
  reporter: "html",
  
  use: {
    baseURL: 'http://localhost:5173',
    trace: "on-first-retry",
  },

  /* Các trình duyệt */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  /* Tự động chạy web server khi test */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});