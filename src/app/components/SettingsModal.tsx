import { motion, AnimatePresence } from 'motion/react';
import { X, Settings, Type, Volume2, FastForward } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontSize: 'normal' | 'large' | 'extra-large';
  setFontSize: (size: 'normal' | 'large' | 'extra-large') => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  voiceSpeed: number;
  setVoiceSpeed: (speed: number) => void;
  highContrast?: boolean;
  setHighContrast?: (enabled: boolean) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  fontSize,
  setFontSize,
  voiceEnabled,
  setVoiceEnabled,
  voiceSpeed,
  setVoiceSpeed,
  highContrast = false,
  setHighContrast,
}: SettingsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600
                           hover:bg-slate-100 rounded-xl transition-all"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-6 h-6 text-cyan-600" />
                <h2 className="text-2xl bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Acessibilidade
                </h2>
              </div>

              <div className="space-y-6">
                {/* Tamanho da Fonte */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Type className="w-4 h-4" />
                    <span className="text-sm font-medium">Tamanho da Fonte</span>
                  </div>
                  <div className="flex gap-2">
                    {(['normal', 'large', 'extra-large'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                          fontSize === size
                            ? 'bg-cyan-500 text-white shadow-md'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {size === 'normal' ? 'Normal' : size === 'large' ? 'Grande' : 'Extra'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Alto contraste */}
                {setHighContrast && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        Alto contraste (Alt+C)
                      </span>
                      <button
                        type="button"
                        onClick={() => setHighContrast(!highContrast)}
                        className={`w-12 h-6 rounded-full transition-all relative ${
                          highContrast ? 'bg-cyan-500' : 'bg-slate-200'
                        }`}
                        aria-pressed={highContrast}
                        aria-label="Alternar alto contraste"
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                            highContrast ? 'left-7' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                )}

                {/* Voz */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Volume2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Leitura de Resposta (Voz)</span>
                    </div>
                    <button
                      onClick={() => setVoiceEnabled(!voiceEnabled)}
                      className={`w-12 h-6 rounded-full transition-all relative ${
                        voiceEnabled ? 'bg-cyan-500' : 'bg-slate-200'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                          voiceEnabled ? 'left-7' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Velocidade da Voz */}
                {voiceEnabled && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-slate-700">
                      <div className="flex items-center gap-2">
                        <FastForward className="w-4 h-4" />
                        <span className="text-sm font-medium">Velocidade da Voz</span>
                      </div>
                      <span className="text-xs font-bold text-cyan-600">{voiceSpeed}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={voiceSpeed}
                      onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                  </div>
                )}
              </div>

              <button
                onClick={onClose}
                className="w-full mt-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500
                           text-white rounded-2xl shadow-md transition-all hover:scale-[1.02]"
              >
                Salvar Preferências
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
