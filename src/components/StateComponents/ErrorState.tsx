import type { ReactNode } from 'react';
import './StateComponents.css';

interface ErrorStateProps {
  title?: string;
  message: string;
  action?: ReactNode;
}

export function ErrorState({ title = 'An Error Occurred', message, action }: ErrorStateProps) {
  return (
    <div className="state-component error-state">
      <div className="state-component__icon error-state__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className="state-component__title">{title}</h3>
      <p className="state-component__description">{message}</p>
      {action && <div className="state-component__action">{action}</div>}
    </div>
  );
}
