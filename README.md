# UPi - Interface do Avatar Inteligente (NAPSI/UPE)

Interface web interativa para o UPi, o assistente virtual do Núcleo de Apoio Psicopedagógico e Social Inclusivo (NAPSI) da POLI/UPE.

## ✨ Funcionalidades

- **Avatar Reativo**: Visual que muda de expressão (feliz, pensando, surpreso) conforme a resposta da IA.
- **Acessibilidade Inclusiva**:
  - **Ajuste de Fonte**: Suporte a tamanhos Normal, Grande e Extra Grande.
  - **Text-to-Speech (TTS)**: Leitura das respostas com controle de velocidade (0.5x a 2.0x).
- **Interface Low Cognitive Load**: Design limpo e intuitivo projetado para reduzir a sobrecarga sensorial, ideal para usuários com TEA.
- **Integração Real-Time**: Comunicação via WebSocket/HTTP com o motor de IA.

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

2. Configure a URL do Backend:
   Verifique em `src/app/components/ChatInterface.tsx` se a URL está apontando para `http://localhost:8000`.

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