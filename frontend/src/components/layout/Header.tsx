import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, Search, Command } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { NAVIGATION_CONFIG } from '../../lib/constants';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  const { t, locale, setLocale } = useLanguage();
  const { isDark } = useTheme();
  const location = useLocation();
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);

  // Find current page label from navigation config
  const allItems = [
    ...NAVIGATION_CONFIG.cooperative,
    ...NAVIGATION_CONFIG.superAdmin,
    ...NAVIGATION_CONFIG.analyst,
    ...NAVIGATION_CONFIG.consultant,
  ];
  const current = allItems.find((item) => item.path === location.pathname);
  const pageLabel = current?.label ?? 'Dashboard';

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <header className="sticky top-0 z-20 bg-bg-light/95 dark:bg-bg-dark/95 backdrop-blur-md border-b border-border-light dark:border-border-dark">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Left: Menu + Page title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-text-light-secondary hover:bg-neutralBg dark:text-text-dark-secondary dark:hover:bg-surface-dark-elevated transition-colors"
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-text-light-primary dark:text-text-dark-primary tracking-tight">
              {pageLabel}
            </h1>
            <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">
              {greeting()}{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
            </p>
          </div>
        </div>

        {/* Right: Search, Notifications, Language, Profile */}
        <div className="flex items-center gap-2">
          {/* Command palette trigger */}
          <button
            onClick={() => setCmdPaletteOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border border-border-light dark:border-border-dark text-text-light-secondary dark:text-text-dark-secondary text-xs hover:border-brand-primary dark:hover:border-brand-primary transition-colors"
          >
            <Search size={14} />
            <span>Pesquisar...</span>
            <kbd className="ml-2 px-1.5 py-0.5 rounded bg-neutralBg dark:bg-surface-dark-elevated text-[10px] font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-xl text-text-light-secondary hover:bg-neutralBg dark:text-text-dark-secondary dark:hover:bg-surface-dark-elevated transition-colors">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-error rounded-full" />
          </button>

          {/* Language selector */}
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as any)}
            className="hidden sm:block px-2 py-1.5 rounded-xl border border-border-light dark:border-border-dark bg-transparent text-xs font-semibold text-text-light-secondary dark:text-text-dark-secondary cursor-pointer"
          >
            <option value="pt">PT</option>
            <option value="en">EN</option>
            <option value="umb">UMB</option>
            <option value="kmb">KMB</option>
          </select>
        </div>
      </div>
    </header>
  );
}
