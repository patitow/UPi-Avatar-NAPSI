import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Clock, Heart } from "lucide-react";
import { modalA11yClasses } from "./modalAccessibility";
import { useModalFocus } from "../../hooks/useModalFocus";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  highContrast?: boolean;
}

export function InfoModal({
  isOpen,
  onClose,
  highContrast = false,
}: InfoModalProps) {
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
            aria-labelledby="info-title"
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
                aria-label="Fechar sobre o UPi"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>

              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className={s.avatarFrame}>
                    <img
                      src="/assets/avatar_idle.jpeg"
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h2 id="info-title" className={s.title}>
                  Sobre o UPi
                </h2>
                <p className={s.subtitle}>Seu assistente virtual do NAPSI</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Heart
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${s.icon}`}
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className={s.heading}>Missão</h3>
                    <p className={s.body}>
                      Apoiar alunos da POLI/UPE com informações acadêmicas e
                      orientação institucional, especialmente para estudantes com
                      TEA.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${s.icon}`}
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className={s.heading}>Disponibilidade</h3>
                    <p className={s.body}>
                      Disponível 24/7 para responder suas dúvidas básicas sobre
                      a instituição.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${s.icon}`}
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className={s.heading}>Contato NAPSI</h3>
                    <p className={s.body}>
                      Para questões específicas ou atendimento personalizado:
                      <br />
                      <a href="mailto:napsi@poli.upe.br" className={s.link}>
                        napsi@poli.upe.br
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className={s.callout}>
                <p className={`text-xs leading-relaxed ${s.body}`}>
                  <strong className={s.calloutStrong}>Importante:</strong> O UPi
                  é um assistente automatizado e não substitui o atendimento
                  humano do NAPSI. Para questões pessoais ou que necessitem
                  acompanhamento profissional, entre em contato diretamente com a
                  equipe.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className={`${s.primaryBtn} mt-6`}
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
