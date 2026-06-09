const PROD_API_URL = "https://upi-api.patitow.dev";

/** Base URL da API UPi (sem barra final). */
export const API_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  (import.meta.env.PROD ? PROD_API_URL : "/api");
