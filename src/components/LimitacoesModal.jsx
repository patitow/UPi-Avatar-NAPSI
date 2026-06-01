import { useEffect, useRef } from 'react'
import styles from './LimitacoesModal.module.css'

const LIMITACOES = [
  {
    titulo: 'Cache semântico requer Redis',
    descricao: 'O cache de respostas similares depende do Redis Stack rodando via Docker. Sem ele, cada pergunta vai direto ao LLM.',
  },
  {
    titulo: 'Embeddings dependem do Ollama',
    descricao: 'A vetorização de texto usa o modelo llama3.2:3b via Ollama. O download do modelo (~2 GB) é necessário na primeira execução.',
  },
  {
    titulo: 'Histórico não persiste entre sessões',
    descricao: 'O contexto de conversa por usuário é mantido apenas durante a sessão atual; ao recarregar, o histórico é perdido.',
  },
  {
    titulo: 'Base de conhecimento estática',
    descricao: 'As informações do NAPSI estão num arquivo .txt local. Mudanças nos dados exigem reingestão manual.',
  },
  {
    titulo: 'LLM de fallback menos preciso',
    descricao: 'Sem chave OpenAI, o sistema usa llama3.2:3b via Ollama, que pode gerar respostas menos fluentes ou imprecisas.',
  },
  {
    titulo: 'Sem autenticação de usuário',
    descricao: 'Qualquer pessoa com acesso à URL pode usar o sistema. Não há controle de identidade ou privacidade por usuário.',
  },
]

export default function LimitacoesModal({ open, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open) {
      el.showModal()
    } else if (el.open) {
      el.close()
    }
  }, [open])

  // Fecha ao clicar fora (no backdrop)
  const handleClick = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const outside =
      e.clientX < rect.left || e.clientX > rect.right ||
      e.clientY < rect.top  || e.clientY > rect.bottom
    if (outside) onClose()
  }

  return (
    <dialog ref={ref} className={styles.dialog} onClick={handleClick}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title}>Limitações conhecidas</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <p className={styles.intro}>
          O UPi é um MVP acadêmico. Os itens abaixo são limitações conhecidas e não afetam a demonstração dos conceitos de IA aplicados.
        </p>

        <ul className={styles.list}>
          {LIMITACOES.map((l, i) => (
            <li key={i} className={styles.item}>
              <span className={styles.badge}>{i + 1}</span>
              <div>
                <strong className={styles.itemTitle}>{l.titulo}</strong>
                <p className={styles.itemDesc}>{l.descricao}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className={styles.footer}>
          <button className={styles.doneBtn} onClick={onClose}>Entendido</button>
        </div>
      </div>
    </dialog>
  )
}
