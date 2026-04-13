import { useState, FormEvent, KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative bg-white rounded-3xl shadow-lg shadow-cyan-500/5 border border-slate-100">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem..."
          disabled={disabled}
          rows={1}
          aria-label="Digite sua mensagem para o UPi"
          aria-describedby="input-help"
          className="w-full px-6 py-4 pr-14 bg-transparent resize-none outline-none placeholder:text-slate-400
                     disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            minHeight: '56px',
            maxHeight: '120px',
          }}
        />

        <motion.button
          type="submit"
          disabled={!message.trim() || disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Enviar mensagem"
          className="absolute right-3 bottom-3 p-2.5 bg-gradient-to-br from-cyan-500 to-blue-500
                     text-white rounded-2xl shadow-md shadow-cyan-500/30
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all duration-200"
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </div>

      <p id="input-help" className="text-xs text-slate-400 mt-2 px-2 text-center">
        Pressione Enter para enviar • Shift+Enter para nova linha
      </p>
    </form>
  );
}
