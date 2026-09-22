import { useState } from 'react';
import type { DatasetItem, LearningCategory } from '../../types';
import './GuidedProjectWizard.css';

interface GuidedProjectWizardProps {
  category: LearningCategory;
  datasets: DatasetItem[];
  onStartProject: (projectConfig: { name: string; dataset: string; taskType: string }) => void;
}

export function GuidedProjectWizard({
  category,
  datasets,
  onStartProject,
}: GuidedProjectWizardProps) {
  const [mode, setMode] = useState<'guided' | 'expert'>('guided');
  const [step, setStep] = useState<number>(1);
  const [selectedDataset, setSelectedDataset] = useState<string>(datasets[0]?.name || 'churn_data.csv');
  const [taskType, setTaskType] = useState<string>(
    category === 'EDA' ? 'Exploratory Profiling' : category === 'DL' ? 'Image Classification' : 'Binary Classification'
  );
  const [isTraining, setIsTraining] = useState(false);
  const [trainProgress, setTrainProgress] = useState(0);
  const [resultsReady, setResultsReady] = useState(false);

  const taskOptions =
    category === 'EDA'
      ? ['Exploratory Profiling', 'Correlation & Multicollinearity', 'Outlier & Hygiene Audit']
      : category === 'DL'
      ? ['Image Classification (CNN)', 'Sequence Modeling (LSTM)', 'Feature Embeddings']
      : ['Binary Classification', 'Multi-class Classification', 'Continuous Regression'];

  const startTrainingSimulation = () => {
    setIsTraining(true);
    setTrainProgress(10);
    const interval = setInterval(() => {
      setTrainProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          setResultsReady(true);
          return 100;
        }
        return p + 25;
      });
    }, 300);
  };

  return (
    <section className="project-wizard">
      <div className="project-wizard__top">
        <div>
          <h3 className="project-wizard__title">🛠️ Guided Project Builder</h3>
          <span className="project-wizard__subtitle">End-to-End {category} Workflow Wizard</span>
        </div>

        {/* Guided vs Expert Mode Toggle */}
        <div className="project-wizard__toggle-bar">
          <button
            type="button"
            className={`project-wizard__toggle-btn ${mode === 'guided' ? 'project-wizard__toggle-btn--active' : ''}`}
            onClick={() => setMode('guided')}
          >
            🧭 Guided Mode
          </button>
          <button
            type="button"
            className={`project-wizard__toggle-btn ${mode === 'expert' ? 'project-wizard__toggle-btn--active' : ''}`}
            onClick={() => setMode('expert')}
          >
            ⚡ Expert Mode
          </button>
        </div>
      </div>

      {/* Stepper Header */}
      <div className="project-wizard__stepper">
        {[
          { num: 1, label: '1. Select Dataset' },
          { num: 2, label: '2. Task Type' },
          { num: 3, label: '3. Configuration' },
          { num: 4, label: '4. Train Pipeline' },
          { num: 5, label: '5. Results in English' },
          { num: 6, label: '6. Export Workspace' },
        ].map((s) => (
          <div
            key={s.num}
            className={`project-wizard__step-item ${step === s.num ? 'project-wizard__step-item--active' : ''} ${
              step > s.num ? 'project-wizard__step-item--passed' : ''
            }`}
            onClick={() => s.num < step && setStep(s.num)}
          >
            <span className="project-wizard__step-badge">{step > s.num ? '✓' : s.num}</span>
            <span className="project-wizard__step-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Step Contents */}
      <div className="project-wizard__content">
        {step === 1 && (
          <div className="project-wizard__step-pane">
            <h4>Step 1: Choose or Upload Dataset</h4>
            <p className="project-wizard__pane-desc">
              Select a benchmark dataset from your ML Flow workspace or sample library.
            </p>
            <div className="project-wizard__dataset-options">
              {datasets.map((ds) => (
                <label
                  key={ds.id}
                  className={`project-wizard__dataset-card ${
                    selectedDataset === ds.name ? 'project-wizard__dataset-card--selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="dataset"
                    value={ds.name}
                    checked={selectedDataset === ds.name}
                    onChange={() => setSelectedDataset(ds.name)}
                  />
                  <div>
                    <strong>{ds.name}</strong>
                    <small>
                      {ds.rows.toLocaleString()} rows • {ds.columns} columns • {ds.format}
                    </small>
                  </div>
                </label>
              ))}
            </div>
            <button type="button" className="project-wizard__next-btn" onClick={() => setStep(2)}>
              Next: Task Type →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="project-wizard__step-pane">
            <h4>Step 2: Select Task Type</h4>
            <p className="project-wizard__pane-desc">Choose the objective for this workflow.</p>
            <div className="project-wizard__task-options">
              {taskOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`project-wizard__task-btn ${taskType === opt ? 'project-wizard__task-btn--selected' : ''}`}
                  onClick={() => setTaskType(opt)}
                >
                  <span>◈</span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>
            <div className="project-wizard__step-actions">
              <button type="button" className="project-wizard__back-btn" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button type="button" className="project-wizard__next-btn" onClick={() => setStep(3)}>
                Next: Configuration →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="project-wizard__step-pane">
            <h4>Step 3: Pipeline Configuration</h4>
            <p className="project-wizard__pane-desc">
              Inline tooltips guide optimal preprocessing parameters.
            </p>
            <div className="project-wizard__config-grid">
              <div className="project-wizard__config-item">
                <label>
                  <span>Validation Split Strategy</span>
                  <select defaultValue="stratified">
                    <option value="stratified">Stratified 5-Fold Cross Validation</option>
                    <option value="holdout">80/20 Train-Test Split</option>
                  </select>
                </label>
                <small className="project-wizard__tooltip">ℹ️ Preserves equal class ratio in every fold.</small>
              </div>

              <div className="project-wizard__config-item">
                <label>
                  <span>Feature Scaler</span>
                  <select defaultValue="standard">
                    <option value="standard">StandardScaler (Mean=0, Std=1)</option>
                    <option value="robust">RobustScaler (Median, IQR)</option>
                    <option value="minmax">MinMaxScaler (0 to 1)</option>
                  </select>
                </label>
                <small className="project-wizard__tooltip">ℹ️ Normalizes disparate column numerical ranges.</small>
              </div>
            </div>
            <div className="project-wizard__step-actions">
              <button type="button" className="project-wizard__back-btn" onClick={() => setStep(2)}>
                ← Back
              </button>
              <button type="button" className="project-wizard__next-btn" onClick={() => setStep(4)}>
                Next: Train Pipeline →
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="project-wizard__step-pane">
            <h4>Step 4: Train & Execute Pipeline</h4>
            <p className="project-wizard__pane-desc">
              Run nodes sequentially and record convergence logs.
            </p>
            {isTraining ? (
              <div className="project-wizard__training-status">
                <div className="project-wizard__loader-bar">
                  <div className="project-wizard__loader-fill" style={{ width: `${trainProgress}%` }} />
                </div>
                <span>Training pipeline nodes... {trainProgress}%</span>
              </div>
            ) : resultsReady ? (
              <div className="project-wizard__success-banner">
                <span>✓ Pipeline nodes successfully trained!</span>
              </div>
            ) : (
              <button type="button" className="project-wizard__train-btn" onClick={startTrainingSimulation}>
                ▶ Start Training Simulation
              </button>
            )}
            <div className="project-wizard__step-actions">
              <button type="button" className="project-wizard__back-btn" onClick={() => setStep(3)}>
                ← Back
              </button>
              <button
                type="button"
                className="project-wizard__next-btn"
                disabled={!resultsReady}
                onClick={() => setStep(5)}
              >
                Next: Plain English Results →
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="project-wizard__step-pane">
            <h4>Step 5: Results in Plain English</h4>
            <div className="project-wizard__plain-english-box">
              <div className="project-wizard__english-header">
                <strong>Executive Model Summary</strong>
                <span className="project-wizard__score-pill">89.4% Accuracy (Top Tier)</span>
              </div>
              <p>
                Your model correctly identifies customer attrition 9 out of 10 times. The strongest predictive signal was
                <strong> MonthlyCharges</strong> followed by <strong>tenure</strong>.
              </p>
              <div className="project-wizard__metric-badges">
                <span>Precision: <strong>88.1%</strong></span>
                <span>Recall: <strong>91.2%</strong></span>
                <span>F1 Score: <strong>89.6%</strong></span>
              </div>
            </div>
            <div className="project-wizard__step-actions">
              <button type="button" className="project-wizard__back-btn" onClick={() => setStep(4)}>
                ← Back
              </button>
              <button type="button" className="project-wizard__next-btn" onClick={() => setStep(6)}>
                Next: Export Workspace →
              </button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="project-wizard__step-pane">
            <h4>Step 6: Export to Visual Canvas</h4>
            <p className="project-wizard__pane-desc">
              Your workflow is ready! Export this pipeline directly into the interactive Miro/n8n-style ML Flow node workspace.
            </p>
            <div className="project-wizard__export-box">
              <span>Selected Dataset: <strong>{selectedDataset}</strong></span>
              <span>Task: <strong>{taskType}</strong></span>
              <span>Mode: <strong>{mode.toUpperCase()}</strong></span>
              <button
                type="button"
                className="project-wizard__launch-btn"
                onClick={() =>
                  onStartProject({
                    name: `${taskType} Workspace`,
                    dataset: selectedDataset,
                    taskType,
                  })
                }
              >
                🚀 Open in Visual Canvas Workspace
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
