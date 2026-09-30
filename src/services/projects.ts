import type { Project } from '../types';
import { requireSupabase } from './supabase';

export interface NewProject {
  name: string;
  description: string;
  type: Project['type'];
}

interface ProjectRow {
  id: string;
  name: string;
  description: string;
  project_type: 'eda' | 'ml' | 'dl';
  status: 'draft' | 'in_progress' | 'completed';
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

function relativeTime(value: string) {
  const elapsed = Math.max(0, Date.now() - new Date(value).getTime());
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    type: row.project_type.toUpperCase() as Project['type'],
    status: row.status === 'in_progress' ? 'In Progress' : row.status === 'completed' ? 'Completed' : 'Draft',
    isFavorite: row.is_favorite,
    datasetName: 'No dataset selected',
    lastModified: relativeTime(row.updated_at),
    nodesCount: 0,
  };
}

export async function listProjects(ownerId: string): Promise<Project[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('projects')
    .select('id, name, description, project_type, status, is_favorite, created_at, updated_at')
    .eq('owner_id', ownerId)
    .is('deleted_at', null)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data as ProjectRow[]).map(toProject);
}

export async function createProject(ownerId: string, project: NewProject): Promise<Project> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('projects')
    .insert({
      owner_id: ownerId,
      name: project.name.trim(),
      description: project.description.trim(),
      project_type: project.type.toLowerCase(),
      status: 'draft',
    })
    .select('id, name, description, project_type, status, is_favorite, created_at, updated_at')
    .single();

  if (error) throw error;
  return toProject(data as ProjectRow);
}

export async function updateProjectName(ownerId: string, projectId: string, name: string): Promise<Project> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('projects')
    .update({ name: name.trim() })
    .eq('id', projectId)
    .eq('owner_id', ownerId)
    .select('id, name, description, project_type, status, is_favorite, created_at, updated_at')
    .single();

  if (error) throw error;
  return toProject(data as ProjectRow);
}