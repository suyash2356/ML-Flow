import type { FeedFilter } from '../../types';
import './FeedFilterTabs.css';

interface FeedFilterTabsProps {
  activeFilter: FeedFilter;
  onSelectFilter: (filter: FeedFilter) => void;
}

export function FeedFilterTabs({
  activeFilter,
  onSelectFilter,
}: FeedFilterTabsProps) {
  const tabs: { id: FeedFilter; label: string; icon: string }[] = [
    { id: 'for_you', label: 'Latest', icon: '◷' },
    { id: 'following', label: 'Following', icon: '👥' },
    { id: 'global', label: 'Global Feed', icon: '🌐' },
    { id: 'my_country', label: 'My Location', icon: '⌖' },
    { id: 'trending', label: 'Trending', icon: '↗' },
  ];

  return (
    <div className="feed-filter-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`feed-filter-tab ${
            activeFilter === tab.id ? 'feed-filter-tab--active' : ''
          }`}
          onClick={() => onSelectFilter(tab.id)}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
