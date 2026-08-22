import type { ReactNode } from 'react';
import './PageHeader.css';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: { label: string; onClick?: () => void }[];
}

export function PageHeader({ title, description, actions, breadcrumbs }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header__content">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="page-header__breadcrumbs" aria-label="Breadcrumb">
            <ol>
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="page-header__breadcrumb-item">
                  {crumb.onClick ? (
                    <button onClick={crumb.onClick}>{crumb.label}</button>
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                  {index < breadcrumbs.length - 1 && (
                    <span className="page-header__breadcrumb-separator">/</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="page-header__title-row">
          <div className="page-header__title-group">
            <h1 className="page-header__title">{title}</h1>
            {description && <p className="page-header__description">{description}</p>}
          </div>
          {actions && <div className="page-header__actions">{actions}</div>}
        </div>
      </div>
    </header>
  );
}
