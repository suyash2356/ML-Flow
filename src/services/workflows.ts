import type { CanvasConnection, CanvasNodeData } from '../types';
import { requireSupabase } from './supabase';

export interface WorkflowDefinition {
  nodes: CanvasNodeData[];
  connections: CanvasConnection[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isWorkflowDefinition(value: unknown): value is WorkflowDefinition {
  if (!isRecord(value) || !Array.isArray(value.nodes) || !Array.isArray(value.connections)) return false;

  const validNodes = value.nodes.every((node) =>
    isRecord(node)
    && typeof node.id === 'string'
    && typeof node.title === 'string'
    && typeof node.subtitle === 'string'
    && ['input', 'preprocessing', 'model', 'eval'].includes(String(node.type))
    && typeof node.x === 'number'
    && typeof node.y === 'number'
  );
  const validConnections = value.connections.every((connection) =>
    isRecord(connection)
    && typeof connection.id === 'string'
    && typeof connection.sourceId === 'string'
    && typeof connection.targetId === 'string'
  );

  return validNodes && validConnections;
}

export async function loadProjectWorkflow(projectId: string): Promise<WorkflowDefinition | null> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('project_workflows')
    .select('definition')
    .eq('project_id', projectId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  if (!isWorkflowDefinition(data.definition)) {
    throw new Error('Saved workflow data is invalid. It was not changed.');
  }
  return data.definition;
}

export async function saveProjectWorkflow(
  projectId: string,
  ownerId: string,
  definition: WorkflowDefinition,
) {
  const client = requireSupabase();
  const { error } = await client
    .from('project_workflows')
    .upsert({
      project_id: projectId,
      owner_id: ownerId,
      schema_version: 1,
      definition,
    }, { onConflict: 'project_id' });

  if (error) throw error;
}