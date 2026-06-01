import styles from './ChatMessage.module.css'

const EMOTION_ICON = {
  happy:   '😊',
  neutral: '🙂',
  sad:     '😟',
  thinking:'🤔',
  excited: '🎉',
}

function formatTime(date) {
  return date?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) ?? ''
}

export default function ChatMessage({ message }) {
  const isUpi = message.from === 'upi'

  return (
    <div className={`${styles.row} ${isUpi ? styles.rowUpi : styles.rowUser}`}>
      {isUpi && (
        <div className={styles.avatar} aria-hidden="true">U</div>
      )}

      <div className={`${styles.bubble} ${isUpi ? styles.bubbleUpi : styles.bubbleUser} ${message.isError ? styles.bubbleError : ''}`}>
        {isUpi && (
          <span className={styles.senderLabel}>
            UPi {message.emotion && EMOTION_ICON[message.emotion] ? EMOTION_ICON[message.emotion] : ''}
          </span>
        )}
        <p className={styles.text}>{message.text}</p>
        <span className={styles.time}>{formatTime(message.time)}</span>
      </div>
    </div>
  )
}
