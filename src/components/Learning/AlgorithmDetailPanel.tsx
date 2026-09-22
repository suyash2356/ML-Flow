import { useState } from 'react';
import type { EncyclopediaCardData } from '../../types';
import './AlgorithmDetailPanel.css';

interface AlgorithmDetailPanelProps {
  card: EncyclopediaCardData;
  onClose: () => void;
  onUseInProject: (card: EncyclopediaCardData) => void;
}

type TabKey =
  | 'what_it_is'
  | 'why_it_exists'
  | 'how_it_works'
  | 'when_to_use'
  | 'pitfalls'
  | 'try_it_live'
  | 'use_in_project';

export function AlgorithmDetailPanel({
  card,
  onClose,
  onUseInProject,
}: AlgorithmDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('what_it_is');
  const [showMathFormula, setShowMathFormula] = useState(true);

  // Playground state initialized from card parameters
  const [playgroundValues, setPlaygroundValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    card.content.playground.params.forEach((p) => {
      initial[p.name] = p.defaultValue;
    });
    return initial;
  });

  const handleParamChange = (name: string, val: number) => {
    setPlaygroundValues((prev) => ({ ...prev, [name]: val }));
  };

  const tabs: { key: TabKey; label: string; num: number }[] = [
    { key: 'what_it_is', label: '1. What It Is', num: 1 },
    { key: 'why_it_exists', label: '2. Why It Exists', num: 2 },
    { key: 'how_it_works', label: '3. How It Works', num: 3 },
    { key: 'when_to_use', label: '4. When To Use / Avoid', num: 4 },
    { key: 'pitfalls', label: '5. Common Pitfalls', num: 5 },
    { key: 'try_it_live', label: '6. Try It Live', num: 6 },
    { key: 'use_in_project', label: '7. Use in Real Project', num: 7 },
  ];

  return (
    <div className="algo-modal-overlay" onClick={onClose}>
      <div className="algo-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="algo-modal__header">
          <div className="algo-modal__title-box">
            <span className="algo-modal__icon">{card.icon}</span>
            <div>
              <div className="algo-modal__meta-tags">
                <span className="algo-modal__category">{card.category} Track</span>
                <span className={`algo-modal__diff algo-modal__diff--${card.difficulty.toLowerCase()}`}>
                  {card.difficulty}
                </span>
              </div>
              <h2 className="algo-modal__title">{card.title}</h2>
            </div>
          </div>
          <button type="button" className="algo-modal__close-btn" onClick={onClose} title="Close">
            ✕
          </button>
        </header>

        {/* 7 Tab Switcher Bar */}
        <nav className="algo-modal__nav">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`algo-modal__nav-item ${activeTab === tab.key ? 'algo-modal__nav-item--active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Body with EXACT 7 SECTIONS */}
        <div className="algo-modal__body">
          {/* SECTION 1: What it is (plain language) */}
          {activeTab === 'what_it_is' && (
            <section className="algo-modal__section">
              <h3 className="algo-modal__section-heading">1. What It Is (Plain Language)</h3>
              <div className="algo-modal__card-block">
                <p className="algo-modal__paragraph">{card.content.whatItIs}</p>
                <div className="algo-modal__takeaway">
                  <strong>💡 Key Takeaway:</strong>
                  <span> This concept provides a structured mathematical or statistical method to represent patterns without requiring manual heuristic guesswork.</span>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 2: Why it exists (intuition/analogy) */}
          {activeTab === 'why_it_exists' && (
            <section className="algo-modal__section">
              <h3 className="algo-modal__section-heading">2. Why It Exists (Intuition & Real-World Analogy)</h3>
              <div className="algo-modal__card-block">
                <p className="algo-modal__paragraph">{card.content.whyItExists}</p>
                <div className="algo-modal__analogy-box">
                  <span className="algo-modal__analogy-icon">🎯</span>
                  <div className="algo-modal__analogy-text">
                    <strong>Real-World Intuition:</strong>
                    <p>Think of it like tuning lenses on a microscope: adjusting parameters helps distinguish genuine signal from background optical distortion.</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 3: How it works (step-by-step, visual diagram placeholder, collapsible math) */}
          {activeTab === 'how_it_works' && (
            <section className="algo-modal__section">
              <h3 className="algo-modal__section-heading">3. How It Works (Step-by-Step Execution)</h3>

              <div className="algo-modal__steps">
                {card.content.howItWorks.steps.map((step, idx) => (
                  <div key={idx} className="algo-modal__step-row">
                    <span className="algo-modal__step-num">{idx + 1}</span>
                    <p className="algo-modal__step-text">{step}</p>
                  </div>
                ))}
              </div>

              {card.content.howItWorks.visualDiagramText && (
                <div className="algo-modal__diagram-box">
                  <span className="algo-modal__diagram-label">Pipeline Topology & Flow:</span>
                  <pre className="algo-modal__diagram-pre">{card.content.howItWorks.visualDiagramText}</pre>
                </div>
              )}

              {/* Collapsible Math Section */}
              {card.content.howItWorks.mathFormula && (
                <div className="algo-modal__math-box">
                  <button
                    type="button"
                    className="algo-modal__math-toggle"
                    onClick={() => setShowMathFormula(!showMathFormula)}
                  >
                    <span>📐 Mathematical Formulation & Objective</span>
                    <span>{showMathFormula ? '▲ Collapse' : '▼ Expand Formula'}</span>
                  </button>
                  {showMathFormula && (
                    <div className="algo-modal__math-content">
                      <code>{card.content.howItWorks.mathFormula}</code>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* SECTION 4: When to use it / when not to (comparison callouts vs alternatives) */}
          {activeTab === 'when_to_use' && (
            <section className="algo-modal__section">
              <h3 className="algo-modal__section-heading">4. When To Use / When To Avoid</h3>

              <div className="algo-modal__two-col-callouts">
                <div className="algo-modal__callout algo-modal__callout--green">
                  <h4>✅ Ideal Use Cases</h4>
                  <ul>
                    {card.content.whenToUse.useCases.map((uc, i) => (
                      <li key={i}>{uc}</li>
                    ))}
                  </ul>
                </div>

                <div className="algo-modal__callout algo-modal__callout--red">
                  <h4>❌ When to Avoid</h4>
                  <ul>
                    {card.content.whenToUse.avoidWhen.map((aw, i) => (
                      <li key={i}>{aw}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="algo-modal__alternatives">
                <strong>Recommended Alternatives:</strong>
                <div className="algo-modal__alt-pills">
                  {card.content.whenToUse.alternatives.map((alt, i) => (
                    <span key={i} className="algo-modal__alt-pill">
                      {alt}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* SECTION 5: Common pitfalls / what to watch out for */}
          {activeTab === 'pitfalls' && (
            <section className="algo-modal__section">
              <h3 className="algo-modal__section-heading">5. Common Pitfalls & What to Watch Out For</h3>
              <div className="algo-modal__pitfalls-list">
                {card.content.pitfalls.map((pf, i) => (
                  <div key={i} className="algo-modal__pitfall-item">
                    <span className="algo-modal__pitfall-icon">⚠️</span>
                    <p>{pf}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECTION 6: Try it live — an interactive mini-playground area */}
          {activeTab === 'try_it_live' && (
            <section className="algo-modal__section">
              <h3 className="algo-modal__section-heading">6. Try It Live — Interactive Mini-Playground</h3>
              <p className="algo-modal__playground-desc">{card.content.playground.description}</p>

              <div className="algo-modal__playground-grid">
                {/* Sliders Control Panel */}
                <div className="algo-modal__controls">
                  <h4>Hyperparameters & Parameters</h4>
                  {card.content.playground.params.map((param) => {
                    const currentVal = playgroundValues[param.name] ?? param.defaultValue;
                    return (
                      <label key={param.name} className="algo-modal__slider-label">
                        <div className="algo-modal__slider-header">
                          <span>{param.label}</span>
                          <strong>
                            {currentVal} {param.unit || ''}
                          </strong>
                        </div>
                        <input
                          type="range"
                          min={param.min}
                          max={param.max}
                          step={param.step}
                          value={currentVal}
                          onChange={(e) => handleParamChange(param.name, parseFloat(e.target.value))}
                        />
                        <small>{param.description}</small>
                      </label>
                    );
                  })}
                </div>

                {/* Dynamic SVG / Canvas Chart Preview */}
                <div className="algo-modal__chart-display">
                  <div className="algo-modal__chart-header">
                    <span>Live Output Visualizer</span>
                    <span className="algo-modal__chart-type">Mode: {card.content.playground.chartType}</span>
                  </div>

                  <div className="algo-modal__svg-wrapper">
                    <svg viewBox="0 0 400 200" className="algo-modal__chart-svg">
                      <line x1="40" y1="170" x2="380" y2="170" stroke="#253a4f" strokeWidth="1.5" />
                      <line x1="40" y1="20" x2="40" y2="170" stroke="#253a4f" strokeWidth="1.5" />

                      {/* Dynamic simulation curves based on chartType */}
                      {card.content.playground.chartType === 'distribution' && (
                        <path
                          d={`M 50 160 Q 150 ${20 + (playgroundValues['nullThreshold'] || playgroundValues['skewLevel'] || 25) * 2} 240 140 T 370 165`}
                          fill="none"
                          stroke="#56d4c0"
                          strokeWidth="3"
                        />
                      )}

                      {card.content.playground.chartType === 'regression' && (
                        <>
                          <line
                            x1="50"
                            y1={160 - (playgroundValues['slope'] || 1.5) * 12}
                            x2="370"
                            y2={30 + (playgroundValues['slope'] || 1.5) * 8}
                            stroke="#56d4c0"
                            strokeWidth="3"
                          />
                          {[60, 110, 160, 210, 260, 310, 360].map((cx, i) => (
                            <circle
                              key={i}
                              cx={cx}
                              cy={80 + Math.sin(i * 1.5) * (playgroundValues['noise'] || 12) * 2}
                              r="4"
                              fill="#6fc0ff"
                            />
                          ))}
                        </>
                      )}

                      {card.content.playground.chartType === 'boundary' && (
                        <>
                          <circle cx="120" cy="90" r="40" fill="#28ae9b33" stroke="#28ae9b" strokeWidth="2" />
                          <circle cx="270" cy="110" r="45" fill="#f7c87233" stroke="#f7c872" strokeWidth="2" />
                          <path
                            d={`M 180 30 Q ${160 + (playgroundValues['threshold'] || 0.5) * 60} 100 210 180`}
                            stroke="#56d4c0"
                            strokeWidth="2.5"
                            strokeDasharray="4 4"
                          />
                        </>
                      )}

                      {card.content.playground.chartType === 'clustering' && (
                        <>
                          <circle cx="100" cy="70" r="28" fill="#56d4c033" stroke="#56d4c0" />
                          <circle cx="260" cy="80" r="32" fill="#cba8ff33" stroke="#cba8ff" />
                          <circle cx="190" cy="140" r="30" fill="#f7c87233" stroke="#f7c872" />
                        </>
                      )}

                      {card.content.playground.chartType === 'neural' && (
                        <>
                          <rect x="60" y="50" width="30" height="90" rx="4" fill="#1d3852" stroke="#56d4c0" />
                          <rect x="180" y="30" width="30" height="130" rx="4" fill="#1d3852" stroke="#56d4c0" />
                          <rect x="300" y="65" width="30" height="60" rx="4" fill="#1d3852" stroke="#56d4c0" />
                          <line x1="90" y1="95" x2="180" y2="95" stroke="#56d4c0" strokeWidth="2" />
                          <line x1="210" y1="95" x2="300" y2="95" stroke="#56d4c0" strokeWidth="2" />
                        </>
                      )}
                    </svg>
                  </div>
                  <small className="algo-modal__chart-hint">Simulated in-browser parameter response curve</small>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 7: Use in a real project — CTA button */}
          {activeTab === 'use_in_project' && (
            <section className="algo-modal__section algo-modal__section--cta">
              <div className="algo-modal__cta-box">
                <span className="algo-modal__cta-icon">🚀</span>
                <h3 className="algo-modal__cta-title">Ready to build with {card.title}?</h3>
                <p className="algo-modal__cta-desc">
                  Instantiate a pre-loaded visual workspace containing {card.title} along with matching datasets and evaluation nodes.
                </p>
                <button
                  type="button"
                  className="algo-modal__cta-btn"
                  onClick={() => onUseInProject(card)}
                >
                  {card.content.realProjectCTA.label} →
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
