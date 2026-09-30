import type { NavigationPage, Project } from '../../types';
import { EDA_STAGES, EDA_ENCYCLOPEDIA_CARDS } from '../../config/edaData';
import { LearningTemplatePage } from '../../components/Learning/LearningTemplatePage';

interface EDAPageProps {
  onNavigate: (page: NavigationPage) => void;
  onStartEDAProject: () => void;
  onOpenWorkspace: (project: Project) => void;
}

export function EDAPage({}: EDAPageProps) {
  return (
    <div className="eda-page-container" style={{ width: '100%' }}>
      <LearningTemplatePage
        category="EDA"
        pageTitle="Exploratory Data Analysis"
        pageSubtitle="Understand data distributions, uncover correlations, clean anomalies, and engineer robust features before model training."
        categoryBadge="Phase 01 · Data Foundations"
        levelBadge="Beginner–Advanced"
        progressPercentage={35}
        stages={EDA_STAGES}
        cards={EDA_ENCYCLOPEDIA_CARDS}
        defaultTab="encyclopedia"
      />
    </div>
  );
}
