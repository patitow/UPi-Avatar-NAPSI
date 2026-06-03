import { motion, AnimatePresence } from "motion/react";
import { X, Settings, Type, Volume2, FastForward } from "lucide-react";
import { modalA11yClasses } from "./modalAccessibility";
import { useModalFocus } from "../../hooks/useModalFocus";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontSize: "normal" | "large" | "extra-large";
  setFontSize: (size: "normal" | "large" | "extra-large") => void;
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
  const s = modalA11yClasses(highContrast);
  const panelRef = useModalFocus(isOpen, onClose);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={s.backdrop}
            aria-hidden="true"
          />

          <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
          >
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={s.panel}
            >
              <button
                type="button"
                onClick={onClose}
                className={s.closeBtn}
                aria-label="Fechar configurações de acessibilidade"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <Settings className={`w-6 h-6 ${s.icon}`} aria-hidden="true" />
                <h2 id="settings-title" className={s.title}>
                  Acessibilidade
                </h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className={`flex items-center gap-2 ${s.label}`}>
                    <Type className="w-4 h-4" aria-hidden="true" />
                    <span className="text-sm font-medium">Tamanho da Fonte</span>
                  </div>
                  <div className="flex gap-2" role="group" aria-label="Tamanho da fonte">
                    {(["normal", "large", "extra-large"] as const).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setFontSize(size)}
                        className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                          fontSize === size ? s.chipActive : s.chipInactive
                        } ${highContrast ? "focus-visible:outline-yellow-300" : "focus-visible:outline-cyan-500"}`}
                      >
                        {size === "normal"
                          ? "Normal"
                          : size === "large"
                            ? "Grande"
                            : "Extra"}
                      </button>
                    ))}
                  </div>
                </div>

                {setHighContrast && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${s.label}`}>
                        Alto contraste (Alt+C)
                      </span>
                      <button
                        type="button"
                        onClick={() => setHighContrast(!highContrast)}
                        className={`w-12 h-6 rounded-full transition-all relative ${highContrast ? s.toggleTrackOn : s.toggleTrackOff}`}
                        aria-pressed={highContrast}
                        aria-label="Alternar alto contraste"
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 rounded-full transition-all ${s.toggleThumb} ${highContrast ? "left-7" : "left-1"}`}
                        />
                      </button>
                    </div>
                    <p className={`text-xs ${s.body}`}>
                      Respeita também a preferência do sistema (
                      <code>prefers-contrast: more</code>).
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 ${s.label}`}>
                      <Volume2 className="w-4 h-4" aria-hidden="true" />
                      <span className="text-sm font-medium">
                        Leitura de Resposta (Voz)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVoiceEnabled(!voiceEnabled)}
                      className={`w-12 h-6 rounded-full transition-all relative ${voiceEnabled ? s.toggleTrackOn : s.toggleTrackOff}`}
                      aria-pressed={voiceEnabled}
                      aria-label="Alternar leitura de voz"
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 rounded-full transition-all ${s.toggleThumb} ${voiceEnabled ? "left-7" : "left-1"}`}
                      />
                    </button>
                  </div>
                </div>

                {voiceEnabled && (
                  <div className="space-y-3">
                    <div className={`flex items-center justify-between ${s.label}`}>
                      <div className="flex items-center gap-2">
                        <FastForward className="w-4 h-4" aria-hidden="true" />
                        <span className="text-sm font-medium">
                          Velocidade da Voz
                        </span>
                      </div>
                      <span className={s.speedLabel}>{voiceSpeed}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={voiceSpeed}
                      onChange={(e) =>
                        setVoiceSpeed(parseFloat(e.target.value))
                      }
                      className={s.range}
                      aria-label="Velocidade da voz"
                      aria-valuemin={0.5}
                      aria-valuemax={2}
                      aria-valuenow={voiceSpeed}
                    />
                  </div>
                )}
              </div>

              <button type="button" onClick={onClose} className={`${s.primaryBtn} mt-8`}>
                Salvar Preferências
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
