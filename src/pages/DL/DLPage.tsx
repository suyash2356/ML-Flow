import React from 'react';
import type { NavigationPage, Project } from '../../types';
import { DL_STAGES, DL_ENCYCLOPEDIA_CARDS } from '../../config/dlData';
import { LearningTemplatePage } from '../../components/Learning/LearningTemplatePage';

interface DLPageProps {
  onNavigate: (page: NavigationPage) => void;
  onStartDLProject: () => void;
  onOpenWorkspace: (project: Project) => void;
}

export function DLPage({}: DLPageProps) {
  return (
    <div className="dl-page-container" style={{ width: '100%' }}>
      <LearningTemplatePage
        pageTitle="Deep Learning Studio"
        pageSubtitle="Design neural architectures, inspect multi-dimensional tensor flow, configure activation layers, and train deep models."
        categoryBadge="Phase 03 • Deep Representations"
        levelBadge="Advanced Architect"
        progressPercentage={20}
        stages={DL_STAGES}
        cards={DL_ENCYCLOPEDIA_CARDS}
        defaultTab="arch-lab"
      />
    </div>
  );
}
