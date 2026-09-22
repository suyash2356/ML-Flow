import type { LearningStage, LearningModuleNode } from '../../types';
import './LearningPathRail.css';

interface LearningPathRailProps {
  stages: LearningStage[];
  activeModuleId?: string;
  onSelectModule: (module: LearningModuleNode) => void;
}

export function LearningPathRail({
  stages,
  activeModuleId,
  onSelectModule,
}: LearningPathRailProps) {
  return (
    <aside className="learning-path-rail">
      <div className="learning-path-rail__header">
        <h3 className="learning-path-rail__title">🗺️ Learning Path Roadmap</h3>
        <span className="learning-path-rail__subtitle">Sequential Curriculum</span>
      </div>

      <div className="learning-path-rail__stages">
        {stages.map((stage, sIdx) => (
          <div key={stage.id} className="learning-path-stage">
            <div className="learning-path-stage__header">
              <span className="learning-path-stage__number">{sIdx + 1}</span>
              <div className="learning-path-stage__titles">
                <strong>{stage.title}</strong>
                <small>{stage.subtitle}</small>
              </div>
            </div>

            <div className="learning-path-stage__nodes">
              {stage.modules.map((mod) => {
                const isActive = activeModuleId === mod.id || activeModuleId === mod.encyclopediaId;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    className={`learning-path-node ${
                      isActive ? 'learning-path-node--active' : ''
                    } ${mod.completed ? 'learning-path-node--completed' : ''} ${
                      mod.locked ? 'learning-path-node--locked' : ''
                    }`}
                    onClick={() => onSelectModule(mod)}
                    disabled={mod.locked}
                  >
                    <div className="learning-path-node__status-icon">
                      {mod.completed ? '✓' : mod.locked ? '🔒' : '○'}
                    </div>

                    <div className="learning-path-node__info">
                      <span className="learning-path-node__title">{mod.title}</span>
                      <div className="learning-path-node__meta">
                        <span>⏱️ {mod.estimatedMinutes}m</span>
                        <span>•</span>
                        <span className={`learning-path-node__diff learning-path-node__diff--${mod.difficulty.toLowerCase()}`}>
                          {mod.difficulty}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
