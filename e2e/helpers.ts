import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

export const SESSION_KEY = "upi-session-active";

export async function enterChat(page: Page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page
    .getByRole("button", { name: /Entrar com conta Google/i })
    .click();
  await expect(
    page.getByRole("heading", { name: /UPi — Assistente do NAPSI/i }),
  ).toBeVisible();
}

export async function waitApiOnline(page: Page) {
  await expect
    .poll(
      async () => {
        const res = await page.request.get("/api/health");
        if (!res.ok()) return false;
        const body = (await res.json()) as { ok?: boolean };
        return body.ok === true;
      },
      { timeout: 45_000, intervals: [500, 1000, 2000] },
    )
    .toBe(true);
}

export async function sendChatMessage(page: Page, text: string) {
  const input = page.locator("#main-chat-input");
  await input.fill(text);
  await page.getByRole("button", { name: "Enviar mensagem" }).click();
}

export async function waitForUpiReply(page: Page) {
  await expect(page.getByLabel("UPi está digitando")).toBeHidden({
    timeout: 120_000,
  });
  const articles = page.locator('#chat-messages [role="article"]');
  await expect(articles.last()).toBeVisible({ timeout: 5_000 });
  return (await articles.last().innerText()).trim();
}

export async function clickQuickQuestion(page: Page, question: string) {
  await page.getByRole("button", { name: question, exact: true }).click();
  return waitForUpiReply(page);
}
