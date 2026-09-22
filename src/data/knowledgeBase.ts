import type { KnowledgeTopic } from '../types';

export const RANDOM_FOREST_TOPIC: KnowledgeTopic = {
  id: 'random-forest',
  slug: 'random-forest',
  category: 'ML',
  title: 'Random Forest',
  summary: 'A strong general-purpose choice for structured/tabular data. It combines many decision trees to produce a stronger and more stable prediction than a single tree.',
  difficulty: 'Beginner',
  bestFor: 'Structured/tabular data',
  useWhen: [
    'Your data is mostly tabular',
    'Relationships may be non-linear',
    'You want a strong baseline quickly',
    'You have mixed feature importance',
    'You don\'t want heavy feature scaling'
  ],
  avoidWhen: [
    'You need a very small model for edge devices',
    'Interpretability is the highest priority',
    'You have extremely high-dimensional sparse data (e.g. text TF-IDF)'
  ],
  dataRequirements: [
    'Missing values handled (though some implementations tolerate them)',
    'Categorical values encoded (One-Hot or Ordinal)',
    'Target defined',
    'Scaling not strictly required'
  ],
  prerequisites: [
    'Identify the target column',
    'Remove obvious leakage',
    'Split your data correctly'
  ],
  howItWorks: 'Instead of relying on one decision tree, Random Forest creates hundreds of distinct decision trees. Each tree looks at different random samples of the data and random subsets of features. Their predictions are combined (majority vote for classification, average for regression) into a final result, preventing the model from overfitting to noise.',
  advantages: [
    'Strong baseline',
    'Handles non-linear relationships',
    'Little feature scaling required',
    'Works well on many tabular problems',
    'Useful feature importance information'
  ],
  limitations: [
    'Less interpretable than a single decision tree',
    'Larger models require more compute and memory',
    'Can still overfit if depth is unrestricted'
  ],
  commonMistakes: [
    'Training without a proper validation strategy.',
    'Ignoring data leakage.',
    'Over-tuning before establishing a baseline.'
  ],
  importantParameters: [
    {
      name: 'Number of Trees (n_estimators)',
      description: 'Controls how many trees are used.',
      effectIfIncreased: 'Better performance, but slower training and prediction.',
      effectIfDecreased: 'Faster, but potentially less accurate.',
      recommendedStart: '100'
    },
    {
      name: 'Max Depth',
      description: 'Controls how complex each tree can become.',
      effectIfIncreased: 'More complex patterns, higher risk of overfitting.',
      effectIfDecreased: 'Simpler models, higher risk of underfitting.',
      recommendedStart: 'None (or 10-20 to prevent overfitting)'
    }
  ],
  evaluationMetrics: [
    'Accuracy (Balanced data)',
    'F1 Score / ROC-AUC (Imbalanced data)',
    'RMSE / MAE (Regression)'
  ],
  recommendedPipeline: [
    { id: '1', name: 'Dataset', description: 'Input your tabular data.', nodeType: 'dataset' },
    { id: '2', name: 'Missing Value Handling', description: 'Impute or drop missing data.', nodeType: 'imputer' },
    { id: '3', name: 'Categorical Encoding', description: 'Encode categories to numbers.', nodeType: 'encoder' },
    { id: '4', name: 'Train/Test Split', description: 'Reserve data for evaluation.', nodeType: 'split' },
    { id: '5', name: 'Random Forest', description: 'Train the model.', nodeType: 'model' },
    { id: '6', name: 'Evaluation', description: 'Calculate metrics.', nodeType: 'evaluate' }
  ],
  exampleProject: {
    name: 'Customer Churn Prediction',
    description: 'Predict whether a telecom customer is likely to leave based on their usage history and demographics.',
    dataset: '10,000 customers, 14 features, Binary target',
    problemType: 'Classification',
    pipeline: ['Dataset', 'EDA', 'Missing Value Handling', 'Encoding', 'Train/Test Split', 'Random Forest', 'Evaluation']
  }
};

