import { useState, useRef, useEffect, useCallback } from "react";
import { UpiAvatar } from "./UpiAvatar";
import { ChatMessage, type UpiChatMessage } from "./ChatMessage";
import { ChatInputBar } from "./ChatInputBar";
import { SettingsModal } from "../components/SettingsModal";
import { InfoModal } from "../components/InfoModal";
import { useSpeech } from "../../hooks/useSpeech";
import type { AccessibilityApi } from "../../hooks/useAccessibility";
import styles from "./UpiChatApp.module.css";

const API_URL = "/api";

const WELCOME_MESSAGE: UpiChatMessage = {
  id: "welcome",
  from: "upi",
  text: "Oi! Sou o UPi, assistente virtual do NAPSI aqui na POLI/UPE! Massa demais ter você aqui, visse? Pode me perguntar qualquer coisa sobre o núcleo — atendimentos, serviços, como agendar... Tô aqui pra ajudar!",
  emotion: "happy",
  time: new Date(),
};

const QUICK_QUESTIONS = [
  "Como agendar um atendimento?",
  "Onde fica o NAPSI?",
  "Quais serviços o NAPSI oferece?",
  "O NAPSI apoia alunos com TEA?",
];

type ApiStatus = "online" | "offline" | "checking";

interface AiModeInfo {
  provider?: string;
  model?: string;
  vectorStore?: string;
}

interface UpiChatAppProps {
  a11y: AccessibilityApi;
  onLogout?: () => void;
}

