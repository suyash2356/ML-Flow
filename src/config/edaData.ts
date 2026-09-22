import type { EncyclopediaCardData, LearningStage } from '../types';

export const EDA_STAGES: LearningStage[] = [
  {
    id: 'foundations',
    title: 'Stage 1: Data Hygiene & Inspection',
    subtitle: 'Identify missing patterns, data types, and initial data health',
    modules: [
      {
        id: 'eda-m1',
        title: 'Missing Value Analysis',
        estimatedMinutes: 12,
        difficulty: 'Beginner',
        completed: true,
        locked: false,
        category: 'EDA',
        stageId: 'foundations',
        encyclopediaId: 'eda-missing-values',
      },
      {
        id: 'eda-m2',
        title: 'Outlier Detection (Z-Score & IQR)',
        estimatedMinutes: 15,
        difficulty: 'Beginner',
        completed: true,
        locked: false,
        category: 'EDA',
        stageId: 'foundations',
        encyclopediaId: 'eda-outliers',
      },
      {
        id: 'eda-m3',
        title: 'Distribution Analysis (Skewness & Kurtosis)',
        estimatedMinutes: 15,
        difficulty: 'Beginner',
        completed: false,
        locked: false,
        category: 'EDA',
        stageId: 'foundations',
        encyclopediaId: 'eda-distributions',
      },
    ],
  },
  {
    id: 'core',
    title: 'Stage 2: Bivariate & Feature Relationships',
    subtitle: 'Uncover patterns, correlations, and feature-target relationships',
    modules: [
      {
        id: 'eda-m4',
        title: 'Univariate, Bivariate & Multivariate Viz',
        estimatedMinutes: 18,
        difficulty: 'Practitioner',
        completed: false,
        locked: false,
        category: 'EDA',
        stageId: 'core',
        encyclopediaId: 'eda-visualization',
      },
      {
        id: 'eda-m5',
        title: 'Correlation & Multicollinearity',
        estimatedMinutes: 20,
        difficulty: 'Practitioner',
        completed: false,
        locked: false,
        category: 'EDA',
        stageId: 'core',
        encyclopediaId: 'eda-correlation',
      },
    ],
  },
  {
    id: 'eval_tuning',
    title: 'Stage 3: Transformation & Encoding',
    subtitle: 'Prepare variables for machine learning models',
    modules: [
      {
        id: 'eda-m6',
        title: 'Feature Encoding (One-Hot vs Target)',
        estimatedMinutes: 15,
        difficulty: 'Practitioner',
        completed: false,
        locked: false,
        category: 'EDA',
        stageId: 'eval_tuning',
        encyclopediaId: 'eda-encoding',
      },
      {
        id: 'eda-m7',
        title: 'Feature Scaling (Standard vs Robust)',
        estimatedMinutes: 14,
        difficulty: 'Practitioner',
        completed: false,
        locked: false,
        category: 'EDA',
        stageId: 'eval_tuning',
        encyclopediaId: 'eda-scaling',
      },
    ],
  },
  {
    id: 'advanced',
    title: 'Stage 4: Advanced Feature Engineering & Hygiene',
    subtitle: 'Construct new signals and prevent data contamination',
    modules: [
      {
        id: 'eda-m8',
        title: 'Feature Engineering Basics',
        estimatedMinutes: 22,
        difficulty: 'Expert',
        completed: false,
        locked: true,
        category: 'EDA',
        stageId: 'advanced',
        encyclopediaId: 'eda-feature-engineering',
      },
      {
        id: 'eda-m9',
        title: 'Data Leakage Awareness & Prevention',
        estimatedMinutes: 20,
        difficulty: 'Expert',
        completed: false,
        locked: true,
        category: 'EDA',
        stageId: 'advanced',
        encyclopediaId: 'eda-data-leakage',
      },
    ],
  },
];

