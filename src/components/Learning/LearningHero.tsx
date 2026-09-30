import type { LearningCategory } from '../../types';
import './LearningHero.css';

interface LearningHeroProps {
  category: LearningCategory;
  categoryBadge: string;
  title: string;
  subtitle: string;
  progressPercentage: number;
  levelBadge: string;
  onResume: () => void;
  onStartGuidedProject: () => void;
}

export function LearningHero({
  category,
  categoryBadge,
  title,
  subtitle,
  progressPercentage: progressPercent,
  levelBadge,
  onResume,
  onStartGuidedProject,
}: LearningHeroProps) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className={`learning-hero learning-hero--${category.toLowerCase()}`}>
      <div className="learning-hero__content">
        <div className="learning-hero__badges">
          <span className="learning-hero__category-badge">{categoryBadge}</span>
          <span className="learning-hero__level-badge">
            {levelBadge}
          </span>
        </div>

        <h1 className="learning-hero__title">{title}</h1>
        <p className="learning-hero__subtitle">{subtitle}</p>

        <div className="learning-hero__actions">
          <button type="button" className="learning-hero__btn learning-hero__btn--primary" onClick={onResume}>
            ▶ Resume Learning
          </button>
          <button type="button" className="learning-hero__btn learning-hero__btn--secondary" onClick={onStartGuidedProject}>
            🛠️ Start Guided Project
          </button>
        </div>
      </div>

      <div className="learning-hero__progress-box">
        <div className="learning-hero__ring-container">
          <svg className="learning-hero__ring" width="90" height="90" viewBox="0 0 90 90">
            <circle
              className="learning-hero__ring-bg"
              cx="45"
              cy="45"
              r={radius}
              strokeWidth="7"
            />
            <circle
              className="learning-hero__ring-fill"
              cx="45"
              cy="45"
              r={radius}
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="learning-hero__ring-text">
            <strong>{progressPercent}%</strong>
            <small>Done</small>
          </div>
        </div>

        <div className="learning-hero__progress-details">
          <span className="learning-hero__status-label">Track Progress</span>
          <span className="learning-hero__cert-status">
            {progressPercent > 75 ? '🏆 Ready for Certification' : '📚 In Progress'}
          </span>
        </div>
      </div>
    </div>
  );
}
