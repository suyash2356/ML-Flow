import type { CanvasNodeData } from '../../types';
import './Connection.css';

export function Connection({
  source,
  target,
  preview = false,
  onDisconnect,
}: {
  source: CanvasNodeData;
  target: CanvasNodeData;
  preview?: boolean;
  onDisconnect?: () => void;
}) {
  const x1 = source.x + 178, y1 = source.y + 36, x2 = target.x, y2 = target.y + 36;
  const d = `M ${x1} ${y1} C ${x1 + 75} ${y1}, ${x2 - 75} ${y2}, ${x2} ${y2}`;

  if (preview) {
    return <path className="canvas-connection canvas-connection--preview" d={d} />;
  }

  const isActive = source.status === 'running' || target.status === 'running';

  return (
    <>
      <path
        className="canvas-connection__hit"
        d={d}
        onClick={(event) => {
          event.stopPropagation();
          onDisconnect?.();
        }}
      />
      <path className={`canvas-connection ${isActive ? 'canvas-connection--active' : ''}`} d={d} />
      {isActive && (
        <circle r="3.5" className="canvas-connection__pulse">
          <animateMotion dur="1.1s" repeatCount="indefinite" path={d} />
        </circle>
      )}
    </>
  );
}
