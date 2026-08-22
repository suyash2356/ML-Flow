import type { NavigationPage } from '../../types';
import './Header.css';

interface HeaderProps {
  activeNavId: NavigationPage;
  userInitials: string;
  onProfileOpen: () => void;
}

export function Header({ activeNavId, userInitials, onProfileOpen }: HeaderProps) {
  const pageTitleMap: Record<NavigationPage, string> = {
    dashboard: 'Dashboard',
    eda: 'Exploratory Data Analysis',
    ml: 'Machine Learning Studio',
    dl: 'Deep Learning Lab',
    projects: 'Projects & Workspaces',
    project_detail: 'Project Details',
    datasets: 'Datasets & Data Hub',
    workspace: 'Pipeline Builder Workspace',
    profile: 'Developer Portfolio',
    settings: 'Settings & Preferences',
  };

  return (
    <header className="app-header">
      {/* Breadcrumbs */}
      <div className="app-header__breadcrumbs">
        <span className="app-header__crumb">ML Flow</span>
        <span className="app-header__separator">/</span>
        <span className="app-header__crumb app-header__crumb--active">
          {pageTitleMap[activeNavId] || activeNavId}
        </span>
      </div>

      {/* Right controls */}
      <div className="app-header__controls">
        <div className="app-header__search">
          <svg className="app-header__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search projects, datasets, guides..."
            className="app-header__search-input"
          />
        </div>
        <button
          type="button"
          className="app-header__avatar"
          onClick={onProfileOpen}
          title="Open profile"
          aria-label="Open profile"
        >
          {userInitials}
        </button>
      </div>
    </header>
  );
}
