# TDD — Technical Design Document

## OLO Fintel

### Technical Architecture & Engineering Specification

**Versão:** 1.1

---

# 1. Objetivo

Este documento define a arquitetura técnica completa da plataforma OLO Fintel.

Serve como referência para:

* Backend Engineers
* Frontend Engineers
* DevOps
* AI Engineers
* Product Engineers
* QA

---

# 2. Princípios Arquiteturais

## 2.1 Business First

A arquitetura existe para servir o domínio.

Não o contrário.

---

## 2.2 Modular Monolith First

V1 será construída como:

```text
NestJS Modular Monolith
```

e não microserviços.

Motivos:

* equipa pequena
* menor custo
* deploy simples
* manutenção simplificada
* menos DevOps

---

## 2.3 Event Driven Internal Architecture

Apesar do monólito:

```text
Module A
↓ Event
Module B
↓ Event
Module C
```

---

## 2.4 Multi-Tenant

Uma única plataforma.

Múltiplas organizações.

---

# 3. Stack Tecnológica

## Frontend

```text
Next.js 14
React
TypeScript
Tailwind
Shadcn UI
React Query
React Hook Form
Zod
```

Deploy:

```text
Vercel
```

---

## Backend

```text
NestJS
TypeScript
Prisma
PostgreSQL
```

Deploy:

```text
Render
```

---

## Base de Dados

```text
PostgreSQL
Supabase
```

---

## Storage

```text
Supabase Storage
```

---

## Queue

```text
BullMQ
Redis
```

---

## Cache

```text
Redis
```

---

## Search

V1:

```text
Postgres Full Text Search
```

V2:

```text
Meilisearch
```

---

## Monitoring

```text
OpenTelemetry
Sentry
Grafana
```

---

# 4. Ambientes

## Local

Docker Compose

---

## Development

Render + Supabase

---

## Staging

Render + Supabase

---

## Production

Render + Supabase + Vercel

---

# 5. Containers

## Frontend

```text
Next.js
```

---

## Backend

```text
NestJS
```

---

## Database

```text
PostgreSQL
```

---

## Reverse Proxy

```text
NGINX
```

---

# Docker Layout

```text
frontend
backend
postgres
nginx
```

---

# 6. Arquitetura Geral

```text
Browser
↓
NGINX
↓
Next.js
↓
NestJS API
↓
PostgreSQL
```

---

# 7. Backend Structure

```text
src

├── modules
├── shared
├── infrastructure
├── domain
├── application
├── events
├── queues
├── ai
├── auth
└── common
```

---

# 8. Domain Driven Design

---

# Core Domains

## Identity

Gestão de utilizadores.

---

## Organization

Centro da plataforma.

---

## Operations

Gestão operacional.

---

## Finance

Gestão financeira.

---

## CRM

Relacionamento comercial.

---

## Documents

Gestão documental.

---

## Funding

Preparação para financiamento.

---

## AI

Consultores IA.

---

## Reporting

Relatórios.

---

## Preferences (NOVO)

Preferências do utilizador (tema, idioma, notificações).

---

## Validation (NOVO)

Questionário de validação de mercado e painel do júri.

---

# 9. Multi-Tenant Model

Todas as entidades devem possuir:

```typescript
organizationId
```

---

Exemplo:

```typescript
User
Organization
Invoice
Expense
Contract
Document
```

Nota: as entidades do módulo **Validation** (`Survey`, `SurveyResponse`) são uma exceção deliberada — não pertencem a uma organização, porque o questionário pode ser respondido por visitantes não registados (leads pré-onboarding).

---

# 10. Identity Module

## Responsabilidades

* Login
* Registo
* MFA
* Sessões

---

Entidades:

```text
User
Role
Permission
Session
```

---

# 11. Organization Module

Entidades:

```text
Organization
OrganizationProfile
OrganizationSector
OrganizationSettings
```

---

Tipos:

```text
Agriculture
Livestock
Fisheries
Commerce
Industry
```

---

# 12. RBAC

Role Based Access Control

---

Roles:

```text
Owner
Admin
Manager
FinancialOfficer
Analyst
Consultant
Member
Jury          (NOVO — acesso apenas ao Painel do Júri, sem organizationId associado)
```

---

# 13. Operations Module

---

# Agriculture

