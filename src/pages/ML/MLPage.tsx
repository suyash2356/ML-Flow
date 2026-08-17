import { MOCK_ML_MODULES } from '../../config/mockData';
import type { NavigationPage, Project } from '../../types';
import './MLPage.css';

interface MLPageProps {
  onNavigate: (page: NavigationPage) => void;
  onStartMLProject: () => void;
  onOpenWorkspace: (project: Project) => void;
}

export function MLPage({ onStartMLProject }: MLPageProps) {
  return (
    <div className="ml-page">
      {/* Header / Hero */}
      <div className="ml-hero">
        <div className="ml-hero__text">
          <span className="ml-hero__badge">Machine Learning Studio</span>
          <h1 className="ml-hero__title">Train & Compare Classical ML Models Visually</h1>
          <p className="ml-hero__desc">
            Build classification and regression workflows without code. Interactively tune hyperparameters for Random Forest, XGBoost, and Support Vector Machines.
          </p>
        </div>
        <button className="ml-hero__cta-btn" onClick={onStartMLProject}>
          <span className="cta-icon">+</span> Start ML Project
        </button>
      </div>

      {/* Learning & Documentation Modules */}
      <section className="ml-section">
        <div className="ml-section__header">
          <h2 className="ml-section__title">Machine Learning Guides & Concepts</h2>
          <span className="ml-section__subtitle">Core algorithms, validation strategies, and hyperparameter optimization</span>
        </div>

        <div className="ml-grid">
          {MOCK_ML_MODULES.map((module) => (
            <div key={module.id} className="ml-card">
              <div className="ml-card__badge">{module.difficulty} • {module.estimatedMinutes} mins</div>
              <h3 className="ml-card__title">{module.title}</h3>
              <p className="ml-card__summary">{module.summary}</p>

              <div className="ml-card__topics">
                {module.topics.map((t) => (
                  <span key={t} className="ml-topic-tag">#{t}</span>
                ))}
              </div>

              <button className="ml-card__action-btn" onClick={onStartMLProject}>
                Explore ML Template →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Model Templates */}
      <section className="ml-section">
        <div className="ml-section__header">
          <h2 className="ml-section__title">ML Starter Templates</h2>
        </div>
        <div className="ml-templates-row">
          <div className="ml-template-box" onClick={onStartMLProject}>
            <div className="ml-template-icon">🎯</div>
            <h4>Classification Benchmark Pipeline</h4>
            <p>Compares Random Forest vs. XGBoost vs. SVM with automated F1 and ROC-AUC scoring.</p>
            <button className="template-launch-btn">Use Template</button>
          </div>
          <div className="ml-template-box" onClick={onStartMLProject}>
            <div className="ml-template-icon">🏡</div>
            <h4>Regression & Price Predictor</h4>
            <p>Feature scaling + Gradient Boosting Regressor for continuous numerical targets.</p>
            <button className="template-launch-btn">Use Template</button>
          </div>
        </div>
      </section>
    </div>
  );
}
