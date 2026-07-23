import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import BackendConnectionManager from '../components/layout/BackendConnectionManager';

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark transition-colors duration-200">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div
        className="transition-all duration-300 lg:ml-[260px]"
        style={{ marginLeft: sidebarCollapsed ? '72px' : undefined }}
      >
        <div className="lg:ml-0 ml-0">
          <Header onMenuClick={() => setMobileOpen(true)} />
          <main className="p-4 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>

      <BackendConnectionManager />
    </div>
  );
}
