# Documentação da API — OLO Fintel Engine

Esta documentação fornece as especificações completas dos contratos de API para o desenvolvimento do frontend do **OLO Fintel**, hospedado na Vercel, que se comunicará com o servidor backend hospedado no Render.

---

## 1. Configurações Globais e Cabeçalhos Padrão

Todas as requisições para a API devem respeitar os seguintes padrões:

*   **URL de Produção (Render)**: `https://olofintel.onrender.com`
*   **URL de Desenvolvimento (AI Studio)**: `https://ais-dev-unq5ob2f5h3txk7mjjov2s-202455623977.europe-west2.run.app`
*   **Formato de Dados**: `application/json`

### Cabeçalhos Requeridos

| Cabeçalho | Tipo | Descrição | Exemplo |
| :--- | :--- | :--- | :--- |
| `Content-Type` | String | Tipo de conteúdo da requisição | `application/json` |
| `Authorization` | String | Token JWT de acesso do utilizador (Obrigatório em rotas protegidas) | `Bearer eyJhbGciOiJIUzI1NiIsInR...` |
| `x-organization-id` | String (UUID) | ID da Organização/Cooperativa ativa (Obrigatório para rotas multi-tenant) | `org-sim-uuid-benguela` |

---

## 2. Códigos de Status HTTP Padrão

A API responde com os seguintes códigos HTTP:

*   **`200 OK`**: A requisição foi bem-sucedida.
*   **`201 Created`**: Recurso criado com sucesso (usado em cadastros e submissões).
*   **`400 Bad Request`**: Dados de entrada inválidos ou parâmetros em falta.
*   **`401 Unauthorized`**: Token JWT ausente, inválido ou expirado.
*   **`403 Forbidden`**: O utilizador está autenticado, mas não possui permissão (papel) para o recurso.
*   **`404 Not Found`**: O recurso solicitado não existe.
*   **`500 Internal Server Error`**: Ocorreu um erro inesperado no servidor.

---

## 3. Endpoints de Autenticação & Organizações

### 3.1 Registo de Novo Gestor (`POST /api/v1/auth/register`)
Cria uma nova conta de utilizador gestor e a respetiva Organização com papel de `Owner`.

*   **Autenticação**: Livre (Público)
*   **Tenant**: Não aplicável

#### Schema de Entrada (Request Body)
```json
{
  "firstName": "Kiala",
  "lastName": "Mateus",
  "email": "kiala.mateus@coop.ao",
  "password": "SenhaSuperSegura",
  "phone": "+244923000000",
  "organizationName": "Cooperativa Agrícola de Catabola",
  "sector": "Agriculture"
}
```

#### Schema de Saída (Response Body - `201 Created`)
```json
{
  "success": true,
  "message": "Gestor e Organização criados com sucesso!",
  "user": {
    "id": "usr-uuid-12345",
    "firstName": "Kiala",
    "lastName": "Mateus",
    "email": "kiala.mateus@coop.ao",
    "phone": "+244923000000"
  },
  "organization": {
    "id": "org-uuid-67890",
    "name": "Cooperativa Agrícola de Catabola",
    "sector": "Agriculture",
    "status": "PendingVerification"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3.2 Iniciar Sessão (`POST /api/v1/auth/login`)
Autentica o utilizador e devolve tokens JWT de acesso (1h) e de atualização (7 dias).

*   **Autenticação**: Livre (Público)
*   **Tenant**: Não aplicável

#### Schema de Entrada (Request Body)
```json
{
  "email": "raisingpigs252@gmail.com",
  "password": "SenhaSuperSegura"
}
```

#### Schema de Saída (Response Body - `200 OK`)
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr-uuid-12345",
    "firstName": "Super",
    "lastName": "Admin",
    "email": "raisingpigs252@gmail.com",
    "role": "Admin",
    "status": "Active"
  },
  "organization": {
    "id": "org-sim-uuid-benguela",
    "name": "Cooperativa Agropecuária do Dombe Grande",
    "sector": "Agriculture"
  }
}
```

