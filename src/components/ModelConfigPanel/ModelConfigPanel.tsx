import { useState } from 'react';
import type { CanvasNodeData } from '../../types';
import './ModelConfigPanel.css';

interface ModelConfigProps {
  onStartRun?: () => void;
  node?: CanvasNodeData;
}

export function ModelConfigPanel({ onStartRun, node }: ModelConfigProps) {
  const [nEstimators, setNEstimators] = useState<number>(200);
  const [maxDepth, setMaxDepth] = useState<number>(15);
  const [minSamplesSplit, setMinSamplesSplit] = useState<number>(5);
  const [criterion, setCriterion] = useState<string>('gini');

  return (
    <div className="model-config-panel">
      <div className="model-config-panel__header"><h3 className="model-config-panel__title">Configuration</h3><h4 className="model-config-panel__subtitle">{node?.title || 'Random Forest'}</h4></div>

      <div className="model-config-panel__body">
        {node?.type !== 'model' && <div className="model-config__note">This node uses the workspace defaults. Connect it to a model node to unlock execution options.</div>}
        {/* Slider 1: n_estimators */}
        <div className="model-config__field">
          <div className="model-config__label-row">
            <label htmlFor="n_estimators">n_estimators</label>
            <span className="model-config__value">{nEstimators}</span>
          </div>
          <input
            id="n_estimators"
            type="range"
            min="10"
            max="500"
            step="10"
            value={nEstimators}
            onChange={(e) => setNEstimators(Number(e.target.value))}
            className="model-config__slider"
          />
        </div>

        {/* Slider 2: max_depth */}
        <div className="model-config__field">
          <div className="model-config__label-row">
            <label htmlFor="max_depth">max_depth</label>
            <span className="model-config__value">{maxDepth}</span>
          </div>
          <input
            id="max_depth"
            type="range"
            min="1"
            max="50"
            value={maxDepth}
            onChange={(e) => setMaxDepth(Number(e.target.value))}
            className="model-config__slider"
          />
        </div>

        {/* Number Input: min_samples_split */}
        <div className="model-config__field">
          <label htmlFor="min_samples_split" className="model-config__label">
            min_samples_split
          </label>
          <div className="model-config__number-input-wrapper">
            <input
              id="min_samples_split"
              type="number"
              value={minSamplesSplit}
              onChange={(e) => setMinSamplesSplit(Number(e.target.value))}
              className="model-config__number-input"
            />
            <div className="model-config__number-steppers">
              <button
                type="button"
                onClick={() => setMinSamplesSplit((v) => v + 1)}
                className="model-config__stepper-btn"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => setMinSamplesSplit((v) => Math.max(1, v - 1))}
                className="model-config__stepper-btn"
              >
                ▼
              </button>
            </div>
          </div>
        </div>

        {/* Select Dropdown: criterion */}
        <div className="model-config__field">
          <label htmlFor="criterion" className="model-config__label">
            criterion
          </label>
          <div className="model-config__select-wrapper">
            <select
              id="criterion"
              value={criterion}
              onChange={(e) => setCriterion(e.target.value)}
              className="model-config__select"
            >
              <option value="gini">gini</option>
              <option value="entropy">entropy</option>
              <option value="log_loss">log_loss</option>
            </select>
            <span className="model-config__select-arrow">▼</span>
          </div>
        </div>

        {/* Target Variable */}
        <div className="model-config__field model-config__field--target">
          <span className="model-config__target-label">Target Variable</span>
          <span className="model-config__target-value">Exited</span>
        </div>

        {/* Start Training Run Action */}
        <div className="model-config__action">
          <button
            type="button"
            className="model-config__run-link"
            onClick={onStartRun}
          >
            Start Training Run
          </button>
        </div>

        {/* Glowing Concentric Play Button Widget */}
        <div className="model-config__play-widget">
          <button
            type="button"
            className="model-config__play-btn"
            onClick={onStartRun}
            title="Run Model Training"
          >
            <div className="model-config__play-ring model-config__play-ring--outer" />
            <div className="model-config__play-ring model-config__play-ring--inner" />
            <div className="model-config__play-icon-container">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
