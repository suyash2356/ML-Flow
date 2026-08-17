export type NavigationPage =
  | 'dashboard'
  | 'eda'
  | 'ml'
  | 'dl'
  | 'projects'
  | 'datasets'
  | 'workspace'
  | 'profile'
  | 'settings';

export interface NavItem {
  id: NavigationPage;
  label: string;
  subtitle?: string;
  icon: string;
  badge?: string;
}

export interface TrainingRun {
  id: string;
  model: string;
  accuracy: number;
  f1Score: number;
  trainingTime: string;
  status: 'Completed' | 'Running' | 'Failed';
}

export interface Project {
  id: string;
  name: string;
  type: 'EDA' | 'ML' | 'DL';
  description: string;
  datasetName: string;
  lastModified: string;
  status: 'In Progress' | 'Completed' | 'Draft';
  isFavorite?: boolean;
  accuracy?: string;
  nodesCount: number;
}

export interface DatasetItem {
  id: string;
  name: string;
  rows: number;
  columns: number;
  size: string;
  uploadedAt: string;
  source: 'Upload' | 'Kaggle' | 'Sample';
  format: 'CSV' | 'Parquet' | 'JSON';
}

export interface KaggleDatasetPlaceholder {
  id: string;
  title: string;
  downloads: string;
  usability: string;
  size: string;
  tags: string[];
}

export interface LearningModule {
  id: string;
  title: string;
  category: 'EDA' | 'ML' | 'DL';
  summary: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  icon: string;
  topics: string[];
}

export interface CanvasNodeData {
  id: string;
  title: string;
  subtitle: string;
  type: 'input' | 'preprocessing' | 'model' | 'eval';
  x: number;
  y: number;
  status?: 'completed' | 'active' | 'selected' | 'idle' | 'running' | 'success' | 'error';
  config?: Record<string, string | number>;
}

export interface CanvasConnection {
  id: string;
  sourceId: string;
  targetId: string;
}

export interface UserProfile {
  name: string;
  handle: string;
  role: string;
  avatar: string;
  bio: string;
  location: string;
  joinedDate: string;
  completedProjects: number;
  totalModelsTrained: number;
  topAccuracy: string;
  skills: { name: string; level: number }[];
  achievements: { title: string; desc: string; date: string; icon: string }[];
}
