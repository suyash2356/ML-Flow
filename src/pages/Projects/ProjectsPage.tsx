import { useState } from 'react';
import type { Project } from '../../types';
import './ProjectsPage.css';

interface ProjectsPageProps {
  projects: Project[];
  onOpenWorkspace: (project: Project) => void;
  onCreateProject: () => void;
}

export function ProjectsPage({ projects, onOpenWorkspace, onCreateProject }: ProjectsPageProps) {
  const [activeTab, setActiveTab] = useState<'All' | 'EDA' | 'ML' | 'DL'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter((p) => {
    const matchesTab = activeTab === 'All' || p.type === activeTab;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.datasetName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="projects-page">
      {/* Top Header & Actions */}
      <div className="projects-header">
        <div>
          <h1 className="projects-title">Workspaces & Projects</h1>
          <p className="projects-subtitle">
            Manage your visual machine learning pipelines across EDA, Classical ML, and Deep Learning models.
          </p>
        </div>
        <button className="projects-new-btn" onClick={onCreateProject}>
          + New Project
        </button>
      </div>

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
      <div className="projects-grid">
        {filteredProjects.map((project) => (
          <div key={project.id} className="project-card" onClick={() => onOpenWorkspace(project)}>
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
              <span className="open-link">Open Workspace →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
