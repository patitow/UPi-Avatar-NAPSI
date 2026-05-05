import { motion } from 'motion/react';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'upi';
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
  index: number;
}

export function MessageBubble({ message, index }: MessageBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: 'easeOut',
      }}
      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-md bg-slate-900">
            <img
              src="/src/imports/image-2.png"
              alt="UPi"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Message Content */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={`max-w-[75%] md:max-w-[65%] ${isUser ? 'ml-auto' : 'mr-auto'}`}
      >
        <div
          className={`px-5 py-3.5 rounded-3xl shadow-sm ${
            isUser
              ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white'
              : 'bg-white text-slate-800 border border-slate-100'
          }`}
        >
          <p className="leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>

        {/* Timestamp */}
        <p
          className={`text-xs text-slate-400 mt-1.5 px-2 ${
            isUser ? 'text-right' : 'text-left'
          }`}
        >
          {message.timestamp.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </motion.div>

      {/* User Avatar Placeholder */}
      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>
      )}
    </motion.div>
  );
}
