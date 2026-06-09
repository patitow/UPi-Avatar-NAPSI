import styles from "./UpiAvatar.module.css";

const ASSETS = {
  idle: "/assets/avatar_idle.jpeg",
  thinking: "/assets/avatar_pensando.jpeg",
  interacting: "/assets/avatar_interagindo.jpeg",
  speaking: "/assets/animated_sprites/waving.gif",
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
  const imageSrc = isSpeaking
    ? ASSETS.speaking
    : getImageSrc(emotion, loading, isReacting);

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
      <img
        src={imageSrc}
        alt=""
        draggable={false}
        className={styles.media}
      />
    </div>
  );
}