Entidades:

```text
Farm
Plot
Crop
Planting
Harvest
Input
Equipment
WeatherRecord
```

---

# Livestock

Entidades:

```text
Animal
Breed
Vaccination
Treatment
Birth
Death
FeedRecord
WeightRecord
```

---

# Fisheries

Entidades:

```text
Vessel
Trip
Catch
Maintenance
FuelRecord
```

---

# Commerce

Entidades:

```text
Product
Inventory
Purchase
Sale
Supplier
Customer
```

---

# 14. Finance Module

Entidades:

```text
Revenue
Expense
Transaction
CashFlow
Budget
Forecast
```

---

Eventos:

```text
RevenueCreated
ExpenseCreated
BudgetUpdated
```

---

# 15. CRM Module

Entidades:

```text
Lead
Opportunity
Client
Contract
Interaction
```

---

Pipeline:

```text
Lead
Contacted
Negotiation
Won
Lost
```

---

# 16. Documents Module

Entidades:

```text
Document
DocumentCategory
DocumentReview
DocumentVersion
```

---

Estados:

```text
Pending
Approved
Rejected
Expired
```

---

# 17. Funding Module

---

Entidades

```text
FundingProfile
FundingScore
FundingChecklist
FundingApplication
FundingReview
```

---

Subscores

```text
Operational
Financial
Commercial
Documental
```

---

# Funding Pipeline

```text
Draft
Submitted
UnderReview
Approved
Rejected
```

---

# 18. Analyst Portal

Entidades:

```text
Analyst
Assessment
Recommendation
Decision
```

---

Funcionalidades:

```text
Review Documents

Review Metrics

Issue Recommendations

Approve

Reject
```

---

# 19. AI Architecture

---

# AI Gateway

Abstração única.

```text
AIProvider
```

---

Implementações:

```text
Gemini
OpenAI
Claude
```

---

# Advisors

## Executive Advisor

Visão global.

---

## Financial Advisor

Finanças.

---

## Operations Advisor

Operações.

---

## Commercial Advisor

CRM.

---

## Funding Advisor

Financiamento.

---

# AI Context Builder

Responsável por construir contexto.

Fontes:

```text
Organization

Operations

Finance

CRM

Funding

Documents
```

---

# AI Memory

V1

```text
Database Persistence
```

---

V2

```text
Vector Database
```

---

# 20. Event Architecture

---

Exemplo

```text
RevenueCreated
↓
UpdateCashFlow
↓
RecalculateScore
↓
GenerateInsights
↓
NotifyUser
```

---

# Eventos Principais

```text
RevenueCreated

ExpenseCreated

ContractSigned

DocumentApproved

FundingSubmitted

HarvestCompleted

AnimalRegistered

CatchRegistered

ThemePreferenceChanged      (NOVO)

SurveyResponseSubmitted     (NOVO)

SurveyGoalReached           (NOVO)
```

---

# 21. Queue System

BullMQ

---

Filas:

```text
notifications

reports

ai

funding

documents

surveys            (NOVO — processamento assíncrono de respostas e recálculo do painel do júri)
```

---

# 22. Notification System

Tipos:

```text
Email

InApp

Push
```

---

Entidades:

```text
Notification
NotificationTemplate
```

---

# 23. Reporting Module

---

Relatórios:

```text
Operational

Financial

Commercial

Funding

Validation (agregado do questionário, para exportação ao júri)   (NOVO)
```

---

Export:

```text
PDF

Excel

CSV
```

---

# 24. Preferences Module (NOVO)

## Responsabilidades

* guardar preferências de UI por utilizador e por dispositivo não autenticado (via identificador local);
* fornecer a preferência de tema no primeiro carregamento (SSR-aware, para evitar "flash" de tema errado).

---

## Entidades

```text
UserPreferences
```

Campos principais:

```text
userId (opcional — nulo para visitante)
deviceId (para persistência antes de login)
theme            -> enum: light | dark | system
language
notificationSettings
updatedAt
```

---

## Regras Técnicas

* a preferência de tema deve estar disponível no primeiro render (evitar flash of unstyled/wrong theme — resolvido no lado do frontend com leitura antecipada da preferência antes da hidratação);
* ao autenticar um visitante com preferência já definida por `deviceId`, a preferência é migrada para o `UserPreferences` associado ao `userId`.

