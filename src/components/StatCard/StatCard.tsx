import type { ReactNode } from 'react';
import './StatCard.css';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: string | number;
    direction: 'up' | 'down' | 'neutral';
    label: string;
  };
  onClick?: () => void;
  className?: string;
}

export function StatCard({ title, value, icon, trend, onClick, className = '' }: StatCardProps) {
  const isClickable = !!onClick;
  
  return (
    <div 
      className={`stat-card ${isClickable ? 'stat-card--clickable' : ''} ${className}`}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      <div className="stat-card__header">
        <h3 className="stat-card__title">{title}</h3>
        {icon && <div className="stat-card__icon">{icon}</div>}
      </div>
      <div className="stat-card__body">
        <div className="stat-card__value">{value}</div>
        {trend && (
          <div className={`stat-card__trend stat-card__trend--${trend.direction}`}>
            <span className="stat-card__trend-icon">
              {trend.direction === 'up' && '↑'}
              {trend.direction === 'down' && '↓'}
              {trend.direction === 'neutral' && '−'}
            </span>
            <span className="stat-card__trend-value">{trend.value}</span>
            <span className="stat-card__trend-label">{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}
