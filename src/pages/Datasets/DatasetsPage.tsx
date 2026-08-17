import { useState } from 'react';
import { MOCK_DATASETS, MOCK_KAGGLE_DATASETS } from '../../config/mockData';
import type { DatasetItem, NavigationPage } from '../../types';
import './DatasetsPage.css';

interface DatasetsPageProps {
  onStartProjectFromDataset: (dataset: DatasetItem, type?: 'EDA' | 'ML' | 'DL') => void;
  onNavigate: (page: NavigationPage) => void;
}

export function DatasetsPage({ onStartProjectFromDataset }: DatasetsPageProps) {
  const [datasets, setDatasets] = useState<DatasetItem[]>(MOCK_DATASETS);
  const [showImportModal, setShowImportModal] = useState(false);
  const [newDatasetName, setNewDatasetName] = useState('');

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDatasetName) return;
    const newDs: DatasetItem = {
      id: `ds-${Date.now()}`,
      name: newDatasetName.endsWith('.csv') ? newDatasetName : `${newDatasetName}.csv`,
      rows: 15000,
      columns: 18,
      size: '2.4 MB',
      uploadedAt: new Date().toISOString().split('T')[0],
      source: 'Upload',
      format: 'CSV',
    };
    setDatasets([newDs, ...datasets]);
    setNewDatasetName('');
    setShowImportModal(false);
  };

  return (
    <div className="datasets-page">
      {/* Header & Main Import Action */}
      <div className="datasets-header">
        <div>
          <h1 className="datasets-title">Datasets & Data Hub</h1>
          <p className="datasets-subtitle">
            Upload CSV/Parquet files or connect Kaggle datasets to bootstrap visual ML pipelines.
          </p>
        </div>
        <button className="datasets-import-btn" onClick={() => setShowImportModal(true)}>
          📁 Import New Dataset
        </button>
      </div>

      {/* Section 1: Imported Datasets */}
      <section className="datasets-section">
        <h2 className="datasets-section-title">Imported Datasets</h2>
        <div className="datasets-grid">
          {datasets.map((ds) => (
            <div key={ds.id} className="dataset-card">
              <div className="dataset-card__top">
                <span className="dataset-card__icon">📄</span>
                <span className="dataset-card__source">{ds.source}</span>
              </div>

              <h3 className="dataset-card__name">{ds.name}</h3>

              <div className="dataset-card__stats">
                <div className="stat-pill">
                  <span className="stat-label">Rows</span>
                  <span className="stat-val">{ds.rows.toLocaleString()}</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-label">Cols</span>
                  <span className="stat-val">{ds.columns}</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-label">Size</span>
                  <span className="stat-val">{ds.size}</span>
                </div>
              </div>

              <div className="dataset-card__footer">
                <span className="upload-date">Uploaded {ds.uploadedAt}</span>
                <div className="dataset-card__actions">
                  {(['EDA', 'ML', 'DL'] as const).map((type) => (
                    <button key={type} className="start-from-ds-btn" onClick={() => onStartProjectFromDataset(ds, type)}>{type}</button>
                  ))}
                </div>
                <button
                  className="start-from-ds-btn"
                  onClick={() => onStartProjectFromDataset(ds)}
                >
                  Start Project →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Online / Kaggle Dataset Placeholders */}
      <section className="datasets-section">
        <div className="datasets-section-header">
          <h2 className="datasets-section-title">Online & Kaggle Datasets (Placeholder Integration)</h2>
          <span className="datasets-badge">Kaggle Hub API Ready</span>
        </div>

        <div className="kaggle-grid">
          {MOCK_KAGGLE_DATASETS.map((kg) => (
            <div key={kg.id} className="kaggle-card">
              <div className="kaggle-card__header">
                <span className="kaggle-logo">K</span>
                <span className="kaggle-usability">Usability {kg.usability}</span>
              </div>
              <h4 className="kaggle-card__title">{kg.title}</h4>
              <div className="kaggle-card__meta">
                <span>Downloads: <strong>{kg.downloads}</strong></span>
                <span>•</span>
                <span>Size: <strong>{kg.size}</strong></span>
              </div>
              <div className="kaggle-card__tags">
                {kg.tags.map((t) => (
                  <span key={t} className="kaggle-tag">#{t}</span>
                ))}
              </div>
              <button
                className="kaggle-import-link"
                onClick={() =>
                  onStartProjectFromDataset({
                    id: kg.id,
                    name: `${kg.title.split(' ')[0].toLowerCase()}_kaggle.csv`,
                    rows: 25000,
                    columns: 12,
                    size: kg.size,
                    uploadedAt: 'Today',
                    source: 'Kaggle',
                    format: 'CSV',
                  })
                }
              >
                Import & Create Project →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Import Dataset Modal */}
      {showImportModal && (
        <div className="modal-backdrop" onClick={() => setShowImportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Import New Dataset</h3>
            <p>Upload your local dataset file (CSV, Parquet, JSON).</p>
            <form onSubmit={handleImportSubmit}>
              <div className="modal-field">
                <label>Dataset File Name</label>
                <input
                  type="text"
                  placeholder="e.g. customer_telecom_data.csv"
                  value={newDatasetName}
                  onChange={(e) => setNewDatasetName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="dropzone-area">
                <span className="dropzone-icon">☁️</span>
                <p>Drag & Drop dataset file here or click to browse</p>
                <span className="dropzone-hint">Supports CSV, TSV, Parquet up to 500MB</span>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowImportModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Import Dataset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
