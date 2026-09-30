import { useState } from 'react';
import type { Project } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { Modal } from '../../components/Modal';
import { EmptyState } from '../../components/StateComponents';
import type { NewProject } from '../../services/projects';
import './ProjectsPage.css';

interface ProjectsPageProps {
  projects: Project[];
  isLoading: boolean;
  error: string;
  onRetry: () => void;
  onOpenProjectDetail: (project: Project) => void;
  onAddProject: (project: NewProject) => Promise<void>;
}

export function ProjectsPage({ projects, isLoading, error, onRetry, onOpenProjectDetail, onAddProject }: ProjectsPageProps) {
  const [activeTab, setActiveTab] = useState<'All' | 'EDA' | 'ML' | 'DL'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [newProject, setNewProject] = useState<{name: string; description: string; type: 'EDA' | 'ML' | 'DL'}>({ name: '', description: '', type: 'ML' });

  const filteredProjects = projects.filter((p) => {
    const matchesTab = activeTab === 'All' || p.type === activeTab;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.datasetName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleCreateProject = async () => {
    if (!newProject.name.trim() || isSaving) return;
    setIsSaving(true);
    setSaveError('');
    try {
      await onAddProject(newProject);
      setIsModalOpen(false);
      setNewProject({ name: '', description: '', type: 'ML' });
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unable to create project.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="projects-page">
      <PageHeader 
        title="Workspaces & Projects"
        description="Manage your visual machine learning pipelines across EDA, Classical ML, and Deep Learning models."
        actions={
            <button className="btn-primary" onClick={() => { setSaveError(''); setIsModalOpen(true); }}>
            + New Project
          </button>
        }
      />

      {/* Controls Bar: Tabs & Search */}
      <div className="projects-controls">
        <div className="projects-tabs">
          {(['All', 'EDA', 'ML', 'DL'] as const).map((tab) => (
            <button
              key={tab}
              className={`projects-tab ${activeTab === tab ? 'projects-tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab} Projects
              <span className="projects-tab-count">
                {tab === 'All' ? projects.length : projects.filter((p) => p.type === tab).length}
              </span>
            </button>
          ))}
        </div>

        <div className="projects-search-box">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Projects Grid */}
      {error ? (
        <div className="projects-data-state" role="alert">
          <p>Projects could not be loaded: {error}</p>
          <button className="btn-secondary" onClick={onRetry}>Retry</button>
        </div>
      ) : isLoading ? (
        <p className="projects-data-state" role="status">Loading your projects...</p>
      ) : filteredProjects.length === 0 ? (
        <EmptyState title="No projects yet" description="Create a project to start building a saved ML workflow." />
      ) : (
      <div className="projects-grid">
        {filteredProjects.map((project) => (
          <div key={project.id} className="project-card" onClick={() => onOpenProjectDetail(project)}>
            <div className="project-card__top">
              <span className={`project-type-tag project-type-tag--${project.type.toLowerCase()}`}>
                {project.type}
              </span>
              <span className={`project-status-tag project-status-tag--${project.status.toLowerCase().replace(' ', '-')}`}>
                {project.status}
              </span>
            </div>

            <h3 className="project-card__title">{project.name}</h3>
            <p className="project-card__desc">{project.description}</p>

            <div className="project-card__meta">
              <div className="meta-item">
                <span className="meta-label">Dataset:</span>
                <span className="meta-value">{project.datasetName}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Nodes:</span>
                <span className="meta-value">{project.nodesCount}</span>
              </div>
              {project.accuracy && (
                <div className="meta-item">
                  <span className="meta-label">Accuracy:</span>
                  <span className="meta-value meta-value--highlight">{project.accuracy}</span>
                </div>
              )}
            </div>

            <div className="project-card__footer">
              <span className="last-modified">Edited {project.lastModified}</span>
              <span className="open-link">Open Project →</span>
            </div>
          </div>
        ))}
      </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Create New Project"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={() => void handleCreateProject()} disabled={!newProject.name.trim() || isSaving}>{isSaving ? 'Creating...' : 'Create Project'}</button>
          </>
        }
      >
        <div className="form-group">
          <label htmlFor="projectName">Project Name <span style={{color: 'var(--color-error)'}}>*</span></label>
          <input 
            id="projectName"
            type="text" 
            className="form-input" 
            placeholder="e.g. Customer Churn Prediction" 
            value={newProject.name}
            onChange={e => setNewProject({...newProject, name: e.target.value})}
            autoFocus
          />
        </div>
        {saveError && <p className="projects-form-error" role="alert">{saveError}</p>}
        <div className="form-group">
          <label htmlFor="projectDesc">Description</label>
          <textarea 
            id="projectDesc"
            className="form-input" 
            placeholder="Briefly describe the goal of this project..." 
            value={newProject.description}
            onChange={e => setNewProject({...newProject, description: e.target.value})}
            rows={3}
          />
        </div>
        <div className="form-group">
          <label htmlFor="projectType">Project Type</label>
          <select 
            id="projectType"
            className="form-input" 
            value={newProject.type}
            onChange={e => setNewProject({...newProject, type: e.target.value as 'EDA' | 'ML' | 'DL'})}
          >
            <option value="EDA">Exploratory Data Analysis (EDA)</option>
            <option value="ML">Classical Machine Learning (ML)</option>
            <option value="DL">Deep Learning (DL)</option>
          </select>
        </div>
      </Modal>
    </div>
  );
}
