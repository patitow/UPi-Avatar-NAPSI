import { test, expect } from "@playwright/test";
import {
  enterChat,
  waitApiOnline,
  sendChatMessage,
  waitForUpiReply,
  clickQuickQuestion,
} from "./helpers";

test.describe("UPi — interface (Playwright)", () => {
  test.beforeEach(async ({ page }) => {
    await enterChat(page);
    await waitApiOnline(page);
  });

  test("login e painel principal carregam", async ({ page }) => {
    await expect(page.locator("#main-chat")).toBeVisible();
    await expect(page.locator("#main-chat-input")).toBeVisible();
    await expect(page.getByText("Perguntas frequentes")).toBeVisible();
    await expect(page.getByRole("log", { name: /Histórico de mensagens/i })).toBeVisible();
  });

  test("proxy /api/health — status online", async ({ page }) => {
    const res = await page.request.get("/api/health");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.ok).toBe(true);
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
      lower.includes("bloco") ||
        lower.includes("sala") ||
        lower.includes("napsi"),
    ).toBeTruthy();
  });

  test("pergunta rápida: agendamento", async ({ page }) => {
    const reply = await clickQuickQuestion(
      page,
      "Como agendar um atendimento?",
    );
    const lower = reply.toLowerCase();
    expect(
      lower.includes("napsi") ||
        lower.includes("e-mail") ||
        lower.includes("email") ||
        lower.includes("agendar"),
    ).toBeTruthy();
  });

  test("nova conversa restaura boas-vindas", async ({ page }) => {
    await sendChatMessage(page, "teste");
    await waitForUpiReply(page);
    await page.getByRole("button", { name: "Nova conversa" }).first().click();
    await expect(page.getByText(/Sou o UPi/i)).toBeVisible();
    await expect(page.getByText("Perguntas frequentes")).toBeVisible();
  });

  test("modal de acessibilidade abre e fecha", async ({ page }) => {
    await page.getByRole("button", { name: /Abrir configurações de acessibilidade/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
  });
});