---

## 4. Estudo de Mercado & Validação (Epic 15)

### 4.1 Obter Estudo de Mercado Ativo (`GET /api/v1/surveys/active`)
Retorna a estrutura ativa de perguntas do estudo de validação de dores das PMEs e cooperativas.

*   **Autenticação**: Livre (Público)
*   **Tenant**: Não aplicável

#### Schema de Saída (Response Body - `200 OK`)
```json
{
  "success": true,
  "survey": {
    "id": "default-survey-id",
    "title": "Estudo Nacional de PMEs e Cooperativas",
    "description": "Estudo para validação de dores operacionais e financeiras de organizações produtivas africanas.",
    "goalCount": 100,
    "questions": [
      {
        "id": "q-sector",
        "order": 1,
        "type": "single_choice",
        "text": "Qual é o setor principal da sua organização?",
        "options": ["Agricultura", "Pecuária", "Pesca", "Comércio", "Outro"]
      },
      {
        "id": "q-province",
        "order": 2,
        "type": "single_choice",
        "text": "Em qual província de Angola está localizada?",
        "options": ["Luanda", "Benguela", "Huambo", "Huíla", "Cabinda", "Outra"]
      },
      {
        "id": "q-challenge",
        "order": 3,
        "type": "text",
        "text": "Qual é a sua principal dor de gestão ou acesso a crédito?",
        "options": null
      }
    ]
  }
}
```

---

### 4.2 Submeter Resposta ao Estudo (`POST /api/v1/surveys/responses`)
Regista as respostas de um respondente anónimo ou autenticado. Há proteção opcional de IP para evitar respostas duplicadas.

*   **Autenticação**: Livre (Público)
*   **Tenant**: Não aplicável

#### Schema de Entrada (Request Body)
```json
{
  "surveyId": "default-survey-id",
  "organizationTypeHint": "Cooperativa",
  "provinceHint": "Benguela",
  "personaHint": "Presidente",
  "answers": [
    { "questionId": "q-sector", "value": "Agricultura" },
    { "questionId": "q-province", "value": "Benguela" },
    { "questionId": "q-challenge", "value": "Falta de controle de fluxo de caixa." }
  ]
}
```

#### Schema de Saída (Response Body - `201 Created`)
```json
{
  "success": true,
  "message": "Resposta registada com sucesso! Obrigado pela sua contribuição.",
  "responseId": "resp-uuid-9999"
}
```

---

### 4.3 Painel do Júri de Validação (`GET /api/v1/surveys/jury-dashboard`)
Retorna dados estatísticos consolidados e análises agregadas para os Júris, Analistas e Administradores.

*   **Autenticação**: Autenticado (Requer papel `Jury`, `Analyst` ou `Admin`)
*   **Tenant**: Opcional

#### Schema de Saída (Response Body - `200 OK`)
```json
{
  "success": true,
  "stats": {
    "totalResponses": 54,
    "targetGoal": 100,
    "progressPercentage": 54,
    "byProvince": {
      "Benguela": 28,
      "Huambo": 14,
      "Luanda": 12
    },
    "bySector": {
      "Agricultura": 32,
      "Pecuária": 12,
      "Pesca": 10
    }
  }
}
```

---

## 5. Consultoria Inteligente (Gemini AI Advisor)

### 5.1 Conversar com Consultor Especialista (`POST /api/v1/ai/chat`)
Dispara um prompt do utilizador para o assistente especializado de IA. Os assistentes são especializados em contextos específicos (Executive, Financial, Operations, Funding).

*   **Autenticação**: Autenticado (Qualquer papel)
*   **Tenant**: Requerido (`x-organization-id` no cabeçalho)

#### Schema de Entrada (Request Body)
```json
{
  "prompt": "Como reduzir os custos na colheita e otimizar adubos?",
  "advisorType": "Operations"
}
```

