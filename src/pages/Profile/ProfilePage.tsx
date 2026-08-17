import { MOCK_USER_PROFILE } from '../../config/mockData';
import type { NavigationPage } from '../../types';
import './ProfilePage.css';

interface ProfilePageProps {
  onNavigate: (page: NavigationPage) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const profile = MOCK_USER_PROFILE;

  return (
    <div className="profile-page">
      {/* Profile Header Banner */}
      <div className="profile-header-card">
        <div className="profile-avatar-box">{profile.avatar}</div>
        <div className="profile-info">
          <div className="profile-name-row">
            <h1 className="profile-name">{profile.name}</h1>
            <span className="profile-handle">{profile.handle}</span>
          </div>
          <p className="profile-role">{profile.role}</p>
          <p className="profile-bio">{profile.bio}</p>
          <div className="profile-meta-row">
            <span>📍 {profile.location}</span>
            <span>•</span>
            <span>📅 Member since {profile.joinedDate}</span>
          </div>
        </div>
        <button className="profile-edit-btn" onClick={() => onNavigate('settings')}>
          ⚙ Edit Profile
        </button>
      </div>

      {/* Stats Counter Cards */}
      <div className="profile-stats-grid">
        <div className="stat-card">
          <span className="stat-card__val">{profile.completedProjects}</span>
          <span className="stat-card__lbl">Completed Workspaces</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__val">{profile.totalModelsTrained}</span>
          <span className="stat-card__lbl">Models Trained</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__val">{profile.topAccuracy}</span>
          <span className="stat-card__lbl">Top Accuracy Record</span>
        </div>
      </div>

      {/* Two Column Grid: Skill Matrix & Achievements */}
      <div className="profile-two-col">
        {/* Skills Matrix */}
        <section className="profile-section">
          <h3 className="profile-section-title">ML & Data Science Skill Matrix</h3>
          <div className="skills-list">
            {profile.skills.map((skill) => (
              <div key={skill.name} className="skill-row">
                <div className="skill-info">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-level">{skill.level}%</span>
                </div>
                <div className="skill-bar-bg">
                  <div className="skill-bar-fill" style={{ width: `${skill.level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Badges & Achievements */}
        <section className="profile-section">
          <h3 className="profile-section-title">Portfolio Achievements</h3>
          <div className="achievements-list">
            {profile.achievements.map((ach) => (
              <div key={ach.title} className="achievement-card">
                <span className="achievement-icon">{ach.icon}</span>
                <div className="achievement-details">
                  <h4>{ach.title}</h4>
                  <p>{ach.desc}</p>
                  <span className="achievement-date">{ach.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
