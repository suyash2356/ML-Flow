import { useState } from 'react';
import type { SuggestedProfile } from '../../types/dashboard';
import './SuggestedFollowList.css';

interface SuggestedFollowListProps {
  users: SuggestedProfile[];
  pendingIds: Set<string>;
  onToggleFollow: (id: string, isFollowing: boolean) => Promise<void>;
}

export function SuggestedFollowList({ users, pendingIds, onToggleFollow }: SuggestedFollowListProps) {
  const [errorMessage, setErrorMessage] = useState('');

  const handleToggle = async (user: SuggestedProfile) => {
    setErrorMessage('');
    try {
      await onToggleFollow(user.id, user.isFollowing);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to update follow.');
    }
  };

  return (
    <div className="suggested-follow-list">
      <div className="suggested-follow-list__header">
        <h4 className="suggested-follow-list__title">People</h4>
      </div>

      <div className="suggested-follow-list__items">
        {users.map((user) => {
          const initials = user.displayName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'U';
          return (
            <div key={user.id} className="suggested-follow-list__row">
              <div className="suggested-follow-list__avatar">{initials}</div>
              <div className="suggested-follow-list__info">
                <strong>{user.displayName}</strong>
                <span>@{user.username} · {user.followerCount} followers</span>
              </div>
              <button
                type="button"
                className={`suggested-follow-list__btn ${
                  user.isFollowing ? 'suggested-follow-list__btn--following' : ''
                }`}
                onClick={() => void handleToggle(user)}
                disabled={pendingIds.has(user.id)}
              >
                {pendingIds.has(user.id) ? 'Saving...' : user.isFollowing ? 'Following' : '+ Follow'}
              </button>
            </div>
          );
        })}
      </div>
      {errorMessage && <p className="suggested-follow-list__error" role="alert">{errorMessage}</p>}
    </div>
  );
}
