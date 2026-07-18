# DEV_DOC

## OLO Fintel

### Development Standards, Engineering Guidelines & Delivery Architecture

**Versão:** 1.0

---

# 1. Objetivo

Este documento define os padrões oficiais de desenvolvimento do OLO Fintel.

Serve como referência obrigatória para:

* Frontend Engineers
* Backend Engineers
* AI Engineers
* DevOps Engineers
* QA Engineers

Objetivos:

* garantir consistência;
* reduzir dívida técnica;
* acelerar desenvolvimento assistido por IA;
* facilitar onboarding;
* permitir escalabilidade futura.

---

# 2. Filosofia de Engenharia

## Princípio 1

O negócio é mais importante que a tecnologia.

Toda implementação deve responder:

```text
Qual problema de negócio resolve?
```

---

## Princípio 2

Código simples vence código inteligente.

Preferir:

```typescript
if (user.isActive)
```

Evitar:

```typescript
activeUsers.filter(...)
.reduce(...)
```

quando a primeira opção for suficiente.

---

## Princípio 3

Toda funcionalidade deve ser modular.

Nunca depender diretamente de outro módulo.

Comunicação:

```text
API
Events
Application Services
```

---

## Princípio 4

IA gera código.

Humanos validam arquitetura.

---

# 3. Estrutura de Repositórios

## Monorepo

```text
olo-fintel

apps
├── frontend
├── backend

packages
├── shared-types
├── ui
├── validations
├── config
├── analytics

infrastructure
├── nginx
├── docker
├── scripts
├── docs
```

---

# 4. Branch Strategy

## Main

Produção

```text
main
```

---

## Development

Integração

```text
develop
```

---

## Features

```text
feature/auth

feature/funding

feature/crm

feature/finance
```

---

## Fixes

```text
fix/login

fix/dashboard
```

---

# 5. Commit Convention

Formato:

```text
type(scope): description
```

---

Exemplos:

```text
feat(auth): add refresh token

feat(funding): implement scoring engine

fix(finance): resolve cashflow calculation

refactor(crm): simplify lead pipeline

docs(api): update funding endpoints
```

---

# 6. Backend Standards

---

# NestJS Architecture

Cada módulo:

```text
module
│
├── controllers
├── services
├── repositories
├── dto
├── entities
├── events
├── listeners
├── guards
├── policies
├── validators
└── tests
```

---

Exemplo:

```text
funding

controllers
services
repositories
dto
events
tests
```

---

# 7. Service Rules

Services:

```text
Business Logic Only
```

Nunca:

```text
SQL
HTTP Calls
External SDK Logic
```

---

# 8. Repository Rules

Repositories:

```text
Database Access Only
```

Nunca:

```text
Business Logic
```

---

# 9. Controller Rules

Controllers:

```text
Validation
Authentication
Request Mapping
```

Nunca:

```text
Business Logic
```

---

# 10. DTO Rules

Todos os inputs devem utilizar:

```typescript
class-validator
class-transformer
```

---

Exemplo:

```typescript
export class CreateRevenueDto {
 amount: number;
 category: string;
 date: Date;
}
```

---

# 11. Frontend Standards

---

# Feature Driven Structure

```text
features

auth
finance
crm
funding
operations
documents
analytics
```

---

# Component Types

```text
ui
forms
charts
tables
layouts
modals
```

---

# Shared Components

```text
packages/ui
```

---

# 12. Naming Convention

---

# Components

```text
PascalCase
```

Exemplo:

```text
FundingScoreCard
RevenueChart
```

---

# Hooks

```text
useFundingScore
useRevenueMetrics
```

---

# Services

```text
funding.service.ts
finance.service.ts
```

---

# Types

```text
FundingScore
Revenue
Organization
```

---

# 13. API Standards

---

# Base Route

```text
/api/v1
```

---

Exemplos

```text
/api/v1/organizations

/api/v1/funding

/api/v1/revenues

/api/v1/crm
```

---

# Response Format

Sucesso:

```json
{
  "success": true,
  "data": {}
}
```

---

Erro:

```json
{
  "success": false,
  "message": "Invalid request"
}
```

---

# Pagination

```json
{
  "items": [],
  "page": 1,
  "limit": 20,
  "total": 100
}
```

---

# 14. Validation Standards

Utilizar:

```text
Zod
```

Frontend

---

Utilizar:

```text
class-validator
```

Backend

---

Toda validação deve existir:

```text
Frontend
Backend
```

---

# 15. Error Handling

Padrão único.

---

Categorias:

```text
ValidationError

AuthenticationError

AuthorizationError

BusinessError

InfrastructureError
```

---

Nunca retornar:

```text
Internal stack traces
```

---

# 16. Authentication

---

Método:

```text
JWT
Refresh Token
```

---

Sessões:

```text
Device Aware
```

---

Preparar:

```text
Google Login
Microsoft Login
```

