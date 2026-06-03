import { test, expect } from "@playwright/test";
import {
  enterChat,
  waitApiOnline,
  clickQuickQuestion,
  sendChatMessage,
  waitForUpiReply,
} from "./helpers";

/** Critérios mínimos para respostas do assistente NAPSI (conteúdo institucional). */
const SCENARIOS: {
  name: string;
  ask: (page: import("@playwright/test").Page) => Promise<string>;
  mustMatch: RegExp[];
  mustNotMatch?: RegExp[];
}[] = [
  {
    name: "localização NAPSI",
    ask: (page) => clickQuickQuestion(page, "Onde fica o NAPSI?"),
    mustMatch: [/bloco|sala\s*12|napsi/i],
  },
  {
    name: "serviços",
    ask: (page) =>
      clickQuickQuestion(page, "Quais serviços o NAPSI oferece?"),
    mustMatch: [/napsi|apoio|psicoped|acolhimento|atendimento/i],
  },
  {
    name: "TEA",
    ask: (page) =>
      clickQuickQuestion(page, "O NAPSI apoia alunos com TEA?"),
    mustMatch: [/tea|autis|napsi|apoio|atendimento/i],
  },
  {
    name: "tom acolhedor (saudação)",
    ask: async (page) => {
      await sendChatMessage(page, "Oi UPi, tudo bem?");
      return waitForUpiReply(page);
    },
    mustMatch: [/upi|napsi|oi|olá|ajudar|massa|oxe|visse/i],
    mustNotMatch: [/não tô conseguindo me conectar/i],
  },
];

test.describe("UPi — qualidade das respostas (LLM + RAG)", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await enterChat(page);
    await waitApiOnline(page);
  });

  for (const scenario of SCENARIOS) {
    test(`responde sobre: ${scenario.name}`, async ({ page }) => {
      const reply = await scenario.ask(page);
      test.info().attach(`resposta-${scenario.name}`, {
        body: reply,
        contentType: "text/plain",
      });

      expect(reply.length).toBeGreaterThan(10);
      for (const re of scenario.mustMatch) {
        expect(reply, `esperado padrão ${re}`).toMatch(re);
      }
      if (scenario.mustNotMatch) {
        for (const re of scenario.mustNotMatch) {
          expect(reply, `não esperado ${re}`).not.toMatch(re);
        }
      }
    });
  }
});
