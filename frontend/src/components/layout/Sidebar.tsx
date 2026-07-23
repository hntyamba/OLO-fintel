import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { NAVIGATION_CONFIG } from '../../lib/constants';
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
  Laptop,
  Menu,
  X,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { UserRole } from '../../types';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function getUserNavSections(role: UserRole) {
  const sections: { label: string; items: Array<{ id: string; label: string; icon: any; path: string }> }[] = [];

  if (['OWNER', 'MANAGER', 'FINANCIAL_OFFICER'].includes(role)) {
    sections.push({ label: 'Cooperativa', items: [...NAVIGATION_CONFIG.cooperative] as any });
  }
  if (role === 'SUPER_ADMIN') {
    sections.push({ label: 'Administração', items: [...NAVIGATION_CONFIG.superAdmin] as any });
  }
  if (role === 'ANALYST') {
    sections.push({ label: 'Análise', items: [...NAVIGATION_CONFIG.analyst] as any });
  }
  if (role === 'CONSULTANT') {
    sections.push({ label: 'Consultoria', items: [...NAVIGATION_CONFIG.consultant] as any });
  }

  return sections;
}

export function Sidebar({ collapsed = false, onToggle, mobileOpen = false, onMobileClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const sections = user ? getUserNavSections(user.role) : [];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn('flex items-center gap-3 px-5 py-5 border-b border-white/10', collapsed && 'justify-center px-3')}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-brand-primary/20 shrink-0">
          OLO
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <span className="font-bold text-sm text-white block leading-tight">OLO Fintel</span>
            <span className="text-[10px] text-white/40 block mt-0.5 truncate">Economic Operating System</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {sections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/30">
                {section.label}
              </div>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={onMobileClose}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={cn(
                      'olo-sidebar-btn group relative',
                      isActive && 'active',
                      collapsed && 'justify-center px-2'
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-white rounded-r-full" />
                    )}
                    <Icon size={18} className={cn('shrink-0', isActive ? 'text-white' : 'text-white/50 group-hover:text-white/80')} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-white/10 p-3 space-y-2">
        {/* Theme toggle */}
        <div className={cn('flex items-center gap-1 p-1 rounded-xl bg-white/5', collapsed && 'justify-center')}>
          {(['light', 'dark', 'system'] as const).map((t) => {
            const Icon = t === 'light' ? Sun : t === 'dark' ? Moon : Laptop;
            const isActive = theme === t;
            return (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={cn(
                  'flex-1 flex items-center justify-center p-1.5 rounded-lg transition-all',
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-white/30 hover:text-white/60'
                )}
                title={t}
              >
                <Icon size={14} />
              </button>
            );
          })}
        </div>

        {/* User info + logout */}
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-xl bg-brand-primary/20 flex items-center justify-center text-brand-secondary text-xs font-bold shrink-0">
              {user.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">{user.name}</div>
              <div className="text-[10px] text-white/40 truncate">{user.email}</div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors"
              title={t('nav.logout')}
            >
              <LogOut size={14} />
            </button>
          </div>
        )}

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={onToggle}
          className={cn(
            'hidden lg:flex w-full items-center justify-center gap-2 p-2 rounded-xl text-white/30 hover:text-white hover:bg-white/10 transition-all text-xs',
            collapsed && 'px-0'
          )}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span>Recolher</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 bg-brand-petroleum transition-all duration-300',
          collapsed ? 'w-[72px]' : 'w-[260px]'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onMobileClose} />
          <aside className="fixed inset-y-0 left-0 w-[280px] bg-brand-petroleum z-50 animate-slide-in-left">
            <button
              onClick={onMobileClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10"
            >
              <X size={18} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
