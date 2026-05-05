import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Clock, Heart } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600
                           hover:bg-slate-100 rounded-xl transition-all"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-slate-900">
                    <img
                      src="/src/imports/image-2.png"
                      alt="UPi"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h2 className="text-2xl mb-2 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Sobre o UPi
                </h2>
                <p className="text-slate-600">
                  Seu assistente virtual do NAPSI
                </p>
              </div>

              {/* Content */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm mb-1 text-slate-800">Missão</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Apoiar alunos da POLI/UPE com informações acadêmicas e orientação institucional,
                      especialmente para estudantes com TEA.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm mb-1 text-slate-800">Disponibilidade</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Disponível 24/7 para responder suas dúvidas básicas sobre a instituição.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm mb-1 text-slate-800">Contato NAPSI</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Para questões específicas ou atendimento personalizado:
                      <br />
                      <a
                        href="mailto:napsi@poli.upe.br"
                        className="text-cyan-600 hover:text-cyan-700 underline"
                      >
                        napsi@poli.upe.br
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Importante:</strong> O UPi é um assistente automatizado e não substitui
                  o atendimento humano do NAPSI. Para questões pessoais ou que necessitem
                  acompanhamento profissional, entre em contato diretamente com a equipe.
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full mt-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500
                           text-white rounded-2xl shadow-md shadow-cyan-500/20
                           hover:shadow-lg hover:shadow-cyan-500/30
                           transition-all duration-200"
              >
                Entendi
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
