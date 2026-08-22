import type { ReactNode } from 'react';
import './StatusBadge.css';

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  icon?: ReactNode;
  className?: string;
}

export function StatusBadge({ status, label, icon, className = '' }: StatusBadgeProps) {
  return (
    <div className={`status-badge status-badge--${status} ${className}`}>
      {icon && <span className="status-badge__icon">{icon}</span>}
      {!icon && (
        <span className="status-badge__dot"></span>
      )}
      <span className="status-badge__label">{label}</span>
    </div>
  );
}