---

# 25. Validation Module (NOVO)

## Responsabilidades

* gerir o questionário de validação de mercado (EPIC 15 do BDD);
* impedir respostas duplicadas;
* agregar e anonimizar resultados para o Painel do Júri;
* expor progresso público (contador vs meta) sem expor dados individuais.

---

## Entidades

```text
Survey
SurveyQuestion
SurveyResponse
SurveyAnswer
```

Campos principais:

```text
Survey
  id, title, goalCount (default 100), status (open | closed), createdAt

SurveyQuestion
  id, surveyId, order, type (single_choice | multi_choice | text | scale), text, options[]

SurveyResponse
  id, surveyId, respondentFingerprint (hash de deviceId/IP — não reversível para PII),
  organizationTypeHint, provinceHint, personaHint, completedAt

SurveyAnswer
  id, responseId, questionId, value
```

---

## Regras Técnicas

* `respondentFingerprint` é um hash unidirecional (não permite reidentificação), usado apenas para bloquear duplicados;
* agregações no Painel do Júri só são calculadas e exibidas para segmentos com um mínimo de N respostas (configurável, sugestão N=3), para evitar reidentificação em grupos pequenos;
* ao atingir `goalCount`, o `Survey.status` passa a `closed` e o evento `SurveyGoalReached` é disparado (dispara notificação interna e, no frontend, substitui o botão flutuante por mensagem de agradecimento).

---

# 26. Public APIs

---

Future Ready

```text
/api/v1
```

---

Categorias:

```text
Organizations

Operations

Finance

CRM

Funding

Documents

AI

Preferences   (NOVO)

Surveys       (NOVO — inclui endpoint público de progresso e endpoint role-gated do painel do júri)
```

---

# 27. Security

---

Autenticação

```text
JWT Access Token

Refresh Token
```

---

Passwords

```text
Argon2
```

---

Uploads

```text
Virus Scan

Validation

Encryption
```

---

Rate Limiting

```text
Throttler
```

---

Nota (NOVO): os endpoints de `Surveys` (submissão de resposta) devem ter rate limiting mais restritivo por IP/fingerprint, já que são públicos e não exigem autenticação.

---

# 28. Audit System

Todas ações críticas:

```text
User

Action

Timestamp

OldValue

NewValue
```

---

Tabela:

```text
AuditLog
```

---

# 29. Database Strategy

Prisma ORM

---

Conventions:

```text
UUID

createdAt

updatedAt

deletedAt
```

---

Soft Delete:

```text
deletedAt
```

---

# 30. Frontend Architecture

```text
app

components

features

hooks

services

providers

types
```

---

# Features

```text
auth

organization

operations

finance

crm

documents

funding

ai

preferences   (NOVO — inclui ThemeProvider)

survey        (NOVO — formulário multi-step + painel do júri)
```

---

# 31. State Management

Server State:

```text
TanStack Query
```

---

Local State:

```text
Zustand
```

---

Forms:

```text
React Hook Form

Zod
```

---

Tema (NOVO):

```text
ThemeProvider baseado em CSS variables + classe no <html> (light/dark),
com leitura antecipada da preferência antes da hidratação para evitar flash de tema incorreto.
```

---

# 32. Observability

Logs:

```text
NestJS Logger
```

---

Errors:

```text
Sentry
```

---

Metrics:

```text
Prometheus
```

---

Tracing:

```text
OpenTelemetry
```

---

# 33. Scalability Roadmap

## V1

Modular Monolith

---

## V2

Extract Services

```text
AI Service

Funding Service

Notification Service
```

---

## V3

Event Bus

```text
Kafka
```

---

## V4

Regional Infrastructure

SADC Multi-Country Architecture

---

# 34. Technical North Star

OLO Fintel deve ser capaz de suportar milhares de organizações operando simultaneamente, mantendo uma arquitetura suficientemente simples para uma equipa pequena desenvolver rapidamente e suficientemente robusta para evoluir para uma infraestrutura económica regional sem necessidade de reescrita completa do sistema — incluindo, desde a V1, o registo de valor diário (Operações/Finanças/CRM/Documentos) e a camada de validação de mercado (Surveys) como cidadãos de primeira classe da arquitetura, não como extensões tardias.
