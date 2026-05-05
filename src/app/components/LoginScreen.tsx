import { motion } from "motion/react";
import { LogIn } from "lucide-react";
import { AvatarDisplay } from "./AvatarDisplay";

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-cyan-100 rounded-full blur-3xl opacity-50 animate-pulse" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 relative z-10 border border-slate-100 flex flex-col items-center"
      >
        {/* Official UPi Avatar (Same as Chat) */}
        <div className="mb-8 w-48 h-48">
          <AvatarDisplay state="talking" isLoginScreen={true} />
        </div>

        {/* Title and Intro */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            UPi
          </h1>
          <p className="text-slate-500 font-medium text-lg mb-4">
            Assistente virtual do NAPSI
          </p>
          <p className="text-slate-600 leading-relaxed px-2">
            Olá! Eu sou o UPi, seu assistente virtual. Estou aqui para ajudar
            com informações acadêmicas e suporte institucional.
          </p>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLogin}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-cyan-200 flex items-center justify-center gap-3 transition-all hover:shadow-cyan-300"
        >
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <LogIn className="w-5 h-5" />
          </div>
          Entrar com Google
        </motion.button>

        {/* Footer Info */}
        <p className="text-center mt-8 text-xs text-slate-400 font-bold tracking-tight uppercase">
          Acesso restrito a domínios{" "}
          <span className="text-slate-500">@upe.br</span>
        </p>
      </motion.div>
    </div>
  );
}
