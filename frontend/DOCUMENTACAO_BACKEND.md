# Arquitetura e Especificação do Backend — OLO Fintel

Esta documentação serve como guia técnico definitivo para a implementação do **Backend de Produção** do **OLO Fintel**. O objetivo deste backend é substituir todos os estados simulados e armazenamentos voláteis (`localStorage` / mocks) do Frontend por um ecossistema persistente, seguro, escalável e de alto desempenho.

---

## 🏗️ 1. Arquitetura de Referência do Sistema

Recomendamos uma arquitetura robusta baseada em **Node.js (TypeScript)** com **Express** ou **NestJS**, integrada com um banco de dados relacional **PostgreSQL** (ou **Cloud SQL / Supabase**) e autenticação gerenciada via **Firebase Authentication**.

```
                   ┌─────────────────────────────────────────┐
                   │               OLO Fintel                │
                   │           Frontend (React)              │
                   └────────────────────┬────────────────────┘
                                        │ (HTTPS / REST)
                                        ▼
                   ┌─────────────────────────────────────────┐
                   │             API Gateway /               │
                   │          Node.js Express App          │
                   └──────┬──────────────────────────┬───────┘
                          │                          │
   (Firebase SDK / JWT)   ▼                          ▼   (Drizzle / Prisma ORM)
             ┌────────────┴─────────────┐      ┌─────┴────────────────────┐
             │  Firebase Authentication │      │   Banco de Dados (SQL)   │
             │     (Auth & JWT Tokens)  │      │        PostgreSQL        │
             └──────────────────────────┘      └──────────────────────────┘
```

---

## 🔑 2. Estratégia de Autenticação & Autorização

O Frontend utiliza o **Firebase Authentication** para fluxos de login, registo e redefinição de palavra-passe. O backend deve implementar o middleware de validação do token JWT emitido pelo Firebase.

### Middleware de Validação (Exemplo em Node.js)
```typescript
import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

// Inicialização do Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

export interface AuthenticatedRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido ou inválido' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Adiciona os metadados do utilizador autenticado à requisição
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Sessão expirada ou token de acesso inválido' });
  }
}
```

---

## 🗄️ 3. Modelo de Dados e Esquema de Base de Dados (Drizzle / SQL)

Abaixo está o esquema relacional proposto para mapear perfeitamente os dados do utilizador, despesas operacionais, transações financeiras, documentos KYC e pontuações de crédito.