export const EDA_ENCYCLOPEDIA_CARDS: EncyclopediaCardData[] = [
  {
    id: 'eda-missing-values',
    title: 'Missing Value Analysis',
    category: 'EDA',
    difficulty: 'Beginner',
    stageId: 'foundations',
    shortSummary: 'Detect missing patterns (MCAR, MAR, MNAR) and apply mean/median/KNN imputation.',
    icon: '🧹',
    tags: ['Imputation', 'Null Matrix', 'Data Cleaning'],
    content: {
      whatItIs:
        'Missing Value Analysis evaluates incomplete cells in your dataset. It determines whether data is missing at random or due to systematic data collection failures.',
      whyItExists:
        'Most machine learning models (like Logistic Regression and SVMs) crash when encountering NaN or null values. Proper imputation prevents throwing away valuable rows.',
      howItWorks: {
        steps: [
          'Calculate null percentage per column to flag severely missing attributes (>40%).',
          'Classify missing mechanism: MCAR (completely random), MAR (random given observed data), or MNAR (not random).',
          'Apply appropriate strategy: Mean/Median for continuous variables, Mode for categorical, or KNN Imputer for correlated features.',
        ],
        mathFormula: 'KNN\\ Imputation:\\ \\hat{y}_i = \\frac{\\sum_{k \\in N_i} w_k y_k}{\\sum_{k \\in N_i} w_k}',
        visualDiagramText: '[ Raw Data ] ➔ [ Null Heatmap ] ➔ [ Imp. Strategy ] ➔ [ Clean Dataset ]',
      },
      whenToUse: {
        useCases: [
          'Tabular datasets with <30% missing values per feature.',
          'Surveys where optional questions resulted in NaN responses.',
        ],
        avoidWhen: [
          'Columns with >70% missing values (prefer dropping the column unless missingness is a feature itself).',
        ],
        alternatives: ['Iterative MICE Imputer', 'XGBoost native missing value handling'],
      },
      pitfalls: [
        'Fitting mean/median imputers before train/test splitting leads to target data leakage.',
        'Using mean imputation on highly skewed distributions distorts the feature variance.',
      ],
      playground: {
        title: 'Imputation Threshold Simulator',
        description: 'Adjust null ratio threshold and imputation strategy to observe dataset row retention.',
        params: [
          {
            name: 'nullThreshold',
            label: 'Column Drop Threshold (%)',
            min: 10,
            max: 80,
            step: 5,
            defaultValue: 35,
            unit: '%',
            description: 'Columns with null % above this will be dropped.',
          },
          {
            name: 'kNeighbors',
            label: 'KNN Neighbors (K)',
            min: 1,
            max: 15,
            step: 1,
            defaultValue: 5,
            unit: 'k',
            description: 'Number of nearest neighbors used for imputation.',
          },
        ],
        chartType: 'distribution',
      },
      realProjectCTA: {
        label: 'Launch EDA Missing Value Pipeline',
        templateType: 'EDA',
      },
    },
  },
  {
    id: 'eda-outliers',
    title: 'Outlier Detection (Z-Score & IQR)',
    category: 'EDA',
    difficulty: 'Beginner',
    stageId: 'foundations',
    shortSummary: 'Identify extreme anomalies using 1.5x IQR boxplot bounds and Z-score standard deviations.',
    icon: '🎯',
    tags: ['Outliers', 'Boxplot', 'IQR', 'Z-Score'],
    content: {
      whatItIs:
        'Outlier detection flags extreme data points that deviate significantly from the rest of the sample distribution.',
      whyItExists:
        'Unfiltered outliers distort linear model coefficients, inflate mean squared error (MSE), and skew feature scaling.',
      howItWorks: {
        steps: [
          'Compute Interquartile Range: IQR = Q3 - Q1.',
          'Define lower bound (Q1 - 1.5*IQR) and upper bound (Q3 + 1.5*IQR).',
          'Alternatively, calculate Z-score: Z = (X - μ) / σ. Flag values with |Z| > 3.',
        ],
        mathFormula: 'Z = \\frac{X - \\mu}{\\sigma},\\ \\quad \\text{IQR} = Q_3 - Q_1',
        visualDiagramText: '[ Lower Bound Q1 - 1.5IQR ] <---- [ Q1 | Median | Q3 ] ----> [ Upper Bound Q3 + 1.5IQR ]',
      },
      whenToUse: {
        useCases: ['Financial transaction auditing', 'Sensor telemetry cleaning', 'House pricing datasets'],
        avoidWhen: ['Fraud detection tasks where outliers ARE the positive target class!'],
        alternatives: ['Isolation Forest', 'Local Outlier Factor (LOF)', 'Mahalanobis Distance'],
      },
      pitfalls: [
        'Blindly truncating or deleting outliers without understanding business context.',
        'Applying Z-score filtering to non-Gaussian / skewed distributions.',
      ],
      playground: {
        title: 'IQR Outlier Threshold Tuner',
        description: 'Adjust the IQR multiplier to observe outlier capping on sample distribution.',
        params: [
          {
            name: 'iqrMultiplier',
            label: 'IQR Multiplier',
            min: 1.0,
            max: 3.0,
            step: 0.1,
            defaultValue: 1.5,
            description: 'Standard value is 1.5x. Higher values are less aggressive.',
          },
        ],
        chartType: 'distribution',
      },
      realProjectCTA: {
        label: 'Run Outlier Profiling in Workspace',
        templateType: 'EDA',
      },
    },
  },
  {
    id: 'eda-distributions',
    title: 'Distribution Analysis (Skewness & Kurtosis)',
    category: 'EDA',
    difficulty: 'Beginner',
    stageId: 'foundations',
    shortSummary: 'Analyze Gaussian normality, bell-curve skewness, tail heaviness, and log-transformations.',
    icon: '📈',
    tags: ['Skewness', 'Kurtosis', 'Log Transform', 'Normality'],
    content: {
      whatItIs:
        'Distribution analysis examines the asymmetry (skewness) and peak tail thickness (kurtosis) of continuous numerical variables.',
      whyItExists:
        'Parametric models assume normally distributed inputs. Heavily right-skewed variables (like income or prices) compress feature spaces.',
      howItWorks: {
        steps: [
          'Plot histogram and KDE kernel density curve.',
          'Calculate skewness coefficient (positive = right tail, negative = left tail).',
          'Apply Log(X + 1) or Box-Cox transformation to normalize skewed features.',
        ],
        mathFormula: '\\text{Skew} = \\frac{E[(X-\\mu)^3]}{\\sigma^3}',
        visualDiagramText: '[ Right Skewed Curve ] ➔ [ Apply Log(X+1) ] ➔ [ Bell Curve Normal ]',
      },
      whenToUse: {
        useCases: ['Income, house prices, web traffic, expenditure data.'],
        avoidWhen: ['Tree-based models (Random Forest, XGBoost) which are invariant to monotonic transformations.'],
        alternatives: ['Yeo-Johnson transformation', 'Quantile Transformer'],
      },
      pitfalls: ['Attempting log transform on negative or zero numbers without offset (+1).'],
      playground: {
        title: 'Log Transformation Simulator',
        description: 'Adjust skewness level and apply log transform to see histogram normalization.',
        params: [
          {
            name: 'skewLevel',
            label: 'Raw Skewness Level',
            min: 0,
            max: 5,
            step: 0.5,
            defaultValue: 2.5,
            description: 'Higher values represent heavier right-tail skew.',
          },
        ],
        chartType: 'distribution',
      },
      realProjectCTA: {
        label: 'Build Distribution Profiler',
        templateType: 'EDA',
      },
    },
  },
  {
    id: 'eda-visualization',
    title: 'Univariate, Bivariate & Multivariate Viz',
    category: 'EDA',
    difficulty: 'Practitioner',
    stageId: 'core',
    shortSummary: 'Visualize single feature distributions, pair plots, scatter matrices, and heatmaps.',
    icon: '📊',
    tags: ['Pairplot', 'Scatter', 'Heatmap', 'EDA'],
    content: {
      whatItIs:
        'Comprehensive visualization technique plotting single attributes (univariate), feature pairs (bivariate), or multi-dimensional groupings.',
      whyItExists:
        'Visual inspection reveals clusters, non-linear relationships, and sub-group behavior that summary statistics miss (Anscombe’s Quartet).',
      howItWorks: {
        steps: [
          'Univariate: Histograms, KDE plots, and bar charts.',
          'Bivariate: Scatter plots, box plots grouped by class, and violin plots.',
          'Multivariate: Hue-encoded scatter matrices and 3D correlation heatmaps.',
        ],
        visualDiagramText: '[ Feature X vs Y ] ➔ [ Hue Class Encoding ] ➔ [ Cluster Separation ]',
      },
      whenToUse: {
        useCases: ['Initial data discovery phase before any model training.'],
        avoidWhen: ['High-dimensional data (>50 columns) where raw pair plots become illegible.'],
        alternatives: ['t-SNE', 'UMAP for high-dimensional reduction visualization'],
      },
      pitfalls: ['Overplotting dense scatter plots without adjusting alpha transparency.'],
      playground: {
        title: 'Scatter Cluster Inspector',
        description: 'Adjust separation and noise to test bivariate class separability.',
        params: [
          {
            name: 'clusterSep',
            label: 'Cluster Separation',
            min: 0.5,
            max: 3.5,
            step: 0.5,
            defaultValue: 2.0,
            description: 'Distance between bivariate class centers.',
          },
        ],
        chartType: 'boundary',
      },
      realProjectCTA: {
        label: 'Open Visualization Canvas',
        templateType: 'EDA',
      },
    },
  },
  {
    id: 'eda-correlation',
    title: 'Correlation & Multicollinearity',
    category: 'EDA',
    difficulty: 'Practitioner',
    stageId: 'core',
    shortSummary: 'Compute Pearson & Spearman correlation heatmaps and Variance Inflation Factor (VIF).',
    icon: '🔗',
    tags: ['Pearson', 'Spearman', 'Heatmap', 'VIF'],
    content: {
      whatItIs:
        'Correlation measures the strength and direction of a linear or monotonic relationship between two variables. Multicollinearity occurs when independent variables are highly correlated with each other.',
      whyItExists:
        'Multicollinearity inflates variance of coefficient estimates in regression, making model interpretation unstable and noisy.',
      howItWorks: {
        steps: [
          'Compute Pearson correlation r (-1 to +1) for linear relationships.',
          'Compute Spearman rank correlation for non-linear monotonic trends.',
          'Calculate VIF (Variance Inflation Factor). VIF > 5-10 indicates problematic collinearity.',
        ],
        mathFormula: 'r = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum (x_i - \\bar{x})^2 \\sum (y_i - \\bar{y})^2}}',
        visualDiagramText: '[ Correlation Matrix Heatmap ] ➔ [ Flag High VIF (>5) ] ➔ [ Drop Redundant Feature ]',
      },
      whenToUse: {
        useCases: ['Feature selection for Linear & Logistic Regression.'],
        avoidWhen: ['Non-monotonic non-linear relationships (use Mutual Information instead).'],
        alternatives: ['Mutual Information Score', 'PCA dimensionality reduction'],
      },
      pitfalls: ['Assuming correlation implies causation.', 'Relying only on linear Pearson correlation for non-linear relationships.'],
      playground: {
        title: 'Correlation Strength Simulator',
        description: 'Adjust correlation coefficient r to see scatter plot slope and VIF response.',
        params: [
          {
            name: 'corrCoeff',
            label: 'Correlation (r)',
            min: -1.0,
            max: 1.0,
            step: 0.1,
            defaultValue: 0.85,
            description: '1.0 is perfect positive linear correlation.',
          },
        ],
        chartType: 'correlation',
      },
      realProjectCTA: {
        label: 'Calculate Correlation Matrix',
        templateType: 'EDA',
      },
    },
  },
  {
    id: 'eda-encoding',
    title: 'Feature Encoding (One-Hot vs Target)',
    category: 'EDA',
    difficulty: 'Practitioner',
    stageId: 'eval_tuning',
    shortSummary: 'Convert categorical strings into numerical vectors via One-Hot, Ordinal, or Target Encoding.',
    icon: '🔤',
    tags: ['OneHot', 'TargetEncoding', 'Ordinal', 'Categorical'],
    content: {
      whatItIs:
        'Feature encoding transforms non-numeric categorical attributes (e.g. City, Gender, Status) into numeric format required by machine learning algorithms.',
      whyItExists:
        'Mathematical operations (dot products, distances) require numbers. Proper encoding preserves semantic relationship without imposing fake ordering.',
      howItWorks: {
        steps: [
          'Nominal categories (<10 unique): Apply One-Hot Encoding (OHE) creating binary dummy columns.',
          'Ordinal categories (Low, Med, High): Apply Ordinal Integer Encoding (1, 2, 3).',
          'High-cardinality categories (>50 unique): Apply Target Encoding (mean target value per category).',
        ],
        visualDiagramText: '[ "City": "NYC", "LA" ] ➔ One-Hot ➔ [ City_NYC: 1, City_LA: 0 ]',
      },
      whenToUse: {
        useCases: ['Tabular datasets with text categories.'],
        avoidWhen: ['High cardinality attributes with One-Hot (creates sparse exploding columns).'],
        alternatives: ['Frequency Encoding', 'CatBoost native encoding'],
      },
      pitfalls: ['Target encoding without cross-validation smoothing causes massive target leakage.'],
      playground: {
        title: 'Encoding Method Comparison',
        description: 'Toggle categories cardinality to see memory & column expansion effect.',
        params: [
          {
            name: 'cardinality',
            label: 'Unique Categories',
            min: 2,
            max: 50,
            step: 4,
            defaultValue: 8,
            description: 'Number of unique categorical strings.',
          },
        ],
        chartType: 'distribution',
      },
      realProjectCTA: {
        label: 'Encode Features in Workspace',
        templateType: 'EDA',
      },
    },
  },
  {
    id: 'eda-scaling',
    title: 'Feature Scaling (Standard vs Robust)',
    category: 'EDA',
    difficulty: 'Practitioner',
    stageId: 'eval_tuning',
    shortSummary: 'Normalize feature magnitudes via StandardScaler (Z-score) or RobustScaler (IQR).',
    icon: '⚖️',
    tags: ['StandardScaler', 'MinMaxScaler', 'RobustScaler'],
    content: {
      whatItIs:
        'Feature scaling aligns the numerical range of continuous variables so no single attribute dominates due to scale magnitude (e.g., Age 25 vs Income $100,000).',
      whyItExists:
        'Distance-based models (KNN, SVM, K-Means) and gradient descent optimizers fail when feature scales differ by orders of magnitude.',
      howItWorks: {
        steps: [
          'StandardScaler: Rescales to mean=0, std=1 (X - μ) / σ.',
          'MinMaxScaler: Bounds values into [0, 1] range.',
          'RobustScaler: Uses median and IQR (X - Q2) / IQR to resist outlier distortion.',
        ],
        mathFormula: 'X_{\\text{scaled}} = \\frac{X - \\mu}{\\sigma}',
        visualDiagramText: '[ Age: 20-80, Income: 10k-1M ] ➔ [ StandardScaler ] ➔ [ Both: -3.0 to +3.0 ]',
      },
      whenToUse: {
        useCases: ['Neural networks, SVMs, KNN, Logistic Regression, PCA.'],
        avoidWhen: ['Decision Trees, Random Forests, XGBoost (tree splits are scale invariant).'],
        alternatives: ['MaxAbsScaler', 'QuantileTransformer'],
      },
      pitfalls: ['Fitting scalers on validation/test datasets prior to splitting.'],
      playground: {
        title: 'Feature Scale Alignment Simulator',
        description: 'Adjust scale disparity and test distance convergence.',
        params: [
          {
            name: 'scaleRatio',
            label: 'Feature Scale Ratio',
            min: 1,
            max: 100,
            step: 10,
            defaultValue: 50,
            description: 'Ratio of Feature A variance to Feature B variance.',
          },
        ],
        chartType: 'distribution',
      },
      realProjectCTA: {
        label: 'Apply Feature Scaling Node',
        templateType: 'EDA',
      },
    },
  },
  {
    id: 'eda-feature-engineering',
    title: 'Feature Engineering Basics',
    category: 'EDA',
    difficulty: 'Expert',
    stageId: 'advanced',
    shortSummary: 'Create domain-specific signals via interaction terms, ratios, binning, and polynomial features.',
    icon: '⚙️',
    tags: ['FeatureCreation', 'Ratios', 'Binning', 'Polynomials'],
    content: {
      whatItIs:
        'Feature engineering is the process of using domain knowledge to extract new variables from raw data that make machine learning algorithms work better.',
      whyItExists:
        'Models can only learn from the representations given to them. Creating interaction ratios (e.g. Debt-to-Income ratio) exposes direct domain signal.',
      howItWorks: {
        steps: [
          'Interaction Terms: Multiply/divide related numeric columns (Debt / Income).',
          'Polynomial Features: Generate quadratic terms (X^2, X*Y) for linear models.',
          'Binning / Discretization: Convert continuous age into age brackets.',
        ],
        visualDiagramText: '[ Income & Debt ] ➔ Ratio Node ➔ [ Debt_To_Income_Ratio ]',
      },
      whenToUse: {
        useCases: ['Structured tabular data modeling to boost benchmark scores.'],
        avoidWhen: ['Raw image pixels or raw audio (deep learning learns features automatically).'],
        alternatives: ['Auto-feature engineering with Featuretools'],
      },
      pitfalls: ['Creating thousands of redundant polynomial features causing overfitting.'],
      playground: {
        title: 'Interaction Signal Generator',
        description: 'Test polynomial degree effect on model capacity.',
        params: [
          {
            name: 'polyDegree',
            label: 'Polynomial Degree',
            min: 1,
            max: 4,
            step: 1,
            defaultValue: 2,
            description: 'Degree of interaction features generated.',
          },
        ],
        chartType: 'regression',
      },
      realProjectCTA: {
        label: 'Engineer Features in Workspace',
        templateType: 'EDA',
      },
    },
  },
  {
    id: 'eda-data-leakage',
    title: 'Data Leakage Awareness & Prevention',
    category: 'EDA',
    difficulty: 'Expert',
    stageId: 'advanced',
    shortSummary: 'Detect and eliminate subtle target leakage and train-test contamination.',
    icon: '🛡️',
    tags: ['DataLeakage', 'TargetLeakage', 'PipelineHygiene'],
    content: {
      whatItIs:
        'Data leakage occurs when information from outside the training dataset is accidentally used to create the model, leading to overly optimistic evaluation.',
      whyItExists:
        'Models trained with leakages achieve fake ~99% cross-validation scores but catastrophically fail when deployed on real unseen data.',
      howItWorks: {
        steps: [
          'Target Leakage: Features containing future information about the target (e.g. "Payment_Received_Date" when predicting default).',
          'Train-Test Contamination: Performing global imputation, scaling, or feature selection BEFORE splitting dataset.',
          'Temporal Leakage: Using future time-series data points to predict past events.',
        ],
        visualDiagramText: '[ Leakage Bug ] ➔ [ Fake 99% CV Score ] ➔ Production ➔ [ Collapse to 50% ]',
      },
      whenToUse: {
        useCases: ['Mandatory audit step in every real-world ML deployment.'],
        avoidWhen: ['Synthetic dummy benchmarks with zero time dimension.'],
        alternatives: ['Scikit-Learn Pipeline objects enforcing fit_transform inside CV folds.'],
      },
      pitfalls: ['Relying on raw script execution instead of structured pipeline containers.'],
      playground: {
        title: 'Leakage Impact Simulator',
        description: 'Toggle pre-split scaling vs fold-level scaling to see CV distortion.',
        params: [
          {
            name: 'leakageLevel',
            label: 'Leakage Contamination %',
            min: 0,
            max: 20,
            step: 2,
            defaultValue: 0,
            unit: '%',
            description: 'Percentage of test set signal leaked into training preprocessing.',
          },
        ],
        chartType: 'distribution',
      },
      realProjectCTA: {
        label: 'Audit Pipeline for Leakage',
        templateType: 'EDA',
      },
    },
  },
];
