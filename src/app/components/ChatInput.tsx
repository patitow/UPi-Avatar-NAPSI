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
    // Envia no Enter apenas se não estiver segurando o Shift e se não for mobile
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div 
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-cyan-500 focus-within:border-transparent transition-all
                   high-contrast:bg-black high-contrast:border-2 high-contrast:border-white high-contrast:focus-within:ring-white"
      >
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "O UPi está pensando..." : "Digite sua mensagem..."}
          disabled={disabled}
          rows={1}
          aria-label="Caixa de entrada de mensagem para o UPi"
          aria-describedby="input-help"
          className="w-full px-5 py-4 pr-14 bg-transparent resize-none outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400
                     disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            minHeight: '54px',
            maxHeight: '140px',
          }}
        />

        <motion.button
          type="submit"
          disabled={!message.trim() || disabled}
          whileHover={{ scale: message.trim() && !disabled ? 1.03 : 1 }}
          whileTap={{ scale: message.trim() && !disabled ? 0.97 : 1 }}
          aria-label="Enviar mensagem para o UPi"
          className="absolute right-2.5 bottom-2.5 p-2.5 bg-gradient-to-br from-cyan-600 to-blue-600
                     text-white rounded-xl shadow-sm
                     disabled:opacity-30 disabled:bg-none disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed
                     transition-all duration-150
                     high-contrast:bg-white high-contrast:text-black high-contrast:disabled:border high-contrast:disabled:border-white/40"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
        </motion.button>
      </div>

      <p id="input-help" className="text-xs text-slate-400 dark:text-slate-500 mt-2 px-2 text-center high-contrast:text-white">
        Pressione <kbd className="font-sans bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 high-contrast:bg-white high-contrast:text-black">Enter</kbd> para enviar • <kbd className="font-sans bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 high-contrast:bg-white high-contrast:text-black">Shift + Enter</kbd> para pular linha
      </p>
    </form>
  );
}