#### Schema de Saída (Response Body - `200 OK`)
```json
{
  "success": true,
  "advisor": "Operations",
  "response": "Para reduzir os custos na colheita e otimizar adubos na província de Benguela, considere:\n1. Mapeamento de solo para aplicação seletiva.\n2. Compra conjunta de insumos através da sua cooperativa agrícola.\n3. Implementação de calendário dinâmico de irrigação...",
  "tokensUsed": 342
}
```

---

## 6. Prontidão de Crédito & Financiamento (Funding & Elegibilidade)

### 6.1 Calcular Score de Elegibilidade (`GET /api/v1/funding/score`)
Avalia em tempo real a maturidade financeira e operacional da organização com base nas suas transações e dados registados.

*   **Autenticação**: Autenticado (Owner, FinancialOfficer, Analyst, Admin)
*   **Tenant**: Requerido (`x-organization-id` no cabeçalho)

#### Schema de Saída (Response Body - `200 OK`)
```json
{
  "success": true,
  "score": 78,
  "breakdown": {
    "operationalScore": 85,
    "financialScore": 72,
    "documentScore": 80
  },
  "verdict": "Elegível com Bom Perfil",
  "recommendations": [
    "Faça upload do documento de Certidão Comercial atualizado para atingir score de 85+",
    "Registe mais 3 lançamentos de receitas para melhorar a consistência de fluxo de caixa."
  ]
}
```

---

### 6.2 Submeter Candidatura de Crédito (`POST /api/v1/funding/applications`)
Cria uma candidatura de crédito formal e envia o dossiê consolidado aos analistas dos bancos parceiros.

*   **Autenticação**: Autenticado (Owner, FinancialOfficer, Admin)
*   **Tenant**: Requerido (`x-organization-id` no cabeçalho)

#### Schema de Entrada (Request Body)
```json
{
  "requestedAmount": 5000000,
  "purpose": "Compra de Trator de Pneus e Equipamentos de Rega por Aspersão"
}
```

#### Schema de Saída (Response Body - `201 Created`)
```json
{
  "success": true,
  "application": {
    "id": "app-uuid-88888",
    "organizationId": "org-sim-uuid-benguela",
    "requestedAmount": 5000000,
    "purpose": "Compra de Trator de Pneus e Equipamentos de Rega por Aspersão",
    "status": "InAnalysis",
    "createdAt": "2026-07-19T12:00:00.000Z"
  }
}
```

---

---

## 7. Sistema de Notificações (Alertas Operacionais & Financeiros)

O sistema de notificações mantém os utilizadores atualizados sobre revisões de documentos, decisões do júri de validação, alteração de score de elegibilidade e novas mensagens ou alertas gerados pela IA.

### 7.1 Listar Notificações (`GET /api/v1/notifications`)
Retorna as notificações ativas do utilizador autenticado, ordenadas das mais recentes às mais antigas.

*   **Autenticação**: Autenticado (Qualquer papel)
*   **Tenant**: Não aplicável (Usa o ID de utilizador extraído do JWT)

#### Schema de Saída (Response Body - `200 OK`)
```json
{
  "success": true,
  "notifications": [
    {
      "id": "notif-uuid-abcde",
      "userId": "usr-sim-uuid-benguela",
      "type": "Operational",
      "title": "Alerta de Colheita Crítica",
      "body": "A humidade do solo no Setor C da fazenda atingiu limites críticos. Agendar irrigação prioritária.",
      "readAt": null,
      "createdAt": "2026-07-19T12:30:00.000Z"
    },
    {
      "id": "notif-uuid-fghij",
      "userId": "usr-sim-uuid-benguela",
      "type": "Funding",
      "title": "Dossiê Recebido",
      "body": "O seu dossiê de candidatura de crédito foi recebido pelos analistas bancários.",
      "readAt": "2026-07-19T12:05:00.000Z",
      "createdAt": "2026-07-19T12:00:00.000Z"
    }
  ]
}
```

