import { useState } from 'react';
import type {
  LearningStage,
  EncyclopediaCardData,
  LearningModuleNode,
  DifficultyLevel,
  LearningCategory,
  DatasetItem,
} from '../../types';
import { MOCK_DATASETS } from '../../config/mockData';
import { LearningHero } from './LearningHero';
import { LearningPathRail } from './LearningPathRail';
import { AlgorithmCard } from './AlgorithmCard';
import { AlgorithmDetailPanel } from './AlgorithmDetailPanel';
import { GuidedProjectWizard } from './GuidedProjectWizard';
import { ArchitectureDesignLab } from './ArchitectureDesignLab';
import { CommunityInContext } from './CommunityInContext';
import { AssessmentSection } from './AssessmentSection';
import './LearningTemplatePage.css';

interface LearningTemplatePageProps {
  pageTitle: string;
  pageSubtitle: string;
  categoryBadge: string;
  levelBadge: DifficultyLevel;
  progressPercentage: number;
  stages: LearningStage[];
  cards: EncyclopediaCardData[];
  defaultTab?: 'encyclopedia' | 'wizard' | 'arch-lab' | 'community' | 'assessment';
}

export const LearningTemplatePage: React.FC<LearningTemplatePageProps> = ({
  pageTitle,
  pageSubtitle,
  categoryBadge,
  levelBadge,
  progressPercentage,
  stages,
  cards,
  defaultTab = 'encyclopedia',
}) => {
  const [activeTab, setActiveTab] = useState<'encyclopedia' | 'wizard' | 'arch-lab' | 'community' | 'assessment'>(defaultTab);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('m1');
  const [selectedCard, setSelectedCard] = useState<EncyclopediaCardData | null>(null);

  // Search & Filters for Encyclopedia
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'Beginner' | 'Intermediate' | 'Advanced'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter categories dynamically from cards
  const categories = ['all', ...Array.from(new Set(cards.map((c) => c.category)))];

  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.shortSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDiff = selectedDifficulty === 'all' || card.difficulty === selectedDifficulty;
    const matchesCat = selectedCategory === 'all' || card.category === selectedCategory;
    return matchesSearch && matchesDiff && matchesCat;
  });

  const handleSelectModule = (mod: LearningModuleNode) => {
    setSelectedModuleId(mod.id);
    const match = cards.find((c) => c.id.toLowerCase() === mod.id.toLowerCase());
    if (match) {
      setSelectedCard(match);
      setActiveTab('encyclopedia');
    }
  };

  const wizardCategory: LearningCategory = categoryBadge.includes('EDA')
    ? 'EDA'
    : categoryBadge.includes('DL')
    ? 'DL'
    : 'ML';

  return (
    <div className="learning-template-page">
      {/* Top Hero Banner */}
      <LearningHero
        title={pageTitle}
        subtitle={pageSubtitle}
        categoryBadge={categoryBadge}
        levelBadge={levelBadge}
        progressPercentage={progressPercentage}
        onResume={() => {
          setActiveTab('encyclopedia');
          if (cards.length > 0) setSelectedCard(cards[0]);
        }}
        onStartGuidedProject={() => {
          setActiveTab('wizard');
        }}
      />

      {/* Main Two-Column Layout */}
      <div className="learning-content-layout">
        {/* Left Rail: Roadmap Tree */}
        <aside className="learning-left-rail-wrap">
          <LearningPathRail
            stages={stages}
            activeModuleId={selectedModuleId}
            onSelectModule={handleSelectModule}
          />
        </aside>

        {/* Center/Main Area */}
        <main className="learning-main-area">
          {/* Section Navigation Tabs */}
          <div className="learning-section-tabs">
            <button
              className={`sec-tab-btn ${activeTab === 'encyclopedia' ? 'active' : ''}`}
              onClick={() => setActiveTab('encyclopedia')}
            >
              📚 Encyclopedia ({cards.length})
            </button>
            <button
              className={`sec-tab-btn ${activeTab === 'wizard' ? 'active' : ''}`}
              onClick={() => setActiveTab('wizard')}
            >
              ⚡ Guided Project Builder
            </button>
            <button
              className={`sec-tab-btn ${activeTab === 'arch-lab' ? 'active' : ''}`}
              onClick={() => setActiveTab('arch-lab')}
            >
              🛠️ Architecture Lab
            </button>
            <button
              className={`sec-tab-btn ${activeTab === 'community' ? 'active' : ''}`}
              onClick={() => setActiveTab('community')}
            >
              👥 Community Hub
            </button>
            <button
              className={`sec-tab-btn ${activeTab === 'assessment' ? 'active' : ''}`}
              onClick={() => setActiveTab('assessment')}
            >
              📝 Assessment & Cert
            </button>
          </div>

          {/* TAB 1: ENCYCLOPEDIA */}
          {activeTab === 'encyclopedia' && (
            <div className="encyclopedia-view-container">
              {/* Search & Filter Toolbar */}
              <div className="encyclopedia-toolbar">
                <div className="search-box">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Search concepts, algorithms, parameters..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button className="clear-search-btn" onClick={() => setSearchQuery('')}>×</button>
                  )}
                </div>

                <div className="filters-group">
                  <div className="filter-item">
                    <label>Difficulty:</label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                    >
                      <option value="all">All Levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="filter-item">
                    <label>Category:</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat === 'all' ? 'All Categories' : cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Cards Grid */}
              <div className="encyclopedia-grid">
                {filteredCards.length > 0 ? (
                  filteredCards.map((card) => (
                    <AlgorithmCard
                      key={card.id}
                      card={card}
                      onOpenDetail={(c) => setSelectedCard(c)}
                    />
                  ))
                ) : (
                  <div className="encyclopedia-empty">
                    <p>No algorithms or concepts matched "{searchQuery}".</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedDifficulty('all');
                        setSelectedCategory('all');
                      }}
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: GUIDED PROJECT BUILDER */}
          {activeTab === 'wizard' && (
            <GuidedProjectWizard
              category={wizardCategory}
              datasets={MOCK_DATASETS as DatasetItem[]}
              onStartProject={(cfg) => {
                alert(`Exporting "${cfg.name}" using dataset "${cfg.dataset}" to visual canvas workspace!`);
              }}
            />
          )}

          {/* TAB 3: ARCHITECTURE / DESIGN LAB */}
          {activeTab === 'arch-lab' && (
            <ArchitectureDesignLab />
          )}

          {/* TAB 4: COMMUNITY IN CONTEXT */}
          {activeTab === 'community' && (
            <CommunityInContext topicTitle={pageTitle} />
          )}

          {/* TAB 5: ASSESSMENT & CERTIFICATION */}
          {activeTab === 'assessment' && (
            <AssessmentSection
              moduleTitle={pageTitle}
              stageName={stages[0]?.title || 'Foundation'}
            />
          )}
        </main>
      </div>

      {/* 7-Tab Detail Modal for Encyclopedia Cards */}
      {selectedCard && (
        <AlgorithmDetailPanel
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onUseInProject={(c) => {
            alert(`Opening ML Flow workspace template preconfigured for: ${c.title}`);
            setSelectedCard(null);
          }}
        />
      )}
    </div>
  );
};
