import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export type AvatarState =
  | "idle"
  | "thinking"
  | "talking"
  | "happy"
  | "surprised";

interface AvatarDisplayProps {
  state: AvatarState;
  isSpeaking?: boolean;
  isLoading?: boolean;
  isLoginScreen?: boolean;
}

const ASSETS = {
  idle: "/assets/avatar_idle.jpeg",
  thinking: "/assets/avatar_pensando.jpeg",
  interacting: "/assets/avatar_interagindo.jpeg",
  video: "/assets/avatar_falando.mp4",
} as const;

function getImageSrc(
  state: AvatarState,
  isLoading: boolean,
): string {
  if (isLoading || state === "thinking") return ASSETS.thinking;
  if (state === "happy" || state === "surprised") return ASSETS.interacting;
  return ASSETS.idle;
}

export function AvatarDisplay({
  state,
  isSpeaking = false,
  isLoading = false,
  isLoginScreen,
}: AvatarDisplayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageSrc = getImageSrc(state, isLoading);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isSpeaking) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isSpeaking]);

  const stateLabel = isLoading
    ? "pensando"
    : isSpeaking
      ? "falando"
      : state;

  return (
    <motion.div
      aria-label={`Avatar UPi – ${stateLabel}`}
      role="img"
      animate={{
        y: state === "idle" || isLoginScreen ? [0, -8, 0] : 0,
        rotate: state === "thinking" || isLoading ? [0, -5, 5, -5, 0] : 0,
      }}
      transition={{
        duration: state === "idle" || isLoginScreen ? 3 : 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{ width: "100%", height: "100%", position: "relative" }}
      className={
        isLoginScreen
          ? "rounded-full overflow-hidden bg-white shadow-inner border-4 border-white"
          : "drop-shadow-2xl"
      }
    >
      <video
        ref={videoRef}
        src={ASSETS.video}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          opacity: isSpeaking ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      />
      <img
        src={imageSrc}
        alt=""
        draggable={false}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "contain",
          opacity: isSpeaking ? 0 : 1,
          transition: "opacity 0.2s ease",
        }}
      />
    </motion.div>
  );
}
