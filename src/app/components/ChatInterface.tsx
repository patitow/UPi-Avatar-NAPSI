import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { LogOut, Menu, X, Info, Settings } from "lucide-react";
import { AvatarDisplay, AvatarState } from "./AvatarDisplay";
import { MessageBubble, Message } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { ChatInput } from "./ChatInput";
import { QuickActions } from "./QuickActions";
import { Disclaimer } from "./Disclaimer";
import { ScrollToBottom } from "./ScrollToBottom";
import { StatusIndicator } from "./StatusIndicator";
import { InfoModal } from "./InfoModal";
import { SettingsModal } from "./SettingsModal";

interface ChatInterfaceProps {
  onLogout: () => void;
}

const welcomeMessage: Message = {
  id: "0",
  content:
    "Oi! Eu sou o UPi, seu assistente virtual do NAPSI! 😊\n\nEstou aqui pra te ajudar com informações sobre a POLI/UPE, suporte acadêmico e orientações institucionais.\n\nComo posso te ajudar hoje?",
  sender: "upi",
  timestamp: new Date(),
};

export function ChatInterface({ onLogout }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [isTyping, setIsTyping] = useState(false);
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const [fontSize, setFontSize] = useState<"normal" | "large" | "extra-large">("normal");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState(1);

  const [statusAnnouncement, setStatusAnnouncement] = useState("");
  const [errorAnnouncement, setErrorAnnouncement] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const prefersReducedMotion = useReducedMotion();

  // Partículas — mesmo sistema da LoginScreen
  useEffect(() => {
    if (prefersReducedMotion || highContrast) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2 + 0.2,
      dx: (Math.random() - 0.5) * 0.25,
      dy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.35 + 0.08,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(125, 211, 252, ${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      animFrame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, [prefersReducedMotion, highContrast]);

  const speakMessage = (text: string) => {
    if (!voiceEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = voiceSpeed;
    window.speechSynthesis.speak(utterance);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom && messages.length > 3);
  };

  const fontSizeClass = {
    normal: "text-sm",
    large: "text-base md:text-lg",
    "extra-large": "text-lg md:text-xl",
  }[fontSize];

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
    return () => document.documentElement.classList.remove("high-contrast");
  }, [highContrast]);

  useEffect(() => {
 const handleShortcuts = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      switch (e.code) {
        case "KeyC":
          e.preventDefault();
          setHighContrast((prev) => {
            setStatusAnnouncement(prev ? "Alto contraste desativado" : "Alto contraste ativado");
            return !prev;
          });
          break;
        case "KeyA": e.preventDefault(); setShowSettingsModal(true); break;
        case "KeyI": e.preventDefault(); setShowInfoModal(true); break;
        case "KeyS":
          e.preventDefault();
          const input = document.querySelector("textarea") || document.querySelector("input");
          if (input instanceof HTMLElement) input.focus();
          break;
        case "KeyM":
          e.preventDefault();
          chatContainerRef.current?.focus();
          break;
      }
    };
     
  window.addEventListener("keydown", handleShortcuts);
  return () => window.removeEventListener("keydown", handleShortcuts);
}, []);
       

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  useEffect(() => {
    if (!statusAnnouncement) return;
    const t = setTimeout(() => setStatusAnnouncement(""), 1500);
    return () => clearTimeout(t);
  }, [statusAnnouncement]);

  useEffect(() => {
    if (!errorAnnouncement) return;
    const t = setTimeout(() => setErrorAnnouncement(""), 1500);
    return () => clearTimeout(t);
  }, [errorAnnouncement]);

  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setAvatarState("talking");
    setIsTyping(true);
    setStatusAnnouncement("UPi está processando sua mensagem…");

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) throw new Error("Falha na comunicação com o UPi");

      const data = await response.json();
      const emotion = data.emotion as AvatarState;
      setAvatarState(emotion || "talking");

      const upiMessage: Message = {
        id: Date.now().toString(),
        content: data.response,
        sender: "upi",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, upiMessage]);
      setStatusAnnouncement("UPi respondeu.");
      speakMessage(data.response);

    } catch (error) {
      console.error("Error:", error);
      setAvatarState("talking");
      setErrorAnnouncement("Erro ao conectar com o UPi. Tenta de novo em instantes.");

      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Eita! Tive um probleminha aqui pra te responder. Tenta de novo em instantes!",
        sender: "upi",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);

    } finally {
      setIsTyping(false);
      setTimeout(() => setAvatarState("idle"), 3000);
    }
  }, [voiceEnabled, voiceSpeed]);

  const fadeIn = prefersReducedMotion
    ? {}
    : { initial: { opacity: 0, y: -16 }, animate: { opacity: 1, y: 0 } };

  const scaleIn = prefersReducedMotion
    ? {}
    : { initial: { scale: 0.85, opacity: 0 }, animate: { scale: 1, opacity: 1 } };

  // Cores que mudam com alto contraste
  const bg = highContrast ? "bg-black text-white" : "";
  const isDark = !highContrast;

  return (
    <div
      className={`h-[100dvh] flex flex-col relative overflow-hidden font-sora ${bg}`}
      style={
        isDark 
          ? { background: "linear-gradient(135deg, #020817 0%, #0a1628 50%, #050d1a 100%)" } 
          : { backgroundColor: "#000000", color: "#ffffff" } // Garante fundo preto no inline style se não for Dark
      }
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&display=swap');
        .font-sora { font-family: 'Sora', sans-serif; }

        /* Regras estritas para quando a classe .high-contrast estiver injetada no html/body */
        .high-contrast *, 
        .high-contrast {
          background-color: #000000 !important;
          background-image: none !important;
          color: #ffffff !important;
          border-color: #ffffff !important;
          text-shadow: none !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }

        /* Mantendo os inputs e botões principais visíveis com bordas no alto contraste */
        .high-contrast button, 
        .high-contrast textarea, 
        .high-contrast input,
        .high-contrast [role="log"] {
          border: 2px solid #ffffff !important;
          border-radius: 4px !important;
        }

        .glass-header {
          background: rgba(2, 8, 23, 0.75);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(125, 211, 252, 0.1);
        }
        .glass-footer {
          background: rgba(2, 8, 23, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-top: 1px solid rgba(125, 211, 252, 0.08);
        }
        .glass-input-area {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(125,211,252,0.1);
          border-radius: 20px;
        }
        .nav-btn {
          color: rgba(125,211,252,0.55);
          border-radius: 12px;
          transition: all 0.2s ease;
          padding: 8px 14px;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.02em;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .nav-btn:hover {
          color: rgba(186,230,253,0.9);
          background: rgba(125,211,252,0.08);
        }
        .nav-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px rgba(14,165,233,0.6);
        }
        .nav-btn-danger:hover {
          color: rgba(252,165,165,0.9);
          background: rgba(239,68,68,0.08);
        }
        .scrollbar-dark::-webkit-scrollbar { width: 4px; }
        .scrollbar-dark::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-dark::-webkit-scrollbar-thumb { background: rgba(125,211,252,0.15); border-radius: 4px; }
        .scrollbar-dark::-webkit-scrollbar-thumb:hover { background: rgba(125,211,252,0.3); }

        .avatar-ring {
          box-shadow: 0 0 0 1px rgba(125,211,252,0.2), 0 0 24px rgba(14,165,233,0.15);
        }

        @keyframes pulse-subtle {
          0%,100% { box-shadow: 0 0 0 1px rgba(125,211,252,0.2), 0 0 20px rgba(14,165,233,0.12); }
          50%      { box-shadow: 0 0 0 1px rgba(125,211,252,0.35), 0 0 36px rgba(14,165,233,0.25); }
        }
        .avatar-talking { animation: pulse-subtle 2s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .avatar-talking { animation: none; }
        }
      `}</style>

      {/* Canvas de partículas */}
      {isDark && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-0"
        />
      )}

      {/* Glow radial de fundo */}
      {isDark && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(14,165,233,0.07) 0%, transparent 70%)",
          }}
        />
      )}

      {/* Regiões para leitores de tela */}
      <a
        href="#main-chat-input"
        className="sr-only focus:not-sr-only absolute top-2 left-2 z-50 bg-sky-500 text-white px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400"
      >
        Ir direto para a caixa de mensagem
      </a>
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">{statusAnnouncement}</div>
      <div role="alert" aria-live="assertive" aria-atomic="true" className="sr-only">{errorAnnouncement}</div>

      {/* ── Header ── */}
      <motion.header
        {...fadeIn}
        role="banner"
        className={`relative z-20 ${isDark ? "glass-header" : "bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm"}`}
      >
        <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <h1
              aria-label="UPi — Assistente virtual do NAPSI"
              className="text-xl font-semibold tracking-tight text-white"
              style={isDark ? {
                background: "linear-gradient(135deg, #e0f2fe 30%, #7dd3fc 70%, #38bdf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              } : {}}
            >
              {!isDark && <span className="text-white">UPi</span>}
              {isDark && "UPi"}
            </h1>
            <StatusIndicator status={isTyping ? "busy" : "online"} />
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Menu principal">
            <button
              onClick={() => setShowSettingsModal(true)}
              aria-label="Configurações de acessibilidade"
              title="Acessibilidade (Alt+A)"
              className={isDark ? "nav-btn" : "flex items-center gap-2 px-4 py-2 rounded-xl text-white hover:bg-slate-900 text-sm transition-all outline-none border border-white"}
            >
              <Settings className="w-4 h-4" aria-hidden="true" />
              <span>Acessibilidade</span>
            </button>
            <button
              onClick={() => setShowInfoModal(true)}
              aria-label="Sobre o UPi e o NAPSI"
              title="Sobre (Alt+I)"
              className={isDark ? "nav-btn" : "flex items-center gap-2 px-4 py-2 rounded-xl text-white hover:bg-slate-900 text-sm transition-all outline-none border border-white"}
            >
              <Info className="w-4 h-4" aria-hidden="true" />
              <span>Sobre</span>
            </button>
            <button
              onClick={onLogout}
              aria-label="Sair do chat"
              className={isDark ? "nav-btn nav-btn-danger" : "flex items-center gap-2 px-4 py-2 rounded-xl text-white hover:bg-red-900 text-sm transition-all outline-none border border-white"}
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>Sair</span>
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            ref={menuButtonRef}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-haspopup="true"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            className="md:hidden p-2 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            style={isDark ? { color: "rgba(125,211,252,0.6)" } : { color: "#ffffff" }}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              role="menu"
              aria-label="Menu de navegação"
              initial={prefersReducedMotion ? {} : { opacity: 0, height: 0 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, height: "auto" }}
              exit={prefersReducedMotion ? {} : { opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
              style={isDark
                ? { borderTop: "1px solid rgba(125,211,252,0.08)", background: "rgba(5,13,26,0.95)" }
                : { borderTop: "1px solid #ffffff", background: "#000000" }
              }
            >
              <div className="flex flex-col py-2 px-4 gap-1">
                {[
                  { label: "Acessibilidade", icon: <Settings className="w-4 h-4" aria-hidden="true" />, action: () => { setShowSettingsModal(true); setMenuOpen(false); } },
                  { label: "Sobre", icon: <Info className="w-4 h-4" aria-hidden="true" />, action: () => { setShowInfoModal(true); setMenuOpen(false); } },
                ].map(({ label, icon, action }) => (
                  <button
                    key={label}
                    role="menuitem"
                    onClick={action}
                    className="w-full flex items-center gap-2 py-3 px-2 text-left text-sm rounded-lg outline-none"
                    style={isDark ? { color: "rgba(186,230,253,0.7)", fontWeight: 400 } : { color: "#ffffff", fontWeight: 500 }}
                  >
                    {icon} {label}
                  </button>
                ))}
                <button
                  role="menuitem"
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 py-3 px-2 text-left text-sm font-medium rounded-lg outline-none"
                  style={{ color: "#fca5a5" }}
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" /> Sair
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ── Main ── */}
      <main
        id="main-content"
        role="main"
        aria-label="Chat com o UPi"
        className="relative z-10 flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 py-4 overflow-hidden"
      >
        {/* Avatar */}
        <motion.div
          {...scaleIn}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mb-3 flex-shrink-0"
        >
          <div
            aria-hidden="true"
            className={`w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden ${
              avatarState === "talking" ? "avatar-talking" : "avatar-ring"
            }`}
            style={{ transition: "box-shadow 0.4s ease" }}
          >
            <AvatarDisplay state={avatarState} />
          </div>
        </motion.div>

        {/* Histórico de mensagens */}
        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          aria-label="Histórico de mensagens. Alt+M para focar aqui."
          className={`flex-1 overflow-y-auto mb-3 space-y-3 pr-1 scrollbar-dark outline-none rounded-xl ${fontSizeClass}`}
          tabIndex={0}
        >
          {messages.map((message, index) => (
            <MessageBubble key={message.id} message={message} index={index} />
          ))}

          {isTyping && (
            <div role="status" aria-label="UPi está digitando uma resposta">
              <TypingIndicator />
            </div>
          )}

          {messages.length === 1 && !isTyping && (
            <div className="mt-4 space-y-3">
              <QuickActions onSelectAction={handleSendMessage} />
              <Disclaimer />
            </div>
          )}

          <div ref={messagesEndRef} aria-hidden="true" />
        </div>

        {/* Input area */}
        <div id="main-chat-input" className={`mt-auto flex-shrink-0 pb-2 md:pb-0 ${isDark ? "glass-input-area p-1" : "border border-white p-1"}`}>
          <p className="sr-only">
            Atalhos: Alt+C (contraste), Alt+A (acessibilidade), Alt+M (histórico), Alt+S (aqui)
          </p>
          <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
        </div>
      </main>

      <ScrollToBottom onClick={scrollToBottom} visible={showScrollButton} />

      <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        fontSize={fontSize}
        setFontSize={setFontSize}
        voiceEnabled={voiceEnabled}
        setVoiceEnabled={setVoiceEnabled}
        voiceSpeed={voiceSpeed}
        setVoiceSpeed={setVoiceSpeed}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
      />

      {/* ── Footer ── */}
      <footer
        role="contentinfo"
        className={`relative z-20 py-3 text-xs ${isDark ? "glass-footer" : "bg-black border-t border-white"}`}
      >
        <div className="max-w-5xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-2">
          <p
            className="text-center md:text-left tracking-wide"
            style={isDark ? { color: "rgba(125,211,252,0.25)", fontSize: "11px" } : { color: "#ffffff" }}
          >
            UPi · NAPSI — Núcleo de Apoio Psicopedagógico e Social Inclusivo · POLI/UPE
          </p>
          <div className="flex items-center gap-4">
            <a
              href="mailto:napsi@poli.upe.br"
              aria-label="Enviar e-mail para napsi arroba poli.upe.br"
              className="outline-none focus-visible:ring-1 rounded transition-colors"
              style={isDark
                ? { color: "rgba(125,211,252,0.4)", fontSize: "11px" }
                : { color: "#ffffff", fontSize: "12px", textDecoration: "underline" }
              }
            >
              napsi@poli.upe.br
            </a>
            <button
              onClick={() => setShowInfoModal(true)}
              aria-label="Abrir informações sobre o UPi"
              className="outline-none focus-visible:ring-1 rounded transition-colors"
              style={isDark
                ? { color: "rgba(125,211,252,0.3)", fontSize: "11px" }
                : { color: "#ffffff", fontSize: "12px", textDecoration: "underline" }
              }
            >
              Sobre
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}