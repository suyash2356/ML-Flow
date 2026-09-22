import { useState } from 'react';
import './SuggestedFollowList.css';

interface UserToFollow {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: string;
  followers: string;
}

interface SuggestedFollowListProps {
  users: UserToFollow[];
}

export function SuggestedFollowList({ users }: SuggestedFollowListProps) {
  const [following, setFollowing] = useState<Record<string, boolean>>({});

  const toggleFollow = (id: string) => {
    setFollowing((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="suggested-follow-list">
      <div className="suggested-follow-list__header">
        <h4 className="suggested-follow-list__title">👥 Suggested to Follow</h4>
      </div>

      <div className="suggested-follow-list__items">
        {users.map((u) => {
          const isFollowed = !!following[u.id];
          return (
            <div key={u.id} className="suggested-follow-list__row">
              <div className="suggested-follow-list__avatar">{u.avatar}</div>
              <div className="suggested-follow-list__info">
                <strong>{u.name}</strong>
                <span>{u.handle} • {u.followers}</span>
              </div>
              <button
                type="button"
                className={`suggested-follow-list__btn ${
                  isFollowed ? 'suggested-follow-list__btn--following' : ''
                }`}
                onClick={() => toggleFollow(u.id)}
              >
                {isFollowed ? 'Following' : '+ Follow'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
