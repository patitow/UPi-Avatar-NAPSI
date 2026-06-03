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
| Leitura de voz (TTS) | Prioridade: áudio gTTS do servidor → Web Speech por plataforma (`speechStrategy.ts`) |
| Alto contraste | Botão no header + modal + Alt+C; respeita `prefers-contrast: more` |
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

## Alto contraste — padrão de mercado

**O que é comum:** controle visível na barra principal (ícone ou texto), preferência do sistema (`prefers-contrast`), persistência local, e painel de acessibilidade com o mesmo estado. Toggle com `role="switch"` e `aria-checked` (WAI-ARIA APG).

**O que o UPi faz hoje:** toggle no modal, atalho Alt+C, botão no header e no menu mobile, sincronização com `prefers-contrast: more`, paleta dedicada `html.high-contrast`.

**Lacunas vs. referências (GOV.UK, BBC, Microsoft, WCAG 2.2):**

| Prática comum | Situação no UPi |
|---------------|-----------------|
| Barra de acessibilidade fixa em todas as páginas | Parcial — header no chat; login sem botão dedicado |
| `@media (forced-colors: active)` (modo alto contraste do Windows) | Não mapeado — tema próprio pode conflitar com paleta do SO |
| Contraste AA no tema **normal** (4.5:1 texto) | Não auditado formalmente (axe/Lighthouse) |
| Página / link “Declaração de acessibilidade” | Ausente |
| Atalhos Alt+* | Útil, mas Alt pode colidir com menus do SO/navegador |
| `prefers-contrast: less/custom` | Só `more` é considerado |

## TTS — estratégia multiplataforma

Ordem de prioridade (implementada em `src/utils/speechStrategy.ts` + `useSpeech.ts`):

1. **Áudio MP3 do backend (gTTS, pt-BR)** quando `/chat` retorna `audio` — melhor opção em Chrome, Edge, Firefox, Brave, Safari, iOS e Android (após gesto do usuário ao enviar mensagem).
2. **Fallback Web Speech API** com voz e parâmetros por plataforma:
   - **iOS / Safari:** voz pt-BR padrão, sem `pernambucanize` no TTS, texto em blocos curtos.
   - **Android Chrome:** voz Google Português (Brasil), preferência por voz em nuvem quando existir.
   - **Desktop Chromium / Edge / Brave:** vozes Flo, Google pt-BR ou Microsoft online/neural (`localService: false`).
   - **Firefox:** melhor voz pt disponível localmente.
3. **Leitores de tela (NVDA, VoiceOver, TalkBack):** com voz do UPi ligada, pode haver dupla leitura com `aria-live`. Quem usa SR deve **desativar “Voz do UPi”** no modal de acessibilidade.

**Limitações inevitáveis:** qualidade do browser TTS depende do SO; iOS tem poucas vozes; autoplay de áudio exige interação; offline só tem voz local.

## Pendências conhecidas (pós-MVP)

- Auditoria automatizada (axe, Lighthouse) em CI.
- Login OAuth real (hoje é simulação com botão Google).
- Testes formais com usuários e certificação WCAG.
- Remoção completa de dependências legadas não usadas no bundle (pasta `ui/` ainda no repo se existir).

## Arquivos principais

- `src/utils/speechStrategy.ts` — perfil TTS por navegador/SO
- `src/hooks/useSpeech.ts` — servidor + fallback browser
- `src/hooks/useAccessibility.ts` — preferências, atalhos, anúncios
- `src/hooks/useFocusTrap.ts` / `useModalFocus.ts` — modais
- `src/utils/a11yStorage.ts` — persistência
- `src/app/upi/UpiChatApp.tsx` — interface principal
- `src/styles/upi-tokens.css` — tokens e alto contraste global
