# Acessibilidade — UPi Avatar NAPSI

Documento de referência alinhado às boas práticas **WCAG 2.2** (nível alvo: **AA** para MVP acadêmico).

## Recursos implementados

### Percepção

| Critério | Implementação |
|----------|----------------|
| Contraste (modo alto) | Paleta preto/branco/amarelo via classe `html.high-contrast` |
| `prefers-contrast: more` | Ativa alto contraste automaticamente até o usuário usar Alt+C |
| Tamanho da fonte | Normal, Grande, Extra (`--chat-font-size`) |
| Texto alternativo | Avatar com `aria-label` / `alt` onde aplicável |

### Operação

| Critério | Implementação |
|----------|----------------|
| Teclado | Tab entre controles; Enter envia mensagem; Esc fecha modais |
| Atalhos | Alt+C contraste, Alt+A acessibilidade, Alt+I sobre, Alt+S input, Alt+M histórico |
| Focus trap | Modais (Acessibilidade e Sobre) com `useFocusTrap` |
| Retorno de foco | Ao fechar modal, foco volta ao botão que abriu |
| Skip link | “Ir direto para a caixa de mensagem” |
| Mobile | Menu hamburger com `role="menu"` e `aria-expanded` |

### Compreensão

| Critério | Implementação |
|----------|----------------|
| Leitura de voz (TTS) | Web Speech API, sotaque pernambucano (`pernambucanize`) |
| Status da API | `aria-live` + anúncio explícito online/offline |
| Mensagens do chat | `role="log"` com `aria-live="polite"` |

### Robustez

| Critério | Implementação |
|----------|----------------|
| Preferências salvas | `localStorage` (`upi-a11y-preferences`) |
| Sessão | `sessionStorage` para login |
| Movimento reduzido | `prefers-reduced-motion` em CSS e animações do avatar |

## Como testar (checklist manual)

1. **Teclado apenas**: navegar header → menu mobile → chat → input → enviar com Enter.
2. **NVDA / VoiceOver**: ouvir anúncio ao conectar/desconectar API; ouvir respostas do UPi no `role="log"`.
3. **Alto contraste**: Alt+C e verificar modais, perguntas rápidas e campo de mensagem.
4. **Persistência**: alterar fonte/voz/contraste, recarregar página (F5) e confirmar que mantém.
5. **Modais**: abrir Sobre/Acessibilidade, Tab não deve sair para o fundo; Esc fecha e devolve foco.

## Pendências conhecidas (pós-MVP)

- Auditoria automatizada (axe, Lighthouse) em CI.
- Login OAuth real (hoje é simulação com botão Google).
- Testes formais com usuários e certificação WCAG.
- Remoção completa de dependências legadas não usadas no bundle (pasta `ui/` ainda no repo se existir).

## Arquivos principais

- `src/hooks/useAccessibility.ts` — preferências, atalhos, anúncios
- `src/hooks/useFocusTrap.ts` / `useModalFocus.ts` — modais
- `src/utils/a11yStorage.ts` — persistência
- `src/app/upi/UpiChatApp.tsx` — interface principal
- `src/styles/upi-tokens.css` — tokens e alto contraste global
