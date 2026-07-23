# PLANO DE REESTRUTURAÇÃO — OLO Fintel Frontend
## Documento de Referência Completa

**Versão:** 1.0
**Data:** Julho 2026
**Estado:** Pronto para Implementação
**Objetivo:** Reestruturar o frontend para arquitetura moderna, design system novo e profissionalismo SaaS

---

## 1. Diagnóstico do Estado Atual

### 1.1 Problemas Identificados

| # | Problema | Severidade | Ficheiro | Linhas |
|---|----------|-----------|----------|--------|
| 1 | Dashboard monolítico | Crítico | `src/components/Dashboards.tsx` | 4.752 |
| 2 | Sem Router — navegação via useState | Crítico | `src/App.tsx` | — |
| 3 | 2 codebases paralelos (duplicados) | Alto | `src/components/` vs `src/features/` | — |
| 4 | Sem UI library reutilizável | Alto | `src/components/ui/` não existe | — |
| 5 | 2 camadas API | Médio | `src/lib/api.ts` (803) + `src/services/api.ts` (213) | — |
| 6 | Dados mock hardcoded | Médio | 10+ ficheiros | — |
| 7 | Paleta de cores inconsistente | Médio | `brand-iris`, `indigo-600`, `purple-600` misturados | — |
| 8 | 50+ useState no Dashboard | Médio | `src/components/Dashboards.tsx` | — |

### 1.2 Ficheiros Existentes — Tamanho

