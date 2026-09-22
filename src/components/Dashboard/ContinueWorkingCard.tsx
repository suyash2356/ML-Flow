import type { Project } from '../../types';
import './ContinueWorkingCard.css';

interface ContinueWorkingCardProps {
  project?: Project;
  onOpenWorkspace: (project: Project) => void;
}

export function ContinueWorkingCard({
  project,
  onOpenWorkspace,
}: ContinueWorkingCardProps) {
  if (!project) return null;

  return (
    <div className="continue-working-card">
      <div className="continue-working-card__header">
        <span className="continue-working-card__badge">⚡ Continue Working</span>
        <span className="continue-working-card__type">{project.type}</span>
      </div>

      <h4 className="continue-working-card__title">{project.name}</h4>
      <p className="continue-working-card__desc">{project.description}</p>

      <div className="continue-working-card__meta">
        <span>📁 {project.datasetName}</span>
        <span>•</span>
        <span>{project.nodesCount} nodes</span>
        {project.accuracy && (
          <>
            <span>•</span>
            <span className="continue-working-card__acc">Acc: {project.accuracy}</span>
          </>
        )}
      </div>

      <button
        type="button"
        className="continue-working-card__btn"
        onClick={() => onOpenWorkspace(project)}
      >
        Open Workspace →
      </button>
    </div>
  );
}
