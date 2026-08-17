import type { NavItem, TrainingRun } from '../types';

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    subtitle: 'Overview & Recent',
    icon: 'dashboard',
  },
  {
    id: 'eda',
    label: 'EDA',
    subtitle: 'Exploratory Analysis',
    icon: 'chart',
  },
  {
    id: 'ml',
    label: 'ML',
    subtitle: 'Machine Learning',
    icon: 'model',
  },
  {
    id: 'dl',
    label: 'DL',
    subtitle: 'Deep Learning',
    icon: 'network',
  },
  {
    id: 'projects',
    label: 'Projects',
    subtitle: 'All Workspaces',
    icon: 'folder',
  },
  {
    id: 'datasets',
    label: 'Datasets',
    subtitle: 'Data Hub & Kaggle',
    icon: 'database',
  },
];

export const INITIAL_TRAINING_RUNS: TrainingRun[] = [
  {
    id: 'RF #112',
    model: 'RF',
    accuracy: 0.86,
    f1Score: 0.83,
    trainingTime: '1m 30s',
    status: 'Completed',
  },
];

export const APP_CONFIG = {
  name: 'ML Flow',
  tagline: 'Visual No-Code ML Workspace',
  userInitials: 'AK',
  version: '3.1',
} as const;
