import { MOCK_DL_MODULES } from '../../config/mockData';
import type { NavigationPage, Project } from '../../types';
import './DLPage.css';

interface DLPageProps {
  onNavigate: (page: NavigationPage) => void;
  onStartDLProject: () => void;
  onOpenWorkspace: (project: Project) => void;
}

export function DLPage({ onStartDLProject }: DLPageProps) {
  return (
    <div className="dl-page">
      {/* Header / Hero */}
      <div className="dl-hero">
        <div className="dl-hero__text">
          <span className="dl-hero__badge">Deep Learning Lab</span>
          <h1 className="dl-hero__title">Design Neural Network Architectures</h1>
          <p className="dl-hero__desc">
            Construct Multi-Layer Perceptrons, Convolutional Neural Networks (CNNs), and Transformer blocks visually with live tensor dimensions.
          </p>
        </div>
        <button className="dl-hero__cta-btn" onClick={onStartDLProject}>
          <span className="cta-icon">+</span> Start DL Project
        </button>
      </div>

      {/* Learning & Documentation Modules */}
      <section className="dl-section">
        <div className="dl-section__header">
          <h2 className="dl-section__title">Deep Learning Guides & Architecture Documentation</h2>
          <span className="dl-section__subtitle">Neural network fundamentals, activation functions, and layer stacking</span>
        </div>

        <div className="dl-grid">
          {MOCK_DL_MODULES.map((module) => (
            <div key={module.id} className="dl-card">
              <div className="dl-card__badge">{module.difficulty} • {module.estimatedMinutes} mins</div>
              <h3 className="dl-card__title">{module.title}</h3>
              <p className="dl-card__summary">{module.summary}</p>

              <div className="dl-card__topics">
                {module.topics.map((t) => (
                  <span key={t} className="dl-topic-tag">#{t}</span>
                ))}
              </div>

              <button className="dl-card__action-btn" onClick={onStartDLProject}>
                Explore DL Template →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Model Templates */}
      <section className="dl-section">
        <div className="dl-section__header">
          <h2 className="dl-section__title">DL Starter Architectures</h2>
        </div>
        <div className="dl-templates-row">
          <div className="dl-template-box" onClick={onStartDLProject}>
            <div className="dl-template-icon">🧬</div>
            <h4>Multi-Layer Perceptron (MLP) Classifier</h4>
            <p>Dense input layer $\rightarrow$ ReLU activation $\rightarrow$ Softmax output for multi-class classification.</p>
            <button className="template-launch-btn">Use Template</button>
          </div>
          <div className="dl-template-box" onClick={onStartDLProject}>
            <div className="dl-template-icon">🖼️</div>
            <h4>Convolutional Image Backbone (CNN)</h4>
            <p>Conv2D $\rightarrow$ BatchNorm $\rightarrow$ MaxPooling2D $\rightarrow$ Flatten $\rightarrow$ Dense.</p>
            <button className="template-launch-btn">Use Template</button>
          </div>
        </div>
      </section>
    </div>
  );
}