```sql
-- Enums Customizados para Setores e Tipos de Transação
CREATE TYPE industry_type AS ENUM ('AGRICULTURE', 'LIVESTOCK', 'FISHERIES', 'COMMERCE', 'SERVICES');
CREATE TYPE trans_type AS ENUM ('RECEITA', 'DESPESA');
CREATE TYPE doc_status AS ENUM ('PENDENTE', 'APROVADO', 'REJEITADO');

-- 1. Tabela de Perfis de Utilizadores
CREATE TABLE users (
    id VARCHAR(128) PRIMARY KEY, -- UID retornado pelo Firebase Auth
    email VARCHAR(255) UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    industry industry_type NOT NULL,
    nif VARCHAR(20),
    phone VARCHAR(30),
    province VARCHAR(100),
    city VARCHAR(100),
    address TEXT,
    employees_count INT DEFAULT 0,
    annual_revenue DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Lançamentos Rápidos (Módulos Setoriais)
CREATE TABLE operational_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
    industry industry_type NOT NULL,
    log_type VARCHAR(50) NOT NULL, -- 'COLHEITA', 'INSUMO', 'PESO', 'VACINA', 'VIAGEM', 'CAPTURA', 'VENDA', 'PAGAMENTO'
    payload JSONB NOT NULL, -- Dados estruturados específicos do formulário de lançamento
    photo_evidence_url TEXT,
    gps_coordinates VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Recursos Humanos (Despesas com Pessoal)
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    base_salary DECIMAL(15, 2) NOT NULL,
    food_allowance DECIMAL(15, 2) DEFAULT 0.00,
    transport_allowance DECIMAL(15, 2) DEFAULT 0.00,
    irt_withheld DECIMAL(15, 2) DEFAULT 0.00, -- Calculado com base na tabela oficial de IRT angolana
    inss_employee DECIMAL(15, 2) DEFAULT 0.00, -- 3% do trabalhador
    inss_employer DECIMAL(15, 2) DEFAULT 0.00, -- 8% da empresa
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela de Despesas Gerais e Administrativas (OpEx)
CREATE TABLE administrative_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL, -- 'WATER', 'ELECTRICITY', 'FUEL', 'INTERNET', 'MAINTENANCE', 'RENT', 'OTHER'
    amount DECIMAL(15, 2) NOT NULL,
    reference_month INT NOT NULL, -- 1 a 12
    reference_year INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabela de Fluxo de Caixa / Transações Financeiras (DRE)
CREATE TABLE financial_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
    type trans_type NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'VENDA', 'PRESTACAO_SERVICOS', 'CUSTO_MERCADORIA', 'SALARIOS', 'IMPOSTOS', etc.
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabela de Gestão de Documentos e KYC
CREATE TABLE corporate_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
    doc_type VARCHAR(100) NOT NULL, -- 'ALVARA', 'REGISTO_COMERCIAL', 'NIF_EMPRESA', 'DIARIO_REPUBLICA', 'DEMO_FINANCEIRA'
    file_url TEXT NOT NULL,
    expiry_date DATE,
    status doc_status DEFAULT 'PENDENTE',
    rejection_reason TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabela de Scorecard e Funding Readiness
CREATE TABLE funding_readiness_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
    overall_score INT NOT NULL, -- 0 a 100
    governance_score INT NOT NULL,
    financial_score INT NOT NULL,
    collateral_score INT NOT NULL,
    operational_score INT NOT NULL,
    risk_score INT NOT NULL,
    recommendations JSONB, -- Array de strings contendo as ações corretivas recomendadas
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🌐 4. Catálogo de Endpoints REST (Especificação de API)

### 👤 Módulo 1: Perfil de Utilizador e Onboarding
*   `GET /api/user/profile` — Retorna os dados completos do utilizador autenticado (incluindo o seu setor de atividade industrial).
*   `PUT /api/user/profile` — Atualiza informações cadastrais da empresa (NIF, morada, número de funcionários).

### 🌾 Módulo 2: Operações e Lançamentos Setoriais
*   `GET /api/operational-logs` — Retorna os logs operacionais do utilizador. Opcionalmente, pode aceitar filtros por query string (`?type=COLHEITA`).
*   `POST /api/operational-logs` — Cria um novo lançamento operacional dinâmico. O payload deve ser validado no backend de acordo com a indústria ativa do utilizador.
    *   *Nota*: Se houver arquivo de foto evidência, o endpoint deve receber dados multipart (via `multer` ou similar) e efetuar o upload para o Google Cloud Storage ou AWS S3 antes de salvar a URL na base de dados.

### 💰 Módulo 3: Recursos Humanos & Custos de Suporte
*   `GET /api/employees` — Lista todos os funcionários registados.
*   `POST /api/employees` — Adiciona um funcionário. O backend deve calcular automaticamente os descontos de **IRT** e **INSS (3% + 8%)** usando as fórmulas fiscais vigentes em Angola.
*   `DELETE /api/employees/:id` — Remove um funcionário.
*   `GET /api/administrative-costs` — Lista despesas gerais organizadas por mês/ano.
*   `POST /api/administrative-costs` — Lança nova despesa (Água, Luz, Combustível Gerador, etc.).

### 📊 Módulo 4: Relatórios Financeiros e DRE
*   `GET /api/financials/dre?year=2026` — Retorna o demonstrativo financeiro anual formatado em conformidade com o PGC. O backend agregará as tabelas `financial_transactions` e `administrative_costs` para retornar receitas brutas, CMV, margem líquida e EBITDA.
*   `GET /api/financials/cashflow` — Retorna o resumo do fluxo de caixa mensal.
*   `POST /api/financials/transaction` — Lança manualmente uma receita ou despesa na contabilidade global.

### 🛡️ Módulo 5: Gestão Documental e KYC
*   `GET /api/documents` — Lista todos os arquivos corporativos carregados na pasta digital.
*   `POST /api/documents/upload` — Executa upload multipart para o repositório de arquivos de produção e insere o registo de validação documental pendente.

### 📈 Módulo 6: Avaliação de Preparação para Financiamento (Funding Readiness)
*   `GET /api/funding/readiness` — Executa o algoritmo de pontuação com base nos dados reais do banco de dados (presença de documentos aprovados em KYC, margem de EBITDA na DRE, saúde do fluxo de caixa e rácio de liquidez) e retorna o score global e o histórico de evolução.

---

## 🤖 5. Integração com a API do Gemini (Servidor Segura)

A chave de API `GEMINI_API_KEY` **nunca** deve ser incluída ou manipulada no cliente frontend para evitar roubos de credenciais e abusos. O backend atuará como um proxy de segurança, enriquecendo o prompt com os dados mais recentes do banco de dados do utilizador.

### Exemplo de Endpoint de Consultoria Inteligente (`POST /api/ai/advisor`)
```typescript
import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';
import { requireAuth, AuthenticatedRequest } from './middleware/auth';
import { db } from './db'; // Conexão com a base de dados

