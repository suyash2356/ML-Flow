import type { NavigationPage, Project, DatasetItem } from '../../types';
import './DashboardPage.css';

interface DashboardPageProps {
  projects: Project[];
  datasets: DatasetItem[];
  onNavigate: (page: NavigationPage) => void;
  onOpenWorkspace: (project: Project) => void;
}

export function DashboardPage({
  projects,
  datasets,
  onNavigate,
  onOpenWorkspace,
}: DashboardPageProps) {
  const activeProject = projects.find((p) => p.status === 'In Progress') || projects[0];
  const favoriteProjects = projects.filter((p) => p.isFavorite);
  const recentDatasets = datasets.slice(0, 3);

  return (
    <div className="dashboard-page">
      {/* Top Banner: Continue Working */}
      {activeProject && (
        <div className="dashboard__banner">
          <div className="dashboard__banner-content">
            <span className="dashboard__banner-badge">✦ Active Workspace</span>
            <h2 className="dashboard__banner-title">{activeProject.name}</h2>
            <p className="dashboard__banner-desc">{activeProject.description}</p>
            <div className="dashboard__banner-meta">
              <span>Dataset: <strong>{activeProject.datasetName}</strong></span>
              <span>•</span>
              <span>Type: <strong>{activeProject.type}</strong></span>
              <span>•</span>
              <span>Last edited: <strong>{activeProject.lastModified}</strong></span>
            </div>
          </div>
          <button
            className="dashboard__banner-btn"
            onClick={() => onOpenWorkspace(activeProject)}
          >
            Continue Working →
          </button>
        </div>
      )}

      {/* New Project Shortcuts */}
      <section className="dashboard__section">
        <div className="dashboard__section-header">
          <h3 className="dashboard__section-title">New Project Shortcuts</h3>
        </div>
        <div className="dashboard__shortcuts-grid">
          <button
            className="dashboard__shortcut-card dashboard__shortcut-card--eda"
            onClick={() => onNavigate('eda')}
          >
            <div className="dashboard__shortcut-icon">📊</div>
            <div className="dashboard__shortcut-text">
              <h4>New EDA Project</h4>
              <p>Profiling, correlation matrices, outlier analysis</p>
            </div>
            <span className="dashboard__shortcut-arrow">+</span>
          </button>

          <button
            className="dashboard__shortcut-card dashboard__shortcut-card--ml"
            onClick={() => onNavigate('ml')}
          >
            <div className="dashboard__shortcut-icon">🧠</div>
            <div className="dashboard__shortcut-text">
              <h4>New ML Project</h4>
              <p>Random Forest, XGBoost, Cross-Validation</p>
            </div>
            <span className="dashboard__shortcut-arrow">+</span>
          </button>

          <button
            className="dashboard__shortcut-card dashboard__shortcut-card--dl"
            onClick={() => onNavigate('dl')}
          >
            <div className="dashboard__shortcut-icon">🔮</div>
            <div className="dashboard__shortcut-text">
              <h4>New DL Project</h4>
              <p>Perceptron, CNNs, Deep Neural Networks</p>
            </div>
            <span className="dashboard__shortcut-arrow">+</span>
          </button>
        </div>
      </section>

      {/* Two Column Grid: Recent Projects & Favourites */}
      <div className="dashboard__two-col">
        {/* Recent Projects */}
        <section className="dashboard__section">
          <div className="dashboard__section-header">
            <h3 className="dashboard__section-title">Recent Projects</h3>
            <button className="dashboard__link-btn" onClick={() => onNavigate('projects')}>
              View All ({projects.length}) →
            </button>
          </div>
          <div className="dashboard__projects-list">
            {projects.slice(0, 3).map((proj) => (
              <div
                key={proj.id}
                className="dashboard__project-row"
                onClick={() => onOpenWorkspace(proj)}
              >
                <div className="dashboard__project-type-badge">{proj.type}</div>
                <div className="dashboard__project-details">
                  <h4>{proj.name}</h4>
                  <p>{proj.datasetName} • {proj.nodesCount} nodes</p>
                </div>
                <div className="dashboard__project-status">
                  <span className={`status-pill status-pill--${proj.status.toLowerCase().replace(' ', '-')}`}>
                    {proj.status}
                  </span>
                  <span className="dashboard__project-time">{proj.lastModified}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Favourite Projects */}
        <section className="dashboard__section">
          <div className="dashboard__section-header">
            <h3 className="dashboard__section-title">Favorite & Starred Projects</h3>
          </div>
          <div className="dashboard__projects-list">
            {favoriteProjects.map((proj) => (
              <div
                key={proj.id}
                className="dashboard__project-row"
                onClick={() => onOpenWorkspace(proj)}
              >
                <span className="dashboard__star-icon">★</span>
                <div className="dashboard__project-details">
                  <h4>{proj.name}</h4>
                  <p>{proj.description}</p>
                </div>
                {proj.accuracy && (
                  <div className="dashboard__project-acc">
                    <span>Acc: <strong>{proj.accuracy}</strong></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Recent Datasets Section */}
      <section className="dashboard__section">
        <div className="dashboard__section-header">
          <h3 className="dashboard__section-title">Recent Datasets</h3>
          <button className="dashboard__link-btn" onClick={() => onNavigate('datasets')}>
            Manage Datasets →
          </button>
        </div>
        <div className="dashboard__datasets-grid">
          {recentDatasets.map((ds) => (
            <div key={ds.id} className="dashboard__dataset-card">
              <div className="dashboard__dataset-header">
                <span className="dashboard__dataset-icon">📁</span>
                <span className="dashboard__dataset-format">{ds.format}</span>
              </div>
              <h4 className="dashboard__dataset-name">{ds.name}</h4>
              <div className="dashboard__dataset-meta">
                <span>{ds.rows.toLocaleString()} rows</span>
                <span>•</span>
                <span>{ds.columns} cols</span>
                <span>•</span>
                <span>{ds.size}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