export function UpiChatApp({ a11y, onLogout }: UpiChatAppProps) {
  const [messages, setMessages] = useState<UpiChatMessage[]>([
    WELCOME_MESSAGE,
  ]);
  const [emotion, setEmotion] = useState("happy");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isReacting, setIsReacting] = useState(false);
  const [apiStatus, setApiStatus] = useState<ApiStatus>("checking");
  const [aiMode, setAiMode] = useState<AiModeInfo | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const reactTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const { speak, stop, supported: voiceSupported } = useSpeech({
    enabled: a11y.voiceEnabled,
    rate: a11y.voiceSpeed * 0.84,
    onStart: () => setIsSpeaking(true),
    onEnd: () => setIsSpeaking(false),
  });

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Record<string, string>) => {
        setApiStatus("online");
        const store = data.vector_store ?? "—";
        setAiMode({
          provider: data.llm_provider ?? (store === "chroma" ? "ollama" : "cloud"),
          model: data.llm_model ?? "ativo",
          vectorStore: store,
        });
      })
      .catch(() => setApiStatus("offline"));
  }, []);

  const prevApiStatus = useRef<ApiStatus>("checking");
  useEffect(() => {
    if (apiStatus === "checking") return;
    if (prevApiStatus.current === apiStatus) return;
    prevApiStatus.current = apiStatus;
    if (apiStatus === "online") {
      a11y.announceStatus(
        "Conexão com a API do UPi estabelecida. O chat está pronto para uso.",
      );
    } else {
      a11y.announceError(
        "API do UPi offline. Inicie o backend na porta 8000 para enviar mensagens.",
      );
    }
  }, [apiStatus, a11y]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [mobileMenuOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [messages, loading]);

  const triggerReact = useCallback((newEmotion: string) => {
    if (reactTimer.current) clearTimeout(reactTimer.current);
    setIsReacting(true);
    setEmotion(newEmotion);
    reactTimer.current = setTimeout(() => setIsReacting(false), 550);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      stop();
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          from: "user",
          text: text.trim(),
          time: new Date(),
        },
      ]);
      setLoading(true);
      triggerReact("thinking");
      a11y.announceStatus("UPi está processando sua mensagem");

      try {
        const res = await fetch(`${API_URL}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text.trim() }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const responseText =
          data.response ?? "Eita, não entendi a resposta do servidor!";
        const responseEmotion = data.emotion ?? "neutral";

        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            from: "upi",
            text: responseText,
            emotion: responseEmotion,
            time: new Date(),
          },
        ]);

        triggerReact(responseEmotion);
        speak(responseText);
        setApiStatus("online");
        a11y.announceStatus("UPi respondeu");
      } catch {
        const errText =
          "Oxe! Não consegui falar com o servidor. Verifica se a API tá rodando, visse?";
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            from: "upi",
            text: errText,
            emotion: "sad",
            time: new Date(),
            isError: true,
          },
        ]);
        triggerReact("sad");
        speak(errText);
        setApiStatus("offline");
        a11y.announceError(
          "Erro ao conectar com o UPi. Verifique se a API está em execução.",
        );
      } finally {
        setLoading(false);
      }
    },
    [loading, triggerReact, speak, stop, a11y],
  );

  const handleClear = () => {
    stop();
    if (reactTimer.current) clearTimeout(reactTimer.current);
    setMessages([
      { ...WELCOME_MESSAGE, id: String(Date.now()), time: new Date() },
    ]);
    setEmotion("happy");
    setIsSpeaking(false);
    setIsReacting(false);
    a11y.announceStatus("Nova conversa iniciada");
  };

  const modeLabel = aiMode
    ? aiMode.provider === "ollama"
      ? `IA Local · ${aiMode.model}`
      : `IA Cloud · ${aiMode.model}`
    : null;

  const statusLabel = {
    online: {
      text: modeLabel ?? "API conectada",
      cls:
        aiMode?.provider === "ollama"
          ? styles.statusLocal
          : styles.statusOnline,
    },
    offline: { text: "API offline", cls: styles.statusOffline },
    checking: { text: "Verificando...", cls: styles.statusChecking },
  }[apiStatus];

  const avatarStatusCls = loading
    ? styles.statusThinking
    : isSpeaking
      ? styles.statusSpeaking
      : styles.statusOnlineBadge;

  const avatarStatusText = loading
    ? "Pensando..."
    : isSpeaking
      ? "Falando..."
      : "Online";

  return (
    <div className={styles.layout}>
      <a href="#main-chat-input" className="sr-only">
        Ir direto para a caixa de mensagem
      </a>
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {a11y.statusAnnouncement}
      </div>
      <div role="alert" aria-live="assertive" aria-atomic="true" className="sr-only">
        {a11y.errorAnnouncement}
      </div>

      <header className={styles.header} role="banner">
        <div className={styles.headerInner}>
          <div className={styles.headerBrand}>
            <div className={styles.headerLogoBox} aria-hidden="true">
              <span className={styles.headerLogoText}>UPE</span>
            </div>
            <div>
              <h1 className={styles.headerTitle}>UPi — Assistente do NAPSI</h1>
              <p className={styles.headerSub}>
                POLI/UPE · Núcleo de Apoio Psicopedagógico e Social Inclusivo
              </p>
            </div>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.desktopActions}>
            {voiceSupported && (
              <button
                type="button"
                className={`${styles.voiceBtn} ${!a11y.voiceEnabled ? styles.voiceMuted : ""}`}
                onClick={() => a11y.setVoiceEnabled((v) => !v)}
                title={
                  a11y.voiceEnabled
                    ? "Silenciar voz do UPi"
                    : "Ativar voz do UPi"
                }
                aria-label={
                  a11y.voiceEnabled
                    ? "Silenciar leitura de voz do UPi"
                    : "Ativar leitura de voz do UPi"
                }
                aria-pressed={a11y.voiceEnabled}
              >
                {a11y.voiceEnabled ? (
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
                    <path
                      d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
                    <line
                      x1="23"
                      y1="9"
                      x2="17"
                      y2="15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="17"
                      y1="9"
                      x2="23"
                      y2="15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                <span>{a11y.voiceEnabled ? "Voz ativa" : "Mudo"}</span>
              </button>
            )}

            <button
              type="button"
              className={styles.headerBtn}
              onClick={(e) =>
                a11y.openSettings(e.currentTarget)
              }
              title="Acessibilidade (Alt+A)"
              aria-label="Abrir configurações de acessibilidade"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>Acessibilidade</span>
            </button>

            <button
              type="button"
              className={styles.headerBtn}
              onClick={(e) => a11y.openInfo(e.currentTarget)}
              title="Sobre o UPi (Alt+I)"
              aria-label="Abrir informações sobre o UPi e o NAPSI"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>Sobre</span>
            </button>

            <span
              className={`${styles.apiStatus} ${statusLabel.cls}`}
              aria-label={`Estado da API: ${statusLabel.text}`}
            >
              <span className={styles.apiDot} aria-hidden="true" />
              <span aria-hidden="true">{statusLabel.text}</span>
            </span>

            {onLogout && (
              <button
                type="button"
                className={styles.headerBtn}
                onClick={onLogout}
                aria-label="Sair do UPi e voltar à tela de login"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Sair</span>
              </button>
            )}
            </div>

            <div className={styles.mobileMenuWrap} ref={mobileMenuRef}>
              <button
                type="button"
                className={styles.mobileMenuBtn}
                onClick={() => setMobileMenuOpen((o) => !o)}
                aria-expanded={mobileMenuOpen}
                aria-haspopup="true"
                aria-controls="mobile-menu-panel"
                aria-label={
                  mobileMenuOpen
                    ? "Fechar menu de opções"
                    : "Abrir menu de opções do UPi"
                }
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              {mobileMenuOpen && (
                <div
                  id="mobile-menu-panel"
                  className={styles.mobileMenuPanel}
                  role="menu"
                  aria-label="Menu principal"
                >
                  {voiceSupported && (
                    <button
                      type="button"
                      role="menuitem"
                      className={styles.mobileMenuItem}
                      onClick={() => {
                        a11y.setVoiceEnabled((v) => !v);
                        setMobileMenuOpen(false);
                      }}
                    >
                      {a11y.voiceEnabled ? "Silenciar voz do UPi" : "Ativar voz do UPi"}
                    </button>
                  )}
                  <button
                    type="button"
                    role="menuitem"
                    className={styles.mobileMenuItem}
                    onClick={(e) => {
                      a11y.openSettings(e.currentTarget);
                      setMobileMenuOpen(false);
                    }}
                  >
                    Acessibilidade
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className={styles.mobileMenuItem}
                    onClick={(e) => {
                      a11y.openInfo(e.currentTarget);
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sobre o UPi
                  </button>
                  <p className={styles.mobileMenuStatus} role="status">
                    API: {statusLabel.text}
                  </p>
                  {onLogout && (
                    <button
                      type="button"
                      role="menuitem"
                      className={styles.mobileMenuItem}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onLogout();
                      }}
                    >
                      Sair
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className={styles.body}>
        <aside className={styles.sidebar} aria-label="Painel do avatar UPi">
          <div className={styles.avatarCard}>
            <UpiAvatar
              emotion={emotion}
              loading={loading}
              isSpeaking={isSpeaking}
              isReacting={isReacting}
            />
            <div className={styles.avatarMeta}>
              <strong className={styles.avatarName}>UPi</strong>
              <span className={`${styles.avatarStatus} ${avatarStatusCls}`}>
                {avatarStatusText}
              </span>
            </div>
          </div>

          <div className={styles.infoBox}>
            <p className={styles.infoTitle}>NAPSI — POLI/UPE</p>
            <ul className={styles.infoList}>
              <li>📍 Bloco A, Sala 12</li>
              <li>🕗 Seg a Sex, 08h–17h</li>
              <li>
                ✉️{" "}
                <a href="mailto:napsi@poli.upe.br">napsi@poli.upe.br</a>
              </li>
            </ul>
          </div>

          {aiMode && (
            <div
              className={`${styles.infoBox} ${aiMode.provider === "ollama" ? styles.modeLocal : styles.modeCloud}`}
            >
              <p className={styles.infoTitle}>IA em uso</p>
              <ul className={styles.infoList}>
                <li>
                  {aiMode.provider === "ollama"
                    ? "🖥️ Local (Ollama)"
                    : "☁️ Cloud (OpenAI)"}
                </li>
                <li>🤖 {aiMode.model}</li>
                <li>
                  🗄️{" "}
                  {aiMode.vectorStore === "chroma"
                    ? "ChromaDB local"
                    : aiMode.vectorStore}
                </li>
              </ul>
            </div>
          )}

          <button type="button" className={styles.clearBtn} onClick={handleClear}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 4v4m0 0L9 5m3 3l3-2M4 12h4m0 0L5 9m3 3-2 3M20 12h-4m0 0 3-3m-3 3 2 3M12 20v-4m0 0 3 3m-3-3-3 3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            Nova conversa
          </button>
        </aside>

        <main className={styles.chat} id="main-chat" role="main">
          <div className={styles.chatTopBar}>
            <div className={styles.chatAvatarMini}>
              <UpiAvatar
                emotion={emotion}
                loading={loading}
                isSpeaking={isSpeaking}
                isReacting={isReacting}
                compact
              />
              <div>
                <strong>UPi</strong>
                <span className={`${styles.avatarStatus} ${avatarStatusCls}`}>
                  {avatarStatusText}
                </span>
              </div>
            </div>
            <button
              type="button"
              className={styles.clearBtnMobile}
              onClick={handleClear}
              title="Nova conversa"
              aria-label="Iniciar nova conversa"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M3 3v5h5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div
            id="chat-messages"
            className={styles.messages}
            role="log"
            aria-label="Histórico de mensagens do chat"
            aria-live="polite"
            aria-relevant="additions"
            tabIndex={-1}
          >
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {loading && (
              <div className={styles.typingRow} aria-label="UPi está digitando">
                <div className={styles.typingBubble}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length === 1 && (
            <div className={styles.quickWrap}>
              <p className={styles.quickLabel} id="quick-questions-label">
                Perguntas frequentes
              </p>
              <div
                className={styles.quickGrid}
                role="group"
                aria-labelledby="quick-questions-label"
              >
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    className={styles.quickBtn}
                    onClick={() => sendMessage(q)}
                    disabled={loading}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <ChatInputBar onSend={sendMessage} disabled={loading} />
        </main>
      </div>

      <SettingsModal
        isOpen={a11y.showSettings}
        onClose={a11y.closeSettings}
        fontSize={a11y.fontSize}
        setFontSize={a11y.setFontSize}
        voiceEnabled={a11y.voiceEnabled}
        setVoiceEnabled={a11y.setVoiceEnabled}
        voiceSpeed={a11y.voiceSpeed}
        setVoiceSpeed={a11y.setVoiceSpeed}
        highContrast={a11y.highContrast}
        setHighContrast={a11y.setHighContrast}
      />

      <InfoModal
        isOpen={a11y.showInfo}
        onClose={a11y.closeInfo}
        highContrast={a11y.highContrast}
      />
    </div>
  );
}
