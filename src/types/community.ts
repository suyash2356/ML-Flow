export type PostMode = 'thought' | 'resource' | 'question' | 'project';
export type FeedFilter = 'for_you' | 'following' | 'global' | 'my_country' | 'trending';

export interface PostComment {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
}

export interface LinkPreview {
  title: string;
  domain: string;
  description: string;
  thumbnailUrl?: string;
  url: string;
}

export interface AttachedProjectSummary {
  id: string;
  name: string;
  datasetName: string;
  taskType: 'Classification' | 'Regression' | 'Clustering' | 'EDA' | 'Computer Vision' | 'ML' | 'DL';
  metricAchieved?: string;
  nodesCount: number;
}

export interface PostItem {
  id: string;
  authorId?: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorRole: string;
  authorCountry: string;
  authorFlag?: string;
  authorLocation?: string;
  timestamp: string;
  mode: PostMode;
  textContent: string;
  tags: string[];
  codeSnippet?: string;
  linkPreview?: LinkPreview;
  attachedProject?: AttachedProjectSummary;
  showcaseId?: string;
  likesCount: number;
  commentsCount: number;
  forksCount?: number;
  liked?: boolean;
  saved?: boolean;
  comments?: PostComment[];
}

export interface CountryMemberPin {
  countryCode: string;
  countryName: string;
  flag: string;
  xPercent: number; // For SVG map overlay positioning
  yPercent: number;
  memberCount: number;
  topMembers: { name: string; avatar: string; role: string }[];
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  datasetName: string;
  description: string;
  deadline: string;
  participantsCount: number;
  prize: string;
  leaderboard: { rank: number; name: string; avatar: string; score: string; metric: string }[];
}

export interface MentorMatch {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: string;
  skills: string[];
  timezone: string;
  matchReason: string;
  matchPercentage: number;
}

export interface TrendingItem {
  id: string;
  name: string;
  category: 'Algorithm' | 'Dataset' | 'Pipeline Template' | 'Notebook';
  usageCount: number;
  growth: string;
}

// ============================================================
// LEARNING & ENCYCLOPEDIA TYPES
// ============================================================

export type DifficultyLevel = 'Beginner' | 'Practitioner' | 'Expert';
export type LearningCategory = 'EDA' | 'ML' | 'DL';
export type StageId = 'foundations' | 'core' | 'eval_tuning' | 'advanced';

export interface LearningModuleNode {
  id: string;
  title: string;
  estimatedMinutes: number;
  difficulty: DifficultyLevel;
  completed: boolean;
  locked: boolean;
  category: LearningCategory;
  stageId: StageId;
  encyclopediaId: string;
}

export interface LearningStage {
  id: StageId;
  title: string;
  subtitle: string;
  modules: LearningModuleNode[];
}

export interface PlaygroundParam {
  name: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit?: string;
  description: string;
}

export interface EncyclopediaCardData {
  id: string;
  title: string;
  category: LearningCategory;
  difficulty: DifficultyLevel;
  stageId: StageId;
  shortSummary: string;
  icon: string;
  tags: string[];
  content: {
    whatItIs: string;
    whyItExists: string;
    howItWorks: {
      steps: string[];
      mathFormula?: string;
      visualDiagramText?: string;
    };
    whenToUse: {
      useCases: string[];
      avoidWhen: string[];
      alternatives: string[];
    };
    pitfalls: string[];
    playground: {
      title: string;
      description: string;
      params: PlaygroundParam[];
      chartType: 'distribution' | 'boundary' | 'clustering' | 'neural' | 'correlation' | 'regression';
    };
    realProjectCTA: {
      label: string;
      templateType: 'EDA' | 'ML' | 'DL';
    };
  };
}

export interface CommunitySolution {
  id: string;
  authorName: string;
  authorAvatar: string;
  projectName: string;
  accuracy: string;
  stars: number;
  description: string;
}
