# Guia de Integração Frontend — OLO Fintel

Este documento define os contratos de API, fluxos de autenticação, tratamento de tokens e a matriz de permissões RBAC para orientar a integração do frontend com o OLO Fintel Engine.

---

## 1. Fluxo de Autenticação e Gestão de Sessão

O backend utiliza **JWT Access Tokens** (expiração: 1h) e **Refresh Tokens** persistidos (expiração: 7 dias) para autorização segura e sem estado.

### 1.1 Registo de Novo Gestor/Organização
Cria a conta do utilizador e inicializa automaticamente a organização com a função de `Owner` (Dono).
* **Endpoint**: `POST /api/v1/auth/register`
* **Request Payload**:
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
* **Response Payload (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "user": { "id": "usr_uuid", "firstName": "Kiala", "lastName": "Mateus", "email": "kiala.mateus@coop.ao" },
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "eyJhbGciOi...",
      "organizationId": "org_uuid",
      "role": "Owner"
    }
  }
  ```

### 1.2 Iniciar Sessão (Login)
* **Endpoint**: `POST /api/v1/auth/login`
* **Request Payload**:
  ```json
  {
    "email": "kiala.mateus@coop.ao",
    "password": "SenhaSuperSegura"
  }
  ```
* **Response Payload (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "user": { "id": "usr_uuid", "email": "kiala.mateus@coop.ao" },
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "eyJhbGciOi...",
      "organizationId": "org_uuid",
      "role": "Owner"
    }
  }
  ```

### 1.3 Renovar Token de Acesso (Refresh Flow)
O frontend deve renovar silenciosamente o Access Token antes de expirar ou ao receber um erro `401 Unauthorized`.
* **Endpoint**: `POST /api/v1/auth/refresh`
* **Request Payload**:
  ```json
  {
    "refreshToken": "eyJhbGciOi..."
  }
  ```
