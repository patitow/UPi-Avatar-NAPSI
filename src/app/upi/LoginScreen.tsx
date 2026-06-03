import { useReducedMotion } from "motion/react";
import type { AccessibilityApi } from "../../hooks/useAccessibility";
import styles from "./LoginScreen.module.css";

interface LoginScreenProps {
  onLogin: () => void;
  a11y: AccessibilityApi;
}

export function LoginScreen({ onLogin, a11y }: LoginScreenProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={styles.page}>
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {a11y.statusAnnouncement}
      </div>

      <main className={styles.card} role="main" aria-labelledby="login-title">
        <div className={styles.brandRow}>
          <div className={styles.logoBox} aria-hidden="true">
            <span className={styles.logoText}>UPE</span>
          </div>
          <div>
            <p className={styles.brandTitle}>POLI/UPE · NAPSI</p>
            <p className={styles.brandSub}>Núcleo de Apoio Psicopedagógico</p>
          </div>
        </div>

        <div className={styles.avatarWrap}>
          <img
            src="/assets/avatar_idle.jpeg"
            alt="Ilustração do assistente virtual UPi"
            className={styles.avatarImg}
          />
        </div>

        <h1 id="login-title" className={styles.title}>
          UPi
        </h1>
        <p className={styles.subtitle}>Assistente virtual</p>
        <p className={styles.desc}>
          Seu assistente para suporte acadêmico e orientação institucional na
          POLI/UPE.
        </p>

        <div className={styles.divider} aria-hidden="true" />

        <button
          type="button"
          className={styles.loginBtn}
          onClick={() => {
            a11y.announceStatus("Entrando no UPi");
            onLogin();
          }}
          aria-label="Entrar com conta Google. Acesso restrito a e-mails @upe.br"
        >
          <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
              fill="currentColor"
            />
            <path
              d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
              fill="currentColor"
              opacity="0.85"
            />
            <path
              d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
              fill="currentColor"
              opacity="0.7"
            />
            <path
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
              fill="currentColor"
              opacity="0.9"
            />
          </svg>
          Entrar com Google
        </button>

        <p className={styles.footerNote}>
          Acesso restrito a <strong>@upe.br</strong>
          {!prefersReducedMotion ? "" : " · Animações reduzidas pelo sistema"}
        </p>
      </main>

      <footer className={styles.pageFooter} role="contentinfo">
        UPi · NAPSI — POLI/UPE
      </footer>
    </div>
  );
}
