import type { NavigationPage, Project } from '../../types';
import { ML_STAGES, ML_ENCYCLOPEDIA_CARDS } from '../../config/mlData';
import { LearningTemplatePage } from '../../components/Learning/LearningTemplatePage';

interface MLPageProps {
  onNavigate: (page: NavigationPage) => void;
  onStartMLProject: () => void;
  onOpenWorkspace: (project: Project) => void;
}

export function MLPage({}: MLPageProps) {
  return (
    <div className="ml-page-container" style={{ width: '100%' }}>
      <LearningTemplatePage
        category="ML"
        pageTitle="Classical Machine Learning"
        pageSubtitle="Master supervised and unsupervised algorithms, validation strategies, hyperparameter optimization, and ensemble techniques."
        categoryBadge="Phase 02 · Core Modeling"
        levelBadge="Practitioner"
        progressPercentage={45}
        stages={ML_STAGES}
        cards={ML_ENCYCLOPEDIA_CARDS}
        defaultTab="encyclopedia"
      />
    </div>
  );
}
