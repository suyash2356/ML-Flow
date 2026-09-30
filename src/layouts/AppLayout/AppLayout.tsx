import { useState, type ReactNode } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { APP_CONFIG } from '../../config/constants';
import type { NavigationPage } from '../../types';
import './AppLayout.css';

interface AppLayoutProps {
  activeNavId: NavigationPage;
  onNavSelect: (id: NavigationPage) => void;
  userInitials: string;
  onSignOut: () => void;
  children: ReactNode;
}

export function AppLayout({ activeNavId, onNavSelect, userInitials, onSignOut, children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={`app-layout ${sidebarCollapsed ? 'app-layout--sidebar-collapsed' : ''}`}>
      <Sidebar
        activeNavId={activeNavId}
        onNavSelect={onNavSelect}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      <div className="app-layout__main">
        <Header
          activeNavId={activeNavId}
          userInitials={userInitials || APP_CONFIG.userInitials}
          onProfileOpen={() => onNavSelect('profile')}
          onSignOut={onSignOut}
        />
        <main className="app-layout__content">{children}</main>
      </div>
    </div>
  );
}
