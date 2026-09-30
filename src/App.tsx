import { useEffect, useState } from 'react';
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
import { ProjectDetail } from './pages/Projects/ProjectDetail';
import { useAuth } from './components/Auth/AuthContext';
import { createProject, listProjects, type NewProject } from './services/projects';
import type { NavigationPage, Project, DatasetItem } from './types';

function App() {
  const { session, signOut } = useAuth();
  const [activeNavId, setActiveNavId] = useState<NavigationPage>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState('');
  const [currentProject, setCurrentProject] = useState<Project | undefined>();

  useEffect(() => {
    let active = true;

    listProjects(session.user.id)
      .then((loadedProjects) => {
        if (active) setProjects(loadedProjects);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setProjectsError(error instanceof Error ? error.message : 'Unable to load projects.');
      })
      .finally(() => {
        if (active) setProjectsLoading(false);
      });

    return () => { active = false; };
  }, [session.user.id]);

  const handleNavSelect = (id: NavigationPage) => {
    setActiveNavId(id);
  };

  const handleOpenWorkspace = (proj?: Project) => {
    if (proj) {
      setCurrentProject(proj);
      setProjects((current) => current.some((project) => project.id === proj.id) ? current : [proj, ...current]);
    }
    setActiveNavId('workspace');
  };

  const handleOpenProjectDetail = (proj: Project) => {
    setCurrentProject(proj);
    setActiveNavId('project_detail');
  };

  const handleCreateProject = async (project: NewProject) => {
    const createdProject = await createProject(session.user.id, project);
    setProjects((current) => [createdProject, ...current]);
    handleOpenProjectDetail(createdProject);
  };

  const handleProjectUpdated = (updatedProject: Project) => {
    setProjects((current) => current.map((project) => project.id === updatedProject.id ? updatedProject : project));
    setCurrentProject((current) => current?.id === updatedProject.id ? updatedProject : current);
  };

  const reloadProjects = () => {
    setProjectsLoading(true);
    setProjectsError('');
    void listProjects(session.user.id)
      .then(setProjects)
      .catch((error: unknown) => setProjectsError(error instanceof Error ? error.message : 'Unable to load projects.'))
      .finally(() => setProjectsLoading(false));
  };

  const handleStartTemplateProject = (type: 'EDA' | 'ML' | 'DL') => {
    void createProject(session.user.id, {
      name: `New ${type} Pipeline Workspace`,
      type,
      description: `Visual ${type} workflow generated from template.`,
    }).then((project) => {
      setProjects((current) => [project, ...current]);
      setCurrentProject(project);
      setActiveNavId('workspace');
    }).catch((error: unknown) => {
      window.alert(error instanceof Error ? error.message : 'Unable to create project.');
    });
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
            isLoading={projectsLoading}
            error={projectsError}
            onRetry={reloadProjects}
            onOpenProjectDetail={handleOpenProjectDetail}
            onAddProject={handleCreateProject}
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
        return <WorkspacePage project={currentProject} onNavigate={handleNavSelect} onProjectUpdated={handleProjectUpdated} />;
      case 'project_detail':
        return currentProject ? (
          <ProjectDetail 
            project={currentProject} 
            onNavigate={handleNavSelect} 
            onOpenWorkspace={handleOpenWorkspace} 
            onBack={() => handleNavSelect('projects')}
          />
        ) : (
          <ProjectsPage
            projects={projects}
            isLoading={projectsLoading}
            error={projectsError}
            onRetry={reloadProjects}
            onOpenProjectDetail={handleOpenProjectDetail}
            onAddProject={handleCreateProject}
          />
        );
      case 'profile':
        return <ProfilePage onNavigate={handleNavSelect} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <DashboardPage
            projects={projects}
            onOpenWorkspace={handleOpenWorkspace}
          />
        );
    }
  };

  if (activeNavId === 'workspace') {
    return <WorkspacePage project={currentProject} onNavigate={handleNavSelect} onProjectUpdated={handleProjectUpdated} />;
  }

  const initials = (session.user.email || 'U').slice(0, 2).toUpperCase();
  return (
    <AppLayout
      activeNavId={activeNavId}
      onNavSelect={handleNavSelect}
      userInitials={initials}
      onSignOut={() => void signOut()}
    >
      {renderPage()}
    </AppLayout>
  );

}

export default App;
