import type { TrendingItem } from '../../types';
import './TrendingMLCard.css';

interface TrendingMLCardProps {
  trendingItems: TrendingItem[];
}

export function TrendingMLCard({ trendingItems }: TrendingMLCardProps) {
  return (
    <div className="trending-ml-card">
      <div className="trending-ml-card__header">
        <h4 className="trending-ml-card__title">🔥 Trending in ML Flow</h4>
        <span className="trending-ml-card__time">This Week</span>
      </div>

      <div className="trending-ml-card__list">
        {trendingItems.map((item, idx) => (
          <div key={item.id} className="trending-ml-card__row">
            <span className="trending-ml-card__index">{idx + 1}</span>
            <div className="trending-ml-card__info">
              <strong className="trending-ml-card__name">{item.name}</strong>
              <small className="trending-ml-card__cat">{item.category} • {item.usageCount.toLocaleString()} uses</small>
            </div>
            <span className="trending-ml-card__growth">{item.growth}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
