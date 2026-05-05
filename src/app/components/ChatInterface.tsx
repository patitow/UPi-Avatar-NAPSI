import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { LogOut, Menu, X, Info, Settings } from 'lucide-react';
import { AvatarDisplay, AvatarState } from './AvatarDisplay';
import { MessageBubble, Message } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { ChatInput } from './ChatInput';
import { QuickActions } from './QuickActions';
import { Disclaimer } from './Disclaimer';
import { ScrollToBottom } from './ScrollToBottom';
import { StatusIndicator } from './StatusIndicator';
import { InfoModal } from './InfoModal';
import { SettingsModal } from './SettingsModal';

interface ChatInterfaceProps {
  onLogout: () => void;
}

// Mock responses do UPi
const mockResponses = [
  'Oxente! Que bom te ver por aqui! Como posso te ajudar hoje?',
  'Massa! Deixa eu ver o que posso fazer por você...',
  'Opa! Entendi sua dúvida. O NAPSI funciona de segunda a sexta, das 8h às 17h.',
  'Eita! Essa pergunta é mais específica. Vou te passar o contato do NAPSI: napsi@poli.upe.br',
  'Beleza! Para mais informações sobre matrícula, você pode acessar o portal do aluno.',
  'Pronto! Espero ter ajudado. Se precisar de mais alguma coisa, é só chamar!',
  'Desculpe, não tenho informações sobre isso no momento. Mas posso te passar o email do NAPSI: napsi@poli.upe.br',
  'Tá certo! O NAPSI oferece apoio psicopedagógico, orientação acadêmica e suporte para inclusão.',
];

const welcomeMessage: Message = {
  id: '0',
  content: 'Oi! Eu sou o UPi, seu assistente virtual do NAPSI! 😊\n\nEstou aqui pra te ajudar com informações sobre a POLI/UPE, suporte acadêmico e orientações institucionais.\n\nComo posso te ajudar hoje?',
  sender: 'upi',
  timestamp: new Date(),
};

export function ChatInterface({ onLogout }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [isTyping, setIsTyping] = useState(false);
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // Acessibilidade
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>('normal');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState(1);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Função para TTS
  const speakMessage = (text: string) => {
    if (!voiceEnabled) return;
    
    // Cancela qualquer fala em andamento
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = voiceSpeed;
    window.speechSynthesis.speak(utterance);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom && messages.length > 3);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // UPi real response
    setAvatarState('thinking');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) throw new Error('Falha na comunicação com o UPi');

      const data = await response.json();
      
      // Update avatar based on emotion
      const emotion = data.emotion as AvatarState;
      setAvatarState(emotion || 'talking');
      
      const upiMessage: Message = {
        id: Date.now().toString(),
        content: data.response,
        sender: 'upi',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, upiMessage]);
      speakMessage(data.response);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: 'Eita! Tive um probleminha aqui pra te responder. Tenta de novo em instantes!',
        sender: 'upi',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      // Wait a bit before going back to idle if it was talking/happy
      setTimeout(() => setAvatarState('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl animate-pulse"
             style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse"
             style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        role="banner"
        className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm"
      >
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-xl opacity-30" />
              <img
                src="/src/imports/image.png"
                alt="UPi"
                className="relative w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                UPi
              </h1>
              <div className="flex items-center gap-2">
                <StatusIndicator status={isTyping ? 'busy' : 'online'} />
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900
                         hover:bg-slate-100 rounded-xl transition-all duration-200"
            >
              <Settings className="w-4 h-4" />
              <span>Acessibilidade</span>
            </button>
            <button
              onClick={() => setShowInfoModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900
                         hover:bg-slate-100 rounded-xl transition-all duration-200"
            >
              <Info className="w-4 h-4" />
              <span>Sobre</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900
                         hover:bg-slate-100 rounded-xl transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl"
          >
            <button
              onClick={() => {
                setShowInfoModal(true);
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-slate-600 hover:bg-slate-50
                         transition-all duration-200 border-b border-slate-100"
            >
              <Info className="w-4 h-4" />
              <span>Sobre</span>
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-4 py-3 text-slate-600 hover:bg-slate-50
                         transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </motion.div>
        )}
      </motion.header>

      {/* Main Chat Area */}
      <main role="main" className="relative z-10 flex-1 flex flex-col max-w-5xl w-full mx-auto px-4 py-6">
        {/* Avatar Section */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <AvatarDisplay state={avatarState} />
        </motion.div>

        {/* Messages Container */}
        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          role="log"
          aria-live="polite"
          aria-label="Histórico de mensagens"
          className={`flex-1 overflow-y-auto mb-6 space-y-4 scroll-smooth ${
            fontSize === 'large' ? 'text-lg' : fontSize === 'extra-large' ? 'text-xl' : 'text-base'
          }`}
          style={{ maxHeight: 'calc(100vh - 400px)' }}
        >
          {messages.map((message, index) => (
            <MessageBubble key={message.id} message={message} index={index} />
          ))}
          {isTyping && <TypingIndicator />}

          {/* Quick Actions - Show only on first message */}
          {messages.length === 1 && !isTyping && (
            <div className="mt-6 space-y-4">
              <QuickActions onSelectAction={handleSendMessage} />
              <Disclaimer />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="mt-auto">
          <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
        </div>
      </main>

      {/* Scroll to Bottom Button */}
      <ScrollToBottom onClick={scrollToBottom} visible={showScrollButton} />

      {/* Info Modal */}
      <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        fontSize={fontSize}
        setFontSize={setFontSize}
        voiceEnabled={voiceEnabled}
        setVoiceEnabled={setVoiceEnabled}
        voiceSpeed={voiceSpeed}
        setVoiceSpeed={setVoiceSpeed}
      />

      {/* Footer */}
      <footer role="contentinfo" className="relative z-10 bg-white/60 backdrop-blur-xl border-t border-slate-100 py-4">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-xs text-slate-500 text-center md:text-left">
              UPi • NAPSI - Núcleo de Apoio Psicopedagógico e Social Inclusivo • POLI/UPE
            </p>
            <div className="flex items-center gap-4 text-xs">
              <a
                href="mailto:napsi@poli.upe.br"
                className="text-cyan-600 hover:text-cyan-700 transition-colors"
              >
                napsi@poli.upe.br
              </a>
              <button
                onClick={() => setShowInfoModal(true)}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                Sobre
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
