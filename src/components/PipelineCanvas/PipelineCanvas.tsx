import { useRef, useState } from 'react';
import type { CanvasConnection, CanvasNodeData } from '../../types';
import { CanvasNode } from '../CanvasNode/CanvasNode';
import { Connection } from '../Connection/Connection';
import './PipelineCanvas.css';

interface Props {
  nodes: CanvasNodeData[];
  connections: CanvasConnection[];
  selectedId?: string;
  zoom: number;
  onSelect: (id?: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onAdd: (item: { name: string; description: string; type: CanvasNodeData['type'] }, x: number, y: number) => void;
  onConnect: (sourceId: string, targetId: string) => void;
  onDisconnect: (id: string) => void;
  onZoom: (zoom: number) => void;
}

export function PipelineCanvas({ nodes, connections, selectedId, zoom, onSelect, onMove, onAdd, onConnect, onDisconnect, onZoom }: Props) {
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

  const startNodeDrag = (event: React.PointerEvent<HTMLButtonElement>, node: CanvasNodeData) => {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragOffset.current = { x: event.nativeEvent.offsetX / zoom, y: event.nativeEvent.offsetY / zoom };
    setDragId(node.id);
    onSelect(selectedId === node.id ? undefined : node.id);
  };

  const startPan = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.target as Element;
    if (target.closest('[data-node-id], .canvas-connection__hit')) return;
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
      onMove(dragId, Math.max(0, next.x - dragOffset.current.x), Math.max(0, next.y - dragOffset.current.y));
    } else if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      setPan({ x: event.clientX - panStart.current.x, y: event.clientY - panStart.current.y });
    }
  };

  const finish = (event: React.PointerEvent<HTMLDivElement>) => {
    if (wire) {
      const hit = document.elementFromPoint(event.clientX, event.clientY);
      const target = hit?.closest('[data-node-id]')?.getAttribute('data-node-id');
      if (target && target !== wire.sourceId) onConnect(wire.sourceId, target);
      setWire(undefined);
    }
    setDragId(undefined);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const startWire = (event: React.PointerEvent<HTMLSpanElement>, node: CanvasNodeData) => {
    event.stopPropagation();
    const next = point(event);
    setWire({ sourceId: node.id, x: next.x, y: next.y });
    surface.current?.setPointerCapture(event.pointerId);
  };

  const wheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const nextZoom = Math.max(0.3, Math.min(2.2, zoom + (event.deltaY < 0 ? 0.1 : -0.1)));
    const cursor = point(event);
    const bounds = surface.current!.getBoundingClientRect();
    setPan({ x: event.clientX - bounds.left - cursor.x * nextZoom, y: event.clientY - bounds.top - cursor.y * nextZoom });
    onZoom(nextZoom);
  };

  const backgroundSize = `${24 * zoom}px ${24 * zoom}px`;
  return <div className="pipeline-canvas" ref={surface} style={{ backgroundPosition: `${pan.x}px ${pan.y}px`, backgroundSize }} onPointerDown={startPan} onPointerMove={move} onPointerUp={finish} onPointerCancel={finish} onWheel={wheel} onDrop={(event) => { event.preventDefault(); const raw = event.dataTransfer.getData('application/mlflow-node'); if (raw) { const next = point(event); onAdd(JSON.parse(raw), next.x, next.y); } }} onDragOver={(event) => event.preventDefault()}>
    <div className="pipeline-canvas__world" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
      <svg className="pipeline-wires" width="2400" height="1600">{connections.map((connection) => { const source = nodes.find((node) => node.id === connection.sourceId); const target = nodes.find((node) => node.id === connection.targetId); return source && target ? <Connection key={connection.id} source={source} target={target} onDisconnect={() => onDisconnect(connection.id)} /> : null; })}{wire && nodes.find((node) => node.id === wire.sourceId) && <Connection source={nodes.find((node) => node.id === wire.sourceId)!} target={{ id: 'preview', title: '', subtitle: '', type: 'input', x: wire.x, y: wire.y }} preview />}</svg>
      {nodes.map((node) => <CanvasNode key={node.id} node={node} selected={node.id === selectedId} dragging={node.id === dragId} onPointerDown={(event) => startNodeDrag(event, node)} onStartConnection={(event) => startWire(event, node)} />)}
    </div>
    <div className="canvas-status">Drag canvas to pan · Scroll to zoom at cursor · Drag ports to connect · Click a wire to remove</div>
  </div>;
}
