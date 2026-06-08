import { useState, useRef, useEffect, useCallback } from 'react'
import UpiAvatar from './components/UpiAvatar'
import ChatMessage from './components/ChatMessage'
import ChatInput from './components/ChatInput'
import LimitacoesModal from './components/LimitacoesModal'
import { useSpeech } from './hooks/useSpeech'
import styles from './App.module.css'

const API_URL = '/api'

const WELCOME_MESSAGE = {
  id: 'welcome',
  from: 'upi',
  text: 'Oi! Sou o UPi, assistente virtual do NAPSI aqui na POLI/UPE! Massa demais ter você aqui, visse? Pode me perguntar qualquer coisa sobre o núcleo — atendimentos, serviços, como agendar... Tô aqui pra ajudar!',
  emotion: 'happy',
  time: new Date(),
}

const QUICK_QUESTIONS = [
  'Como agendar um atendimento?',
  'Onde fica o NAPSI?',
  'Quais serviços o NAPSI oferece?',
  'O NAPSI apoia alunos com TEA?',
]

export default function App() {
  const [messages, setMessages]         = useState([WELCOME_MESSAGE])
  const [emotion, setEmotion]           = useState('happy')
  const [loading, setLoading]           = useState(false)
  const [isSpeaking, setIsSpeaking]     = useState(false)
  const [isReacting, setIsReacting]     = useState(false)
  const [showLimitacoes, setShowLimitacoes] = useState(false)
  const [apiStatus, setApiStatus]       = useState('checking')
  const [aiMode, setAiMode]             = useState(null)
  const bottomRef  = useRef(null)
  const reactTimer = useRef(null)

  const { speak, stop, toggle: toggleVoice, enabled: voiceEnabled, supported: voiceSupported } = useSpeech({
    onStart: () => setIsSpeaking(true),
    onEnd:   () => setIsSpeaking(false),
  })

  // Verifica conexão e modo da IA na montagem
  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        setApiStatus('online')
        setAiMode({
          provider:    data.llm_provider,
          model:       data.llm_model,
          vectorStore: data.vector_store,
        })
      })
      .catch(() => setApiStatus('offline'))
  }, [])

  // Auto-scroll ao final das mensagens
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Aciona animação de reação ao mudar emoção
  const triggerReact = useCallback((newEmotion) => {
    clearTimeout(reactTimer.current)
    setIsReacting(true)
    setEmotion(newEmotion)
    reactTimer.current = setTimeout(() => setIsReacting(false), 550)
  }, [])

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return

    stop() // interrompe fala anterior se houver

    setMessages(prev => [...prev, {
      id: Date.now(), from: 'user', text: text.trim(), time: new Date(),
    }])
    setLoading(true)
    triggerReact('thinking')

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()

      console.log("RESPOSTA API:", data)

      console.log("Audio recebido:", !!data.audio)
      console.log("Tamanho:", data.audio?.length)

      const responseText    = data.response ?? 'Eita, não entendi a resposta do servidor!'
      const responseEmotion = data.emotion  ?? 'neutral'

      setMessages(prev => [...prev, {
        id: Date.now() + 1, from: 'upi',
        text: responseText, emotion: responseEmotion, time: new Date(),
      }])

      triggerReact(responseEmotion)

      if (data.audio) {
        const audio = new Audio(data.audio)

        audio.onplay = () => setIsSpeaking(true)
        audio.onended = () => setIsSpeaking(false)

        audio.play()
      } else {
        speak(responseText)
      }

      setApiStatus('online')
    } catch {
      const errText = 'Oxe! Não consegui falar com o servidor. Verifica se a API tá rodando, visse?'
      setMessages(prev => [...prev, {
        id: Date.now() + 1, from: 'upi',
        text: errText, emotion: 'sad', time: new Date(), isError: true,
      }])
      triggerReact('sad')
      speak(errText)
      setApiStatus('offline')
    } finally {
      setLoading(false)
    }
  }, [loading, triggerReact, speak, stop])

  const handleClear = () => {
    stop()
    clearTimeout(reactTimer.current)
    setMessages([{ ...WELCOME_MESSAGE, id: Date.now(), time: new Date() }])
    setEmotion('happy')
    setIsSpeaking(false)
    setIsReacting(false)
  }

  const modeLabel = aiMode
    ? aiMode.provider === 'ollama'
      ? `IA Local · ${aiMode.model}`
      : `IA Cloud · ${aiMode.model}`
    : null

  const statusLabel = {
    online:   { text: modeLabel ?? 'API conectada', cls: aiMode?.provider === 'ollama' ? styles.statusLocal : styles.statusOnline },
    offline:  { text: 'API offline',                cls: styles.statusOffline },
    checking: { text: 'Verificando...',             cls: styles.statusChecking },
  }[apiStatus]

  return (
    <div className={styles.layout}>

      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerBrand}>
            <div className={styles.headerLogoBox}>
              <span className={styles.headerLogoText}>UPE</span>
            </div>
            <div>
              <p className={styles.headerTitle}>UPi — Assistente do NAPSI</p>
              <p className={styles.headerSub}>POLI/UPE · Núcleo de Apoio Psicopedagógico e Social Inclusivo</p>
            </div>
          </div>

          <div className={styles.headerActions}>
            {/* Botão mudo/som */}
            {voiceSupported && (
              <button
                className={`${styles.voiceBtn} ${!voiceEnabled ? styles.voiceMuted : ''}`}
                onClick={toggleVoice}
                title={voiceEnabled ? 'Silenciar voz do UPi' : 'Ativar voz do UPi'}
                aria-label={voiceEnabled ? 'Silenciar voz' : 'Ativar voz'}
              >
                {voiceEnabled ? (
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
                    <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
                <span>{voiceEnabled ? 'Voz ativa' : 'Mudo'}</span>
              </button>
            )}

            {/* Status da API */}
            <span className={`${styles.apiStatus} ${statusLabel.cls}`}>
              <span className={styles.apiDot} />
              {statusLabel.text}
            </span>

            {/* Botão limitações */}
            <button
              className={styles.limitBtn}
              onClick={() => setShowLimitacoes(true)}
              title="Ver limitações conhecidas do sistema"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Limitações
            </button>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className={styles.body}>

        {/* ── Sidebar ── */}
        <aside className={styles.sidebar}>
          <div className={styles.avatarCard}>
            <UpiAvatar
              emotion={emotion}
              loading={loading}
              isSpeaking={isSpeaking}
              isReacting={isReacting}
            />
            <div className={styles.avatarMeta}>
              <strong className={styles.avatarName}>UPi</strong>
              <span className={`${styles.avatarStatus} ${
                loading    ? styles.statusThinking :
                isSpeaking ? styles.statusSpeaking :
                             styles.statusOnline
              }`}>
                {loading ? 'Pensando...' : isSpeaking ? 'Falando...' : 'Online'}
              </span>
            </div>
          </div>

          {/* Info NAPSI */}
          <div className={styles.infoBox}>
            <p className={styles.infoTitle}>NAPSI — POLI/UPE</p>
            <ul className={styles.infoList}>
              <li>📍 Bloco A, Sala 12</li>
              <li>🕗 Seg a Sex, 08h–17h</li>
              <li>✉️ napsi@poli.br</li>
            </ul>
          </div>

          {/* Modo IA ativo */}
          {aiMode && (
            <div className={`${styles.infoBox} ${aiMode.provider === 'ollama' ? styles.modeLocal : styles.modeCloud}`}>
              <p className={styles.infoTitle}>IA em uso</p>
              <ul className={styles.infoList}>
                <li>{aiMode.provider === 'ollama' ? '🖥️ Local (Ollama)' : '☁️ Cloud (OpenAI)'}</li>
                <li>🤖 {aiMode.model}</li>
                <li>🗄️ {aiMode.vectorStore === 'chroma' ? 'ChromaDB local' : 'PGVector'}</li>
              </ul>
            </div>
          )}

          {/* Nova conversa */}
          <button className={styles.clearBtn} onClick={handleClear}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 4v4m0 0L9 5m3 3l3-2M4 12h4m0 0L5 9m3 3-2 3M20 12h-4m0 0 3-3m-3 3 2 3M12 20v-4m0 0 3 3m-3-3-3 3"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Nova conversa
          </button>
        </aside>

        {/* ── Área de chat ── */}
        <main className={styles.chat}>

          {/* Barra de ação do chat (mobile) */}
          <div className={styles.chatTopBar}>
            <div className={styles.chatAvatarMini}>
              <UpiAvatar emotion={emotion} loading={loading} isSpeaking={isSpeaking} isReacting={isReacting} />
              <div>
                <strong>UPi</strong>
                <span className={`${styles.avatarStatus} ${
                  loading ? styles.statusThinking : isSpeaking ? styles.statusSpeaking : styles.statusOnline
                }`}>
                  {loading ? 'Pensando...' : isSpeaking ? 'Falando...' : 'Online'}
                </span>
              </div>
            </div>
            <button className={styles.clearBtnMobile} onClick={handleClear} title="Nova conversa">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M3 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Mensagens */}
          <div className={styles.messages}>
            {messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {loading && (
              <div className={styles.typingRow}>
                <div className={styles.typingBubble}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Perguntas rápidas (só antes da primeira mensagem do usuário) */}
          {messages.length === 1 && (
            <div className={styles.quickWrap}>
              <p className={styles.quickLabel}>Perguntas frequentes</p>
              <div className={styles.quickGrid}>
                {QUICK_QUESTIONS.map(q => (
                  <button
                    key={q}
                    className={styles.quickBtn}
                    onClick={() => sendMessage(q)}
                    disabled={loading}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <ChatInput onSend={sendMessage} disabled={loading} />
        </main>
      </div>

      {/* ── Modal de limitações ── */}
      <LimitacoesModal open={showLimitacoes} onClose={() => setShowLimitacoes(false)} />
    </div>
  )
}