---

### 7.2 Marcar Todas como Lidas (`PATCH /api/v1/notifications/read-all`)
Marca todas as notificações pendentes (`readAt == null`) do utilizador como lidas em lote.

*   **Autenticação**: Autenticado (Qualquer papel)
*   **Tenant**: Não aplicável

#### Schema de Saída (Response Body - `200 OK`)
```json
{
  "success": true,
  "message": "Todas as notificações foram marcadas como lidas."
}
```

---

### 7.3 Marcar Notificação Individual como Lida (`PATCH /api/v1/notifications/:id/read`)
Marca um único alerta específico como lido.

*   **Autenticação**: Autenticado (Qualquer papel)
*   **Tenant**: Não aplicável

#### Schema de Saída (Response Body - `200 OK`)
```json
{
  "success": true,
  "message": "Notificação marcada como lida com sucesso.",
  "notification": {
    "id": "notif-uuid-abcde",
    "userId": "usr-sim-uuid-benguela",
    "type": "Operational",
    "title": "Alerta de Colheita Crítica",
    "body": "A humidade do solo no Setor C da fazenda atingiu limites críticos. Agendar irrigação prioritária.",
    "readAt": "2026-07-19T12:35:10.000Z",
    "createdAt": "2026-07-19T12:30:00.000Z"
  }
}
```

---

### 7.4 Criar Notificação Simulada (`POST /api/v1/notifications`)
Permite que o sistema backend, crons automáticos ou canais de administração de testes disparem alertas instantâneos para um utilizador.

*   **Autenticação**: Autenticado (Qualquer papel / Admin)
*   **Tenant**: Não aplicável

#### Schema de Entrada (Request Body)
```json
{
  "userId": "usr-sim-uuid-benguela",
  "type": "Operational",
  "title": "Nova Recomendação do Consultor",
  "body": "O Consultor de IA gerou novas recomendações com base no seu fluxo de caixa de Julho."
}
```

#### Schema de Saída (Response Body - `201 Created`)
```json
{
  "success": true,
  "message": "Notificação criada com sucesso.",
  "notification": {
    "id": "notif-uuid-9999",
    "userId": "usr-sim-uuid-benguela",
    "type": "Operational",
    "title": "Nova Recomendação do Consultor",
    "body": "O Consultor de IA gerou novas recomendações com base no seu fluxo de caixa de Julho.",
    "readAt": null,
    "createdAt": "2026-07-19T12:40:00.000Z"
  }
}
```

---

## 8. Utilitários Exclusivos de Super Administrador (Controlo da BD)

Estes endpoints estão protegidos e servem apenas para sincronização ou monitoramento de testes no painel administrativo.

### 7.1 Estado Geral da Base de Dados (`GET /api/v1/admin/db-status`)
Retorna estatísticas de todas as tabelas em tempo real.

```json
{
  "success": true,
  "engine": "OLO Fintel Administrative Console",
  "dbConfigured": true,
  "isUsingMock": false,
  "counts": {
    "organizations": 3,
    "users": 11,
    "farms": 5,
    "animals": 12,
    "surveys": 1,
    "surveyResponses": 18
  }
}
```

### 7.2 Redefinição de Base de Dados (`POST /api/v1/admin/db-reset`)
Limpa e recria todas as tabelas no PostgreSQL/Supabase.

```json
{
  "success": true,
  "message": "Base de dados redefinida e sincronizada com sucesso!"
}
```

---

## 8. Políticas de CORS Ativadas no Servidor

O servidor Express foi configurado para permitir requisições de origens específicas. Certifique-se de que a URL do frontend esteja listada no array de origens permitidas:

```javascript
const allowedOrigins = [
  "https://olofintel.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000"
];
```

*Se introduzir uma nova URL de frontend, adicione-a à variável de ambiente `FRONTEND_URL` no servidor Render para autorização automática.*
