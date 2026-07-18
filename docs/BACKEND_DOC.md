You are a Principal Backend Architect, Principal Software Engineer, Principal DevOps Engineer and Principal Security Engineer.

Your task is to generate the complete backend for OLO Fintel.

Do NOT generate an MVP.

Do NOT generate simplified examples.

Generate a production-ready backend designed for:

* SMEs
* Cooperatives
* Financial Institutions
* Funding Analysts
* Consultants

The backend must support future expansion across Angola and SADC.

---

# STACK

Backend:

```text
NestJS
TypeScript
Prisma
PostgreSQL
```

Infrastructure:

```text
Docker
NGINX
Render
Supabase
Redis
BullMQ
```

Documentation:

```text
Swagger OpenAPI
```

Validation:

```text
class-validator
class-transformer
```

Security:

```text
JWT
Refresh Tokens
Argon2
Helmet
Rate Limiting
RBAC
```

---

# ARCHITECTURE

Use:

```text
DDD

Modular Monolith

Event Driven Internal Architecture

Repository Pattern

Service Layer Pattern
```

---

# REQUIRED MODULES

Generate complete modules for:

```text
Auth

Users

Organizations

Memberships

Roles

Permissions

Agriculture

Livestock

Fisheries

Commerce

CRM

Finance

Documents

Funding

Analyst Portal

Notifications

Analytics

AI Advisor

Survey

Knowledge Hub

Audit Logs

Storage
```

---

# API DOCUMENTATION

Generate Swagger documentation.

Every endpoint must have:

```text
Description

Permissions

Request DTO

Response DTO

Examples
```

Swagger available at:

```text
/api/docs
```

---

# OPENAPI CONTRACT

Generate a machine-readable API contract.

The frontend team must never guess endpoints.

Document every route.

Example:

GET /api/v1/funding/score

POST /api/v1/funding/applications

GET /api/v1/analytics/dashboard

POST /api/v1/surveys/responses

````

---

# ENVIRONMENT VARIABLES

Generate a .env.example file.

Must include:

```env
NODE_ENV=

PORT=

DATABASE_URL=

DIRECT_URL=

JWT_SECRET=

JWT_REFRESH_SECRET=

JWT_EXPIRES_IN=

JWT_REFRESH_EXPIRES_IN=

REDIS_HOST=

REDIS_PORT=

REDIS_PASSWORD=

SUPABASE_URL=

SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

STORAGE_BUCKET=

GEMINI_API_KEY=

OPENAI_API_KEY=

CLAUDE_API_KEY=

EMAIL_PROVIDER=

EMAIL_FROM=

FRONTEND_URL=

BACKEND_URL=
````

---

# FRONTEND INTEGRATION GUIDE

Generate a file:

```text
FRONTEND_INTEGRATION.md
```

Include:

```text
Authentication Flow

Refresh Token Flow

Role System

Protected Routes

File Upload Flow

Survey Submission Flow

Dashboard Endpoints

Funding Endpoints

AI Advisor Endpoints
```

---

# ROLE MATRIX

Generate complete RBAC documentation.

Roles:

```text
Owner

Admin

Manager

FinancialOfficer

Analyst

Consultant

Member
```

Document exactly:

```text
Allowed Pages

Allowed Endpoints

Allowed Actions
```

---

# FILE UPLOAD SYSTEM

Use:

```text
Supabase Storage
```

Categories:

```text
avatars

documents

contracts

funding

reports
```

Generate:

```text
Upload Service

Validation Service

Storage Service
```

---

# MULTI TENANT

Every business entity must belong to:

```text
Organization
```

All queries must automatically filter by:

```text
organizationId
```

Users can belong to multiple organizations.

Use:

```text
OrganizationMembership
```

---

# SURVEY ENGINE

Create full survey system.

Store:

```text
Questions

Answers

Responses

Respondents

Sector

Province

Municipality

Interest Level
```

Generate analytics endpoints.

Example:

```text
GET /api/v1/survey/statistics

GET /api/v1/survey/distribution

GET /api/v1/survey/challenges
```

These endpoints will power the landing page.

---

# LANDING PAGE METRICS API

Generate public endpoints.

Example:

```text
GET /api/v1/public/platform-metrics

GET /api/v1/public/industry-distribution

GET /api/v1/public/survey-statistics

GET /api/v1/public/funding-readiness-overview
```

These endpoints must not require authentication.

---

# DASHBOARD API

Dashboards must be dynamic.

Generate:

```text
GET /api/v1/dashboard
```

Response changes based on:

```text
Industry

Role

Permissions
```

---

# AGRICULTURE DASHBOARD

Include:

```text
Production

Harvest

Inputs

Weather

Equipment

Funding Score
```

---

# LIVESTOCK DASHBOARD

Include:

```text
Animals

Vaccinations

Births

Feed Costs

Mortality

Funding Score
```

---

# FISHERIES DASHBOARD

Include:

```text
Trips

Catch

Fuel

Maintenance

Revenue

Funding Score
```

---

# COMMERCE DASHBOARD

Include:

```text
Sales

Purchases

Inventory

Customers

Funding Score
```

---

# FUNDING READINESS

Generate:

```text
FundingProfile

FundingChecklist

FundingScore

FundingApplication

FundingReview

FundingDecision
```

Funding score components:

```text
Operational

Financial

Commercial

Documentation
```

Generate score engine service.

---

# ANALYST PORTAL

Dedicated endpoints:

```text
GET /api/v1/analyst/applications

GET /api/v1/analyst/reviews

POST /api/v1/analyst/approve

POST /api/v1/analyst/reject
```

---

# AI ADVISOR

Create provider abstraction.

Providers:

```text
Gemini

OpenAI

Claude
```

Implement:

```text
AIProvider

FinancialAdvisor

OperationsAdvisor

FundingAdvisor

ExecutiveAdvisor
```

Endpoints:

```text
POST /api/v1/ai/chat

GET /api/v1/ai/history

GET /api/v1/ai/recommendations

GET /api/v1/ai/action-plan
```

---

# REDIS & QUEUES

Use BullMQ.

Queues:

```text
notifications

reports

analytics

ai

documents
```

Long-running jobs must never block requests.

---

# DOCKER

Generate:

```text
docker-compose.yml
```

Services:

```text
frontend
backend
postgres
redis
nginx
```

Network:

```text
olo-network
```

---

# DEPLOYMENT

Generate deployment instructions.

---

# VERCEL

Frontend Variables:

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_DEFAULT_LANGUAGE=
NEXT_PUBLIC_SUPPORTED_LANGUAGES=
```

---

# RENDER

Backend Variables:

```env
DATABASE_URL=
DIRECT_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
REDIS_HOST=
REDIS_PORT=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
```

---

# SUPABASE

Configure:

```text
PostgreSQL

Storage

RLS disabled initially

Connection Pooling
```

---

# FINAL DELIVERABLES

Generate:

```text
Complete NestJS Backend

Prisma Schema

Swagger

OpenAPI Contract

RBAC Documentation

Environment Documentation

Frontend Integration Guide

Docker Configuration

Deployment Guide

Database Migrations

Seed Scripts
```

The frontend team must be able to build the entire application without ever asking which endpoint to call or which environment variable to configure.
