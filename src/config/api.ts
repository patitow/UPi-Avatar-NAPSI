import { getSiteAuthToken } from "../utils/authStorage";

const PROD_API_URL = "https://upi-api.patitow.dev";

/** Base URL da API UPi (sem barra final). */
export const API_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  (import.meta.env.PROD ? PROD_API_URL : "/api");

export async function apiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  const token = getSiteAuthToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (
    init.body &&
    typeof init.body === "string" &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(`${API_URL}${path}`, { ...init, headers });
}
