import type { KnowledgeTopic } from '../../types';
import './KnowledgeComponents.css';

export function DecisionHeader({ topic }: { topic: KnowledgeTopic }) {
  return (
    <div className="decision-header">
      <h2 id="what-is-it" className="decision-title">{topic.title}</h2>
      <p className="decision-summary">{topic.summary}</p>
      
      <div id="when-to-use" className="decision-grid">
        <div className="decision-box decision-box--use">
          <h3><span className="icon">✓</span> Use it when:</h3>
          <ul>
            {topic.useWhen.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="decision-box decision-box--avoid">
          <h3><span className="icon">⚠</span> Think twice when:</h3>
          <ul>
            {topic.avoidWhen.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function ProsConsGrid({ topic }: { topic: KnowledgeTopic }) {
  return (
    <div id="pros-cons" className="pros-cons-grid">
      <div className="pros-col">
        <h3>Strengths</h3>
        <ul className="checklist checklist--pros">
          {topic.advantages.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="cons-col">
        <h3>Limitations</h3>
        <ul className="checklist checklist--cons">
          {topic.limitations.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function PipelineVisualizer({ topic, onBuildPipeline }: { topic: KnowledgeTopic, onBuildPipeline?: () => void }) {
  return (
    <div id="pipeline" className="pipeline-visualizer-container">
      <h3>Recommended Pipeline</h3>
      <p>This is the standard workflow when using {topic.title}.</p>
      
      <div className="pipeline-visualizer">
        {topic.recommendedPipeline.map((step, idx) => (
          <div key={step.id} className="pipeline-step-wrapper">
            <div className="pipeline-step">
              <span className="step-number">{idx + 1}</span>
              <div className="step-content">
                <h4>{step.name}</h4>
                <p>{step.description}</p>
              </div>
            </div>
            {idx < topic.recommendedPipeline.length - 1 && (
              <div className="pipeline-connector">↓</div>
            )}
          </div>
        ))}
      </div>

      {onBuildPipeline && (
        <div className="pipeline-cta">
          <button className="btn-primary btn-large" onClick={onBuildPipeline}>
            Build this pipeline in ML Flow
          </button>
        </div>
      )}
    </div>
  );
}

export function KnowledgeTopicView({ topic, onBuildPipeline }: { topic: KnowledgeTopic, onBuildPipeline?: () => void }) {
  return (
    <div className="knowledge-topic-view">
      <DecisionHeader topic={topic} />
      
      <div className="knowledge-section">
        <h3>Before you start</h3>
        <ul className="bullet-list">
          {topic.prerequisites.map((req, idx) => (
            <li key={idx}>{req}</li>
          ))}
        </ul>
      </div>

      <div id="how-it-works" className="knowledge-section">
        <h3>How it works (Conceptually)</h3>
        <p className="concept-text">{topic.howItWorks}</p>
      </div>

      <ProsConsGrid topic={topic} />

      {topic.importantParameters && topic.importantParameters.length > 0 && (
        <div className="knowledge-section">
          <h3>Important Settings</h3>
          <div className="params-list">
            {topic.importantParameters.map((param, idx) => (
              <div key={idx} className="param-card">
                <h4>{param.name}</h4>
                <p><strong>What it controls:</strong> {param.description}</p>
                <div className="param-effects">
                  <div><strong>If increased:</strong> {param.effectIfIncreased}</div>
                  <div><strong>If decreased:</strong> {param.effectIfDecreased}</div>
                </div>
                <p className="param-recommend"><strong>Recommended start:</strong> {param.recommendedStart}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {topic.commonMistakes && topic.commonMistakes.length > 0 && (
        <div className="knowledge-section">
          <h3>Common Mistakes</h3>
          <ol className="mistakes-list">
            {topic.commonMistakes.map((mistake, idx) => (
              <li key={idx}>{mistake}</li>
            ))}
          </ol>
        </div>
      )}

      <PipelineVisualizer topic={topic} onBuildPipeline={onBuildPipeline} />
    </div>
  );
}
