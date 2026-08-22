import { useState } from 'react';
import './KnowledgeComponents.css';

interface Question {
  id: string;
  title: string;
  options: {
    label: string;
    nextQuestionId?: string;
    result?: string;
  }[];
}

const WIZARD_QUESTIONS: Record<string, Question> = {
  start: {
    id: 'start',
    title: 'What are you trying to do?',
    options: [
      { label: 'Predict a category (e.g. Yes/No, Red/Blue)', nextQuestionId: 'data_type' },
      { label: 'Predict a number (e.g. Price, Temperature)', nextQuestionId: 'data_type_reg' },
      { label: 'Find hidden groups (Clustering)', result: 'K-Means' },
      { label: 'Detect anomalies', result: 'Isolation Forest' }
    ]
  },
  data_type: {
    id: 'data_type',
    title: 'What kind of data do you have?',
    options: [
      { label: 'Tabular (Spreadsheet/CSV)', nextQuestionId: 'priority' },
      { label: 'Images', result: 'CNN' },
      { label: 'Text', result: 'Transformer' }
    ]
  },
  data_type_reg: {
    id: 'data_type_reg',
    title: 'What kind of data do you have?',
    options: [
      { label: 'Tabular (Spreadsheet/CSV)', nextQuestionId: 'priority' },
      { label: 'Time Series (Dates/Timestamps)', result: 'LSTM / ARIMA' }
    ]
  },
  priority: {
    id: 'priority',
    title: 'What matters most to you?',
    options: [
      { label: 'I need a strong baseline quickly', result: 'Random Forest' },
      { label: 'Maximum accuracy is critical', result: 'XGBoost' },
      { label: 'I need to explain the model to business', result: 'Logistic Regression / Decision Tree' }
    ]
  }
};

export function DecisionWizard({ onAlgorithmSelect }: { onAlgorithmSelect: (algoId: string) => void }) {
  const [currentQ, setCurrentQ] = useState<string>('start');
  const [history, setHistory] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const question = WIZARD_QUESTIONS[currentQ];

  const handleOption = (opt: typeof WIZARD_QUESTIONS[string]['options'][0]) => {
    if (opt.result) {
      setResult(opt.result);
    } else if (opt.nextQuestionId) {
      setHistory([...history, currentQ]);
      setCurrentQ(opt.nextQuestionId);
    }
  };

  const handleReset = () => {
    setCurrentQ('start');
    setHistory([]);
    setResult(null);
  };

  const handleResultClick = () => {
    if (result) {
      // Map result names to topic IDs roughly
      const idMap: Record<string, string> = {
        'Random Forest': 'random-forest',
        'CNN': 'cnn'
      };
      
      const mappedId = idMap[result];
      if (mappedId) {
         onAlgorithmSelect(mappedId);
      }
    }
  };

  return (
    <div className="decision-wizard">
      <h3>Which algorithm should I choose?</h3>
      {!result ? (
        <div className="wizard-question-area">
          <p className="wizard-question">{question.title}</p>
          <div className="wizard-options">
            {question.options.map((opt, idx) => (
              <button key={idx} className="wizard-option-btn" onClick={() => handleOption(opt)}>
                {opt.label}
              </button>
            ))}
          </div>
          {history.length > 0 && (
             <button className="wizard-back-btn" onClick={() => {
                const prev = history[history.length - 1];
                setCurrentQ(prev);
                setHistory(history.slice(0, -1));
             }}>← Back</button>
          )}
        </div>
      ) : (
        <div className="wizard-result-area">
          <p>Based on your answers, we recommend starting with:</p>
          <div className="wizard-result">
            {result}
          </div>
          <div className="wizard-actions">
            <button className="btn-secondary" onClick={handleReset}>Start Over</button>
            <button className="btn-primary" onClick={handleResultClick}>Read about {result}</button>
          </div>
        </div>
      )}
    </div>
  );
}
