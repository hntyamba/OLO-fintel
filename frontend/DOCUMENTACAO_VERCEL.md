# Guia de Deploy no Vercel & Ligação com o Backend (Render) — OLO Fintel

Este guia orienta-o passo-a-passo sobre como fazer o deploy da aplicação Frontend do **OLO Fintel** no **Vercel** de forma profissional, segura e totalmente integrada ao seu backend NestJS alojado no **Render**.

---

## 🛠️ 1. Preparação para o Deploy do Frontend no Vercel

### A. Arquivo de Configuração do Vercel (`vercel.json`)
Para que as rotas da aplicação React SPA funcionem corretamente ao recarregar a página no navegador (evitando erros de `404 Not Found`), crie ou garanta que o ficheiro `vercel.json` existe na raiz do seu projeto com o seguinte conteúdo:

```json
{
  "cleanUrls": true,
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### B. Variáveis de Ambiente no React (Vite)
No desenvolvimento frontend usando Vite, todas as variáveis de ambiente públicas que precisam ser injetadas no browser devem obrigatoriamente possuir o prefixo `VITE_`.
Configure a URL do seu backend NestJS (Render) da seguinte forma:

*   **Chave**: `VITE_API_URL`
*   **Valor**: `https://olo-fintel-backend.onrender.com` (Substitua pela URL gerada pelo Render para o seu serviço)

---

## 🌐 2. Como Integrar a Comunicação (Frontend ➜ Backend)

No seu frontend React, crie um serviço centralizado ou utilize um cliente HTTP (`fetch` ou `axios`) que consome a variável de ambiente configurada.

### Exemplo de Configuração de API (`src/services/api.ts`)
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // 1. Recuperar o Token JWT salvo no início de sessão
  const token = localStorage.getItem('olo_fintel_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      // Redirecionar para login ou limpar estado de sessão expirada
      localStorage.removeItem('olo_fintel_token');
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro na requisição ao servidor');
  }

  return response.json();
}
```

---

## 🚀 3. Deploy Passo-a-Passo no Vercel

Siga os passos abaixo para carregar o seu repositório Git diretamente no painel do Vercel:

1.  **Aceda ao Painel**: Entre em [vercel.com](https://vercel.com) e faça login com a sua conta do GitHub/GitLab.
2.  **Importar Projeto**: Clique em **"Add New"** ➜ **"Project"** e importe o repositório do seu frontend.
3.  **Configurações de Build (Framework Preset)**:
    *   O Vercel detetará automaticamente o **Vite**.
    *   **Build Command**: Substitua pelo comando customizado que criamos para compilar estritamente o frontend: `npm run build:frontend` (ou utilize `npx vite build`).
    *   **Output Directory**: `dist`
4.  **Configurar Variáveis de Ambiente (Environment Variables)**:
    *   Expanda a secção "Environment Variables" e adicione:
        *   **Key**: `VITE_API_URL`
        *   **Value**: `https://seu-subdominio-no-render.onrender.com`
5.  **Executar Deploy**: Clique em **"Deploy"**. Em menos de 1 minuto o seu frontend estará online com SSL grátis e CDN global ativa.

---

## 🛡️ 4. Configuração de CORS (Muito Importante!)

Quando o seu frontend hospedado na Vercel (`https://olo-fintel.vercel.app`) tenta enviar pedidos (requests) para o backend hospedado na Render (`https://olo-fintel-backend.onrender.com`), o navegador irá bloquear os pedidos se o **CORS (Cross-Origin Resource Sharing)** não estiver ativado no backend.

### Como habilitar o CORS no NestJS (Backend no Render):
No arquivo principal do seu backend NestJS (`src/main.ts`), ative o CORS apontando especificamente para o domínio da sua Vercel:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Ativação do CORS com segurança para receber pedidos do frontend no Vercel
  app.enableCors({
    origin: [
      'https://seu-projeto.vercel.app', // URL de produção do seu frontend
      'http://localhost:5173',          // URL de desenvolvimento local
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT || 10000);
}
bootstrap();
```
