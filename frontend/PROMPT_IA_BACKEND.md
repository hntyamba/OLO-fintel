# PROMPT DE INSTRUÇÃO PARA CONSTRUÇÃO DO BACKEND (NESTJS + PRISMA + SUPABASE)

> **Instrução para a IA**: Você é um engenheiro de software especialista em NestJS, Prisma e PostgreSQL (Supabase). Sua tarefa é construir do absoluto zero um backend robusto, escalável e pronto para produção para a plataforma **OLO Fintel** (Sistema Financeiro e Operacional para PMEs e Cooperativas em Angola).
> Siga rigorosamente as especificações abaixo de arquitetura, esquema do Prisma, segurança baseada em JWT, estrutura de módulos do NestJS e diretrizes de deploy no Render.

---

## 🚀 1. Visão Geral do Projeto & Tech Stack
*   **Framework**: NestJS (TypeScript)
*   **ORM**: Prisma ORM
*   **Banco de Dados**: PostgreSQL (hospedado no Supabase)
*   **Autenticação**: JWT (JSON Web Tokens) com Passport e criptografia bcrypt para senhas.
*   **Deploy**: Render (através de Web Service Nativo de Node.js)
*   **Integração de IA**: SDK Oficial `@google/genai` utilizando o modelo `gemini-2.5-flash` para análise financeira e gerador de planos.

---

## 📁 2. Estrutura de Pastas do NestJS Recomendada
Crie a estrutura clássica modular do NestJS:
```
src/
├── app.module.ts
├── main.ts
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   └── strategies/
│       └── jwt.strategy.ts
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
└── modules/
    ├── auth/
    ├── users/
    ├── operational-logs/
    ├── employees/
    ├── administrative-costs/
    ├── financial-transactions/
    ├── corporate-documents/
    ├── funding-readiness/
    └── ai-advisor/
```

---

## 🗄️ 3. Esquema do Prisma (`prisma/schema.prisma`)
Gere exatamente o seguinte arquivo `schema.prisma`. Certifique-se de usar o driver do PostgreSQL.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum IndustryType {
  AGRICULTURE
  LIVESTOCK
  FISHERIES
  COMMERCE
  SERVICES
}

enum TransType {
  RECEITA
  DESPESA
}

enum DocStatus {
  PENDENTE
  APROVADO
  REJEITADO
}

model User {
  id                  String                 @id @default(uuid())
  email               String                 @unique
  passwordHash        String                 @map("password_hash")
  companyName         String                 @map("company_name")
  industry            IndustryType
  nif                 String?
  phone               String?
  province            String?
  city                String?
  address             String?
  employeesCount      Int                    @default(0) @map("employees_count")
  annualRevenue       Decimal                @default(0.00) @map("annual_revenue") @db.Decimal(15, 2)
  createdAt           DateTime               @default(now()) @map("created_at")
  updatedAt           DateTime               @updatedAt @map("updated_at")
  
  operationalLogs     OperationalLog[]
  employees           Employee[]
  administrativeCosts AdministrativeCost[]
  transactions        FinancialTransaction[]
  documents           CorporateDocument[]
  fundingHistories    FundingReadinessHistory[]

  @@map("users")
}

model OperationalLog {
  id                String       @id @default(uuid())
  userId            String       @map("user_id")
  industry          IndustryType
  logType           String       @map("log_type") // 'COLHEITA', 'INSUMO', 'PESO', 'VACINA', 'VIAGEM', 'CAPTURA', 'VENDA', 'PAGAMENTO'
  payload           Json         // Detalhes específicos em formato JSON do formulário
  photoEvidenceUrl  String?      @map("photo_evidence_url")
  gpsCoordinates    String?      @map("gps_coordinates")
  createdAt         DateTime     @default(now()) @map("created_at")

  user              User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("operational_logs")
}

model Employee {
  id                 String   @id @default(uuid())
  userId             String   @map("user_id")
  name               String
  role               String
  baseSalary         Decimal  @map("base_salary") @db.Decimal(15, 2)
  foodAllowance      Decimal  @default(0.00) @map("food_allowance") @db.Decimal(15, 2)
  transportAllowance Decimal  @default(0.00) @map("transport_allowance") @db.Decimal(15, 2)
  irtWithheld        Decimal  @default(0.00) @map("irt_withheld") @db.Decimal(15, 2)
  inssEmployee       Decimal  @default(0.00) @map("inss_employee") @db.Decimal(15, 2)
  inssEmployer       Decimal  @default(0.00) @map("inss_employer") @db.Decimal(15, 2)
  createdAt          DateTime @default(now()) @map("created_at")

  user               User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("employees")
}

