import type { TrendingTag } from '../../types/dashboard';
import './TrendingMLCard.css';

interface TrendingMLCardProps {
  trendingTags: TrendingTag[];
}

export function TrendingMLCard({ trendingTags }: TrendingMLCardProps) {
  return (
    <div className="trending-ml-card">
      <div className="trending-ml-card__header">
        <h4 className="trending-ml-card__title">Trending tags</h4>
        <span className="trending-ml-card__time">In this feed</span>
      </div>

      <div className="trending-ml-card__list">
        {trendingTags.map((item, index) => (
          <div key={item.name} className="trending-ml-card__row">
            <span className="trending-ml-card__index">{index + 1}</span>
            <div className="trending-ml-card__info">
              <strong className="trending-ml-card__name">#{item.name}</strong>
              <small className="trending-ml-card__cat">{item.postCount} posts</small>
            </div>
          </div>
        ))}
        {trendingTags.length === 0 && <p className="trending-ml-card__empty">No tags in these posts yet.</p>}
      </div>
    </div>
  );
}