---

# 17. Authorization

RBAC

---

Roles:

```text
Owner

Admin

Manager

FinancialOfficer

Consultant

Analyst

Member
```

---

Permissões:

```text
resource

action
```

---

Exemplo:

```text
funding.create

funding.read

funding.update

funding.approve
```

---

# 18. File Upload Standards

---

Storage:

```text
Supabase Storage
```

---

Categorias:

```text
documents

avatars

contracts

reports
```

---

Validação:

```text
size

mime type

virus scan
```

---

# 19. AI Development Standards

---

# AI Gateway Pattern

Nunca usar SDK diretamente.

---

Criar:

```typescript
AIProvider
```

---

Implementações:

```typescript
GeminiProvider

OpenAIProvider

ClaudeProvider
```

---

# Advisors

```text
ExecutiveAdvisor

FinancialAdvisor

OperationsAdvisor

CommercialAdvisor

FundingAdvisor
```

---

Todos devem implementar:

```typescript
generateInsight()

generateRecommendations()

generateActionPlan()
```

---

# 20. AI Prompt Storage

Nunca hardcode.

Criar:

```text
PromptTemplate
```

Tabela dedicada.

---

Campos:

```text
name

version

content

active
```

---

# 21. Event Standards

---

Todos eventos:

```text
Past Tense
```

---

Exemplos:

```text
RevenueCreated

FundingSubmitted

DocumentApproved

HarvestCompleted
```

---

# 22. Queue Standards

BullMQ

---

Filas:

```text
notifications

reports

funding

documents

analytics

ai
```

---

Jobs longos:

```text
Sempre assíncronos
```

---

# 23. Reporting Standards

Relatórios gerados em background.

Nunca durante request HTTP.

---

Formatos:

```text
PDF

Excel

CSV
```

---

# 24. Dashboard Standards

Todos dashboards devem consumir:

```text
Analytics Layer
```

---

Nunca:

```text
Queries complexas diretamente da UI
```

---

# 25. Database Standards

---

IDs

```text
UUID
```

---

Campos obrigatórios

```text
createdAt

updatedAt
```

---

Campos opcionais

```text
deletedAt

deletedBy
```

---

# Soft Delete

Obrigatório.

---

# 26. Prisma Standards

---

Uma entidade por ficheiro.

---

Exemplo:

```text
organization.prisma

funding.prisma

crm.prisma
```

Durante desenvolvimento.

---

Build final:

```text
schema.prisma
```

---

# 27. Testing Strategy

---

# Unit Tests

Jest

---

Cobertura mínima:

```text
80%
```

---

# Integration Tests

```text
Controllers

Services

Repositories
```

---

# E2E

```text
Playwright
```

---

Fluxos críticos:

```text
Login

Create Organization

Funding Submission

Document Approval

AI Advisor
```

---

# 28. Security Standards

---

Passwords

```text
Argon2
```

---

Rate Limiting

```text
NestJS Throttler
```

---

Headers

```text
Helmet
```

---

Logs

Nunca armazenar:

```text
Passwords

Tokens

Secrets
```

---

# 29. Observability

---

Logs

```text
Pino
```

---

Errors

```text
Sentry
```

---

Metrics

```text
Prometheus
```

---

Tracing

```text
OpenTelemetry
```

---

# 30. CI/CD

---

GitHub Actions

---

Pipeline

```text
Lint

Type Check

Tests

Build

Deploy
```

---

Deploy Frontend

```text
Vercel
```

---

Deploy Backend

```text
Render
```

---

Database

```text
Supabase
```

---

# 31. Docker Standards

---

Containers

```text
frontend

backend

postgres

nginx
```

---

Network

```text
olo-network
```

---

Volumes

```text
postgres-data
```

---

# 32. NGINX Routing

```nginx
/api -> backend

/ -> frontend
```

---

# 33. Documentation Standards

Todo módulo deve possuir:

```text
README

Architecture Notes

API Examples
```

---

# 34. Definition of Done

Uma funcionalidade só está concluída quando:

✓ Implementada

✓ Testada

✓ Documentada

✓ Auditável

✓ Observável

✓ Segura

✓ Compatível com RBAC

✓ Compatível com Multi-Tenant

✓ Compatível com Analytics

✓ Compatível com AI Context Engine

---

# 35. Engineering North Star

OLO Fintel deve ser desenvolvido como uma infraestrutura económica digital de longo prazo.

Cada linha de código deve contribuir para um objetivo central:

> Transformar dados operacionais do dia a dia de PMEs e cooperativas em inteligência acionável, credibilidade económica e acesso sustentável a oportunidades de crescimento e financiamento.

Isso significa que toda funcionalidade, API, entidade e componente deve ser pensada não apenas para resolver uma tarefa atual, mas para fortalecer o ecossistema de dados que alimenta os módulos de analytics, consultoria financeira por IA e funding readiness.
