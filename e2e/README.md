# E2E (Playwright)

Testes do **front** contra a UI real. Não sobem nem configuram o backend.

## Antes de rodar

1. Backend em `http://localhost:8000` (ex.: `.\start_dev.ps1` no repo do backend)
2. Opcional: `npm run dev` aqui — o Playwright sobe o Vite sozinho se a porta estiver livre

```bash
npm install
npx playwright install chromium
npm run test:e2e
```

Os testes de chat validam intenções (local, TEA, agendamento) quando a API está no ar.
