import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Partículas flutuantes no fundo
  useEffect(() => {
    if (prefersReducedMotion) return;
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

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
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
  }, [prefersReducedMotion]);

  return (
    <div
      className="min-h-[100dvh] w-full flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #020817 0%, #0a1628 50%, #050d1a 100%)" }}
    >
      {/* Google Font — Sora */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&display=swap');
        .font-sora { font-family: 'Sora', sans-serif; }

        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-rev  { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes pulse-ring { 0%,100% { opacity:.35; transform:scale(1); } 50% { opacity:.6; transform:scale(1.04); } }

        .ring-spin    { animation: spin-slow 18s linear infinite; }
        .ring-rev     { animation: spin-rev  24s linear infinite; }
        .ring-pulse   { animation: pulse-ring 4s ease-in-out infinite; }

        .glass-card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          border: 1px solid rgba(125,211,252,0.12);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04) inset,
            0 32px 80px rgba(0,0,0,0.6),
            0 0 60px rgba(14,165,233,0.06);
        }

        .btn-glow {
          background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
          box-shadow: 0 0 30px rgba(14,165,233,0.35), 0 4px 16px rgba(0,0,0,0.4);
          transition: box-shadow 0.3s ease, transform 0.15s ease;
        }
        .btn-glow:hover {
          box-shadow: 0 0 50px rgba(14,165,233,0.55), 0 8px 24px rgba(0,0,0,0.5);
        }

        @media (prefers-reduced-motion: reduce) {
          .ring-spin, .ring-rev, .ring-pulse { animation: none; }
        }
      `}</style>

      {/* Canvas de partículas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
      />

      {/* Glow de fundo central */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(14,165,233,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Card principal */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card font-sora relative z-10 w-full max-w-sm mx-4 rounded-[36px] px-8 py-10 flex flex-col items-center"
      >

        {/* Avatar com anéis orbitais */}
        <div className="relative mb-8 flex items-center justify-center" aria-hidden="true">

          {/* Anel externo tracejado */}
          <div
            className="ring-spin absolute rounded-full border border-dashed"
            style={{
              width: 196,
              height: 196,
              borderColor: "rgba(125,211,252,0.18)",
            }}
          />

          {/* Anel médio sólido */}
          <div
            className="ring-rev absolute rounded-full"
            style={{
              width: 172,
              height: 172,
              border: "1px solid rgba(56,189,248,0.22)",
            }}
          />

          {/* Anel pulsante glow */}
          <div
            className="ring-pulse absolute rounded-full"
            style={{
              width: 154,
              height: 154,
              boxShadow: "0 0 0 1px rgba(14,165,233,0.3), 0 0 32px rgba(14,165,233,0.15)",
              borderRadius: "50%",
            }}
          />

          {/* Container do vídeo */}
          <div
            className="relative rounded-full overflow-hidden"
            style={{
              width: 140,
              height: 140,
              border: "1.5px solid rgba(125,211,252,0.25)",
              boxShadow:
                "0 0 40px rgba(14,165,233,0.2), 0 8px 32px rgba(0,0,0,0.5)",
            }}
          >
            <video
              autoPlay
              loop
              playsInline
              className="w-full h-full object-cover"
              aria-label="Apresentação do UPi"
            >
              <source src="/assets/animated_sprites/INICIO.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Ponto de status online */}
          <div
            className="absolute bottom-3 right-3 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-[#050d1a]"
            title="Online"
          />
        </div>

        {/* Textos */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8 w-full"
        >
          <h1
            className="text-5xl font-semibold tracking-tight mb-1"
            style={{
              background: "linear-gradient(135deg, #e0f2fe 30%, #7dd3fc 70%, #38bdf8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            UPi
          </h1>

          <p
            className="text-sm font-medium tracking-widest uppercase mb-5"
            style={{ color: "rgba(125,211,252,0.6)", letterSpacing: "0.18em" }}
          >
            NAPSI · POLI/UPE
          </p>

          <p
            className="text-sm font-light leading-relaxed"
            style={{ color: "rgba(186,230,253,0.55)" }}
          >
            Seu assistente virtual para suporte
            <br />
            acadêmico e institucional.
          </p>
        </motion.div>

        {/* Divider */}
        <div
          aria-hidden="true"
          className="w-full h-px mb-8"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(125,211,252,0.2), transparent)",
          }}
        />

        {/* Botão de login */}
        <motion.button
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
          onClick={onLogin}
          aria-label="Entrar com conta Google — acesso restrito a domínios @upe.br"
          className="btn-glow w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-medium text-sm tracking-wide outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050d1a]"
        >
          {/* Ícone Google SVG */}
          <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="rgba(255,255,255,0.9)"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="rgba(255,255,255,0.75)"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="rgba(255,255,255,0.6)"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="rgba(255,255,255,0.85)"/>
          </svg>
          Entrar com Google
        </motion.button>

        {/* Rodapé do card */}
        <motion.p
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="mt-6 text-xs font-light tracking-wide"
          style={{ color: "rgba(125,211,252,0.3)" }}
        >
          Acesso restrito a{" "}
          <span style={{ color: "rgba(125,211,252,0.55)" }}>@upe.br</span>
        </motion.p>
      </motion.div>

      {/* Rodapé da página */}
      <motion.footer
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="absolute bottom-5 left-0 right-0 text-center font-sora"
        style={{ color: "rgba(125,211,252,0.2)", fontSize: "11px", letterSpacing: "0.08em" }}
      >
        NAPSI · Núcleo de Apoio Psicopedagógico e Social Inclusivo · POLI/UPE
      </motion.footer>
    </div>
  );
}
