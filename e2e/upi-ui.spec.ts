import { test, expect } from "@playwright/test";
import {
  enterChat,
  waitApiOnline,
  sendChatMessage,
  waitForUpiReply,
  clickQuickQuestion,
} from "./helpers";

test.describe("UPi — interface", () => {
  test.beforeEach(async ({ page }) => {
    await enterChat(page);
    await waitApiOnline(page);
  });

  test("login e painel principal carregam", async ({ page }) => {
    await expect(page.locator("#main-chat")).toBeVisible();
    await expect(page.locator("#main-chat-input")).toBeVisible();
    await expect(page.getByText("Perguntas frequentes")).toBeVisible();
  });

  test("proxy /api/health responde ok", async ({ page }) => {
    const res = await page.request.get("/api/health");
    expect(res.ok()).toBeTruthy();
    expect((await res.json()).ok).toBe(true);
  });

  test("mensagem manual no chat", async ({ page }) => {
    await sendChatMessage(page, "Olá UPi");
    const reply = await waitForUpiReply(page);
    expect(reply.length).toBeGreaterThan(5);
    expect(reply.toLowerCase()).not.toContain("não tô conseguindo me conectar");
  });

  test("pergunta rápida: local do NAPSI", async ({ page }) => {
    const reply = await clickQuickQuestion(page, "Onde fica o NAPSI?");
    const lower = reply.toLowerCase();
    expect(
      lower.includes("bloco") || lower.includes("sala") || lower.includes("napsi"),
    ).toBeTruthy();
  });

  test("nova conversa restaura boas-vindas", async ({ page }) => {
    await sendChatMessage(page, "teste");
    await waitForUpiReply(page);
    await page.getByRole("button", { name: "Nova conversa" }).first().click();
    await expect(page.getByText(/Sou o UPi/i)).toBeVisible();
  });
});
