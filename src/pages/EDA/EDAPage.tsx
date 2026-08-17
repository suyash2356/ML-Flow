import { MOCK_EDA_MODULES } from '../../config/mockData';
import type { NavigationPage, Project } from '../../types';
import './EDAPage.css';

interface EDAPageProps {
  onNavigate: (page: NavigationPage) => void;
  onStartEDAProject: () => void;
  onOpenWorkspace: (project: Project) => void;
}

export function EDAPage({ onStartEDAProject }: EDAPageProps) {
  return (
    <div className="eda-page">
      {/* Header / Hero */}
      <div className="eda-hero">
        <div className="eda-hero__text">
          <span className="eda-hero__badge">Exploratory Data Analysis</span>
          <h1 className="eda-hero__title">Understand & Clean Your Data Visually</h1>
          <p className="eda-hero__desc">
            Profile dataset statistics, detect null patterns, visualize correlations, and generate automated feature insights before training ML models.
          </p>
        </div>
        <button className="eda-hero__cta-btn" onClick={onStartEDAProject}>
          <span className="cta-icon">+</span> Start EDA Project
        </button>
      </div>

      {/* Learning & Documentation Modules */}
      <section className="eda-section">
        <div className="eda-section__header">
          <h2 className="eda-section__title">EDA Guides & Documentation</h2>
          <span className="eda-section__subtitle">Master interactive visual data exploration</span>
        </div>

        <div className="eda-grid">
          {MOCK_EDA_MODULES.map((module) => (
            <div key={module.id} className="eda-card">
              <div className="eda-card__badge">{module.difficulty} • {module.estimatedMinutes} mins</div>
              <h3 className="eda-card__title">{module.title}</h3>
              <p className="eda-card__summary">{module.summary}</p>

              <div className="eda-card__topics">
                {module.topics.map((t) => (
                  <span key={t} className="eda-topic-tag">#{t}</span>
                ))}
              </div>

              <button className="eda-card__action-btn" onClick={onStartEDAProject}>
                Explore Module Template →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Starter Pipelines */}
      <section className="eda-section">
        <div className="eda-section__header">
          <h2 className="eda-section__title">Preset EDA Templates</h2>
        </div>
        <div className="eda-templates-row">
          <div className="eda-template-box" onClick={onStartEDAProject}>
            <div className="eda-template-icon">📈</div>
            <h4>Automated Data Hygiene & Profiler</h4>
            <p>Runs missing matrix, data type check, and outlier detection automatically.</p>
            <button className="template-launch-btn">Use Template</button>
          </div>
          <div className="eda-template-box" onClick={onStartEDAProject}>
            <div className="eda-template-icon">🔥</div>
            <h4>Correlation & Multicollinearity Heatmap</h4>
            <p>Calculates Pearson/Spearman matrix to identify redundant features.</p>
            <button className="template-launch-btn">Use Template</button>
          </div>
        </div>
      </section>
    </div>
  );
}