export const MISSING_VALUES_TOPIC: KnowledgeTopic = {
  id: 'missing-values',
  slug: 'missing-values',
  category: 'EDA',
  title: 'Missing Value Analysis',
  summary: 'Identify and handle gaps in your dataset before they distort your analysis and model training.',
  difficulty: 'Beginner',
  bestFor: 'Any dataset with nulls or empty strings.',
  useWhen: [
    'You are exploring a new dataset for the first time',
    'Your model throws errors about NaN values',
    'You suspect data collection issues'
  ],
  avoidWhen: [
    'N/A (Always check for missing values)'
  ],
  dataRequirements: [
    'Raw tabular data'
  ],
  prerequisites: [
    'Load the dataset'
  ],
  howItWorks: 'Missing value analysis calculates the percentage of nulls in each column and identifies patterns. For example, if "Age" and "Income" are always missing together, it might indicate a specific group of users skipped a survey page.',
  advantages: [
    'Prevents model training crashes',
    'Identifies data collection flaws',
    'Guides imputation strategies'
  ],
  limitations: [
    'Cannot magically restore lost information',
    'Imputation can introduce bias if done incorrectly'
  ],
  commonMistakes: [
    'Dropping rows with any missing values (you might lose 80% of your data!).',
    'Filling missing values with 0 when 0 has a real meaning (e.g. Temperature = 0).',
    'Imputing before splitting data (Data Leakage).'
  ],
  recommendedPipeline: [
    { id: '1', name: 'Dataset', description: 'Load raw data.', nodeType: 'dataset' },
    { id: '2', name: 'Data Profiler', description: 'Calculate missing % per column.', nodeType: 'profiler' },
    { id: '3', name: 'Missing Value Handler', description: 'Drop >80% missing, Impute others.', nodeType: 'imputer' }
  ]
};

export const CNN_TOPIC: KnowledgeTopic = {
  id: 'cnn',
  slug: 'cnn',
  category: 'DL',
  title: 'Convolutional Neural Networks (CNN)',
  summary: 'The standard deep learning architecture for processing grid-like data, such as images and video.',
  difficulty: 'Intermediate',
  bestFor: 'Images, Video, Spatial patterns',
  useWhen: [
    'You are working with image data',
    'Features have spatial relationships (pixels near each other matter)',
    'You want to detect objects, classify images, or segment regions'
  ],
  avoidWhen: [
    'Working with standard tabular data',
    'Working with purely sequential text data'
  ],
  dataRequirements: [
    'Images resized to a consistent dimension (e.g., 224x224)',
    'Pixel values normalized (e.g., 0 to 1 or -1 to 1)',
    'Labels provided (for supervised tasks)'
  ],
  prerequisites: [
    'Understand tensor shapes',
    'Ensure you have access to a GPU for training'
  ],
  howItWorks: 'CNNs use "convolutional filters" that slide across an image to detect patterns like edges, textures, and eventually complex shapes (like eyes or wheels). By combining these filters with pooling (downsampling), the network learns a hierarchy of spatial features without needing a manual feature engineering step.',
  advantages: [
    'State-of-the-art for image tasks',
    'Automatically learns hierarchical features',
    'Translation invariant (detects an object regardless of where it is in the image)'
  ],
  limitations: [
    'Requires large amounts of labeled data (unless using transfer learning)',
    'Computationally expensive to train from scratch',
    'Prone to overfitting on small datasets without augmentation'
  ],
  commonMistakes: [
    'Training a massive CNN from scratch on a small dataset (use Transfer Learning instead!).',
    'Forgetting to normalize pixel values.',
    'Not using data augmentation to artificially expand the dataset.'
  ],
  recommendedPipeline: [
    { id: '1', name: 'Image Dataset', description: 'Load image folders.', nodeType: 'image_dataset' },
    { id: '2', name: 'Resize & Normalize', description: 'Standardize inputs.', nodeType: 'image_preprocess' },
    { id: '3', name: 'Data Augmentation', description: 'Flip, rotate, crop.', nodeType: 'augmentation' },
    { id: '4', name: 'Transfer Learning CNN', description: 'Load pre-trained ResNet/VGG.', nodeType: 'dl_model' },
    { id: '5', name: 'Training', description: 'Train the classifier head.', nodeType: 'train_dl' },
    { id: '6', name: 'Evaluation', description: 'Accuracy and Confusion Matrix.', nodeType: 'evaluate' }
  ]
};

export const MOCK_KNOWLEDGE_BASE = [
  RANDOM_FOREST_TOPIC,
  MISSING_VALUES_TOPIC,
  CNN_TOPIC
];
