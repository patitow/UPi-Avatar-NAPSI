import { useEffect, useRef } from 'react'
import styles from './UpiAvatar.module.css'

const ASSETS = {
  idle:          '/assets/avatar_idle.jpeg',
  thinking:      '/assets/avatar_pensando.jpeg',
  interacting:   '/assets/avatar_interagindo.jpeg',
  video:         '/assets/avatar_falando.mp4',
}

function wrapClass(loading, isSpeaking, isReacting) {
  if (isReacting) return styles.reacting
  if (loading)    return styles.thinking
  if (isSpeaking) return styles.speaking
  return styles.idle
}

function getImageSrc(emotion, loading, isReacting) {
  if (loading)              return ASSETS.thinking
  if (isReacting)           return ASSETS.interacting
  if (emotion === 'sad')    return ASSETS.thinking
  return ASSETS.idle
}

export default function UpiAvatar({
  emotion    = 'neutral',
  loading    = false,
  isSpeaking = false,
  isReacting = false,
}) {
  const videoRef = useRef(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (isSpeaking) {
      v.play().catch(() => {})
    } else {
      v.pause()
      v.currentTime = 0
    }
  }, [isSpeaking])

  const stateLabel = loading    ? 'pensando'
    : isSpeaking   ? 'falando'
    : isReacting   ? 'reagindo'
    : emotion

  return (
    <div
      className={`${styles.wrap} ${wrapClass(loading, isSpeaking, isReacting)}`}
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
        className={`${styles.media} ${isSpeaking ? styles.visible : styles.hidden}`}
        aria-hidden="true"
      />
      <img
        src={getImageSrc(emotion, loading, isReacting)}
        alt=""
        className={`${styles.media} ${isSpeaking ? styles.hidden : styles.visible}`}
        draggable={false}
      />
    </div>
  )
}
