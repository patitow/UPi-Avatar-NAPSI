# Deploy do front UPi (Vercel)

Guia completo (backend + DNS Cloudflare): [`../DEPLOY.md`](../DEPLOY.md).

## Vercel

1. Conecte o repositório `UPi-Avatar-NAPSI`.
2. Build: `npm run build` · Output: `dist`
3. Domínio: `upi.patitow.dev`

## Variável de ambiente (Production)

```
VITE_API_BASE_URL=https://api.upi.patitow.dev
```

Sem essa variável, o build usa `/api` (proxy do Vite), que **não existe** na Vercel — o chat fica offline.

## Dev local

Deixe `VITE_API_BASE_URL` vazio no `.env`. O proxy em `vite.config.ts` encaminha `/api` → `http://localhost:8000`.

## `vercel.json`

Rewrite SPA: todas as rotas servem `index.html` (React client-side).
