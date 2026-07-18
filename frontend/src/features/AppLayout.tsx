import React, { useState, useEffect } from "react";
import { 
  Building2, 
  TrendingUp, 
  Users, 
  MapPin, 
  FileCheck, 
  Compass, 
  HelpCircle, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle,
  FileSpreadsheet,
  Grid,
  Menu,
  ChevronDown,
  Bell,
  Search,
  BookOpen,
  LogOut,
  FolderLock
} from "lucide-react";
import { Role, Sector, ThemePreference } from "../types";
import ThemeToggle from "../components/ThemeToggle";

interface AppLayoutProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  currentSector: Sector;
  onSectorChange: (sector: Sector) => void;
  currentTheme: ThemePreference;
  onThemeChange: (theme: ThemePreference) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  currentUser?: { name: string; email: string; role: Role; sector: Sector; organizationName: string } | null;
  children: React.ReactNode;
}

export default function AppLayout({
  currentRole,
  onRoleChange,
  currentSector,
  onSectorChange,
  currentTheme,
  onThemeChange,
  activeTab,
  onTabChange,
  onLogout,
  currentUser,
  children
}: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("PT");


  // Mock Notifications
  const notifications = [
    { id: 1, title: "Funding Readiness score subiu!", text: "Com a aprovação do seu Alvará Comercial, o seu score aumentou para 78.", type: "funding" },
    { id: 2, title: "Alerta de Stock Crítico", text: "O stock de ração de engorda/combustível está abaixo do mínimo definido.", type: "inventory" },
    { id: 3, title: "Estatutos em Revisão", text: "O analista Dr. Eduardo Mateus iniciou a auditoria documental.", type: "document" }
  ];

  // Helper for role and sector names
  const roleNames: Record<Role, string> = {
    [Role.Owner]: "Proprietário / Sócio",
    [Role.Manager]: "Gestor Operacional",
    [Role.FinancialOfficer]: "Diretor Financeiro",
    [Role.Analyst]: "Analista de Crédito",
    [Role.Consultant]: "Consultor OLO",
    [Role.Member]: "Produtor Associado",
    [Role.Jury]: "Júri de Validação"
  };

  const sectorNames: Record<Sector, string> = {
    [Sector.Agriculture]: "Agronegócio 🌾",
    [Sector.Livestock]: "Pecuária 🐂",
    [Sector.Fisheries]: "Pesca & Frotas ⚓",
    [Sector.Commerce]: "Comércio & Logística 🏪"
  };

  // RBAC check: filter sidebar menu based on roles
  const menuItems = [
    { id: "dashboard", label: "Dashboard Geral", icon: Grid, roles: [Role.Owner, Role.Manager, Role.FinancialOfficer, Role.Analyst, Role.Consultant] },
    { id: "operations", label: "Gestão Operacional", icon: Compass, roles: [Role.Owner, Role.Manager, Role.Member, Role.Consultant] },
    { id: "finance", label: "Controlo Financeiro", icon: TrendingUp, roles: [Role.Owner, Role.FinancialOfficer, Role.Analyst, Role.Consultant] },
    { id: "crm", label: "Clientes & CRM", icon: Users, roles: [Role.Owner, Role.Manager, Role.Consultant] },
    { id: "documents", label: "Dossiê Documental", icon: FileCheck, roles: [Role.Owner, Role.FinancialOfficer, Role.Analyst] },
    { id: "funding", label: "Funding Readiness", icon: AwardIcon, roles: [Role.Owner, Role.FinancialOfficer, Role.Analyst, Role.Consultant] },
    { id: "ai", label: "AI Center Advisor", icon: Cpu, roles: [Role.Owner, Role.Manager, Role.FinancialOfficer, Role.Consultant] },
    { id: "knowledge", label: "Knowledge Hub", icon: BookOpen, roles: [Role.Owner, Role.Manager, Role.Member] }
  ];

  function AwardIcon(props: any) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className={props.className}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-6.75c-.621 0-1.125.504-1.125 1.125v3.375m9 0V9M7.5 18.75V9m3.75 3.375H12"
        />
      </svg>
    );
  }

  const visibleMenuItems = menuItems.filter(item => item.roles.includes(currentRole));

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-transparent text-gray-900 dark:text-zinc-100 transition-colors duration-200">
      
      {/* ---------------------------------------------------- */}
      {/* SIDEBAR (Desktop) */}
      {/* ---------------------------------------------------- */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-black/20 border-r border-gray-200 dark:border-white/5 shrink-0 select-none">
        {/* Brand Header */}
        <div className="p-5 border-b border-gray-200 dark:border-white/5 flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center text-white font-black text-sm shadow-md glow-indigo">
            O
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-gray-900 dark:text-white">OLO <span className="text-indigo-600 dark:text-indigo-400">Fintel</span></span>
            <span className="block text-[9px] text-indigo-500 dark:text-indigo-400 font-bold truncate max-w-[150px]" title={currentUser?.organizationName || "Economic OS"}>
              {currentUser?.organizationName || "Economic OS"}
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md glow-indigo font-bold"
                    : "text-gray-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon size={16} className={isActive ? "text-white" : "text-gray-400 dark:text-zinc-400"} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer: System User Settings */}
        <div className="p-4 border-t border-gray-200 dark:border-white/5 space-y-4">
          
          {/* Active Sector Dropdown (Dynamic UI mapping) */}
          <div className="space-y-1">
            <label className="block text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Setor Ativo</label>
            <div className="relative">
              <select
                value={currentSector}
                onChange={(e) => onSectorChange(e.target.value as Sector)}
                className="w-full bg-slate-50 dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-xl px-2.5 py-2 text-xs font-bold text-gray-800 dark:text-zinc-200 focus:outline-none appearance-none"
              >
                {Object.values(Sector).map((sec) => (
                  <option key={sec} value={sec} className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">{sectorNames[sec]}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <ChevronDown size={12} />
              </div>
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 p-2 rounded-lg transition"
          >
            <LogOut size={14} />
            <span>Voltar ao Web Site</span>
          </button>
        </div>
      </aside>

      {/* ---------------------------------------------------- */}
      {/* MAIN CONTAINER */}
      {/* ---------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* HEADER */}
        <header className="h-16 bg-white dark:bg-black/40 backdrop-blur-md border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-4 sm:px-6 z-30 transition-colors">
          
          <div className="flex items-center space-x-3">
            {/* Hamburger for mobile */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-gray-500 dark:text-zinc-400"
            >
              <Menu size={18} />
            </button>
            
            {/* Global Search Bar mockup */}
            <div className="hidden sm:flex items-center space-x-2.5 bg-slate-50 dark:bg-white/[0.02] dark:backdrop-blur-md px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/5">
              <Search size={14} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Pesquisar talhão, venda, documento..." 
                className="bg-transparent border-none text-xs focus:outline-none w-48 font-medium text-gray-700 dark:text-zinc-300"
              />
            </div>
          </div>

          {/* Quick Config Row (Header Actions) */}
          <div className="flex items-center space-x-4">
            
            {/* Server Status indicator from Immersive UI */}
            <div className="hidden lg:flex flex-col items-end shrink-0 select-none mr-2">
              <span className="text-[9px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-widest">Server Status</span>
              <div className="flex items-center gap-1.5">
                <span className="status-pulse"></span>
                <span className="text-[9px] uppercase tracking-wider text-emerald-500 dark:text-emerald-400 font-bold">Optimal</span>
              </div>
            </div>

            {/* Multilingual Support (PT, EN, UM, KI) */}
            <div className="flex items-center space-x-1.5">
              <span className="hidden md:inline text-[10px] font-bold text-gray-400 uppercase tracking-wider">Língua:</span>
              <div className="relative">
                <select
                  value={currentLanguage}
                  onChange={(e) => setCurrentLanguage(e.target.value)}
                  className="bg-slate-50 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-white/5 rounded-lg px-2 py-1 text-[11px] font-bold focus:outline-none appearance-none pr-5 cursor-pointer"
                >
                  <option value="PT" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">PT 🇦🇴</option>
                  <option value="EN" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">EN 🇬🇧</option>
                  <option value="UM" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">UM 🌾</option>
                  <option value="KI" className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">KI ⚓</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center text-gray-500">
                  <ChevronDown size={10} />
                </div>
              </div>
            </div>

            {/* RBAC Role Selector Dropdown (Critical requirement) */}
            <div className="flex items-center space-x-1.5">
              <span className="hidden md:inline text-[10px] font-bold text-gray-400 uppercase tracking-wider">Função:</span>
              <div className="relative">
                <select
                  value={currentRole}
                  onChange={(e) => onRoleChange(e.target.value as Role)}
                  className="bg-purple-50 dark:bg-zinc-900 text-purple-700 dark:text-indigo-400 border border-purple-200/50 dark:border-white/5 rounded-lg px-2 py-1 text-[11px] font-bold focus:outline-none appearance-none pr-5 cursor-pointer"
                >
                  {Object.values(Role).map((r) => (
                    <option key={r} value={r} className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-200">{roleNames[r]}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center text-purple-600 dark:text-indigo-400">
                  <ChevronDown size={10} />
                </div>
              </div>
            </div>

            {/* Theme Toggle Button */}
            <ThemeToggle current={currentTheme} onChange={onThemeChange} />

            {/* Notifications Alert Popover */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-gray-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg relative"
              >
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#09090e] dark:backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-2xl shadow-xl p-4 z-50 space-y-3 glow-indigo">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-zinc-800">
                    <span className="text-xs font-bold">Notificações Recentes</span>
                    <button 
                      onClick={() => setNotificationsOpen(false)}
                      className="text-[10px] text-purple-600 hover:underline"
                    >
                      Limpar tudo
                    </button>
                  </div>
                  <div className="space-y-3">
                    {notifications.map((n) => (
                      <div key={n.id} className="text-xs space-y-0.5">
                        <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0"></span>
                          {n.title}
                        </span>
                        <p className="text-gray-500 dark:text-zinc-400 leading-normal">{n.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar info */}
            <div className="flex items-center space-x-2.5">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold font-mono">
                {currentLanguage === "EN" ? "AF" : "AF"}
              </div>
              <div className="hidden md:block text-left select-none">
                <span className="block text-xs font-extrabold">
                  {currentUser ? currentUser.name : (
                    currentLanguage === "PT" ? "António Fula" :
                    currentLanguage === "EN" ? "Anthony Fula" :
                    currentLanguage === "UM" ? "António Fula (Waliapo)" : "António Fula (Kiambote)"
                  )}
                </span>
                <span className="block text-[9px] text-gray-400 font-bold uppercase flex items-center gap-1">
                  {currentRole}
                  {(currentLanguage === "UM" || currentLanguage === "KI") && (
                    <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-[8px] font-black px-1 rounded">Dialeto</span>
                  )}
                </span>
              </div>
            </div>

          </div>
        </header>

        {/* ---------------------------------------------------- */}
        {/* MOBILE DRAWER */}
        {/* ---------------------------------------------------- */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex">
            <div className="w-64 bg-white dark:bg-[#0c0c14] h-full p-5 flex flex-col border-r border-gray-200 dark:border-white/5">
              <div className="flex justify-between items-center pb-5 border-b border-gray-200 dark:border-white/5">
                <span className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="h-5.5 w-5.5 rounded bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center text-[10px] text-white">O</span>
                  OLO Fintel
                </span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-bold text-gray-400 hover:text-white"
                >
                  Fechar ✕
                </button>
              </div>

              <nav className="flex-1 py-4 space-y-1.5 overflow-y-auto">
                {visibleMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-md glow-indigo"
                          : "text-gray-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/5"
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-gray-200 dark:border-white/5 space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Setor</span>
                  <select
                    value={currentSector}
                    onChange={(e) => onSectorChange(e.target.value as Sector)}
                    className="w-full bg-slate-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-lg p-2 text-xs font-bold text-gray-800 dark:text-white"
                  >
                    {Object.values(Sector).map((sec) => (
                      <option key={sec} value={sec}>{sectorNames[sec]}</option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center space-x-2 text-xs font-bold text-red-500 p-2 rounded-lg"
                >
                  <LogOut size={14} />
                  <span>Sair</span>
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
          </div>
        )}

        {/* WORKSPACE CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>

      </div>

    </div>
  );
}
