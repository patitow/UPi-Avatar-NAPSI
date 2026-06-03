import { useEffect, useRef } from "react";
import styles from "./LimitacoesModal.module.css";

const LIMITACOES = [
  {
    titulo: "Cache semântico requer Redis",
    descricao:
      "O cache de respostas similares depende do Redis Stack rodando via Docker. Sem ele, cada pergunta vai direto ao LLM.",
  },
  {
    titulo: "Embeddings dependem do Ollama",
    descricao:
      "A vetorização de texto usa o modelo local via Ollama. O download do modelo é necessário na primeira execução.",
  },
  {
    titulo: "Histórico não persiste entre sessões",
    descricao:
      "O contexto de conversa é mantido apenas durante a sessão atual; ao recarregar, o histórico é perdido.",
  },
  {
    titulo: "Base de conhecimento estática",
    descricao:
      "As informações do NAPSI estão num arquivo local. Mudanças nos dados exigem reingestão manual.",
  },
  {
    titulo: "LLM de fallback menos preciso",
    descricao:
      "Sem chave OpenAI, o sistema usa Ollama, que pode gerar respostas menos fluentes ou imprecisas.",
  },
  {
    titulo: "Sem autenticação de usuário",
    descricao:
      "Qualquer pessoa com acesso à URL pode usar o sistema. Não há controle de identidade por usuário.",
  },
];

interface LimitacoesModalProps {
  open: boolean;
  onClose: () => void;
}

export function LimitacoesModal({ open, onClose }: LimitacoesModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) {
      el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onCancel = () => onClose();
    el.addEventListener("cancel", onCancel);
    return () => el.removeEventListener("cancel", onCancel);
  }, [onClose]);

  const handleClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const outside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
    if (outside) onClose();
  };

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      onClick={handleClick}
      aria-labelledby="limitacoes-title"
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 id="limitacoes-title" className={styles.title}>
            Limitações conhecidas
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Fechar limitações"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <p className={styles.intro}>
          O UPi é um MVP acadêmico. Os itens abaixo são limitações conhecidas e
          não afetam a demonstração dos conceitos de IA aplicados.
        </p>

        <ul className={styles.list}>
          {LIMITACOES.map((l, i) => (
            <li key={l.titulo} className={styles.item}>
              <span className={styles.badge} aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <strong className={styles.itemTitle}>{l.titulo}</strong>
                <p className={styles.itemDesc}>{l.descricao}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className={styles.footer}>
          <button type="button" className={styles.doneBtn} onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
    </dialog>
  );
}
