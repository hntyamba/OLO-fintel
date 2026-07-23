import { Outlet, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Menu, X, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import BackendConnectionManager from '../components/layout/BackendConnectionManager';

export default function PublicLayout() {
  const { t, locale, setLocale } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-bg-light dark:bg-bg-dark text-text-light-primary dark:text-text-dark-primary transition-colors duration-200">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-bg-dark/95 border-b border-border-light dark:border-border-dark backdrop-blur px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-left">
            <div className="px-3 h-9 rounded-xl bg-brand-petroleum text-white flex items-center justify-center font-bold text-base shadow-md">
              OLO
            </div>
            <div>
              <span className="font-bold text-base leading-none text-text-light-primary dark:text-text-dark-primary block">OLO Fintel</span>
              <span className="text-[10px] text-text-light-secondary block mt-0.5 font-sans">Economic Operating System</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <Link to="/" className="transition-all hover:text-brand-primary text-text-light-secondary dark:text-text-dark-secondary">
              {t('nav.home')}
            </Link>
            <Link to="/survey" className="transition-all hover:text-brand-primary text-text-light-secondary dark:text-text-dark-secondary">
              {t('nav.survey')}
            </Link>
            <Link
              to="/auth/login"
              className="px-4 py-2 border border-border-light dark:border-border-dark hover:border-brand-primary dark:hover:border-brand-primary text-text-light-secondary dark:text-text-dark-secondary rounded-xl transition-all"
            >
              {t('nav.login')}
            </Link>
            <Link
              to="/auth/register"
              className="px-5 py-2 bg-brand-primary text-white hover:bg-brand-primary-hover rounded-xl shadow-lg shadow-brand-primary/15 transition-all"
            >
              {t('nav.register')}
            </Link>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl border border-border-light dark:border-border-dark hover:bg-neutralBg dark:hover:bg-surface-dark-elevated transition-all text-text-light-secondary"
            >
              {isDark ? <Sun size={16} className="text-status-warning" /> : <Moon size={16} />}
            </button>
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl border border-border-light dark:border-border-dark transition-all text-text-light-secondary"
            >
              {isDark ? <Sun size={16} className="text-status-warning" /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-border-light dark:border-border-dark text-text-light-secondary dark:text-text-dark-primary"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border-light dark:border-border-dark flex flex-col gap-4 text-sm font-semibold">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-left py-2 px-3 rounded-lg hover:bg-neutralBg dark:hover:bg-surface-dark-elevated">
              {t('nav.home')}
            </Link>
            <Link to="/survey" onClick={() => setMobileMenuOpen(false)} className="text-left py-2 px-3 rounded-lg hover:bg-neutralBg dark:hover:bg-surface-dark-elevated">
              {t('nav.survey')}
            </Link>
            <div className="h-px bg-border-light dark:border-border-dark" />
            <Link to="/auth/login" onClick={() => setMobileMenuOpen(false)} className="text-left py-2 px-3 rounded-lg border border-border-light dark:border-border-dark hover:border-brand-primary">
              {t('nav.login')}
            </Link>
            <Link to="/auth/register" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 bg-brand-primary text-white rounded-lg font-bold text-center">
              {t('nav.register')}
            </Link>
          </div>
        )}
      </nav>

      {/* Main content */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="px-2.5 h-8 rounded-xl bg-brand-petroleum text-white flex items-center justify-center font-bold text-xs">OLO</div>
              <span className="font-bold text-base text-text-light-primary dark:text-text-dark-primary">OLO Fintel</span>
            </div>
            <p className="text-xs text-text-light-secondary leading-relaxed">{t('footer.desc')}</p>
          </div>
          <div>
            <h4 className="font-bold text-xs text-text-light-secondary uppercase tracking-wider mb-4">{t('footer.platform')}</h4>
            <ul className="space-y-2 text-xs font-semibold text-text-light-secondary dark:text-text-dark-secondary">
              <li><Link to="/" className="hover:text-brand-primary">{t('nav.home')}</Link></li>
              <li><Link to="/survey" className="hover:text-brand-primary">{t('nav.inquerito_nacional')}</Link></li>
              <li><Link to="/auth/login" className="hover:text-brand-primary">{t('nav.reserved_area')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs text-text-light-secondary uppercase tracking-wider mb-4">{t('footer.languages')}</h4>
            <ul className="space-y-2 text-xs font-semibold text-text-light-secondary dark:text-text-dark-secondary">
              {(['pt', 'en', 'umb', 'kmb'] as const).map((l) => (
                <li key={l}>
                  <button onClick={() => setLocale(l)} className={`hover:text-brand-primary ${locale === l ? 'text-brand-primary' : ''}`}>
                    {{ pt: 'Português', en: 'English', umb: 'Umbundu', kmb: 'Kimbundu' }[l]}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-text-light-secondary uppercase tracking-wider mb-2">{t('footer.compliance_title')}</h4>
            <div className="p-3 bg-brand-primary/5 rounded-xl border border-brand-primary/10 text-[10px] text-text-light-secondary flex items-start gap-2">
              <ShieldCheck className="text-brand-primary mt-0.5 shrink-0" size={16} />
              <span>{t('footer.compliance_desc')}</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-border-light dark:border-border-dark flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-text-light-secondary">
          <span>{t('footer.rights')}</span>
          <div className="flex gap-4">
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-neutralBg dark:bg-surface-dark-elevated text-text-light-secondary font-bold">Angola Sandbox Environment</span>
          </div>
        </div>
      </footer>

      <BackendConnectionManager />
    </div>
  );
}
