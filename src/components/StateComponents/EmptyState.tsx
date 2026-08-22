import type { ReactNode } from 'react';
import './StateComponents.css';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="state-component empty-state">
      {icon && <div className="state-component__icon">{icon}</div>}
      <h3 className="state-component__title">{title}</h3>
      <p className="state-component__description">{description}</p>
      {action && <div className="state-component__action">{action}</div>}
    </div>
  );
}
