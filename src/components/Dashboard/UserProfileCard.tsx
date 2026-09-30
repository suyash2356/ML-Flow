import type { DashboardProfile } from '../../types/dashboard';
import './UserProfileCard.css';

interface UserProfileCardProps {
  profile: DashboardProfile;
  projectCount: number;
}

export function UserProfileCard({ profile, projectCount }: UserProfileCardProps) {
  const initials = profile.displayName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'U';
  return (
    <div className="user-profile-card">
      <div className="user-profile-card__header">
        <div className="user-profile-card__avatar">{initials}</div>
        <div className="user-profile-card__identity">
          <h3 className="user-profile-card__name">{profile.displayName}</h3>
          <span className="user-profile-card__handle">@{profile.username}</span>
          {profile.headline && <span className="user-profile-card__role">{profile.headline}</span>}
        </div>
      </div>

      {profile.location && <div className="user-profile-card__location"><span>{profile.location}</span></div>}

      {profile.skills.length > 0 && <div className="user-profile-card__skills">
        {profile.skills.slice(0, 4).map((skill) => (
          <span key={skill} className="user-profile-card__skill-tag">{skill}</span>
        ))}
      </div>}

      <div className="user-profile-card__stats-grid">
        <div className="user-profile-card__stat">
          <span className="user-profile-card__stat-value">{projectCount}</span>
          <span className="user-profile-card__stat-label">Projects</span>
        </div>
        <div className="user-profile-card__stat">
          <span className="user-profile-card__stat-value">{profile.followerCount}</span>
          <span className="user-profile-card__stat-label">Followers</span>
        </div>
        <div className="user-profile-card__stat">
          <span className="user-profile-card__stat-value">{profile.followingCount}</span>
          <span className="user-profile-card__stat-label">Following</span>
        </div>
      </div>
    </div>
  );
}
