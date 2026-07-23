import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-bg-light dark:bg-bg-dark gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand-primary border-t-transparent animate-spin" />
        <p className="text-sm font-semibold text-text-light-secondary font-mono">Iniciando Fintel OS...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}

interface RoleGuardProps {
  roles: UserRole[];
  children: React.ReactNode;
}

export function RoleGuard({ roles, children }: RoleGuardProps) {
  const { user } = useAuth();

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/app/overview" replace />;
  }

  return <>{children}</>;
}
