import './StateComponents.css';

interface LoadingStateProps {
  message?: string;
  type?: 'spinner' | 'pulse';
}

export function LoadingState({ message = 'Loading...', type = 'spinner' }: LoadingStateProps) {
  return (
    <div className="state-component loading-state">
      {type === 'spinner' ? (
        <div className="loading-state__spinner"></div>
      ) : (
        <div className="loading-state__pulse"></div>
      )}
      <p className="state-component__title">{message}</p>
    </div>
  );
}
