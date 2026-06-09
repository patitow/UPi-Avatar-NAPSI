const TOKEN_KEY = "upi-site-auth-token";

export function getSiteAuthToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setSiteAuthToken(token: string | null): void {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export function clearSiteAuthToken(): void {
  setSiteAuthToken(null);
}
