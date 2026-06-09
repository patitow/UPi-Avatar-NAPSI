import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { AccessibilityApi } from "../../hooks/useAccessibility";
import { API_URL, apiFetch } from "../../config/api";
import { setSiteAuthToken } from "../../utils/authStorage";
import styles from "./LoginScreen.module.css";

interface LoginScreenProps {
  onLogin: () => void;
  a11y: AccessibilityApi;
}

export function LoginScreen({ onLogin, a11y }: LoginScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const [authRequired, setAuthRequired] = useState(import.meta.env.PROD);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!import.meta.env.PROD) {
      setAuthRequired(false);
      return;
    }

    fetch(`${API_URL}/auth/config`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: { required?: boolean }) => {
        setAuthRequired(Boolean(data?.required));
      })
      .catch(() => setAuthRequired(true));
  }, []);

  const enterWithoutPassword = () => {
    a11y.announceStatus("Entrando no UPi");
    onLogin();
  };

  const submitPassword = async () => {
    if (!password.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ password: password.trim() }),
      });
      if (!res.ok) {
        setError("Senha incorreta. Tente novamente.");
        a11y.announceError("Senha incorreta");
        return;
      }
      const data = (await res.json()) as { token?: string | null };
      if (data.token) setSiteAuthToken(data.token);
      a11y.announceStatus("Acesso autorizado. Entrando no UPi");
      onLogin();
    } catch {
      setError("Não foi possível validar a senha agora. Tente de novo.");
      a11y.announceError("Falha ao validar senha");
    } finally {
      setLoading(false);
    }
  };

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

        {authRequired ? (
          <form
            className={styles.passwordForm}
            onSubmit={(e) => {
              e.preventDefault();
              void submitPassword();
            }}
          >
            <label className={styles.passwordLabel} htmlFor="site-password">
              Senha de acesso
            </label>
            <input
              id="site-password"
              type="password"
              className={styles.passwordInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Digite a senha do site"
              disabled={loading}
            />
            {error ? (
              <p className={styles.errorText} role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              className={styles.loginBtn}
              disabled={loading || !password.trim()}
            >
              {loading ? "Validando..." : "Entrar"}
            </button>
          </form>
        ) : (
          <button
            type="button"
            className={styles.loginBtn}
            onClick={enterWithoutPassword}
            aria-label="Entrar no UPi"
          >
            Entrar
          </button>
        )}

        <p className={styles.footerNote}>
          {authRequired
            ? "Acesso restrito · uso autorizado NAPSI/POLI"
            : "Ambiente de desenvolvimento"}
          {!prefersReducedMotion ? "" : " · Animações reduzidas pelo sistema"}
        </p>
      </main>

      <footer className={styles.pageFooter} role="contentinfo">
        UPi · NAPSI — POLI/UPE
      </footer>
    </div>
  );
}
