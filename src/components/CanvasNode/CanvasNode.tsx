import type { CanvasNodeData } from '../../types';
import './CanvasNode.css';

const glyphs: Record<CanvasNodeData['type'], string> = {
  input: '▤',
  preprocessing: '⌘',
  model: '◈',
  eval: '✓',
};

interface CanvasNodeProps {
  node: CanvasNodeData;
  selected: boolean;
  dragging: boolean;
  isTargeting?: boolean;
  onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => void;
  onStartConnection: (e: React.PointerEvent<HTMLSpanElement>) => void;
  onConnectNearest?: () => void;
  onDisconnect?: () => void;
  onDelete?: () => void;
}

export function CanvasNode({
  node,
  selected,
  dragging,
  isTargeting,
  onPointerDown,
  onStartConnection,
  onConnectNearest,
  onDisconnect,
  onDelete,
}: CanvasNodeProps) {
  const status = node.status === 'completed' ? 'success' : node.status || 'idle';

  return (
    <div
      className={`canvas-node-wrapper ${selected ? 'canvas-node-wrapper--selected' : ''}`}
      style={{ left: node.x, top: node.y }}
    >
      {selected && (
        <div className="canvas-node__actions" onPointerDown={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="canvas-node__action-btn canvas-node__action-btn--connect"
            onClick={(e) => {
              e.stopPropagation();
              onConnectNearest?.();
            }}
            title="Connect to nearest nodes (1-2)"
          >
            ⚡ Connect
          </button>
          <button
            type="button"
            className="canvas-node__action-btn canvas-node__action-btn--disconnect"
            onClick={(e) => {
              e.stopPropagation();
              onDisconnect?.();
            }}
            title="Disconnect all links"
          >
            ✂ Disconnect
          </button>
          <button
            type="button"
            className="canvas-node__action-btn canvas-node__action-btn--delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            title="Remove node"
          >
            🗑 Remove
          </button>
        </div>
      )}

      <button
        data-node-id={node.id}
        className={`canvas-node canvas-node--${node.type} canvas-node--${status} ${
          selected ? 'canvas-node--selected' : ''
        } ${dragging ? 'canvas-node--dragging' : ''} ${
          isTargeting ? 'canvas-node--targeting' : ''
        }`}
        onPointerDown={onPointerDown}
      >
        <span
          className="canvas-node__port canvas-node__port--in"
          title="Input port (connect from upstream node)"
        />
        <span
          className="canvas-node__port canvas-node__port--out"
          title="Output port — Drag or click to connect"
          onPointerDown={onStartConnection}
        >
          +
        </span>
        <span className="canvas-node__icon">{glyphs[node.type]}</span>
        <span className="canvas-node__copy">
          <strong>{node.title}</strong>
          <small>{node.subtitle}</small>
        </span>
        <span className="canvas-node__state">
          {status === 'success' ? '✓' : status === 'running' ? '…' : status === 'error' ? '!' : '●'}
        </span>
      </button>
    </div>
  );
}

