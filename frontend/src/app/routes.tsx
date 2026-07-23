import { lazy, Suspense } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import { AuthGuard, RoleGuard } from './guards';
import type { UserRole } from '../types';

// Lazy-loaded pages
const LandingPage = lazy(() => import('../components/LandingPage'));
const SurveyPage = lazy(() => import('../components/SurveyPage'));
const LoginPage = lazy(() => import('../components/AuthPages'));
const Dashboards = lazy(() => import('../components/layout/DashboardShell'));

// Placeholder pages (will be built in later phases)
function PlaceholderPage({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h2 className="text-xl font-bold text-text-light-primary dark:text-text-dark-primary">{name}</h2>
        <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-2">Página em construção</p>
      </div>
    </div>
  );
}

const OverviewPage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage name="Dashboard Overview" /> }));
const OperationsPage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage name="Operações" /> }));
const FinancePage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage name="Financeiro" /> }));
const CRMPage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage name="CRM & Vendas" /> }));
const DocumentsPage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage name="Documentos" /> }));
const FundingPage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage name="Funding" /> }));
const AICenterPage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage name="Consultor IA" /> }));
const SupportCostsPage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage name="Custos Suporte" /> }));
const LedgerPage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage name="Livro Razo" /> }));
const ProfilePage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage name="Perfil" /> }));
const EcosystemPage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage name="Ecossistema" /> }));
const UserManagementPage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage name="Utilizadores" /> }));
const KYCQueuePage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage name="Fila KYC" /> }));
const SurveyEnginePage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage name="Motor Survey" /> }));
const SystemLogsPage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage name="Sistema" /> }));
const ConsultantDelegationPage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage name="Delegar Consultores" /> }));
const ApplicationsPage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage name="Aplicações" /> }));
const ScoringQueuePage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage name="Scoring" /> }));
const DocumentReviewPage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage name="Revisão Docs" /> }));
const WorkflowPage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage name="Workflow" /> }));
const ClientsPage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage name="Clientes" /> }));
const ActionPlansPage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage name="Planos de Ação" /> }));
const AIRecommendationsPage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage name="Recomendações IA" /> }));
const NotFoundPage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage name="404 - Não encontrado" /> }));

function LoadingSpinner() {
  return (
    <div className="w-full h-64 flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-4 border-brand-primary border-t-transparent animate-spin" />
    </div>
  );
}

function withSuspense(Component: React.LazyExoticComponent<React.ComponentType>) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Component />
    </Suspense>
  );
}

// AuthPages needs special handling - it accepts a `view` prop via the old system
// For now we'll use it as a login page wrapper
function LoginPageWrapper() {
  return withSuspense(LoginPage);
}

const routes: RouteObject[] = [
  // PUBLIC
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: withSuspense(LandingPage) },
      { path: 'survey', element: withSuspense(SurveyPage) },
    ],
  },

  // AUTH
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPageWrapper /> },
      { path: 'register', element: <LoginPageWrapper /> },
    ],
  },

  // DASHBOARD (authenticated)
  {
    path: '/app',
    element: <AuthGuard><DashboardLayout /></AuthGuard>,
    children: [
      // Cooperative (OWNER, MANAGER, FINANCIAL_OFFICER)
      { path: 'overview', element: withSuspense(OverviewPage) },
      { path: 'operations', element: withSuspense(OperationsPage) },
      { path: 'finance', element: withSuspense(FinancePage) },
      { path: 'crm', element: withSuspense(CRMPage) },
      { path: 'documents', element: withSuspense(DocumentsPage) },
      { path: 'funding', element: withSuspense(FundingPage) },
      { path: 'ai-center', element: withSuspense(AICenterPage) },
      { path: 'support-costs', element: withSuspense(SupportCostsPage) },
      { path: 'ledger', element: withSuspense(LedgerPage) },
      { path: 'profile', element: withSuspense(ProfilePage) },

      // SUPER_ADMIN
      { path: 'admin/ecosystem', element: <RoleGuard roles={['SUPER_ADMIN']}>{withSuspense(EcosystemPage)}</RoleGuard> },
      { path: 'admin/users', element: <RoleGuard roles={['SUPER_ADMIN']}>{withSuspense(UserManagementPage)}</RoleGuard> },
      { path: 'admin/kyc', element: <RoleGuard roles={['SUPER_ADMIN']}>{withSuspense(KYCQueuePage)}</RoleGuard> },
      { path: 'admin/survey', element: <RoleGuard roles={['SUPER_ADMIN']}>{withSuspense(SurveyEnginePage)}</RoleGuard> },
      { path: 'admin/logs', element: <RoleGuard roles={['SUPER_ADMIN']}>{withSuspense(SystemLogsPage)}</RoleGuard> },
      { path: 'admin/consultants', element: <RoleGuard roles={['SUPER_ADMIN']}>{withSuspense(ConsultantDelegationPage)}</RoleGuard> },

      // ANALYST
      { path: 'analyst/applications', element: <RoleGuard roles={['ANALYST']}>{withSuspense(ApplicationsPage)}</RoleGuard> },
      { path: 'analyst/scoring', element: <RoleGuard roles={['ANALYST']}>{withSuspense(ScoringQueuePage)}</RoleGuard> },
      { path: 'analyst/docs', element: <RoleGuard roles={['ANALYST']}>{withSuspense(DocumentReviewPage)}</RoleGuard> },
      { path: 'analyst/workflow', element: <RoleGuard roles={['ANALYST']}>{withSuspense(WorkflowPage)}</RoleGuard> },

      // CONSULTANT
      { path: 'consultant/clients', element: <RoleGuard roles={['CONSULTANT']}>{withSuspense(ClientsPage)}</RoleGuard> },
      { path: 'consultant/plans', element: <RoleGuard roles={['CONSULTANT']}>{withSuspense(ActionPlansPage)}</RoleGuard> },
      { path: 'consultant/ai-recs', element: <RoleGuard roles={['CONSULTANT']}>{withSuspense(AIRecommendationsPage)}</RoleGuard> },
    ],
  },

  // 404
  { path: '*', element: withSuspense(NotFoundPage) },
];

export const router = createBrowserRouter(routes);