* **Response Payload (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "accessToken": "eyJhbGciOi..."
    }
  }
  ```

---

## 2. Multi-Tenancy (Segregação de Dados)

Todas as consultas de dados de negócios (operações, finanças, documentos) exigem isolamento por organização.
* O frontend **DEVE** enviar o cabeçalho `x-organization-id` em todos os pedidos autenticados.
* Exemplo de cabeçalhos no Axios / Fetch:
  ```javascript
  headers: {
    'Authorization': 'Bearer ' + accessToken,
    'x-organization-id': currentOrganizationId
  }
  ```

---

## 3. Matriz de Perfis e Permissões (RBAC)

O sistema de controlo de acessos restringe o acesso a ecrãs e chamadas de API com base nas seguintes funções:

| Perfil / Função | Páginas Permitidas | Ações de API Permitidas |
| :--- | :--- | :--- |
| **Owner** (Dono) | Todas as páginas operacionais, finanças, documentos, IA, candidaturas, configurações | Acesso total de leitura e escrita (Admin, CRUD) |
| **Admin** | Painéis organizacionais, gestão documental, auditoria, configurações | CRUD de utilizadores, visualizar auditorias |
| **Manager** | Operações diárias (talhões, gado, colheitas, capturas), inventário, CRM | Criar e editar dados operacionais; sem acesso a finanças |
| **FinancialOfficer** | Fluxos de caixa, receitas, despesas, contas bancárias, candidaturas | CRUD finanças, submeter candidaturas a crédito |
| **Analyst** | Portal de Analistas, revisão documental de terceiros, pareceres de crédito | Analisar candidaturas, aprovar/rejeitar documentos |
| **Consultant** | Carteira de clientes PMEs, diagnósticos e planos de ação de IA | Criar diagnósticos e partilhar conselhos com cooperativas |
| **Member** | Registo básico de operações diárias (colheita ou venda direta) | Inserir registos rápidos; sem permissões de apagar |
| **Jury** | Painel de Avaliação de Validação / Questionários (Agregado e Anónimo) | Visualizar estatísticas agregadas e anónimas de pesquisas |

---

## 4. Endpoints de Validação e Estudo de Mercado (Público)

Estes endpoints destinam-se a validar o interesse de mercado na landing page e recolher evidência quantitativa para apresentar aos jurados:

### 4.1 Obter Estudo Ativo (Para apresentar o formulário multi-step)
* **Endpoint**: `GET /api/v1/surveys/active`
* **Retorna**: Estrutura das perguntas, opções, progresso atual das respostas agregadas e se a meta (ex: 100) foi atingida.

### 4.2 Submeter Resposta ao Estudo
* **Endpoint**: `POST /api/v1/surveys/responses`
* **Request Payload**:
  ```json
  {
    "surveyId": "survey_uuid",
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
* **Duplicados**: O servidor gera um hash SHA256 do IP e User-Agent para bloquear submissões duplicadas da mesma máquina, respondendo com `409 Conflict` se já tiver respondido.

### 4.3 Painel de Júri de Validação (Role Gated)
* **Endpoint**: `GET /api/v1/surveys/jury-dashboard`
* **Requisito**: Autenticado como `Jury`, `Analyst` ou `Admin`.
* **Retorna**: Gráficos estatísticos agregados por pergunta. Para garantir o anonimato absoluto, se houver menos de 3 respostas, os dados agregados ficam bloqueados (`isLocked: true`).

---

## 5. Endpoints do Consultor de IA (Gemini)

Interage com os consultores especializados:
* **Endpoint**: `POST /api/v1/ai/chat`
* **Payload**:
  ```json
  {
    "prompt": "Como reduzir custos na frota de pesca?",
    "advisorType": "Operations" 
  }
  ```
  *(Opções de advisorType: `Executive`, `Financial`, `Operations`, `Commercial`, `Funding`)*

---

## 6. Endpoints do Centro de Funding Readiness

Recalcula as métricas reais e submete candidaturas estruturadas:
* **Cálculo de Score**: `GET /api/v1/funding/score`
  *(Retorna as subpontuações calculadas a partir das finanças e documentos reais da cooperativa de 0 a 100)*
* **Submeter Candidatura**: `POST /api/v1/funding/applications`
  *(Requer que a organização tenha pelo menos um documento avaliado como 'Approved' por analistas)*

---

## 7. Servidores, Ambientes e Utilitários de Administração

### 7.1 URLs de Base (Endpoints da API)
Ao integrar o frontend, utilize as seguintes variáveis de ambiente ou constantes:
* **Ambiente de Desenvolvimento (AI Studio)**: `https://ais-dev-unq5ob2f5h3txk7mjjov2s-202455623977.europe-west2.run.app` (Ou use caminhos relativos `/api/*` se o frontend for servido pelo mesmo container Express/Vite)
* **API Server (Render)**: `https://olofintel.onrender.com`
* **Vercel Frontend**: `https://olofintel.vercel.app`

### 7.2 Utilitários Exclusivos de Super Administrador (Controlo da BD)
Para auxiliar o desenvolvimento e sincronização de testes, disponibilizamos dois endpoints administrativos:

#### A. Estado Geral da BD Relacional (PostgreSQL / Supabase)
* **Endpoint**: `GET /api/v1/admin/db-status`
* **Retorna**: Contagem agregada de registos em todas as tabelas (utilizadores, organizações, questionários, candidaturas), além da lista dos últimos 15 utilizadores e organizações registadas.

#### B. Redefinição Total (Reset & Seed)
* **Endpoint**: `POST /api/v1/admin/db-reset`
* **Descrição**: Limpa todas as tabelas e recria as perguntas básicas de validação do estudo de mercado no PostgreSQL.
* **Aviso**: Esta ação é destrutiva e deve ser utilizada apenas em fase de testes e preparação da documentação.

---

## 8. Consola Administrativa Visual Integrada
Para testar estes fluxos de forma interativa sem recorrer ao Postman, a nossa plataforma inclui agora uma **Consola Administrativa** no topo do ecrã com três separadores dedicados:
1. **Simulador de Operações**: Permite alternar papéis (Owner, Analyst, Jury, Admin) e simular lançamentos no dashboard.
2. **DB Postgres Inspector**: Um painel visual que se liga diretamente à base de dados PostgreSQL no Supabase, exibindo a contagem e os últimos registos em tempo real.
3. **API Docs & Playground**: Documentação viva e gerador automático de comandos `cURL` para cada endpoint do sistema, com capacidade de disparar pedidos reais diretamente do navegador e analisar as respostas JSON instantaneamente.