model AdministrativeCost {
  id             String   @id @default(uuid())
  userId         String   @map("user_id")
  category       String   // 'WATER', 'ELECTRICITY', 'FUEL', 'INTERNET', 'MAINTENANCE', 'RENT', 'OTHER'
  amount         Decimal  @db.Decimal(15, 2)
  referenceMonth Int      @map("reference_month")
  referenceYear  Int      @map("reference_year")
  createdAt      DateTime @default(now()) @map("created_at")

  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("administrative_costs")
}

model FinancialTransaction {
  id              String    @id @default(uuid())
  userId          String    @map("user_id")
  type            TransType
  category        String    // 'VENDA', 'PRESTACAO_SERVICOS', 'CUSTO_MERCADORIA', 'SALARIOS', 'IMPOSTOS'
  amount          Decimal   @db.Decimal(15, 2)
  description     String?
  transactionDate DateTime  @map("transaction_date") @db.Date
  createdAt       DateTime  @default(now()) @map("created_at")

  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("financial_transactions")
}

model CorporateDocument {
  id              String    @id @default(uuid())
  userId          String    @map("user_id")
  docType         String    @map("doc_type") // 'ALVARA', 'REGISTO_COMERCIAL', 'NIF_EMPRESA', 'DIARIO_REPUBLICA', 'DEMO_FINANCEIRA'
  fileUrl         String    @map("file_url")
  expiryDate      DateTime? @map("expiry_date")
  status          DocStatus @default(PENDENTE)
  rejectionReason String?   @map("rejection_reason")
  uploadedAt      DateTime  @default(now()) @map("uploaded_at")

  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("corporate_documents")
}

