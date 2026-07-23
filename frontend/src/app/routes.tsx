import { lazy, Suspense } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AuthLayout from '../layouts/AuthLayout';
import { AuthGuard } from './guards';

// Lazy-loaded pages
const LandingPage = lazy(() => import('../components/LandingPage'));
const SurveyPage = lazy(() => import('../components/SurveyPage'));
const AuthPages = lazy(() => import('../components/AuthPages'));
const DashboardShell = lazy(() => import('../components/layout/DashboardShell'));

function NotFoundPage() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h2 className="text-xl font-bold text-text-light-primary dark:text-text-dark-primary">404 — Não encontrado</h2>
        <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-2">Página em construção</p>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="w-full h-64 flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-4 border-brand-primary border-t-transparent animate-spin" />
    </div>
  );
}

// AuthPages needs `view` prop — create wrappers for each route
function LoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthPages view="login" />
    </Suspense>
  );
}

function RegisterPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthPages view="register" />
    </Suspense>
  );
}

const routes: RouteObject[] = [
  // PUBLIC
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Suspense fallback={<LoadingFallback />}><LandingPage /></Suspense> },
      { path: 'survey', element: <Suspense fallback={<LoadingFallback />}><SurveyPage /></Suspense> },
    ],
  },

  // AUTH
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },

  // DASHBOARD (authenticated) — DashboardShell handles its own sidebar/header
  {
    path: '/app',
    element: <AuthGuard><Suspense fallback={<LoadingFallback />}><DashboardShell /></Suspense></AuthGuard>,
  },

  // 404
  { path: '*', element: <NotFoundPage /> },
];

export const router = createBrowserRouter(routes);
