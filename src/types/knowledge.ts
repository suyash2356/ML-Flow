export type KnowledgeCategory = 'EDA' | 'ML' | 'DL';

export interface PipelineStep {
  id: string;
  name: string;
  description: string;
  nodeType?: string; // Maps to ML Flow Workspace Node Type
}

export interface ExampleProject {
  name: string;
  description: string;
  dataset: string;
  problemType: string;
  pipeline: string[];
}

export interface KnowledgeTopic {
  id: string;
  slug: string;
  category: KnowledgeCategory;
  title: string;
  summary: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  
  // Level 1: Quick Decision
  bestFor: string;
  useWhen: string[];
  avoidWhen: string[];
  dataRequirements: string[];
  
  // Level 2: Practical Understanding
  prerequisites: string[];
  howItWorks: string;
  advantages: string[];
  limitations: string[];
  commonMistakes: string[];
  
  // Specific to ML/DL (Algorithms)
  importantParameters?: {
    name: string;
    description: string;
    effectIfIncreased: string;
    effectIfDecreased: string;
    recommendedStart: string;
  }[];
  evaluationMetrics?: string[];
  
  // Level 3: Implementation
  recommendedPipeline: PipelineStep[];
  exampleProject?: ExampleProject;
}

export interface KnowledgeSection {
  title: string;
  topics: KnowledgeTopic[];
}
