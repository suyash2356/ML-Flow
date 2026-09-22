import type { EncyclopediaCardData } from '../../types';
import './AlgorithmCard.css';

interface AlgorithmCardProps {
  card: EncyclopediaCardData;
  onOpenDetail: (card: EncyclopediaCardData) => void;
}

export function AlgorithmCard({ card, onOpenDetail }: AlgorithmCardProps) {
  return (
    <div className="algorithm-card" onClick={() => onOpenDetail(card)}>
      <div className="algorithm-card__top">
        <span className="algorithm-card__icon">{card.icon}</span>
        <span className={`algorithm-card__diff-badge algorithm-card__diff-badge--${card.difficulty.toLowerCase()}`}>
          {card.difficulty}
        </span>
      </div>

      <h3 className="algorithm-card__title">{card.title}</h3>
      <p className="algorithm-card__summary">{card.shortSummary}</p>

      <div className="algorithm-card__tags">
        {card.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="algorithm-card__tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="algorithm-card__footer">
        <span className="algorithm-card__sections-hint">7 In-Depth Sections</span>
        <button type="button" className="algorithm-card__explore-btn">
          Explore Concept →
        </button>
      </div>
    </div>
  );
}
