import type { PostComment, PostItem, Project } from '../types';
import type { DashboardPostDraft, DashboardProfile, FeedFilter, SuggestedProfile, TrendingTag } from '../types';
import { createProject } from './projects';
import { saveProjectWorkflow, type WorkflowDefinition } from './workflows';
import { requireSupabase } from './supabase';

export interface DashboardSnapshot {
  profile: DashboardProfile;
  posts: PostItem[];
  suggestions: SuggestedProfile[];
  trendingTags: TrendingTag[];
}

interface ProfileRow {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  headline: string | null;
  bio: string | null;
  location: string | null;
}

interface PostRow {
  id: string;
  author_id: string;
  post_type: string;
  content: string | null;
  metadata: unknown;
  showcase_id: string | null;
  created_at: string;
}

interface ShowcaseRow {
  id: string;
  title: string;
  project_type: string | null;
}

interface ShowcaseVersionRow {
  showcase_id: string;
  version_number: number;
  preview_data: unknown;
  metrics: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function text(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function postOperationError(operation: string, error: {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}) {
  const diagnostic = [
    `${operation}: ${error.message}`,
    error.code ? `Code: ${error.code}` : '',
    error.details ? `Details: ${error.details}` : '',
    error.hint ? `Hint: ${error.hint}` : '',
  ].filter(Boolean).join(' | ');
  return new Error(diagnostic, { cause: error });
}

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'U';
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

function postMode(value: string): PostItem['mode'] {
  return value === 'resource' || value === 'question' || value === 'project' ? value : 'thought';
}

function profileToDashboard(
  row: ProfileRow,
  skills: string[],
  followerCount: number,
  followingCount: number,
): DashboardProfile {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    headline: row.headline,
    location: row.location,
    skills,
    followerCount,
    followingCount,
  };
}

export async function loadDashboard(userId: string, filter: FeedFilter): Promise<DashboardSnapshot> {
  const client = requireSupabase();
  const [profileResult, followingResult, blockedResult, followerCountResult, followingCountResult, skillLinksResult, candidateResult] = await Promise.all([
    client.from('profiles').select('id, username, display_name, avatar_url, headline, bio, location').eq('id', userId).maybeSingle(),
    client.from('follows').select('following_id').eq('follower_id', userId),
    client.from('blocks').select('blocked_id').eq('blocker_id', userId),
    client.from('follows').select('follower_id', { count: 'exact', head: true }).eq('following_id', userId),
    client.from('follows').select('following_id', { count: 'exact', head: true }).eq('follower_id', userId),
    client.from('user_skills').select('skill_id').eq('user_id', userId),
    client.from('profiles').select('id, username, display_name, avatar_url, headline, bio, location').neq('id', userId).order('created_at', { ascending: false }).limit(30),
  ]);

  for (const result of [profileResult, followingResult, blockedResult, followerCountResult, followingCountResult, skillLinksResult, candidateResult]) {
    if (result.error) throw result.error;
  }

  if (!profileResult.data) throw new Error('Your profile could not be found. Contact support before continuing.');
  const currentProfile = profileResult.data as ProfileRow;
  const followingIds = ((followingResult.data ?? []) as { following_id: string }[]).map((row) => row.following_id);
  const blockedIds = new Set(((blockedResult.data ?? []) as { blocked_id: string }[]).map((row) => row.blocked_id));
  const skillIds = ((skillLinksResult.data ?? []) as { skill_id: string }[]).map((row) => row.skill_id);
  const candidateRows = (candidateResult.data ?? []) as ProfileRow[];

  const [skillNamesResult, followerRowsResult] = await Promise.all([
    skillIds.length
      ? client.from('skills').select('id, name').in('id', skillIds)
      : Promise.resolve({ data: [], error: null }),
    candidateRows.length
      ? client.from('follows').select('following_id').in('following_id', candidateRows.map((row) => row.id))
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (skillNamesResult.error) throw skillNamesResult.error;
  if (followerRowsResult.error) throw followerRowsResult.error;

  const skillNames = ((skillNamesResult.data ?? []) as { id: string; name: string }[]).map((skill) => skill.name);
  const candidateFollowerCounts = new Map<string, number>();
  for (const row of (followerRowsResult.data ?? []) as { following_id: string }[]) {
    candidateFollowerCounts.set(row.following_id, (candidateFollowerCounts.get(row.following_id) ?? 0) + 1);
  }
  const followingSet = new Set(followingIds);
  const suggestions = candidateRows
    .filter((row) => !blockedIds.has(row.id))
    .slice(0, 8)
    .map((row) => ({
      id: row.id,
      username: row.username,
      displayName: row.display_name,
      avatarUrl: row.avatar_url,
      headline: row.headline,
      followerCount: candidateFollowerCounts.get(row.id) ?? 0,
      isFollowing: followingSet.has(row.id),
    }));

  const profile = profileToDashboard(
    currentProfile,
    skillNames,
    followerCountResult.count ?? 0,
    followingCountResult.count ?? 0,
  );

  let postQuery = client
    .from('posts')
    .select('id, author_id, post_type, content, metadata, showcase_id, created_at')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(filter === 'trending' ? 100 : 40);

  if (filter === 'global') postQuery = postQuery.eq('visibility', 'public');
  if (filter === 'following') {
    if (followingIds.length === 0) {
      return { profile, posts: [], suggestions, trendingTags: [] };
    }
    postQuery = postQuery.in('author_id', followingIds);
  }
  if (filter === 'my_country') {
    if (!currentProfile.location) return { profile, posts: [], suggestions, trendingTags: [] };
    const { data: sameLocationRows, error } = await client
      .from('profiles')
      .select('id')
      .eq('location', currentProfile.location);
    if (error) throw error;
    const locationIds = ((sameLocationRows ?? []) as { id: string }[]).map((row) => row.id);
    if (locationIds.length === 0) return { profile, posts: [], suggestions, trendingTags: [] };
    postQuery = postQuery.in('author_id', locationIds);
  }
  if (filter === 'trending') {
    postQuery = postQuery.gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
  }

  const { data: postData, error: postError } = await postQuery;
  if (postError) throw postError;
  const postRows = (postData ?? []) as PostRow[];
  if (postRows.length === 0) return { profile, posts: [], suggestions, trendingTags: [] };

  const postIds = postRows.map((row) => row.id);
  const authorIds = [...new Set(postRows.map((row) => row.author_id))];
  const showcaseIds = [...new Set(postRows.map((row) => row.showcase_id).filter((id): id is string => Boolean(id)))];
  const [authorsResult, engagementResult, likedResult, savedResult, showcasesResult, versionsResult] = await Promise.all([
    client.from('profiles').select('id, username, display_name, avatar_url, headline, bio, location').in('id', authorIds),
    client.from('post_engagement_summary').select('post_id, likes_count, comments_count').in('post_id', postIds),
    client.from('post_likes').select('post_id').eq('user_id', userId).in('post_id', postIds),
    client.from('bookmarks').select('post_id').eq('user_id', userId).in('post_id', postIds),
    showcaseIds.length
      ? client.from('project_showcases').select('id, title, project_type').in('id', showcaseIds)
      : Promise.resolve({ data: [], error: null }),
    showcaseIds.length
      ? client.from('project_showcase_versions').select('showcase_id, version_number, preview_data, metrics').in('showcase_id', showcaseIds).order('version_number', { ascending: false })
      : Promise.resolve({ data: [], error: null }),
  ]);
  for (const result of [authorsResult, engagementResult, likedResult, savedResult, showcasesResult, versionsResult]) {
    if (result.error) throw result.error;
  }

  const authors = new Map(((authorsResult.data ?? []) as ProfileRow[]).map((row) => [row.id, row]));
  const engagements = new Map(((engagementResult.data ?? []) as { post_id: string; likes_count: number; comments_count: number }[]).map((row) => [row.post_id, row]));
  const likedIds = new Set(((likedResult.data ?? []) as { post_id: string }[]).map((row) => row.post_id));
  const savedIds = new Set(((savedResult.data ?? []) as { post_id: string }[]).map((row) => row.post_id));
  const showcases = new Map(((showcasesResult.data ?? []) as ShowcaseRow[]).map((row) => [row.id, row]));
  const versions = new Map<string, ShowcaseVersionRow>();
  for (const version of (versionsResult.data ?? []) as ShowcaseVersionRow[]) {
    if (!versions.has(version.showcase_id)) versions.set(version.showcase_id, version);
  }

  const posts = postRows.map((row): PostItem => {
    const author = authors.get(row.author_id);
    const authorName = author?.display_name || 'ML Flow member';
    const metadata = isRecord(row.metadata) ? row.metadata : {};
    const link = isRecord(metadata.resource) ? metadata.resource : null;
    const showcase = row.showcase_id ? showcases.get(row.showcase_id) : undefined;
    const version = row.showcase_id ? versions.get(row.showcase_id) : undefined;
    const previewData = version && isRecord(version.preview_data) ? version.preview_data : {};
    const workflow = isRecord(previewData.workflow) ? previewData.workflow : {};
    const nodeCount = Array.isArray(workflow.nodes) ? workflow.nodes.length : 0;
    const taskType = showcase?.project_type?.toUpperCase();
    const attachedProject = showcase ? {
      id: showcase.id,
      name: showcase.title,
      datasetName: 'Not shared',
      taskType: taskType === 'EDA' ? 'EDA' as const : taskType === 'DL' ? 'DL' as const : 'ML' as const,
      metricAchieved: '',
      nodesCount: nodeCount,
    } : undefined;

    return {
      id: row.id,
      authorId: row.author_id,
      authorName,
      authorHandle: author?.username ? `@${author.username}` : '@member',
      authorAvatar: initials(authorName),
      authorRole: author?.headline ?? '',
      authorCountry: author?.location ?? '',
      authorLocation: author?.location ?? undefined,
      timestamp: relativeTime(row.created_at),
      mode: postMode(row.post_type),
      textContent: row.content ?? '',
      tags: stringArray(metadata.tags),
      codeSnippet: text(metadata.code_snippet) || undefined,
      linkPreview: link && typeof link.url === 'string' ? {
        title: text(link.title) || link.url,
        domain: text(link.domain),
        description: '',
        url: link.url,
      } : undefined,
      attachedProject,
      showcaseId: row.showcase_id ?? undefined,
      likesCount: engagements.get(row.id)?.likes_count ?? 0,
      commentsCount: engagements.get(row.id)?.comments_count ?? 0,
      liked: likedIds.has(row.id),
      saved: savedIds.has(row.id),
      comments: [],
    };
  });

  if (filter === 'trending') {
    posts.sort((left, right) => (right.likesCount + right.commentsCount * 2) - (left.likesCount + left.commentsCount * 2));
  }

  const tagCounts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
  }
  const trendingTags = [...tagCounts.entries()]
    .map(([name, postCount]) => ({ name, postCount }))
    .sort((left, right) => right.postCount - left.postCount || left.name.localeCompare(right.name))
    .slice(0, 6);

  return { profile, posts, suggestions, trendingTags };
}

export async function createPost(userId: string, draft: DashboardPostDraft) {
  const client = requireSupabase();
  const metadata: Record<string, unknown> = {
    tags: [...new Set(draft.tags.map((tag) => tag.trim().replace(/^#/, '').slice(0, 40)).filter(Boolean))].slice(0, 10),
  };
  if (draft.codeSnippet?.trim()) metadata.code_snippet = draft.codeSnippet.trim().slice(0, 12_000);
  if (draft.resourceUrl) {
    const resourceUrl = new URL(draft.resourceUrl);
    if (!['http:', 'https:'].includes(resourceUrl.protocol)) throw new Error('Only HTTP and HTTPS resource links are allowed.');
    metadata.resource = {
      url: resourceUrl.toString(),
      title: draft.resourceTitle?.trim().slice(0, 200) || resourceUrl.hostname,
      domain: resourceUrl.hostname,
    };
  }

  if (draft.mode === 'project') {
    if (!draft.projectId) throw new Error('Select a project to publish a showcase.');
    const { error } = await client.rpc('publish_project_post', {
      p_project_id: draft.projectId,
      p_content: draft.content.trim(),
      p_metadata: metadata,
    });
    if (error) throw postOperationError('Project showcase publishing failed', error);
    return;
  }

  const { error } = await client.from('posts').insert({
    author_id: userId,
    post_type: draft.mode,
    content: draft.content.trim(),
    visibility: 'public',
    metadata,
  });
  if (error) throw postOperationError(`${draft.mode} post creation failed`, error);
}

export async function togglePostLike(userId: string, postId: string, currentlyLiked: boolean) {
  const client = requireSupabase();
  const result = currentlyLiked
    ? await client.from('post_likes').delete().eq('post_id', postId).eq('user_id', userId)
    : await client.from('post_likes').insert({ post_id: postId, user_id: userId });
  if (result.error) throw result.error;
}

export async function togglePostBookmark(userId: string, postId: string, currentlySaved: boolean) {
  const client = requireSupabase();
  const result = currentlySaved
    ? await client.from('bookmarks').delete().eq('post_id', postId).eq('user_id', userId)
    : await client.from('bookmarks').insert({ post_id: postId, user_id: userId });
  if (result.error) throw result.error;
}

export async function addPostComment(userId: string, postId: string, content: string) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('comments')
    .insert({ post_id: postId, author_id: userId, content: content.trim() })
    .select('id, content, created_at')
    .single();
  if (error) throw error;
  return data as { id: string; content: string; created_at: string };
}

export async function loadPostComments(postId: string): Promise<PostComment[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('comments')
    .select('id, author_id, content, created_at')
    .eq('post_id', postId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true })
    .limit(100);
  if (error) throw error;

  const comments = (data ?? []) as { id: string; author_id: string; content: string; created_at: string }[];
  const authorIds = [...new Set(comments.map((comment) => comment.author_id))];
  const { data: profiles, error: profileError } = authorIds.length
    ? await client.from('profiles').select('id, username, display_name').in('id', authorIds)
    : { data: [], error: null };
  if (profileError) throw profileError;
  const authors = new Map(((profiles ?? []) as { id: string; username: string; display_name: string }[]).map((profile) => [profile.id, profile]));

  return comments.map((comment) => {
    const author = authors.get(comment.author_id);
    const authorName = author?.display_name || 'ML Flow member';
    return {
      id: comment.id,
      authorName,
      authorHandle: author?.username ? `@${author.username}` : '@member',
      authorAvatar: initials(authorName),
      content: comment.content,
      timestamp: relativeTime(comment.created_at),
    };
  });
}

export async function deletePost(postId: string) {
  const { error } = await requireSupabase()
    .from('posts')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', postId);
  if (error) throw error;
}

export async function toggleFollow(userId: string, targetId: string, currentlyFollowing: boolean) {
  const client = requireSupabase();
  const result = currentlyFollowing
    ? await client.from('follows').delete().eq('follower_id', userId).eq('following_id', targetId)
    : await client.from('follows').insert({ follower_id: userId, following_id: targetId });
  if (result.error) throw result.error;
}

export async function forkShowcase(userId: string, showcaseId: string): Promise<Project> {
  const client = requireSupabase();
  const [{ data: showcase, error: showcaseError }, { data: version, error: versionError }] = await Promise.all([
    client.from('project_showcases').select('id, title, description, project_type').eq('id', showcaseId).maybeSingle(),
    client.from('project_showcase_versions').select('preview_data').eq('showcase_id', showcaseId).order('version_number', { ascending: false }).limit(1).maybeSingle(),
  ]);
  if (showcaseError) throw showcaseError;
  if (versionError) throw versionError;
  if (!showcase) throw new Error('This project showcase is no longer available.');

  const type = String(showcase.project_type).toUpperCase();
  const projectType = type === 'EDA' || type === 'DL' ? type : 'ML';
  const project = await createProject(userId, {
    name: `${showcase.title} (Copy)`,
    type: projectType,
    description: `${showcase.description || ''}`.trim(),
  });

  try {
    const previewData = isRecord(version?.preview_data) ? version.preview_data : {};
    const workflow = previewData.workflow;
    if (isRecord(workflow) && Array.isArray(workflow.nodes) && Array.isArray(workflow.connections)) {
      await saveProjectWorkflow(project.id, userId, workflow as unknown as WorkflowDefinition);
    }
    return project;
  } catch (error) {
    const { error: deleteError } = await client.from('projects').delete().eq('id', project.id).eq('owner_id', userId);
    if (deleteError) {
      throw new Error(`Could not save the forked workflow or remove its project record: ${deleteError.message}`, { cause: error });
    }
    throw error;
  }
}