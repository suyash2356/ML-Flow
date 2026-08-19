import { useEffect, useMemo, useState } from 'react';
import { NodeLibrary } from '../../components/NodeLibrary/NodeLibrary';
import { NodeInspector } from '../../components/NodeInspector/NodeInspector';
import { OutputPanel } from '../../components/OutputPanel/OutputPanel';
import { PipelineCanvas } from '../../components/PipelineCanvas/PipelineCanvas';
import { ProjectHeader } from '../../components/ProjectHeader/ProjectHeader';
import { ZoomControls } from '../../components/ZoomControls/ZoomControls';
import { INITIAL_TRAINING_RUNS } from '../../config/constants';
import { MOCK_STARTER_NODES } from '../../config/mockData';
import type { CanvasConnection, CanvasNodeData, NavigationPage, Project, TrainingRun } from '../../types';
import './WorkspacePage.css';

interface WorkspacePageProps {
  project?: Project;
  onNavigate?: (page: NavigationPage) => void;
}

type LibraryItem = { name: string; description: string; type: CanvasNodeData['type'] };

export function WorkspacePage({ project, onNavigate }: WorkspacePageProps) {
  const mode = project?.type || 'ML';
  const starter = useMemo(
    () =>
      MOCK_STARTER_NODES[mode].map((n) => ({
        ...n,
        status: n.status === 'selected' ? 'idle' : n.status || 'idle',
      })),
    [mode]
  );

  const [nodes, setNodes] = useState<CanvasNodeData[]>(starter);
  const [connections, setConnections] = useState<CanvasConnection[]>(() =>
    starter.slice(0, -1).map((node, index) => ({
      id: `link-${node.id}-${starter[index + 1].id}`,
      sourceId: node.id,
      targetId: starter[index + 1].id,
    }))
  );
  const [selectedId, setSelectedId] = useState<string>();
  const [connectingSourceId, setConnectingSourceId] = useState<string>();
  const [zoom, setZoom] = useState(0.85);
  const [runs, setRuns] = useState<TrainingRun[]>(INITIAL_TRAINING_RUNS);
  const [logs, setLogs] = useState<string[]>([
    '> ML Flow workspace ready.',
    `> Loaded ${starter.length} pipeline nodes.`,
  ]);
  const [panelHeight, setPanelHeight] = useState(190);
  const [name, setName] = useState(project?.name || 'Customer Churn Prediction v3.1');

  useEffect(() => {
    setNodes(starter);
    setConnections(
      starter.slice(0, -1).map((n, i) => ({
        id: `link-${n.id}-${starter[i + 1].id}`,
        sourceId: n.id,
        targetId: starter[i + 1].id,
      }))
    );
    setSelectedId(undefined);
    setConnectingSourceId(undefined);
    setName(project?.name || 'Customer Churn Prediction v3.1');
  }, [project?.id, starter]);

  const selected = nodes.find((n) => n.id === selectedId);

  const move = (id: string, x: number, y: number) =>
    setNodes((list) => list.map((n) => (n.id === id ? { ...n, x, y } : n)));

  const add = (
    item: LibraryItem,
    x = 130 + nodes.length * 25,
    y = 140 + nodes.length * 18
  ) => {
    const id = `node-${Date.now()}`;
    setNodes((list) => [
      ...list,
      { id, title: item.name, subtitle: item.description, type: item.type, x, y, status: 'idle' },
    ]);
    setSelectedId(id);
    setLogs((l) => [...l, `> Added ${item.name} to canvas.`]);
  };

  const connect = (nodeAId: string, nodeBId: string) => {
    if (nodeAId === nodeBId) return;
    const nodeA = nodes.find((n) => n.id === nodeAId);
    const nodeB = nodes.find((n) => n.id === nodeBId);
    if (!nodeA || !nodeB) return;

    // Topology rank mapping: input (0) -> preprocessing (1) -> model (2) -> eval (3)
    const rankMap: Record<CanvasNodeData['type'], number> = {
      input: 0,
      preprocessing: 1,
      model: 2,
      eval: 3,
    };

    let sourceId = nodeAId;
    let targetId = nodeBId;

    if (rankMap[nodeA.type] > rankMap[nodeB.type]) {
      sourceId = nodeBId;
      targetId = nodeAId;
    } else if (rankMap[nodeA.type] === rankMap[nodeB.type] && nodeA.x > nodeB.x) {
      sourceId = nodeBId;
      targetId = nodeAId;
    }

    const sourceNode = nodes.find((n) => n.id === sourceId);
    const targetNode = nodes.find((n) => n.id === targetId);

    setConnections((list) => {
      const exists = list.some(
        (c) =>
          (c.sourceId === sourceId && c.targetId === targetId) ||
          (c.sourceId === targetId && c.targetId === sourceId)
      );
      if (exists) {
        setLogs((l) => [...l, `! Connection between ${sourceNode?.title} and ${targetNode?.title} already exists.`]);
        return list;
      }
      setLogs((l) => [...l, `> Connected ${sourceNode?.title} → ${targetNode?.title}`]);
      return [...list, { id: `link-${sourceId}-${targetId}`, sourceId, targetId }];
    });
  };

  const connectNearest = (nodeId: string, count = 2) => {
    const targetNode = nodes.find((n) => n.id === nodeId);
    if (!targetNode) return;

    const candidateNodes = nodes.filter((n) => n.id !== nodeId);
    if (candidateNodes.length === 0) {
      setLogs((l) => [...l, '! No other nodes available on canvas.']);
      return;
    }

    const unconnectedCandidates = candidateNodes.filter(
      (cand) =>
        !connections.some(
          (c) =>
            (c.sourceId === nodeId && c.targetId === cand.id) ||
            (c.sourceId === cand.id && c.targetId === nodeId)
        )
    );

    if (unconnectedCandidates.length === 0) {
      setLogs((l) => [...l, `! ${targetNode.title} is already connected to all available nodes.`]);
      return;
    }

    const sorted = [...unconnectedCandidates].sort((a, b) => {
      const distA = Math.hypot(a.x - targetNode.x, a.y - targetNode.y);
      const distB = Math.hypot(b.x - targetNode.x, b.y - targetNode.y);
      return distA - distB;
    });

    const targetsToConnect = sorted.slice(0, count);
    targetsToConnect.forEach((target) => {
      connect(nodeId, target.id);
    });

    setLogs((l) => [
      ...l,
      `⚡ Auto-connected ${targetNode.title} with nearest ${targetsToConnect.length} node${
        targetsToConnect.length > 1 ? 's' : ''
      }.`,
    ]);
  };

  const removeNode = (nodeId: string) => {
    const nodeToRemove = nodes.find((n) => n.id === nodeId);
    setNodes((list) => list.filter((node) => node.id !== nodeId));
    setConnections((list) =>
      list.filter((connection) => connection.sourceId !== nodeId && connection.targetId !== nodeId)
    );
    if (selectedId === nodeId) setSelectedId(undefined);
    if (connectingSourceId === nodeId) setConnectingSourceId(undefined);
    if (nodeToRemove) setLogs((log) => [...log, `> Removed ${nodeToRemove.title}.`]);
  };

  const disconnectNode = (nodeId: string) => {
    const nodeToDisconnect = nodes.find((n) => n.id === nodeId);
    setConnections((list) =>
      list.filter((connection) => connection.sourceId !== nodeId && connection.targetId !== nodeId)
    );
    if (nodeToDisconnect) setLogs((log) => [...log, `> Disconnected ${nodeToDisconnect.title}.`]);
  };

  const execute = async (flow: boolean) => {
    const ordered: string[] = [];
    const visit = (id: string, seen = new Set<string>()) => {
      if (seen.has(id)) return;
      seen.add(id);
      connections.filter((c) => c.targetId === id).forEach((c) => visit(c.sourceId, seen));
      if (!ordered.includes(id)) ordered.push(id);
    };
    if (flow) nodes.forEach((n) => visit(n.id));
    else if (selectedId) visit(selectedId);
    const queue = ordered;
    if (!queue.length) {
      setLogs((l) => [...l, '! Select a node to run it.']);
      return;
    }
    setLogs((l) => [...l, `> ${flow ? 'Running complete flow' : 'Running current node and upstream dependencies'}…`]);
    for (const id of queue) {
      setNodes((list) => list.map((n) => (n.id === id ? { ...n, status: 'running' } : n)));
      setLogs((l) => [...l, `  • ${nodes.find((n) => n.id === id)?.title || id}: running`]);
      await new Promise<void>((resolve) => window.setTimeout(resolve, 420));
      setNodes((list) => list.map((n) => (n.id === id ? { ...n, status: 'success' } : n)));
      setLogs((l) => [...l, `  ✓ ${nodes.find((n) => n.id === id)?.title || id}: complete`]);
    }
    const model = selected?.title || nodes.find((n) => n.type === 'model')?.title || 'Pipeline';
    setRuns((list) => [
      {
        id: `Run #${112 + list.length}`,
        model,
        accuracy: 0.87,
        f1Score: 0.84,
        trainingTime: `${Math.max(1, Math.round(queue.length * 0.4))}s`,
        status: 'Completed',
      },
      ...list,
    ]);
    setLogs((l) => [...l, `> Run complete — ${queue.length} node${queue.length === 1 ? '' : 's'} succeeded.`]);
  };

  const menuAction = (action: string) => {
    if (action === 'Reset workspace') {
      setNodes([]);
      setConnections([]);
      setSelectedId(undefined);
      setConnectingSourceId(undefined);
      setLogs((l) => [...l, '> Workspace cleared.']);
    } else setLogs((l) => [...l, `> ${action} requested.`]);
  };

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd' && selected) {
        e.preventDefault();
        add({ name: `${selected.title} copy`, description: selected.subtitle, type: selected.type }, selected.x + 36, selected.y + 36);
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selected && !(e.target instanceof HTMLInputElement)) {
        removeNode(selected.id);
      }
      if (e.key === 'Escape') {
        setConnectingSourceId(undefined);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        execute(true);
      }
    };
    window.addEventListener('keydown',key);
    return () => window.removeEventListener('keydown', key);
  }, [selected, nodes, connections]);

  return (
    <div className="workspace-page">
      <ProjectHeader
        project={project}
        name={name}
        onNameChange={setName}
        onRunNode={() => execute(false)}
        onRunFlow={() => execute(true)}
        canRunNode={Boolean(selected)}
        onAction={menuAction}
        onNavigate={onNavigate}
      />

      <div className="workspace-page__body">
        <NodeLibrary onAdd={(item) => add(item)} />
        <section className="workspace-page__canvas">
          <PipelineCanvas
            nodes={nodes}
            connections={connections}
            selectedId={selectedId}
            connectingSourceId={connectingSourceId}
            zoom={zoom}
            onSelect={setSelectedId}
            onMove={move}
            onAdd={add}
            onConnect={connect}
            onDisconnect={(id) => {
              setConnections((list) => list.filter((connection) => connection.id !== id));
              setLogs((log) => [...log, '> Connection removed.']);
            }}
            onDisconnectNode={disconnectNode}
            onDeleteNode={removeNode}
            onConnectNearest={(id) => connectNearest(id, 2)}
            onCancelTargetConnect={() => setConnectingSourceId(undefined)}
            onZoom={setZoom}
          />
          <NodeInspector
            node={selected}
            allNodes={nodes}
            isTargeting={selected ? connectingSourceId === selected.id : false}
            onClose={() => setSelectedId(undefined)}
            onRun={() => execute(false)}
            onDelete={() => selected && removeNode(selected.id)}
            onDisconnect={() => selected && disconnectNode(selected.id)}
            onConnectNearest={() => selected && connectNearest(selected.id, 2)}
            onConnectTarget={(targetId) => selected && connect(selected.id, targetId)}
            onStartTargetConnect={() =>
              selected &&
              setConnectingSourceId((prev) => (prev === selected.id ? undefined : selected.id))
            }
          />
          <ZoomControls zoom={zoom} onChange={setZoom} onFit={() => setZoom(0.85)} />
        </section>
      </div>
      <OutputPanel nodes={nodes} runs={runs} logs={logs} height={panelHeight} onResize={setPanelHeight} />
    </div>
  );
}