const router = Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/ai/advisor', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { userPrompt } = req.body;
  const userId = req.user?.uid;

  try {
    // 1. Coletar dados operacionais e financeiros em tempo real do utilizador na base de dados
    const userProfile = await db.select().from('users').where({ id: userId }).first();
    const activeEmployees = await db.select().from('employees').where({ user_id: userId });
    const generalCosts = await db.select().from('administrative_costs').where({ user_id: userId });

    // 2. Construir um System Prompt rico em contexto real
    const contextPrompt = `
      Você é o Consultor Virtual Financeiro Sénior do OLO Fintel, especializado na economia angolana.
      O utilizador atual opera no setor de ${userProfile.industry}.
      A empresa chama-se "${userProfile.company_name}" e está sediada na província de ${userProfile.province}.
      Dados reais atuais:
      - Total de Funcionários ativos: ${activeEmployees.length}
      - Total de custos operacionais lançados: ${generalCosts.reduce((acc, curr) => acc + curr.amount, 0)} AOA.
      
      Por favor, forneça respostas extremamente acionáveis, em português, evitando conselhos abstratos e focando em orientações aplicáveis ao contexto prático de Angola.
    `;

    // 3. Fazer a chamada ao modelo Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'system', parts: [{ text: contextPrompt }] },
        { role: 'user', parts: [{ text: userPrompt }] }
      ]
    });

    return res.json({ response: response.text });
  } catch (error) {
    console.error('Erro na análise da IA:', error);
    return res.status(500).json({ error: 'Falha interna ao processar consulta com o assistente inteligente' });
  }
});

export default router;
```

---

## 🛡️ 6. Check-List de Segurança e Lançamento em Produção

1.  **SSL/HTTPS Ativo**: Configure todas as comunicações para exigir tráfego encriptado HTTPS.
2.  **Variáveis de Ambiente Ocultas**: Certifique-se de que chaves como `GEMINI_API_KEY`, credenciais do banco de dados, chaves privadas do Firebase Admin e do repositório de arquivos S3/GCS fiquem estritamente em ficheiros `.env` protegidos, fora do controlo de versões.
3.  **CORS Configurado**: Defina as origens aceites de CORS estritamente para o domínio oficial onde o frontend react do OLO Fintel está instalado.
4.  **Cálculos de Descontos Conformes**: Certifique-se de que o cálculo das tabelas de retenção na fonte do IRT de salários esteja parametrizado para atualizar consoante as novas tabelas anuais publicadas pela AGT (Administração Geral Tributária) de Angola.
