import type { WeeklyChallenge } from '../../types';
import './WeeklyChallengeCard.css';

interface WeeklyChallengeCardProps {
  challenge: WeeklyChallenge;
  onJoinChallenge: (challenge: WeeklyChallenge) => void;
}

export function WeeklyChallengeCard({
  challenge,
  onJoinChallenge,
}: WeeklyChallengeCardProps) {
  return (
    <div className="weekly-challenge-card">
      <div className="weekly-challenge-card__header">
        <span className="weekly-challenge-card__badge">🏆 Weekly Challenge</span>
        <span className="weekly-challenge-card__deadline">⏳ {challenge.deadline}</span>
      </div>

      <h4 className="weekly-challenge-card__title">{challenge.title}</h4>
      <p className="weekly-challenge-card__desc">{challenge.description}</p>

      <div className="weekly-challenge-card__prize">
        <span>Prize Pool:</span> <strong>{challenge.prize}</strong>
      </div>

      {/* Leaderboard Snippet */}
      <div className="weekly-challenge-card__leaderboard">
        <span className="weekly-challenge-card__lb-title">Top Leaderboard</span>
        {challenge.leaderboard.map((row) => (
          <div key={row.rank} className="weekly-challenge-card__lb-row">
            <span className={`weekly-challenge-card__rank weekly-challenge-card__rank--${row.rank}`}>
              #{row.rank}
            </span>
            <div className="weekly-challenge-card__lb-user">
              <span className="weekly-challenge-card__lb-avatar">{row.avatar}</span>
              <span>{row.name}</span>
            </div>
            <strong className="weekly-challenge-card__lb-score">{row.score}</strong>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="weekly-challenge-card__btn"
        onClick={() => onJoinChallenge(challenge)}
      >
        Join Challenge →
      </button>
    </div>
  );
}
