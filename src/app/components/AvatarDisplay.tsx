import { motion } from "framer-motion"; // Ajustado para o padrão do framer-motion
import { useEffect, useRef } from "react";

export type AvatarState =
  | "idle"
  | "thinking"
  | "talking"
  | "happy"
  | "surprised";

interface AvatarDisplayProps {
  state: AvatarState;
  isLoginScreen?: boolean;
}

const stateToAsset: Record<AvatarState, string> = {
  idle: "/assets/static_sprites/showing_computer_idle.png",
  thinking: "/assets/static_sprites/thinking.png",
  talking: "/assets/animated_sprites/falando.mp4",
  happy: "/assets/animated_sprites/celebrating.gif",
  surprised: "/assets/animated_sprites/unsure.gif",
};

export function AvatarDisplay({ state, isLoginScreen }: AvatarDisplayProps) {
  const assetUrl = stateToAsset[state] ?? stateToAsset.idle;
  const isVideo = assetUrl.endsWith(".mp4");
  const videoRef = useRef<HTMLVideoElement>(null);

  // Console log mantido de forma limpa dentro do escopo correto
  console.log("🎬 AvatarDisplay render:", { state, assetUrl, isVideo });

  useEffect(() => {
    if (!isVideo || !videoRef.current) return;
    videoRef.current.load();
    videoRef.current.play().catch(() => {});
  }, [assetUrl, isVideo]);

  const mediaElement = isVideo ? (
    <video
      ref={videoRef}
      key={assetUrl}
      src={assetUrl}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: "contain",
         mixBlendMode: "multiply", // ← adiciona isso
      }}
    />
  ) : (
    <img
      key={assetUrl}
      src={assetUrl}
      alt=""
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
    />
  );

  return (
    <motion.div
      aria-label={`Avatar UPi – ${state}`}
      animate={{
        y: state === "idle" || isLoginScreen ? [0, -8, 0] : 0,
        rotate: state === "thinking" ? [0, -5, 5, -5, 0] : 0,
      }}
      transition={{
        duration: state === "idle" || isLoginScreen ? 3 : 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{ width: "100%", height: "100%" }}
      className={
        isLoginScreen
          ? "rounded-full overflow-hidden bg-white shadow-inner border-4 border-white"
          : "drop-shadow-2xl"
      }
    >
      {mediaElement}
    </motion.div>
  );
}