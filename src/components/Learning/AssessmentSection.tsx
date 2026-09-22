import React, { useState } from 'react';
import './AssessmentSection.css';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface AssessmentSectionProps {
  moduleTitle: string;
  stageName: string;
  questions?: QuizQuestion[];
}

const DEFAULT_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'When dealing with high variance (overfitting) in a deep neural network, which action is MOST effective?',
    options: [
      'Increase model depth and number of hidden units',
      'Apply L2 regularization (weight decay) or Dropout',
      'Remove all batch normalization layers',
      'Decrease the training dataset size',
    ],
    correctIndex: 1,
    explanation: 'L2 regularization penalizes large weights and Dropout randomly deactivates activations during training, reducing co-adaptation and curbing overfitting.',
  },
  {
    id: 2,
    question: 'Why should feature scaling (e.g., StandardScaler) be fitted ONLY on the training split?',
    options: [
      'To prevent data leakage from the test distribution into model fitting',
      'Because test data cannot be converted to floats',
      'It decreases computational complexity during inference',
      'StandardScaler throws an error if called on test sets',
    ],
    correctIndex: 0,
    explanation: 'Fitting scalers on test data introduces data snooping/leakage, yielding overly optimistic evaluation metrics.',
  },
  {
    id: 3,
    question: 'In imbalanced classification (e.g. 99% negative, 1% positive), why is Accuracy a misleading metric?',
    options: [
      'It cannot be computed for binary tasks',
      'A trivial model predicting the majority class gets 99% accuracy but fails on all positives',
      'It is computationally slower than ROC-AUC',
      'Scikit-learn deprecates accuracy score',
    ],
    correctIndex: 1,
    explanation: 'The accuracy paradox: predicting always negative achieves 99% accuracy with zero true positive recall.',
  },
];

export const AssessmentSection: React.FC<AssessmentSectionProps> = ({
  moduleTitle,
  stageName,
  questions = DEFAULT_QUESTIONS,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  const handleSelect = (qId: number, optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) correct++;
    });
    return Math.round((correct / questions.length) * 100);
  };

  const score = calculateScore();
  const passed = isSubmitted && score >= 70;

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  return (
    <div className="assessment-section">
      <div className="assessment-header">
        <div className="assessment-title-meta">
          <span className="assessment-stage-pill">{stageName} Capstone</span>
          <h3>📝 Skill Assessment & Certification: {moduleTitle}</h3>
          <p>Complete the knowledge check below to certify your practical mastery and unlock your verifiable badge.</p>
        </div>

        {passed && (
          <button className="gold-cert-btn" onClick={() => setShowCertModal(true)}>
            🏆 View Certificate
          </button>
        )}
      </div>

      <div className="assessment-body">
        <div className="quiz-questions-list">
          {questions.map((q, qIndex) => {
            const chosen = selectedAnswers[q.id];
            return (
              <div key={q.id} className="quiz-question-card">
                <div className="q-number-title">
                  <span className="q-num">Q{qIndex + 1}</span>
                  <span className="q-text">{q.question}</span>
                </div>

                <div className="quiz-options-group">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = chosen === optIdx;
                    let stateClass = '';
                    if (isSubmitted) {
                      if (optIdx === q.correctIndex) stateClass = 'correct-answer';
                      else if (isSelected) stateClass = 'wrong-answer';
                    } else if (isSelected) {
                      stateClass = 'selected-answer';
                    }

                    return (
                      <button
                        key={optIdx}
                        className={`quiz-opt-btn ${stateClass}`}
                        onClick={() => handleSelect(q.id, optIdx)}
                      >
                        <span className="opt-letter">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="opt-text">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {isSubmitted && (
                  <div className={`quiz-explanation ${chosen === q.correctIndex ? 'correct-exp' : 'wrong-exp'}`}>
                    <strong>{chosen === q.correctIndex ? '✓ Correct:' : '✗ Incorrect:'}</strong>{' '}
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="quiz-footer-actions">
          {!isSubmitted ? (
            <button
              className="submit-quiz-btn"
              disabled={Object.keys(selectedAnswers).length < questions.length}
              onClick={() => setIsSubmitted(true)}
            >
              Submit Assessment ({Object.keys(selectedAnswers).length}/{questions.length} answered)
            </button>
          ) : (
            <div className="quiz-results-banner">
              <div className="score-summary">
                <span className="score-label">Final Score:</span>
                <span className={`score-val ${passed ? 'passed-text' : 'failed-text'}`}>{score}%</span>
                <span className="score-status">
                  {passed ? '🎉 Passed! Certification unlocked.' : 'Needs 70% to pass. Review explanations and try again.'}
                </span>
              </div>
              <div className="results-buttons">
                <button className="retake-quiz-btn" onClick={handleReset}>
                  Retake Quiz
                </button>
                {passed && (
                  <button className="claim-cert-btn" onClick={() => setShowCertModal(true)}>
                    Claim Certificate
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertModal && (
        <div className="cert-modal-backdrop" onClick={() => setShowCertModal(false)}>
          <div className="cert-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-cert-btn" onClick={() => setShowCertModal(false)}>×</button>

            <div className="cert-card-inner">
              <div className="cert-seal">🎖️</div>
              <span className="cert-issuer">ML FLOW CERTIFIED SPECIALIST</span>
              <h2 className="cert-title">{moduleTitle} Practitioner</h2>
              <p className="cert-recipient">Issued to <strong>Suyash</strong> on {new Date().toLocaleDateString()}</p>
              <div className="cert-meta-grid">
                <div><span>Score</span><strong>{score}%</strong></div>
                <div><span>Stage</span><strong>{stageName}</strong></div>
                <div><span>Credential ID</span><strong>MLF-{Math.random().toString(36).substring(2, 9).toUpperCase()}</strong></div>
              </div>
              <div className="cert-badges-row">
                <span className="cert-pill">✓ Verified Skills</span>
                <span className="cert-pill">✓ Pipeline Architect</span>
              </div>
              <div className="cert-actions-row">
                <button className="cert-download-btn" onClick={() => alert('Certificate downloaded as PDF!')}>
                  📥 Download Certificate
                </button>
                <button className="cert-share-btn" onClick={() => alert('Credential link copied to clipboard!')}>
                  🔗 Share Credential
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
