import styles from "./ChatMessage.module.css";

const EMOTION_ICON: Record<string, string> = {
  happy: "😊",
  neutral: "🙂",
  sad: "😟",
  thinking: "🤔",
  excited: "🎉",
  surprised: "😮",
  calm: "😌",
  confused: "🤔",
};

export interface UpiChatMessage {
  id: string | number;
  from: "user" | "upi";
  text: string;
  time: Date;
  emotion?: string;
  isError?: boolean;
  audio?: string;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface ChatMessageProps {
  message: UpiChatMessage;
  onPlayAudio?: (text: string, audio?: string) => void;
}

export function ChatMessage({ message, onPlayAudio }: ChatMessageProps) {
  const isUpi = message.from === "upi";
  const icon =
    message.emotion && EMOTION_ICON[message.emotion]
      ? EMOTION_ICON[message.emotion]
      : "";

  return (
    <div
      className={`${styles.row} ${isUpi ? styles.rowUpi : styles.rowUser}`}
      role={isUpi ? "article" : undefined}
      aria-label={isUpi ? `Mensagem do UPi` : undefined}
    >
      {isUpi && (
        <div className={styles.avatar} aria-hidden="true">
          U
        </div>
      )}

      <div
        className={`${styles.bubble} ${isUpi ? styles.bubbleUpi : styles.bubbleUser} ${message.isError ? styles.bubbleError : ""}`}
      >
        {isUpi && (
          <div className={styles.senderHeader}>
            <span className={styles.senderLabel}>UPi {icon}</span>
            {onPlayAudio && (
              <button
                className={styles.playButton}
                onClick={() => onPlayAudio(message.text, message.audio)}
                title="Ouvir mensagem"
                aria-label="Ouvir mensagem"
              >
                🔊
              </button>
            )}
          </div>
        )}
        <p className={styles.text}>{message.text}</p>
        <time className={styles.time} dateTime={message.time.toISOString()}>
          {formatTime(message.time)}
        </time>
      </div>
    </div>
  );
}
