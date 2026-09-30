import type { PostMode } from './community';

export interface DashboardProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  headline: string | null;
  location: string | null;
  skills: string[];
  followerCount: number;
  followingCount: number;
}

export interface SuggestedProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  headline: string | null;
  followerCount: number;
  isFollowing: boolean;
}

export interface TrendingTag {
  name: string;
  postCount: number;
}

export interface DashboardPostDraft {
  mode: PostMode;
  content: string;
  tags: string[];
  codeSnippet?: string;
  resourceUrl?: string;
  resourceTitle?: string;
  projectId?: string;
}