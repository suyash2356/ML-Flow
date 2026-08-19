import { useState } from 'react';
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { EDAPage } from './pages/EDA/EDAPage';
import { MLPage } from './pages/ML/MLPage';
import { DLPage } from './pages/DL/DLPage';
import { ProjectsPage } from './pages/Projects/ProjectsPage';
import { DatasetsPage } from './pages/Datasets/DatasetsPage';
import { WorkspacePage } from './pages/Workspace/WorkspacePage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { MOCK_PROJECTS, MOCK_DATASETS } from './config/mockData';
import type { NavigationPage, Project, DatasetItem } from './types';

function App() {
  const [activeNavId, setActiveNavId] = useState<NavigationPage>('dashboard');
  const [projects] = useState<Project[]>(MOCK_PROJECTS);
  const [datasets] = useState<DatasetItem[]>(MOCK_DATASETS);
  const [currentProject, setCurrentProject] = useState<Project | undefined>(MOCK_PROJECTS[0]);

  const handleNavSelect = (id: NavigationPage) => {
    setActiveNavId(id);
  };

  const handleOpenWorkspace = (proj?: Project) => {
    if (proj) {
      setCurrentProject(proj);
    }
    setActiveNavId('workspace');
  };

  const handleStartTemplateProject = (type: 'EDA' | 'ML' | 'DL') => {
    const templateProj: Project = {
      id: `proj-${Date.now()}`,
      name: `New ${type} Pipeline Workspace`,
      type: type,
      description: `Visual ${type} workflow generated from template.`,
      datasetName: datasets[0]?.name || 'churn_data_preprocessed.csv',
      lastModified: 'Just now',
      status: 'In Progress',
      nodesCount: type === 'EDA' ? 3 : type === 'ML' ? 6 : 5,
    };
    setCurrentProject(templateProj);
    setActiveNavId('workspace');
  };

  const handleStartProjectFromDataset = (ds: DatasetItem, type: 'EDA' | 'ML' | 'DL' = 'EDA') => {
    const dsProj: Project = {
      id: `proj-${Date.now()}`,
      name: `${ds.name.replace(/\.[^/.]+$/, '')} Analysis`,
      type,
      description: `${type} pipeline attached to ${ds.name}`,
      datasetName: ds.name,
      lastModified: 'Just now',
      status: 'In Progress',
      nodesCount: type === 'EDA' ? 4 : type === 'ML' ? 6 : 5,
    };
    setCurrentProject(dsProj);
    setActiveNavId('workspace');
  };

  const renderPage = () => {
    switch (activeNavId) {
      case 'dashboard':
        return (
          <DashboardPage
            projects={projects}
            datasets={datasets}
            onNavigate={handleNavSelect}
            onOpenWorkspace={handleOpenWorkspace}
          />
        );
      case 'eda':
        return (
          <EDAPage
            onNavigate={handleNavSelect}
            onStartEDAProject={() => handleStartTemplateProject('EDA')}
            onOpenWorkspace={handleOpenWorkspace}
          />
        );
      case 'ml':
        return (
          <MLPage
            onNavigate={handleNavSelect}
            onStartMLProject={() => handleStartTemplateProject('ML')}
            onOpenWorkspace={handleOpenWorkspace}
          />
        );
      case 'dl':
        return (
          <DLPage
            onNavigate={handleNavSelect}
            onStartDLProject={() => handleStartTemplateProject('DL')}
            onOpenWorkspace={handleOpenWorkspace}
          />
        );
      case 'projects':
        return (
          <ProjectsPage
            projects={projects}
            onOpenWorkspace={handleOpenWorkspace}
            onCreateProject={() => handleStartTemplateProject('ML')}
          />
        );
      case 'datasets':
        return (
          <DatasetsPage
            onStartProjectFromDataset={handleStartProjectFromDataset}
            onNavigate={handleNavSelect}
          />
        );
      case 'workspace':
        return <WorkspacePage project={currentProject} onNavigate={handleNavSelect} />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavSelect} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <DashboardPage
            projects={projects}
            datasets={datasets}
            onNavigate={handleNavSelect}
            onOpenWorkspace={handleOpenWorkspace}
          />
        );
    }
  };

  if (activeNavId === 'workspace') {
    return <WorkspacePage project={currentProject} onNavigate={handleNavSelect} />;
  }

  return <AppLayout activeNavId={activeNavId} onNavSelect={handleNavSelect}>{renderPage()}</AppLayout>;

}

export default App;
