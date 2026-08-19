import { useState } from 'react';
import type { CanvasNodeData } from '../../types';
import './NodeInspector.css';

interface Props {
  node?: CanvasNodeData;
  allNodes?: CanvasNodeData[];
  isTargeting?: boolean;
  onClose: () => void;
  onRun: () => void;
  onDelete: () => void;
  onDisconnect: () => void;
  onConnectNearest?: () => void;
  onConnectTarget?: (targetId: string) => void;
  onStartTargetConnect?: () => void;
}

export function NodeInspector({
  node,
  allNodes = [],
  isTargeting = false,
  onClose,
  onRun,
  onDelete,
  onDisconnect,
  onConnectNearest,
  onConnectTarget,
  onStartTargetConnect,
}: Props) {
  const [target, setTarget] = useState('Exited');
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');

  if (!node) return null;

  const dataset = node.type === 'input';
  const model = node.type === 'model';

  const availableTargets = allNodes.filter((n) => n.id !== node.id);

  return (
    <aside className="node-inspector">
      <header>
        <span className={`node-inspector__icon node-inspector__icon--${node.type}`}>
          {dataset ? '▤' : model ? '◈' : '⌘'}
        </span>
        <div>
          <strong>{node.title}</strong>
          <small>
            {node.type} node · {node.status || 'idle'}
          </small>
        </div>
        <button onClick={onClose} title="Close inspector">
          ×
        </button>
      </header>

      <div className="node-inspector__body">
        <section className="node-inspector__section">
          <h4>Configuration</h4>
          {dataset ? (
            <>
              <Field label="Dataset source">
                <select>
                  <option>{node.subtitle}</option>
                  <option>Upload a dataset…</option>
                </select>
              </Field>
              <Field label="Dataset type">
                <select>
                  <option>CSV</option>
                  <option>Parquet</option>
                  <option>JSON</option>
                </select>
              </Field>
              <div className="inspector-actions">
                <button>Preview dataset</button>
                <button>.head()</button>
                <button>.describe()</button>
                <button>.info()</button>
              </div>
              <div className="dataset-summary">
                <span>10,000 rows</span>
                <span>14 columns</span>
                <span>
                  Target:{' '}
                  <select value={target} onChange={(e) => setTarget(e.target.value)}>
                    <option>Exited</option>
                    <option>Churn</option>
                  </select>
                </span>
              </div>
            </>
          ) : model ? (
            <>
              <Range label="n_estimators" initial={200} min={10} max={500} />
              <Range label="max_depth" initial={15} min={1} max={50} />
              <Field label="criterion">
                <select>
                  <option>gini</option>
                  <option>entropy</option>
                  <option>log_loss</option>
                </select>
              </Field>
            </>
          ) : (
            <>
              <Field label="Operation">
                <select>
                  <option>{node.title}</option>
                  <option>Standard scaler</option>
                  <option>Median imputation</option>
                </select>
              </Field>
              <Field label="Output name">
                <input defaultValue="processed_data" />
              </Field>
            </>
          )}

          <button className="node-inspector__run" onClick={onRun}>
            ▶ Run this node
          </button>
        </section>

        <section className="node-inspector__section node-inspector__connect-box">
          <h4>Node Connections</h4>

          <button
            type="button"
            className="node-inspector__connect-btn node-inspector__connect-btn--primary"
            onClick={onConnectNearest}
            title="Auto connect to nearest 1 or 2 nodes"
          >
            ⚡ Connect to Nearest (1-2 Nodes)
          </button>

          {availableTargets.length > 0 && (
            <div className="node-inspector__target-picker">
              <select
                value={selectedTargetId}
                onChange={(e) => setSelectedTargetId(e.target.value)}
                className="node-inspector__target-select"
              >
                <option value="">Select target node to connect…</option>
                {availableTargets.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.title} ({n.type})
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="node-inspector__connect-btn"
                disabled={!selectedTargetId}
                onClick={() => {
                  if (selectedTargetId) {
                    onConnectTarget?.(selectedTargetId);
                    setSelectedTargetId('');
                  }
                }}
              >
                + Connect
              </button>
            </div>
          )}

          {onStartTargetConnect && (
            <button
              type="button"
              className={`node-inspector__connect-btn ${
                isTargeting ? 'node-inspector__connect-btn--active' : ''
              }`}
              onClick={onStartTargetConnect}
            >
              {isTargeting ? '🎯 Click target node on canvas...' : '🎯 Pick Target on Canvas'}
            </button>
          )}
        </section>

        <div className="node-inspector__secondary-actions">
          <button onClick={onDisconnect}>✂ Disconnect links</button>
          <button onClick={onDelete}>🗑 Remove node</button>
        </div>
      </div>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="inspector-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Range({
  label,
  initial,
  min,
  max,
}: {
  label: string;
  initial: number;
  min: number;
  max: number;
}) {
  const [value, setValue] = useState(initial);
  return (
    <label className="inspector-field">
      <span>
        {label}
        <b>{value}</b>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
    </label>
  );
}

