import { useState, useEffect } from "react";
import { Role, Sector, ThemePreference } from "./types";

// Components & Views imports
import LandingPage from "./features/LandingPage";
import SurveyForm from "./features/SurveyForm";
import JuryPanel from "./features/JuryPanel";
import AppLayout from "./features/AppLayout";
import Auth from "./features/Auth";
import ExecutiveDashboard from "./features/ExecutiveDashboard";
import IndustryDashboards from "./features/IndustryDashboards";
import FinanceManagement from "./features/FinanceManagement";
import CRM from "./features/CRM";
import Documents from "./features/Documents";
import FundingReadiness from "./features/FundingReadiness";
import AICenter from "./features/AICenter";
import KnowledgeHub from "./features/KnowledgeHub";

export default function App() {
  const [view, setView] = useState<"landing" | "survey" | "jury" | "app" | "auth">("landing");
  
  // App-level state
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: Role; sector: Sector; organizationName: string } | null>(null);
  const [currentRole, setCurrentRole] = useState<Role>(Role.Owner);
  const [currentSector, setCurrentSector] = useState<Sector>(Sector.Agriculture);
  const [currentTheme, setCurrentTheme] = useState<ThemePreference>(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("olo-theme") as ThemePreference : null;
    return saved || "light";
  });
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [fundingScore, setFundingScore] = useState<number>(55); // Starts intermediate
  const [surveyStats, setSurveyStats] = useState<any>(null);

  // Fetch initial survey statistics
  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setSurveyStats(resData.data);
        }
      })
      .catch((err) => console.error("Error fetching initial survey stats:", err));
  }, []);

  // Apply dark mode theme to document element and persist
  useEffect(() => {
    const isDark = currentTheme === "dark" || 
      (currentTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("olo-theme", currentTheme);
  }, [currentTheme]);

  const handleAuthSuccess = (user: { name: string; email: string; role: Role; sector: Sector; organizationName: string }) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    setCurrentSector(user.sector);
    
    if (user.role === Role.Jury) {
      setView("jury");
    } else {
      setView("app");
      // Set default tab for the role
      const roleTabs: Record<Role, string[]> = {
        [Role.Owner]: ["dashboard", "operations", "finance", "crm", "documents", "funding", "ai", "knowledge"],
        [Role.Manager]: ["dashboard", "operations", "crm", "ai", "knowledge"],
        [Role.FinancialOfficer]: ["dashboard", "finance", "documents", "funding", "ai"],
        [Role.Analyst]: ["dashboard", "finance", "documents", "funding"],
        [Role.Consultant]: ["dashboard", "operations", "finance", "crm", "funding", "ai"],
        [Role.Member]: ["operations", "knowledge"],
        [Role.Jury]: []
      };
      const allowed = roleTabs[user.role];
      if (allowed && allowed.length > 0) {
        setActiveTab(allowed[0]);
      }
    }
  };

  // Sync role and active tabs safely (RBAC check for active tab)
  const handleRoleChange = (role: Role) => {
    setCurrentRole(role);
    
    // If we transition to Jury role, swap view entirely to the Jury Validation Panel!
    if (role === Role.Jury) {
      setView("jury");
      return;
    }

    // Role boundary checks for active tabs
    const roleTabs: Record<Role, string[]> = {
      [Role.Owner]: ["dashboard", "operations", "finance", "crm", "documents", "funding", "ai", "knowledge"],
      [Role.Manager]: ["dashboard", "operations", "crm", "ai", "knowledge"],
      [Role.FinancialOfficer]: ["dashboard", "finance", "documents", "funding", "ai"],
      [Role.Analyst]: ["dashboard", "finance", "documents", "funding"],
      [Role.Consultant]: ["dashboard", "operations", "finance", "crm", "funding", "ai"],
      [Role.Member]: ["operations", "knowledge"],
      [Role.Jury]: []
    };

    const allowed = roleTabs[role];
    if (allowed && allowed.length > 0 && !allowed.includes(activeTab)) {
      setActiveTab(allowed[0]);
    }
  };

  // Helper to render layout content depending on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <ExecutiveDashboard 
            sector={currentSector} 
            score={fundingScore} 
            onNavigate={(tab) => setActiveTab(tab)} 
          />
        );
      case "operations":
        return <IndustryDashboards sector={currentSector} />;
      case "finance":
        return <FinanceManagement />;
      case "crm":
        return <CRM />;
      case "documents":
        return <Documents />;
      case "funding":
        return (
          <FundingReadiness 
            sector={currentSector} 
            score={fundingScore} 
            onScoreChange={(score) => setFundingScore(score)} 
          />
        );
      case "ai":
        return <AICenter sector={currentSector} score={fundingScore} />;
      case "knowledge":
        return <KnowledgeHub />;
      default:
        return <ExecutiveDashboard sector={currentSector} score={fundingScore} onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="font-sans antialiased text-gray-900 dark:text-zinc-100 min-h-screen bg-slate-50 dark:bg-[#050508] relative overflow-x-hidden transition-colors duration-200">
      
      {/* Immersive Theme Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none z-0 opacity-0 dark:opacity-100 transition-opacity duration-1000"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-900/10 rounded-full blur-[120px] pointer-events-none z-0 opacity-0 dark:opacity-100 transition-opacity duration-1000"></div>

      <div className="relative z-10 min-h-screen">
        {view === "landing" && (
          <LandingPage 
            stats={surveyStats}
            onStartSurvey={() => setView("survey")} 
            onLoginClick={() => setView("auth")}
          />
        )}

        {view === "auth" && (
          <Auth 
            onBack={() => setView("landing")}
            onAuthSuccess={handleAuthSuccess}
          />
        )}

        {view === "survey" && (
          <SurveyForm 
            stats={surveyStats}
            onSuccess={(updatedStats, preselectedSector) => {
              setSurveyStats(updatedStats);
              const foundSector = Object.values(Sector).find(
                (s) => s.toLowerCase() === preselectedSector.toLowerCase()
              );
              if (foundSector) {
                setCurrentSector(foundSector);
              }
              setCurrentRole(Role.Jury);
              setView("jury");
            }} 
            onCancel={() => setView("landing")} 
          />
        )}

        {view === "jury" && (
          <JuryPanel 
            stats={surveyStats}
            onExit={() => {
              setCurrentUser(null);
              setView("landing");
            }} 
            onLoginAsOwner={() => {
              // Direct login mock test as Owner
              const mockOwner = {
                name: "António Fula",
                email: "owner@olo.ao",
                role: Role.Owner,
                sector: Sector.Agriculture,
                organizationName: "Cooperativa Agrícola do Huambo"
              };
              setCurrentUser(mockOwner);
              setCurrentRole(Role.Owner);
              setCurrentSector(Sector.Agriculture);
              setView("app");
              setActiveTab("dashboard");
            }}
          />
        )}

        {view === "app" && (
          <AppLayout
            currentRole={currentRole}
            onRoleChange={handleRoleChange}
            currentSector={currentSector}
            onSectorChange={setCurrentSector}
            currentTheme={currentTheme}
            onThemeChange={setCurrentTheme}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={() => {
              setCurrentUser(null);
              setView("landing");
            }}
            currentUser={currentUser}
          >
            {renderTabContent()}
          </AppLayout>
        )}
      </div>

    </div>
  );
}
