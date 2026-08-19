import { useState } from 'react';
import { ProjectMenu } from '../ProjectMenu/ProjectMenu';
import type { NavigationPage, Project } from '../../types';
import './ProjectHeader.css';

interface Props {
  project?: Project;
  name: string;
  onNameChange: (name: string) => void;
  onRunNode: () => void;
  onRunFlow: () => void;
  canRunNode: boolean;
  onAction: (action: string) => void;
  onNavigate?: (page: NavigationPage) => void;
}

export function ProjectHeader({
  project,
  name,
  onNameChange,
  onRunNode,
  onRunFlow,
  canRunNode,
  onAction,
  onNavigate,
}: Props) {
  const [editing, setEditing] = useState(false);

  return (
    <header className="project-header">
      <div className="project-header__crumbs">
        <button
          type="button"
          className="project-header__crumb-link"
          onClick={() => onNavigate?.('dashboard')}
          title="Go to Home Dashboard"
        >
          ML Flow
        </button>
        <i>/</i>
        <button
          type="button"
          className="project-header__crumb-link"
          onClick={() => onNavigate?.('projects')}
          title="Go to Projects Page"
        >
          Pipeline Builder Workspace
        </button>
        <i>/</i>
        {editing ? (
          <input
            autoFocus
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setEditing(false)}
          />
        ) : (
          <button
            type="button"
            className="project-header__name"
            onDoubleClick={() => setEditing(true)}
            onClick={() => setEditing(true)}
            title="Click to rename project"
          >
            {name}
          </button>
        )}
        <small
          className="project-header__dataset-link"
          onClick={() => onNavigate?.('datasets')}
          title="View Datasets"
        >
          {project?.datasetName || 'No dataset attached'}
        </small>
      </div>

      <div className="project-header__right">
        <button className="project-btn" disabled={!canRunNode} onClick={onRunNode}>
          Run current node
        </button>
        <button className="project-btn project-btn--primary" onClick={onRunFlow}>
          Run complete flow
        </button>
        <ProjectMenu onAction={onAction} />
      </div>
    </header>
  );
}

