import { test, expect } from "@playwright/test";
import {
  enterChat,
  waitApiOnline,
  clickQuickQuestion,
  sendChatMessage,
  waitForUpiReply,
} from "./helpers";

test.describe("UPi — chat (API ligada)", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await enterChat(page);
    await waitApiOnline(page);
  });

  test("pergunta rápida: agendamento", async ({ page }) => {
    const reply = await clickQuickQuestion(page, "Como agendar um atendimento?");
    expect(/napsi|e-mail|email|agendar/i.test(reply)).toBeTruthy();
  });

  test("saudação sem apelido íntimo na resposta", async ({ page }) => {
    await sendChatMessage(page, "oi lindo");
    const reply = await waitForUpiReply(page);
    expect(/upi|napsi/i.test(reply)).toBeTruthy();
    expect(/\blindo\b|\blinda\b/i.test(reply)).toBeFalsy();
    expect(/seja bem-vindo/i.test(reply)).toBeFalsy();
  });

  test("pergunta rápida: TEA menciona autismo", async ({ page }) => {
    const reply = await clickQuickQuestion(
      page,
      "O NAPSI apoia alunos com TEA?",
    );
    const lower = reply.toLowerCase();
    expect(/tea|autis|espectro/.test(lower)).toBeTruthy();
    expect(/tempo\s+extraordin/i.test(lower)).toBeFalsy();
  });
});
