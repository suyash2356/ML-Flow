import type { MentorMatch } from '../../types';
import './MentorMatchCard.css';

interface MentorMatchCardProps {
  mentors: MentorMatch[];
}

export function MentorMatchCard({ mentors }: MentorMatchCardProps) {
  return (
    <div className="mentor-match-card">
      <div className="mentor-match-card__header">
        <h4 className="mentor-match-card__title">🤝 Find a Study Buddy / Mentor</h4>
        <span className="mentor-match-card__badge">Suggested Matches</span>
      </div>

      <div className="mentor-match-card__list">
        {mentors.map((m) => (
          <div key={m.id} className="mentor-match-card__item">
            <div className="mentor-match-card__avatar">{m.avatar}</div>
            <div className="mentor-match-card__info">
              <div className="mentor-match-card__name-row">
                <strong>{m.name}</strong>
                <span className="mentor-match-card__match-pct">{m.matchPercentage}% match</span>
              </div>
              <span className="mentor-match-card__role">{m.role} • {m.timezone}</span>
              <p className="mentor-match-card__reason">{m.matchReason}</p>
              <div className="mentor-match-card__skills">
                {m.skills.map((s) => (
                  <span key={s} className="mentor-match-card__skill">{s}</span>
                ))}
              </div>
            </div>
            <button type="button" className="mentor-match-card__connect-btn" title="Send connection invite">
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
