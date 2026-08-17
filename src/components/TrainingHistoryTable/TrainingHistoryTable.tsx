import type { TrainingRun } from '../../types';
import './TrainingHistoryTable.css';

interface TrainingHistoryProps {
  runs: TrainingRun[];
}

export function TrainingHistoryTable({ runs }: TrainingHistoryProps) {
  return (
    <div className="training-history">
      {/* Header section */}
      <div className="training-history__header">
        <h3 className="training-history__title">Training History & Best Runs</h3>
        <span className="training-history__subtitle">
          Historical Performance & Live Data Streams
        </span>
      </div>

      {/* Table */}
      <div className="training-history__table-container">
        <table className="training-history__table">
          <thead>
            <tr>
              <th>Run ID</th>
              <th>Model</th>
              <th>Accuracy</th>
              <th>F1-Score</th>
              <th>Training Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <tr key={run.id}>
                <td className="training-history__cell-id">{run.id}</td>
                <td>{run.model}</td>
                <td>
                  <div className="training-history__metric-cell">
                    <span>{run.accuracy}</span>
                    <div className="training-history__bars">
                      <span className="bar bar--fill-4" />
                      <span className="bar bar--fill-3" />
                      <span className="bar bar--fill-2" />
                      <span className="bar bar--fill-1" />
                    </div>
                  </div>
                </td>
                <td>
                  <div className="training-history__metric-cell">
                    <span>{run.f1Score}</span>
                    <div className="training-history__bars">
                      <span className="bar bar--fill-4" />
                      <span className="bar bar--fill-3" />
                      <span className="bar bar--fill-2" />
                      <span className="bar bar--outline" />
                    </div>
                  </div>
                </td>
                <td className="training-history__cell-time">{run.trainingTime}</td>
                <td>
                  <div className="training-history__status">
                    <span className="training-history__status-icon" />
                    <span>{run.status}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