model FundingReadinessHistory {
  id               String   @id @default(uuid())
  userId           String   @map("user_id")
  overallScore     Int      @map("overall_score")
  governanceScore  Int      @map("governance_score")
  financialScore   Int      @map("financial_score")
  collateralScore  Int      @map("collateral_score")
  operationalScore Int      @map("operational_score")
  riskScore        Int      @map("risk_score")
  recommendations  Json     // Lista de strings de recomendações []
  createdAt        DateTime @default(now()) @map("created_at")

  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("funding_readiness_history")
}
```

---

## 🔒 4. Autenticação e Autorização (Modulo JWT)
Implemente um fluxo padrão usando `@nestjs/jwt`, `passport-jwt` e `@nestjs/passport`.

### Fluxo de Registro (`POST /auth/register`)
Recebe: `email`, `password`, `companyName`, `industry`.
1.  Gera o hash da senha usando `bcrypt` com 10 rounds.
2.  Persiste o utilizador usando o Prisma.
3.  Retorna o objeto do utilizador recém-criado (removendo a senha).

### Fluxo de Login (`POST /auth/login`)
Recebe: `email`, `password`.
1.  Valida se o utilizador existe e a senha coincide.
2.  Gera um JWT contendo `{ sub: userId, email: user.email, industry: user.industry }`.
3.  Retorna `{ access_token: string, user: { id, email, companyName, industry } }`.

---

## 🧮 5. Lógica de Negócio Essencial de Angola (Regras do Backend)

### Módulo de Funcionários (Descontos e Retenções)
Sempre que um funcionário for adicionado (`POST /employees`), o backend deve calcular automaticamente:
1.  **INSS do Trabalhador**: 3% do Salário Base.
2.  **INSS da Entidade Empregadora**: 8% do Salário Base.
3.  **IRT (Tabela Oficial de Angola de 2026)**:
    *   *Até 100.000 AOA*: Isento.
    *   *De 100.001 a 150.000 AOA*: 10% sobre o excesso de 100.000 AOA.
    *   *De 150.001 a 200.000 AOA*: 5.000 AOA + 13% sobre o excesso de 150.000 AOA.
    *   *De 200.001 a 300.000 AOA*: 11.500 AOA + 16% sobre o excesso de 200.000 AOA.
    *   *De 300.001 a 500.000 AOA*: 27.500 AOA + 18% sobre o excesso de 300.000 AOA.
    *   *De 500.001 a 1.000.000 AOA*: 63.500 AOA + 19% sobre o excesso de 500.000 AOA.
    *   *De 1.000.001 a 1.500.000 AOA*: 158.500 AOA + 20% sobre o excesso de 1.000.000 AOA.
    *   *De 1.500.001 a 3.000.000 AOA*: 258.500 AOA + 21% sobre o excesso de 1.500.000 AOA.
    *   *De 3.000.001 a 10.000.000 AOA*: 573.500 AOA + 22% sobre o excesso de 3.000.000 AOA.
    *   *Mais de 10.000.000 AOA*: 2.113.500 AOA + 25% sobre o excesso de 10.000.000 AOA.

### Algoritmo do Score de Funding Readiness (0 a 100)
Ao solicitar a pontuação (`GET /funding-readiness`), o backend deve buscar em tempo real os dados cadastrais do utilizador:
*   **Governação (20 pontos)**: +4 pontos para cada documento KYC presente e aprovado (`ALVARA`, `REGISTO_COMERCIAL`, `NIF_EMPRESA`, `DIARIO_REPUBLICA`, `DEMO_FINANCEIRA`).
*   **Registos Financeiros (20 pontos)**: +10 pontos se tiver DRE anual gerada, +10 pontos se tiver lançamentos de custos administrativos frequentes.
*   **Operacional (30 pontos)**: +15 se possuir mais de 3 logs operacionais recentes na tabela `operational_logs`. +15 se possuir receitas consistentes lançadas nos últimos 3 meses.
*   **Garantias/Colateral (15 pontos)**: Baseado no preenchimento de ativos declarados em faturamento ou volume financeiro de vendas.
*   **Risco e Equipa (15 pontos)**: +5 se tiver telefone e NIF preenchido no perfil de utilizador, +10 se possuir funcionários registados na folha de RH.

---

## 🤖 6. Proxy Seguro para a API do Gemini
Implemente no módulo `AIAdvisorModule` um serviço de conexão usando a biblioteca oficial `@google/genai`:

```typescript
import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class AiAdvisorService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async generateFinancialAdvice(prompt: string, userContext: any) {
    const systemInstruction = `
      Você é o Analista Virtual Financeiro do OLO Fintel para PMEs angolanas.
      O cliente opera em Angola, na província de ${userContext.province || 'Luanda'}, no setor ${userContext.industry}.
      Responda de forma prática em português de Angola (use Kwanzas - AOA). Evite conselhos genéricos.
    `;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'system', parts: [{ text: systemInstruction }] },
        { role: 'user', parts: [{ text: prompt }] },
      ],
    });

    return { response: response.text };
  }
}
```

---

## 🌐 7. Configuração de Deploy no Render

Crie o arquivo `render.yaml` na raiz do repositório para orquestrar o build e o deploy automatizados de forma nativa:

```yaml
services:
  - type: web
    name: olo-fintel-backend
    env: node
    plan: free
    buildCommand: npm install && npx prisma generate && npm run build
    startCommand: npx prisma migrate deploy && node dist/src/main.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: DATABASE_URL
        sync: false # Cole a URL de conexão direta do PostgreSQL do Supabase aqui
      - key: JWT_SECRET
        sync: false # Insira uma chave de criptografia de alta segurança
      - key: GEMINI_API_KEY
        sync: false # Insira a sua chave de API do Google Gemini
```

---

## 📝 Instruções de Execução para a IA de Destino
1.  Configure as variáveis de ambiente em um arquivo `.env` local (`DATABASE_URL`, `JWT_SECRET`, `GEMINI_API_KEY`, `PORT`).
2.  Crie as tabelas na base de dados do Supabase rodando `npx prisma db push` ou gerando uma migração com `npx prisma migrate dev --name init`.
3.  Crie controladores REST expondo as operações do CRUD para cada modelo mapeado. Proteja os endpoints operacionais e financeiros usando o Guard `@UseGuards(JwtAuthGuard)`.
4.  Certifique-se de configurar e ativar o CORS para aceitar conexões vindas do endereço do frontend de desenvolvimento e produção da plataforma.