| Ficheiro | Linhas | Estado |
|----------|--------|--------|
| `Dashboards.tsx` | 4.752 | ATIVO — monolito com 5 roles |
| `SectorOperationalDashboard.tsx` | 2.000 | ATIVO — operações por setor |
| `SupportCostsModule.tsx` | 1.742 | ATIVO — custos de suporte |
| `LandingPage.tsx` (components) | 1.334 | ATIVO — landing page pública |
| `FinancialModule.tsx` | 1.574 | ATIVO — finanças |
| `CommercialCRMModule.tsx` | 1.124 | ATIVO — CRM |
| `FundingReadinessModule.tsx` | 1.164 | ATIVO — funding |
| `DocumentKYCModule.tsx` | 923 | ATIVO — documentos |
| `AuthPages.tsx` | 448 | ATIVO — auth |
| `App.tsx` | 230 | ATIVO — shell principal |
| `LanguageContext.tsx` | 781 | ATIVO — i18n |
| `AICenterModule.tsx` | 633 | ATIVO — IA |
| `UserProfileModule.tsx` | 359 | ATIVO — perfil |
| `AuthContext.tsx` | 126 | ATIVO — auth context |
| `ThemeContext.tsx` | 84 | ATIVO — tema |
| `BackendConnectionManager.tsx` | 249 | ATIVO — conexão |
| `ThemeToggle.tsx` | 38 | ATIVO — toggle tema |
| `lib/api.ts` | 803 | ATIVO — API layer principal |
| `services/api.ts` | 213 | ATIVO — API layer ERP |
| `types.ts` | 201 | ATIVO — tipos |
| `index.css` | 336 | ATIVO — estilos |
| **features/** (desconectados) | ~4.310 | INATIVO — não ligado ao App.tsx |

### 1.3 Total de Linhas Ativas (src/components/)

~18.000 linhas num único directorio, com ~12.000 concentradas em 3 ficheiros.

---

## 2. Design System — Paleta de Cores (definida no README)

### 2.1 Paleta Principal

| Nome | Cor | Código | Uso |
|------|-----|--------|-----|
| Azul Petróleo | 🔵 | `#0D1B2A` | Sidebar, header, logo, fundo de destaque |
| Verde Empresarial | 🟢 | `#0DA676` | Botões primários, indicadores positivos, gráficos |
| Turquesa | 🟩 | `#17C39B` | Hover, elementos ativos, progress bars |
| Branco Neutro | ⬜ | `#F4F6F8` | Background da área principal |
| Cinza Médio | ⚪ | `#6B7280` | Texto secundário |
| Cinza Claro | — | `#E5E7EB` | Bordas, separadores |

### 2.2 Cores de Status

| Status | Cor | Código |
|--------|-----|--------|
| Sucesso/Concluído | Verde | `#0DA676` |
| Aviso/Pendente | Amarelo | `#F59E0B` |
| Erro/Atrasado | Vermelho | `#EF4444` |
| Informação | Azul | `#3B82F6` |

### 2.3 Modo Escuro

| Elemento | Cor |
|----------|-----|
| Background | `#0E0E12` |
| Surface/Card | `#1A1A21` |
| Border | `#2A2A35` |
| Texto primário | `#F5F5F7` |
| Texto secundário | `#A1A1AA` |

### 2.4 Tipografia

| Propriedade | Valor |
|-------------|-------|
| Fonte | Inter |
| Pesos | 400, 500, 600, 700 |
| Fonte mono | JetBrains Mono |
| Border radius cards | 16px |
| Border radius buttons | 12px |

### 2.5 Regras de Uso por Elemento

| Elemento | Cor Primária | Cor Secundária |
|----------|-------------|----------------|
| Sidebar fundo | `#0D1B2A` | — |
| Sidebar item ativo | Gradiente verde | `#0DA676` → `#17C39B` |
| Botão primário | `#0DA676` | Texto branco |
| Botão secundário | Outline `#0DA676` | Texto `#0DA676` |
| Card KPI | `#FFFFFF` bg | Sombra suave |
| Progress bar | `#17C39B` | Fundo `#E5E7EB` |
| Badge sucesso | `#0DA676` bg | Texto branco |
| Badge aviso | `#F59E0B` bg | Texto branco |
| Badge erro | `#EF4444` bg | Texto branco |
| Indicador positivo | `#0DA676` | Texto `#0DA676` |
| Indicador negativo | `#EF4444` | Texto `#EF4444` |
| Tabela header | `#F4F6F8` bg | Texto `#6B7280` |
| Tabela row hover | `#F4F6F8` | — |

---

## 3. Arquitetura Final

### 3.1 Estrutura de Pastas

```
src/
├── app/
│   ├── App.tsx
│   ├── routes.tsx
│   └── guards.tsx
│
├── layouts/
│   ├── PublicLayout.tsx
│   ├── DashboardLayout.tsx
│   └── AuthLayout.tsx
│
├── pages/
│   ├── public/
│   │   ├── LandingPage.tsx
│   │   └── SurveyPage.tsx
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── dashboard/
│   │   ├── OverviewPage.tsx
│   │   ├── OperationsPage.tsx
│   │   ├── FinancePage.tsx
│   │   ├── CRMPage.tsx
│   │   ├── DocumentsPage.tsx
│   │   ├── FundingPage.tsx
│   │   ├── AICenterPage.tsx
│   │   ├── SupportCostsPage.tsx
│   │   ├── LedgerPage.tsx
│   │   └── ProfilePage.tsx
│   ├── admin/
│   │   ├── EcosystemPage.tsx
│   │   ├── UserManagementPage.tsx
│   │   ├── KYCQueuePage.tsx
│   │   ├── SurveyEnginePage.tsx
│   │   ├── SystemLogsPage.tsx
│   │   └── ConsultantDelegationPage.tsx
│   ├── analyst/
│   │   ├── ApplicationsPage.tsx
│   │   ├── ScoringQueuePage.tsx
│   │   ├── DocumentReviewPage.tsx
│   │   └── WorkflowPage.tsx
│   ├── consultant/
│   │   ├── ClientsPage.tsx
│   │   ├── ActionPlansPage.tsx
│   │   └── AIRecommendationsPage.tsx
│   └── NotFoundPage.tsx
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Table.tsx
│   │   ├── Tabs.tsx
│   │   ├── Progress.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Avatar.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Toast.tsx
│   │   ├── EmptyState.tsx
│   │   └── index.ts
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── MobileDrawer.tsx
│   │   └── CommandPalette.tsx
│   └── shared/
│       ├── KPICard.tsx
│       ├── StatusBadge.tsx
│       ├── DataTable.tsx
│       ├── ConfirmDialog.tsx
│       └── PageHeader.tsx
│
├── modules/
│   ├── overview/
│   │   ├── WelcomeCard.tsx
│   │   ├── FundingScoreGauge.tsx
│   │   ├── CashFlowChart.tsx
│   │   ├── CostAlerts.tsx
│   │   ├── QuickChecklist.tsx
│   │   └── AIRecommendations.tsx
│   ├── operations/
│   │   ├── index.tsx
│   │   ├── AgricultureView.tsx
│   │   ├── LivestockView.tsx
│   │   ├── FisheriesView.tsx
│   │   └── CommerceView.tsx
│   ├── finance/
│   │   ├── index.tsx
│   │   ├── RevenueExpenseTab.tsx
│   │   ├── CashFlowTab.tsx
│   │   ├── ProfitabilityTab.tsx
│   │   ├── PlanningTab.tsx
│   │   ├── ReceivablesPayableTab.tsx
│   │   ├── AssetsTab.tsx
│   │   └── ReportsTab.tsx
│   ├── crm/
│   │   ├── index.tsx
│   │   ├── PipelineView.tsx
│   │   ├── ClientsView.tsx
│   │   ├── SuppliersView.tsx
│   │   └── ContractsView.tsx
│   ├── documents/
│   │   ├── index.tsx
│   │   ├── MyDocuments.tsx
│   │   └── KYCQueue.tsx
│   ├── funding/
│   │   ├── index.tsx
│   │   ├── ScoreCard.tsx
│   │   ├── Checklist.tsx
│   │   └── ActionPlan.tsx
│   ├── ai/
│   │   ├── index.tsx
│   │   └── AdvisorChat.tsx
│   ├── support/
│   │   ├── index.tsx
│   │   ├── HRView.tsx
│   │   ├── MachineryView.tsx
│   │   └── UtilitiesView.tsx
│   ├── admin/
│   │   ├── EcosystemTab.tsx
│   │   ├── UserManagementTab.tsx
│   │   ├── KYCTab.tsx
│   │   ├── SurveyEngineTab.tsx
│   │   ├── SystemLogsTab.tsx
│   │   └── ConsultantDelegationTab.tsx
│   ├── analyst/
│   │   ├── ApplicationsTab.tsx
│   │   ├── ScoringTab.tsx
│   │   ├── DocumentReviewTab.tsx
│   │   └── WorkflowTab.tsx
│   └── consultant/
│       ├── ClientsTab.tsx
│       ├── ActionPlansTab.tsx
│       └── AIRecommendationsTab.tsx
│
├── contexts/
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   └── LanguageContext.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useTheme.ts
│   ├── useLanguage.ts
│   └── useDashboardData.ts
│
├── lib/
│   ├── api.ts
│   ├── utils.ts
│   ├── constants.ts
│   └── mockData.ts
│
├── types/
│   ├── index.ts
│   ├── auth.ts
│   ├── organization.ts
│   ├── operations.ts
│   ├── finance.ts
│   ├── crm.ts
│   ├── documents.ts
│   ├── funding.ts
│   ├── survey.ts
│   └── ai.ts
│
├── index.css
├── main.tsx
└── vite-env.d.ts
```

### 3.2 Definição de Rotas

```typescript
// src/app/routes.tsx
const routes = [
  // PUBLIC
  { path: '/', element: <PublicLayout />, children: [
    { index: true, element: <LandingPage /> },
    { path: 'survey', element: <SurveyPage /> },
  ]},

  // AUTH
  { path: '/auth', element: <AuthLayout />, children: [
    { path: 'login', element: <LoginPage /> },
    { path: 'register', element: <RegisterPage /> },
  ]},

  // DASHBOARD (autenticado)
  { path: '/app', element: <AuthGuard><DashboardLayout /></AuthGuard>, children: [
    // COOPERATIVE (OWNER, MANAGER, FINANCIAL_OFFICER)
    { path: 'overview', element: <OverviewPage /> },
    { path: 'operations', element: <OperationsPage /> },
    { path: 'finance', element: <FinancePage /> },
    { path: 'crm', element: <CRMPage /> },
    { path: 'documents', element: <DocumentsPage /> },
    { path: 'funding', element: <FundingPage /> },
    { path: 'ai-center', element: <AICenterPage /> },
    { path: 'support-costs', element: <SupportCostsPage /> },
    { path: 'ledger', element: <LedgerPage /> },
    { path: 'profile', element: <ProfilePage /> },

    // SUPER_ADMIN
    { path: 'admin/ecosystem', element: <RoleGuard roles={['SUPER_ADMIN']}><EcosystemPage /></RoleGuard> },
    { path: 'admin/users', element: <RoleGuard roles={['SUPER_ADMIN']}><UserManagementPage /></RoleGuard> },
    { path: 'admin/kyc', element: <RoleGuard roles={['SUPER_ADMIN']}><KYCQueuePage /></RoleGuard> },
    { path: 'admin/survey', element: <RoleGuard roles={['SUPER_ADMIN']}><SurveyEnginePage /></RoleGuard> },
    { path: 'admin/logs', element: <RoleGuard roles={['SUPER_ADMIN']}><SystemLogsPage /></RoleGuard> },
    { path: 'admin/consultants', element: <RoleGuard roles={['SUPER_ADMIN']}><ConsultantDelegationPage /></RoleGuard> },

    // ANALYST
    { path: 'analyst/applications', element: <RoleGuard roles={['ANALYST']}><ApplicationsPage /></RoleGuard> },
    { path: 'analyst/scoring', element: <RoleGuard roles={['ANALYST']}><ScoringQueuePage /></RoleGuard> },
    { path: 'analyst/docs', element: <RoleGuard roles={['ANALYST']}><DocumentReviewPage /></RoleGuard> },
    { path: 'analyst/workflow', element: <RoleGuard roles={['ANALYST']}><WorkflowPage /></RoleGuard> },

    // CONSULTANT
    { path: 'consultant/clients', element: <RoleGuard roles={['CONSULTANT']}><ClientsPage /></RoleGuard> },
    { path: 'consultant/plans', element: <RoleGuard roles={['CONSULTANT']}><ActionPlansPage /></RoleGuard> },
    { path: 'consultant/ai-recs', element: <RoleGuard roles={['CONSULTANT']}><AIRecommendationsPage /></RoleGuard> },
  ]},

  // 404
  { path: '*', element: <NotFoundPage /> },
];
```

### 3.3 Layout do Dashboard

```
┌────────────────────────────────────────────────────────────┐
│ SIDEBAR (280px)           │  HEADER (sticky top)           │
│ Background: #0D1B2A       │  Background: #F4F6F8           │
│                           │                                │
│ ┌───────────────────┐     │  Saudação + Subtexto           │
│ │ OLO Logo (branco) │     │                                │
│ └───────────────────┘     │  🔍 Pesquisa  🔔 Notif  👤   │
│                           │                                │
│ ▓ Dashboard (ativo)       ├────────────────────────────────┤
│ ○ Operações               │                                │
│ ○ Financeiro              │  ┌──────┐ ┌──────┐ ┌──────┐   │
│ ○ CRM & Vendas            │  │ KPI1 │ │ KPI2 │ │ KPI3 │   │
│ ○ Inventário              │  └──────┘ └──────┘ └──────┘   │
│ ○ Documentos              │                                │
│ ○ Relatórios              │  ┌──────────┐ ┌──────────┐    │
│ ○ Consultor IA            │  │ Gráfico  │ │ Alertas  │    │
│ ○ Configurações           │  │ Fluxo    │ │ Operac.  │    │
│                           │  └──────────┘ └──────────┘    │
│ ┌───────────────────┐     │                                │
│ │ Progresso: 72%    │     │  ┌──────────────────────┐     │
│ │ ████████████░░░░  │     │  │ Tabela de Dados      │     │
│ └───────────────────┘     │  └──────────────────────┘     │
│                           │                                │
│ ┌────┐ User Name          │                                │
│ │ AVT│ email@olo.ao       │                                │
│ └────┘                    │                                │
└────────────────────────────────────────────────────────────┘
  Background geral: #F4F6F8
  Cards: #FFFFFF, border-radius: 16px, sombra suave
  Sidebar item ativo: gradiente verde #0DA676 → #17C39B
```

---

## 4. Fases de Implementação

### Fase 1: Design System + UI Components Base
**Deps:** Nenhuma | **Status:** PENDENTE

**Tarefas:**
1. Atualizar `index.css` com tokens `#0D1B2A`, `#0DA676`, `#17C39B`
2. Criar `src/lib/utils.ts` — `cn()` (clsx + tailwind-merge)
3. Criar `src/lib/constants.ts` — roles, sectors, provincias, cores
4. Criar `src/components/ui/` — Button, Card, Input, Select, Badge, Modal, Table, Tabs, Progress, Skeleton, Avatar, Dropdown, Toast, EmptyState, index.ts
5. Criar `src/components/shared/` — KPICard, StatusBadge, DataTable, PageHeader, ConfirmDialog

**Ficheiros criados:** ~20
**Ficheiros modificados:** 1 (index.css)

---

### Fase 2: Router + Layouts + Guards
**Deps:** Fase 1 | **Status:** PENDENTE

**Tarefas:**
1. `npm install react-router-dom`
2. Criar `src/app/routes.tsx`
3. Criar `src/layouts/PublicLayout.tsx` — navbar + footer
4. Criar `src/layouts/DashboardLayout.tsx` — sidebar `#0D1B2A` + header + content
5. Criar `src/layouts/AuthLayout.tsx` — card centrado
6. Criar `src/app/guards.tsx` — AuthGuard, RoleGuard
7. Configurar lazy loading com `React.lazy` + `Suspense`
8. Reescrever `src/app/App.tsx` com `<BrowserRouter>`

**Ficheiros criados:** ~6
**Ficheiros modificados:** 1 (App.tsx)

---

### Fase 3: Contexts + Hooks + Types + API
**Deps:** Fase 1 | **Status:** PENDENTE

**Tarefas:**
1. Migrar `src/components/AuthContext.tsx` → `src/contexts/AuthContext.tsx`
2. Migrar `src/components/ThemeContext.tsx` → `src/contexts/ThemeContext.tsx`
3. Migrar `src/components/LanguageContext.tsx` → `src/contexts/LanguageContext.tsx`
4. Criar `src/hooks/useAuth.ts`, `useTheme.ts`, `useLanguage.ts`
5. Extrair `fetchDashboardData` do Dashboards.tsx → `src/hooks/useDashboardData.ts`
6. Split `src/types.ts` em `src/types/{index,auth,organization,operations,finance,crm,documents,funding,survey,ai}.ts`
7. Consolidar `src/lib/api.ts` + `src/services/api.ts` → `src/lib/api.ts` único
8. Criar `src/lib/mockData.ts` com todo o mock data centralizado
9. Migrar `src/components/BackendConnectionManager.tsx` → `src/components/layout/BackendConnectionManager.tsx`

**Ficheiros criados:** ~18
**Ficheiros eliminados:** 4 (contextos antigos, types.ts, services/api.ts)

---

### Fase 4: Descompactar Dashboards.tsx (4.752 linhas)
**Deps:** Fases 1-3 | **Status:** PENDENTE

**Tarefas:**
1. Extrair `src/modules/overview/` — WelcomeCard, FundingScoreGauge, CashFlowChart, CostAlerts, QuickChecklist, AIRecommendations
2. Extrair `src/modules/admin/` — EcosystemTab, UserManagementTab, KYCTab, SurveyEngineTab, SystemLogsTab, ConsultantDelegationTab
3. Extrair `src/modules/analyst/` — ApplicationsTab, ScoringTab, DocumentReviewTab, WorkflowTab
4. Extrair `src/modules/consultant/` — ClientsTab, ActionPlansTab, AIRecommendationsTab
5. Extrair Command Palette → `src/components/layout/CommandPalette.tsx`
6. Extrair offline sync → `src/hooks/useOfflineSync.ts`
7. Eliminar `src/components/Dashboards.tsx` (4.752 linhas → 0)

**Ficheiros criados:** ~20
**Ficheiros eliminados:** 1 (Dashboards.tsx)

---

### Fase 5: Migrar Módulos Existentes
**Deps:** Fase 1 | **Status:** PENDENTE

**Tarefas:**
1. `SectorOperationalDashboard.tsx` (2.000) → `src/modules/operations/` (4 sub-views)
2. `FinancialModule.tsx` (1.574) → `src/modules/finance/` (7 sub-tabs)
3. `CommercialCRMModule.tsx` (1.124) → `src/modules/crm/` (4 sub-views)
4. `DocumentKYCModule.tsx` (923) → `src/modules/documents/` (2 sub-views)
5. `FundingReadinessModule.tsx` (1.164) → `src/modules/funding/` (3 sub-componentes)
6. `AICenterModule.tsx` (633) → `src/modules/ai/` (1 sub-componente)
7. `SupportCostsModule.tsx` (1.742) → `src/modules/support/` (3 sub-views)
8. `UserProfileModule.tsx` (359) → `src/pages/dashboard/ProfilePage.tsx`

Cada módulo:
- Usa componentes `ui/` em vez de Tailwind inline
- Usa tokens de cor do README
- Props interfaces tipadas

**Ficheiros criados:** ~25
**Ficheiros eliminados:** 8 (módulos antigos em src/components/)

---

### Fase 6: Landing Page + Auth + Visual Redesign
**Deps:** Fases 1-2 | **Status:** PENDENTE

**Tarefas:**
1. Nova LandingPage seguindo README:
   - Hero: "Inteligência. Organização. Oportunidades."
   - Mock dashboard com: Receitas 32.540.000 Kz, Despesas 18.230.000 Kz, Saldo 14.310.000 Kz
   - Funding Score circular 72/100
   - Gráfico de barras: verde (receitas), vermelho (despesas), dourado (saldo)
   - Alertas: Estoque Baixo, Fatura a Vencer, Vacina Pendente
   - Atalhos rápidos: Nova Operação, Registrar Despesa, Nova Venda, Novo Documento, Relatório Rápido
2. LoginPage com AuthLayout centrado, botão verde `#0DA676`
3. RegisterPage com stepper, drag-and-drop
4. Dashboard OverviewPage com estilo README:
   - Cards brancos, border-radius 16px, sombra suave
   - Métricas horizontalmente
   - Tabela moderna com badges coloridos
   - Botões verdes (primário) e outline verde (secundário)

**Ficheiros criados/modificados:** ~5

---

### Fase 7: Consolidação e Limpeza
**Deps:** Todas | **Status:** PENDENTE

**Tarefas:**
1. Apagar `src/features/` inteiro (código desconectado)
2. Apagar `src/components/` inteiro (tudo migrado)
3. Verificar `vite build` sem erros
4. Verificar `tsc --noEmit` sem erros
5. Testar navegação por todas as 5 roles
6. Testar responsividade mobile
7. Testar dark mode
8. Atualizar README.md com nova estrutura

**Ficheiros eliminados:** ~30 (todo o código antigo)

---

## 5. Mapeamento de Migração

### 5.1 De → Para

| Ficheiro Actual | Linhas | Novo Local | Notas |
|-----------------|--------|------------|-------|
| `components/Dashboards.tsx` | 4.752 | `modules/overview/`, `modules/admin/`, `modules/analyst/`, `modules/consultant/`, `components/layout/Sidebar.tsx`, `components/layout/Header.tsx` | ELIMINAR |
| `components/SectorOperationalDashboard.tsx` | 2.000 | `modules/operations/` | Dividir em 4 sub-views |
| `components/SupportCostsModule.tsx` | 1.742 | `modules/support/` | Dividir em 3 sub-views |
| `components/LandingPage.tsx` | 1.334 | `pages/public/LandingPage.tsx` | REESCREVER com estilo README |
| `components/FinancialModule.tsx` | 1.574 | `modules/finance/` | Dividir em 7 sub-tabs |
| `components/CommercialCRMModule.tsx` | 1.124 | `modules/crm/` | Dividir em 4 sub-views |
| `components/FundingReadinessModule.tsx` | 1.164 | `modules/funding/` | Dividir em 3 sub-componentes |
| `components/DocumentKYCModule.tsx` | 923 | `modules/documents/` | Dividir em 2 sub-views |
| `components/AICenterModule.tsx` | 633 | `modules/ai/` | Dividir em 2 |
| `components/AuthPages.tsx` | 448 | `pages/auth/LoginPage.tsx`, `pages/auth/RegisterPage.tsx` | Separar |
| `components/UserProfileModule.tsx` | 359 | `pages/dashboard/ProfilePage.tsx` | — |
| `components/AuthContext.tsx` | 126 | `contexts/AuthContext.tsx` | Mover |
| `components/LanguageContext.tsx` | 781 | `contexts/LanguageContext.tsx` | Mover |
| `components/ThemeContext.tsx` | 84 | `contexts/ThemeContext.tsx` | Mover |
| `components/ThemeToggle.tsx` | 38 | `components/ui/ThemeToggle.tsx` | Mover |
| `components/BackendConnectionManager.tsx` | 249 | `components/layout/BackendConnectionManager.tsx` | Mover |
| `App.tsx` | 230 | `app/App.tsx` | REESCREVER com Router |
| `types.ts` | 201 | `types/` (10 ficheiros) | Split |
| `lib/api.ts` | 803 | `lib/api.ts` | Consolidar |
| `services/api.ts` | 213 | `lib/api.ts` | Merge |
| `index.css` | 336 | `index.css` | Atualizar tokens |
| `features/*` | ~4.310 | — | ELIMINAR (desconectados) |

### 5.2 Mock Data a Centralizar

| Dado | Origem Atual | Novo Local |
|------|-------------|------------|
| Talhões, culturas, produções | Dashboards.tsx (linhas 202-226) | `lib/mockData.ts` |
| Rebanho, reprodução, saúde | Dashboards.tsx (linhas 229-250) | `lib/mockData.ts` |
| Embarcações, viagens, capturas | Dashboards.tsx (linhas 253-271) | `lib/mockData.ts` |
| Produtos, inventário, vendas | Dashboards.tsx (linhas 274-295) | `lib/mockData.ts` |
| Organizações, users, consultores | Dashboards.tsx (linhas 166-191) | `lib/mockData.ts` |
| Credit applications | Dashboards.tsx (linhas 174-178) | `lib/mockData.ts` |
| Partner banks | Dashboards.tsx (linhas 186-191) | `lib/mockData.ts` |
| System logs | Dashboards.tsx (linhas 158-164) | `lib/mockData.ts` |
| Receitas financeiras | FinancialModule.tsx (linhas 44-50) | `lib/mockData.ts` |
| HR employees | SupportCostsModule.tsx | `lib/mockData.ts` |

---

## 6. Dependências

### 6.1 Dependências a Instalar

```bash
npm install react-router-dom
```

### 6.2 Dependências Existentes (manter)

```json
{
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.6.0",
  "lucide-react": "^0.546.0",
  "motion": "^12.23.24",
  "react": "^19.0.1",
  "react-dom": "^19.0.1",
  "tailwindcss": "^4.1.14"
}
```

---

## 7. Comandos de Verificação

Após cada fase:

```bash
# Type check
cd frontend && npx tsc --noEmit

# Build
cd frontend && npm run build:frontend

# Dev server
cd frontend && npm run dev
```

---

## 8. Ordem de Execução

```
Fase 1 (UI Components)
    ↓
Fase 2 (Router + Layouts)
    ↓
Fase 3 (Contexts + Hooks + Types)
    ↓
Fase 4 (Descompactar Dashboards.tsx)
    ↓
Fase 5 (Migrar Módulos)
    ↓
Fase 6 (Visual Redesign — Landing + Dashboard)
    ↓
Fase 7 (Consolidação + Limpeza)
```

---

## 9. Estado de Progresso

| Fase | Estado | Data Início | Data Fim | Notas |
|------|--------|-------------|----------|-------|
| Fase 1 | ⏳ PENDENTE | — | — | — |
| Fase 2 | ⏳ PENDENTE | — | — | — |
| Fase 3 | ⏳ PENDENTE | — | — | — |
| Fase 4 | ⏳ PENDENTE | — | — | — |
| Fase 5 | ⏳ PENDENTE | — | — | — |
| Fase 6 | ⏳ PENDENTE | — | — | — |
| Fase 7 | ⏳ PENDENTE | — | — | — |

---

## 10. Checkpoint de Interrupção

Se a sessão for interrompida, retomar verificando:

1. **Que fases estão completas?** → Ver tabela acima
2. **Que ficheiros foram criados/modificados?** → `git status`
3. **O build passa?** → `npm run build:frontend`
4. **O type check passa?** → `npx tsc --noEmit`
5. **Qual é a próxima tarefa?** → Ver fase pendente de menor número
