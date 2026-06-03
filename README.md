# UPi - Interface do Avatar Inteligente (NAPSI/UPE)

Interface web interativa para o UPi, o assistente virtual do Núcleo de Apoio Psicopedagógico e Social Inclusivo (NAPSI) da POLI/UPE.

## ✨ Funcionalidades

- **Avatar Reativo**: Visual que muda de expressão (feliz, pensando, surpreso) conforme a resposta da IA.
- **Acessibilidade Inclusiva**:
  - **Ajuste de Fonte**: Suporte a tamanhos Normal, Grande e Extra Grande.
  - **Text-to-Speech (TTS)**: Leitura das respostas com controle de velocidade (0.5x a 2.0x).
- **Interface Low Cognitive Load**: Design limpo e intuitivo projetado para reduzir a sobrecarga sensorial, ideal para usuários com TEA.
- **Integração com a API**: Chat em `src/app/upi/UpiChatApp.tsx` via HTTP (`POST /api/chat`, proxy Vite → backend na porta 8000).

## 🚀 Tecnologias

- **React + Vite**
- **Tailwind CSS**
- **Framer Motion** (Animações e transições)
- **Lucide React** (Ícones)
- **Shadcn/UI** (Componentes de interface)

## 📋 Pré-requisitos

- Node.js (v18+)
- Backend do UPi em execução (porta 8000)

## 🛠️ Instalação

1. Instale as dependências:
   ```bash
   npm install
   # ou
   pnpm install
   ```

2. Variáveis locais (opcional):
   ```bash
   copy .env.example .env
   ```
   O chat usa o proxy `/api` → `http://localhost:8000` (ver `vite.config.ts`). Nenhum script do repo apaga ou reescreve o seu `.env`.

3. Suba o backend (`UPi-Avatar-NAPSI-backend`, porta **8000**) antes de usar o chat — ver README do backend.

## ⚙️ Execução

Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
Acesse `http://localhost:5173` no seu navegador.

## 🎨 Design

O projeto visual original foi concebido no Figma e implementado utilizando as melhores práticas de UX para acessibilidade.

---
**NAPSI/UPE** - Promovendo a inclusão na Escola Politécnica.