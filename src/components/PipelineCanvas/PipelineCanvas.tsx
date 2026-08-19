import { useRef, useState } from 'react';
import type { CanvasConnection, CanvasNodeData } from '../../types';
import { CanvasNode } from '../CanvasNode/CanvasNode';
import { Connection } from '../Connection/Connection';
import './PipelineCanvas.css';

interface Props {
  nodes: CanvasNodeData[];
  connections: CanvasConnection[];
  selectedId?: string;
  connectingSourceId?: string;
  zoom: number;
  onSelect: (id?: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onAdd: (item: { name: string; description: string; type: CanvasNodeData['type'] }, x: number, y: number) => void;
  onConnect: (sourceId: string, targetId: string) => void;
  onDisconnect: (id: string) => void;
  onDisconnectNode: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onConnectNearest: (nodeId: string) => void;
  onCancelTargetConnect?: () => void;
  onZoom: (zoom: number) => void;
}

export function PipelineCanvas({
  nodes,
  connections,
  selectedId,
  connectingSourceId,
  zoom,
  onSelect,
  onMove,
  onAdd,
  onConnect,
  onDisconnect,
  onDisconnectNode,
  onDeleteNode,
  onConnectNearest,
  onCancelTargetConnect,
  onZoom,
}: Props) {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragId, setDragId] = useState<string>();
  const [wire, setWire] = useState<{ sourceId: string; x: number; y: number }>();
  const surface = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });

  const point = (event: { clientX: number; clientY: number }) => {
    const bounds = surface.current!.getBoundingClientRect();
    return { x: (event.clientX - bounds.left - pan.x) / zoom, y: (event.clientY - bounds.top - pan.y) / zoom };
  };

  const connectingSourceNode = connectingSourceId ? nodes.find((n) => n.id === connectingSourceId) : undefined;

  const startNodeDrag = (event: React.PointerEvent<HTMLButtonElement>, node: CanvasNodeData) => {
    event.stopPropagation();

    // If currently in target picking mode, click to connect!
    if (connectingSourceId && connectingSourceId !== node.id) {
      onConnect(connectingSourceId, node.id);
      onCancelTargetConnect?.();
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragOffset.current = { x: event.nativeEvent.offsetX / zoom, y: event.nativeEvent.offsetY / zoom };
    setDragId(node.id);
    onSelect(selectedId === node.id ? undefined : node.id);
  };

  const startPan = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.target as Element;
    if (target.closest('[data-node-id], .canvas-connection__hit, .canvas-node__actions')) return;

    if (connectingSourceId) {
      onCancelTargetConnect?.();
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    panStart.current = { x: event.clientX - pan.x, y: event.clientY - pan.y };
    onSelect(undefined);
  };

  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    if (wire) {
      const next = point(event);
      setWire({ ...wire, x: next.x, y: next.y });
    } else if (dragId) {
      const next = point(event);
      // Unbounded node movement across infinite canvas (Miro-style)
      onMove(dragId, next.x - dragOffset.current.x, next.y - dragOffset.current.y);
    } else if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      setPan({ x: event.clientX - panStart.current.x, y: event.clientY - panStart.current.y });
    }
  };

  const finish = (event: React.PointerEvent<HTMLDivElement>) => {
    if (wire) {
      const hit = document.elementFromPoint(event.clientX, event.clientY);
      const target = hit?.closest('[data-node-id]')?.getAttribute('data-node-id');
      if (target && target !== wire.sourceId) {
        onConnect(wire.sourceId, target);
      }
      setWire(undefined);
    }
    setDragId(undefined);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const startWire = (event: React.PointerEvent<HTMLSpanElement>, node: CanvasNodeData) => {
    event.stopPropagation();
    const next = point(event);
    setWire({ sourceId: node.id, x: next.x, y: next.y });
    surface.current?.setPointerCapture(event.pointerId);
  };

  const wheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const nextZoom = Math.max(0.2, Math.min(2.5, zoom + (event.deltaY < 0 ? 0.08 : -0.08)));
    const cursor = point(event);
    const bounds = surface.current!.getBoundingClientRect();
    setPan({ x: event.clientX - bounds.left - cursor.x * nextZoom, y: event.clientY - bounds.top - cursor.y * nextZoom });
    onZoom(nextZoom);
  };

  const backgroundSize = `${24 * zoom}px ${24 * zoom}px`;

  return (
    <div
      className={`pipeline-canvas ${connectingSourceId ? 'pipeline-canvas--connecting' : ''}`}
      ref={surface}
      style={{ backgroundPosition: `${pan.x}px ${pan.y}px`, backgroundSize }}
      onPointerDown={startPan}
      onPointerMove={move}
      onPointerUp={finish}
      onPointerCancel={finish}
      onWheel={wheel}
      onDrop={(event) => {
        event.preventDefault();
        const raw = event.dataTransfer.getData('application/mlflow-node');
        if (raw) {
          const next = point(event);
          onAdd(JSON.parse(raw), next.x, next.y);
        }
      }}
      onDragOver={(event) => event.preventDefault()}
    >
      {connectingSourceNode && (
        <div className="canvas-connecting-banner">
          <span>
            🎯 Connecting <strong>{connectingSourceNode.title}</strong>... Click target node to link
          </span>
          <button onClick={onCancelTargetConnect} className="canvas-connecting-banner__cancel">
            Cancel
          </button>
        </div>
      )}

      <div
        className="pipeline-canvas__world"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
      >
        <svg className="pipeline-wires">
          {connections.map((connection) => {
            const source = nodes.find((node) => node.id === connection.sourceId);
            const target = nodes.find((node) => node.id === connection.targetId);
            return source && target ? (
              <Connection
                key={connection.id}
                source={source}
                target={target}
                onDisconnect={() => onDisconnect(connection.id)}
              />
            ) : null;
          })}
          {wire && nodes.find((node) => node.id === wire.sourceId) && (
            <Connection
              source={nodes.find((node) => node.id === wire.sourceId)!}
              target={{ id: 'preview', title: '', subtitle: '', type: 'input', x: wire.x, y: wire.y }}
              preview
            />
          )}
        </svg>

        {nodes.map((node) => (
          <CanvasNode
            key={node.id}
            node={node}
            selected={node.id === selectedId}
            dragging={node.id === dragId}
            isTargeting={Boolean(connectingSourceId && connectingSourceId !== node.id)}
            onPointerDown={(event) => startNodeDrag(event, node)}
            onStartConnection={(event) => startWire(event, node)}
            onConnectNearest={() => onConnectNearest(node.id)}
            onDisconnect={() => onDisconnectNode(node.id)}
            onDelete={() => onDeleteNode(node.id)}
          />
        ))}
      </div>

      <div className="canvas-status">
        ⚡ Move nodes anywhere across infinite canvas (Miro-style) · Drag canvas to pan · Scroll to zoom
      </div>
    </div>
  );
}


