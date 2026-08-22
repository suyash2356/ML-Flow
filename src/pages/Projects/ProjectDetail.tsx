import { useState } from 'react';
import type { NavigationPage, Project } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { StatCard } from '../../components/StatCard';
import { EmptyState } from '../../components/StateComponents';
import './ProjectDetail.css';

interface ProjectDetailProps {
  project: Project;
  onNavigate: (id: NavigationPage) => void;
  onOpenWorkspace: (project: Project) => void;
  onBack: () => void;
}

export function ProjectDetail({ project, onNavigate, onOpenWorkspace, onBack }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Datasets' | 'EDA' | 'ML' | 'DL' | 'Runs'>('Overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="project-detail__overview">
            <div className="project-detail__stats">
              <StatCard title="Total Nodes" value={project.nodesCount} icon={<span>⚡</span>} />
              <StatCard title="Dataset" value={project.datasetName.split('.')[0]} icon={<span>📊</span>} />
              <StatCard title="Last Modified" value={project.lastModified} icon={<span>🕒</span>} />
              <StatCard title="Status" value={project.status} icon={<span>✓</span>} />
            </div>
            
            <div className="project-detail__section">
              <h3>Recent Activity</h3>
              <EmptyState 
                title="No recent activity" 
                description="This project doesn't have any recent runs or modifications."
              />
            </div>
          </div>
        );
      case 'Datasets':
      case 'EDA':
      case 'ML':
      case 'DL':
      case 'Runs':
      default:
        return (
          <div className="project-detail__section">
            <EmptyState 
              title={`${activeTab} Not Found`} 
              description={`The ${activeTab.toLowerCase()} section is currently empty or hasn't been configured yet.`}
              action={<button className="btn-primary" onClick={() => onNavigate(activeTab.toLowerCase() as NavigationPage)}>Go to {activeTab}</button>}
            />
          </div>
        );
    }
  };

  return (
    <div className="project-detail">
      <PageHeader
        title={project.name}
        description={project.description}
        breadcrumbs={[
          { label: 'Projects', onClick: onBack },
          { label: project.name }
        ]}
        actions={
          <button className="btn-primary" onClick={() => onOpenWorkspace(project)}>
            Open Workspace
          </button>
        }
      />

      <div className="project-detail__tabs">
        {(['Overview', 'Datasets', 'EDA', 'ML', 'DL', 'Runs'] as const).map(tab => (
          <button
            key={tab}
            className={`project-detail__tab ${activeTab === tab ? 'project-detail__tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="project-detail__content">
        {renderTabContent()}
      </div>
    </div>
  );
}
