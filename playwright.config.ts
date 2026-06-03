import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const FRONT_PORT = process.env.PLAYWRIGHT_PORT ?? "5173";
const BASE_URL = `http://127.0.0.1:${FRONT_PORT}`;
const BACKEND_DIR = path.resolve(ROOT, "..", "UPi-Avatar-NAPSI-backend");

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 180_000,
  expect: { timeout: 120_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command:
        process.platform === "win32"
          ? `powershell -NoProfile -Command "$env:UPI_DEV_MODE='1'; $env:TTS_PROVIDER='none'; $env:OLLAMA_MODEL='llama3.2:3b'; Set-Location '${BACKEND_DIR}'; python -m uvicorn app.main:app --host 127.0.0.1 --port 8000"`
          : `bash -c 'cd "${BACKEND_DIR}" && UPI_DEV_MODE=1 TTS_PROVIDER=none OLLAMA_MODEL=llama3.2:3b python -m uvicorn app.main:app --host 127.0.0.1 --port 8000'`,
      url: "http://127.0.0.1:8000/health",
      reuseExistingServer: true,
      timeout: 180_000,
      cwd: ROOT,
    },
    {
      command: `npm run dev -- --host 127.0.0.1 --port ${FRONT_PORT}`,
      url: BASE_URL,
      reuseExistingServer: true,
      timeout: 60_000,
    },
  ],
});
