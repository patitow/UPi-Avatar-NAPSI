import { useEffect, useRef } from "react";
import styles from "./UpiAvatar.module.css";

const ASSETS = {
  idle: "/assets/avatar_idle.jpeg",
  thinking: "/assets/avatar_pensando.jpeg",
  interacting: "/assets/avatar_interagindo.jpeg",
  video: "/assets/avatar_falando.mp4",
} as const;

function getImageSrc(
  emotion: string,
  loading: boolean,
  isReacting: boolean,
): string {
  if (loading || emotion === "thinking" || emotion === "sad") {
    return ASSETS.thinking;
  }
  if (
    isReacting ||
    emotion === "happy" ||
    emotion === "excited" ||
    emotion === "surprised"
  ) {
    return ASSETS.interacting;
  }
  return ASSETS.idle;
}

function wrapClass(loading: boolean, isSpeaking: boolean, isReacting: boolean) {
  if (isReacting) return styles.reacting;
  if (loading) return styles.thinking;
  if (isSpeaking) return styles.speaking;
  return styles.idle;
}

interface UpiAvatarProps {
  emotion?: string;
  loading?: boolean;
  isSpeaking?: boolean;
  isReacting?: boolean;
  compact?: boolean;
}

export function UpiAvatar({
  emotion = "neutral",
  loading = false,
  isSpeaking = false,
  isReacting = false,
  compact = false,
}: UpiAvatarProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageSrc = getImageSrc(emotion, loading, isReacting);

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

  const stateLabel = loading
    ? "pensando"
    : isSpeaking
      ? "falando"
      : isReacting
        ? "reagindo"
        : emotion;

  return (
    <div
      className={`${styles.wrap} ${wrapClass(loading, isSpeaking, isReacting)}`}
      style={compact ? { height: 44, width: 44 } : undefined}
      aria-label={`Avatar UPi — estado: ${stateLabel}`}
      role="img"
    >
      <video
        ref={videoRef}
        src={ASSETS.video}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className={`${styles.media} ${isSpeaking ? styles.visible : styles.hidden}`}
      />
      <img
        src={imageSrc}
        alt=""
        draggable={false}
        className={`${styles.media} ${isSpeaking ? styles.hidden : styles.visible}`}
      />
    </div>
  );
}
