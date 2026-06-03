import { useState, useRef } from "react";
import styles from "./ChatInputBar.module.css";

interface ChatInputBarProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function ChatInputBar({ onSend, disabled = false }: ChatInputBarProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    textareaRef.current?.focus();
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${Math.min(ta.scrollHeight, 140)}px`;
    }
  };

  return (
    <div className={styles.bar}>
      <div
        className={`${styles.inputWrap} ${disabled ? styles.disabled : ""}`}
      >
        <textarea
          ref={textareaRef}
          id="main-chat-input"
          className={styles.textarea}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKey}
          placeholder="Digite sua pergunta... (Enter para enviar)"
          rows={1}
          disabled={disabled}
          aria-label="Mensagem para o UPi"
          maxLength={1000}
        />
        <button
          type="button"
          className={styles.sendBtn}
          onClick={submit}
          disabled={disabled || !value.trim()}
          aria-label="Enviar mensagem"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M3.4 20.4L20.85 12.92a1 1 0 0 0 0-1.84L3.4 3.6A1 1 0 0 0 2 4.52L4.5 12 2 19.48a1 1 0 0 0 1.4.92z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
      <p className={styles.hint} id="chat-input-hint">
        Shift + Enter para nova linha · {value.length}/1000 · Atalhos: Alt+A
        acessibilidade, Alt+I sobre, Alt+C alto contraste
      </p>
    </div>
  );
}
