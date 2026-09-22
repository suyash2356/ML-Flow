import type { UserProfile } from '../../types';
import './UserProfileCard.css';

interface UserProfileCardProps {
  user: UserProfile;
  streakDays?: number;
  karmaScore?: number;
}

export function UserProfileCard({
  user,
  streakDays = 4,
  karmaScore = 1420,
}: UserProfileCardProps) {
  return (
    <div className="user-profile-card">
      <div className="user-profile-card__header">
        <div className="user-profile-card__avatar">{user.avatar}</div>
        <div className="user-profile-card__identity">
          <h3 className="user-profile-card__name">{user.name}</h3>
          <span className="user-profile-card__handle">{user.handle}</span>
          <span className="user-profile-card__role">{user.role}</span>
        </div>
      </div>

      <div className="user-profile-card__location">
        <span>📍 {user.location}</span>
      </div>

      <div className="user-profile-card__skills">
        {user.skills.slice(0, 4).map((sk) => (
          <span key={sk.name} className="user-profile-card__skill-tag">
            {sk.name}
          </span>
        ))}
      </div>

      <div className="user-profile-card__stats-grid">
        <div className="user-profile-card__stat">
          <span className="user-profile-card__stat-value">🔥 {streakDays}d</span>
          <span className="user-profile-card__stat-label">Streak</span>
        </div>
        <div className="user-profile-card__stat">
          <span className="user-profile-card__stat-value">{user.completedProjects}</span>
          <span className="user-profile-card__stat-label">Projects</span>
        </div>
        <div className="user-profile-card__stat">
          <span className="user-profile-card__stat-value">{user.totalModelsTrained}</span>
          <span className="user-profile-card__stat-label">Models</span>
        </div>
        <div className="user-profile-card__stat">
          <span className="user-profile-card__stat-value">⭐ {karmaScore}</span>
          <span className="user-profile-card__stat-label">Karma</span>
        </div>
      </div>
    </div>
  );
}
