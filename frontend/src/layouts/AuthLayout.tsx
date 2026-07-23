import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="px-3 h-10 rounded-xl bg-brand-petroleum text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-brand-petroleum/20">
            OLO
          </div>
          <div>
            <span className="font-bold text-lg text-text-light-primary dark:text-text-dark-primary block leading-tight">OLO Fintel</span>
            <span className="text-[10px] text-text-light-secondary block">Economic Operating System</span>
          </div>
        </Link>

        {/* Auth card */}
        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl shadow-lg p-8">
          <Outlet />
        </div>

        {/* Footer link */}
        <p className="text-center text-xs text-text-light-secondary mt-6">
          <Link to="/" className="hover:text-brand-primary transition-colors">
            ← Voltar à página inicial
          </Link>
        </p>
      </div>
    </div>
  );
}
