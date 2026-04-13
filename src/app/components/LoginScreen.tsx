import { motion } from 'motion/react';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50">
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl animate-pulse"
             style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse"
             style={{ animationDuration: '6s', animationDelay: '1s' }} />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-cyan-500/10 p-12 max-w-md w-full mx-4"
      >
        {/* Logo and Avatar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-2xl opacity-40 animate-pulse" />
            <img
              src="/src/imports/image.png"
              alt="UPi Avatar"
              className="relative w-32 h-32 object-contain drop-shadow-2xl"
            />
          </div>
          <h1 className="text-4xl mb-2 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            UPi
          </h1>
          <p className="text-slate-600 text-center leading-relaxed">
            Assistente virtual do NAPSI
          </p>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8 text-center"
        >
          <p className="text-slate-600 leading-relaxed">
            Olá! Eu sou o UPi, seu assistente virtual. Estou aqui para ajudar com informações acadêmicas e suporte institucional.
          </p>
        </motion.div>

        {/* Login Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0, 212, 255, 0.2)' }}
          whileTap={{ scale: 0.98 }}
          onClick={onLogin}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-2xl
                     shadow-lg shadow-cyan-500/30 transition-all duration-300
                     flex items-center justify-center gap-3 group"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="tracking-wide">Entrar com Google</span>
        </motion.button>

        {/* Footer Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-6 text-xs text-center text-slate-500 leading-relaxed"
        >
          Acesso restrito a emails @upe.br, @ecomp.poli.br ou @poli.br
        </motion.p>
      </motion.div>
    </div>
  );
}
