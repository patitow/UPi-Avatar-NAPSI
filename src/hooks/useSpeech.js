import { useState, useEffect, useRef, useCallback } from 'react'
import { pernambucanize } from '../utils/pernambucanize'

const LANG = 'pt-BR'

function pickVoice(voices) {
  const ptBR = voices.filter(v => v.lang === 'pt-BR')
  // Preferência: Flo (nova, responde melhor à fonética) → outras pt-BR
  const preferred = ptBR.find(v => /\bflo\b/i.test(v.name))
    ?? ptBR.find(v => /luciana|sandy|shelley/i.test(v.name))
    ?? ptBR[0]
    ?? voices.find(v => v.lang.startsWith('pt'))
    ?? null
  if (preferred) console.log('[TTS VOICE SELECTED]', preferred.name)
  return preferred
}

export function useSpeech({ onStart, onEnd } = {}) {
  const [enabled, setEnabled]     = useState(true)
  const [supported, setSupported] = useState(false)
  const voiceRef  = useRef(null)
  const uttRef    = useRef(null)

  // Verifica suporte e pré-carrega vozes
  useEffect(() => {
    if (!window.speechSynthesis) return
    setSupported(true)

    const load = () => {
      const voices = window.speechSynthesis.getVoices()
      voiceRef.current = pickVoice(voices)
    }

    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [])

  const speak = useCallback((text) => {
    if (!supported || !enabled || !text) return

    // Cancela fala anterior
    window.speechSynthesis.cancel()

    // Remove emojis/markdown, depois aplica transformação fonética pernambucana
    const clean = pernambucanize(
      text
        .replace(/[\u{1F300}-\u{1FFFF}]/gu, '')
        .replace(/[*_~`#]/g, '')
        .trim()
    )

    // Busca voz na hora também (garante que voiceschanged já disparou)
    const voice = voiceRef.current ?? pickVoice(window.speechSynthesis.getVoices())

    console.log('[TTS] texto transformado:', clean)
    console.log('[TTS] voz:', voice?.name)

    const utt = new SpeechSynthesisUtterance(clean)
    utt.lang   = LANG
    utt.rate   = 0.84   // mais devagar — clareza e sotaque nordestino
    utt.pitch  = 1.08   // leve elevação — suave, sem exagero
    utt.volume = 1.0

    if (voice) utt.voice = voice

    utt.onstart = () => onStart?.()
    utt.onend   = () => onEnd?.()
    utt.onerror = () => onEnd?.()

    uttRef.current = utt
    window.speechSynthesis.speak(utt)
  }, [supported, enabled, onStart, onEnd])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    onEnd?.()
  }, [onEnd])

  const toggle = useCallback(() => {
    setEnabled(prev => {
      if (prev) window.speechSynthesis.cancel()
      return !prev
    })
  }, [])

  return { speak, stop, toggle, enabled, supported }
}
