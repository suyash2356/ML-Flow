import { useEffect, useState } from 'react';
import type { FeedFilter, PostComment, PostItem, Project } from '../../types';
import type { DashboardPostDraft } from '../../types/dashboard';
import { useAuth } from '../../components/Auth/AuthContext';
import { FeedFilterTabs } from '../../components/Dashboard/FeedFilterTabs';
import { PostCard } from '../../components/Dashboard/PostCard';
import { PostComposer } from '../../components/Dashboard/PostComposer';
import { SuggestedFollowList } from '../../components/Dashboard/SuggestedFollowList';
import { TrendingMLCard } from '../../components/Dashboard/TrendingMLCard';
import { UserProfileCard } from '../../components/Dashboard/UserProfileCard';
import {
  addPostComment,
  createPost,
  deletePost,
  forkShowcase,
  loadDashboard,
  loadPostComments,
  toggleFollow,
  togglePostBookmark,
  togglePostLike,
  type DashboardSnapshot,
} from '../../services/dashboard';
import './DashboardPage.css';

interface DashboardPageProps {
  projects: Project[];
  onOpenWorkspace: (project: Project) => void;
}

export function DashboardPage({ projects, onOpenWorkspace }: DashboardPageProps) {
  const { session } = useAuth();
  const userId = session.user.id;
  const [activeFilter, setActiveFilter] = useState<FeedFilter>('for_you');
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadToken, setReloadToken] = useState(0);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [commentsByPost, setCommentsByPost] = useState<Record<string, PostComment[]>>({});
  const [loadedCommentPosts, setLoadedCommentPosts] = useState<Set<string>>(() => new Set());
  const [commentsLoading, setCommentsLoading] = useState<Set<string>>(() => new Set());
  const [pendingPosts, setPendingPosts] = useState<Set<string>>(() => new Set());
  const [pendingProfiles, setPendingProfiles] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    let active = true;
    void loadDashboard(userId, activeFilter)
      .then((data) => {
        if (!active) return;
        setSnapshot(data);
        setErrorMessage('');
      })
      .catch((error: unknown) => {
        if (active) setErrorMessage(error instanceof Error ? error.message : 'Unable to load the dashboard.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, [userId, activeFilter, reloadToken]);

  const runPostAction = async (postId: string, action: () => Promise<void>) => {
    setPendingPosts((current) => new Set(current).add(postId));
    try {
      await action();
    } finally {
      setPendingPosts((current) => {
        const next = new Set(current);
        next.delete(postId);
        return next;
      });
    }
  };

  const handleAddPost = async (draft: DashboardPostDraft) => {
    await createPost(userId, draft);
    setIsComposerOpen(false);
    setIsLoading(true);
    setReloadToken((current) => current + 1);
  };

  const handleForkProject = async (showcaseId: string) => {
    const project = await forkShowcase(userId, showcaseId);
    onOpenWorkspace(project);
  };

  const handleToggleLike = (post: PostItem) => runPostAction(post.id, async () => {
    await togglePostLike(userId, post.id, Boolean(post.liked));
    setSnapshot((current) => current && ({
      ...current,
      posts: current.posts.map((item) => item.id === post.id ? {
        ...item,
        liked: !post.liked,
        likesCount: Math.max(0, item.likesCount + (post.liked ? -1 : 1)),
      } : item),
    }));
  });

  const handleToggleBookmark = (post: PostItem) => runPostAction(post.id, async () => {
    await togglePostBookmark(userId, post.id, Boolean(post.saved));
    setSnapshot((current) => current && ({
      ...current,
      posts: current.posts.map((item) => item.id === post.id ? { ...item, saved: !post.saved } : item),
    }));
  });

  const handleLoadComments = async (postId: string) => {
    if (loadedCommentPosts.has(postId)) return;
    setCommentsLoading((current) => new Set(current).add(postId));
    try {
      const comments = await loadPostComments(postId);
      setCommentsByPost((current) => ({ ...current, [postId]: comments }));
      setLoadedCommentPosts((current) => new Set(current).add(postId));
    } finally {
      setCommentsLoading((current) => {
        const next = new Set(current);
        next.delete(postId);
        return next;
      });
    }
  };

  const handleAddComment = (post: PostItem, content: string) => runPostAction(post.id, async () => {
    const inserted = await addPostComment(userId, post.id, content);
    const profile = snapshot?.profile;
    const comment: PostComment = {
      id: inserted.id,
      authorName: profile?.displayName || 'You',
      authorHandle: profile?.username ? `@${profile.username}` : '@you',
      authorAvatar: profile?.displayName?.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase() || 'U',
      content: inserted.content,
      timestamp: 'Just now',
    };
    setCommentsByPost((current) => ({ ...current, [post.id]: [...(current[post.id] ?? []), comment] }));
    setLoadedCommentPosts((current) => new Set(current).add(post.id));
    setSnapshot((current) => current && ({
      ...current,
      posts: current.posts.map((item) => item.id === post.id ? { ...item, commentsCount: item.commentsCount + 1 } : item),
    }));
  });

  const handleDeletePost = (postId: string) => runPostAction(postId, async () => {
    if (!window.confirm('Remove this post from the feed?')) return;
    await deletePost(postId);
    setSnapshot((current) => current && ({ ...current, posts: current.posts.filter((post) => post.id !== postId) }));
  });

  const handleFollow = async (profileId: string, isFollowing: boolean) => {
    setPendingProfiles((current) => new Set(current).add(profileId));
    try {
      await toggleFollow(userId, profileId, isFollowing);
      setSnapshot((current) => current && ({
        ...current,
        profile: { ...current.profile, followingCount: Math.max(0, current.profile.followingCount + (isFollowing ? -1 : 1)) },
        suggestions: current.suggestions.map((profile) => profile.id === profileId ? { ...profile, isFollowing: !isFollowing } : profile),
      }));
    } finally {
      setPendingProfiles((current) => {
        const next = new Set(current);
        next.delete(profileId);
        return next;
      });
    }
  };

  return (
    <div className="dashboard-3col">
      <aside className="dashboard-3col__left">
        {snapshot && <UserProfileCard profile={snapshot.profile} projectCount={projects.length} />}
        {snapshot && <TrendingMLCard trendingTags={snapshot.trendingTags} />}
      </aside>

      <main className="dashboard-3col__center">
        <FeedFilterTabs
          activeFilter={activeFilter}
          onSelectFilter={(filter) => {
            if (filter === activeFilter) return;
            setIsLoading(true);
            setErrorMessage('');
            setActiveFilter(filter);
          }}
        />

        <div className="dashboard-3col__feed-list">
          {errorMessage ? (
            <div className="dashboard-3col__state dashboard-3col__state--error" role="alert">
              <p>Dashboard data could not be loaded: {errorMessage}</p>
              <button type="button" onClick={() => { setIsLoading(true); setReloadToken((value) => value + 1); }}>Retry</button>
              <p className="dashboard-3col__migration-note">If this mentions a missing column, view, or function, run the dashboard migration in Supabase.</p>
            </div>
          ) : isLoading ? (
            <p className="dashboard-3col__state" role="status">Loading your dashboard...</p>
          ) : snapshot?.posts.length ? snapshot.posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              comments={commentsByPost[post.id] ?? []}
              commentsLoaded={loadedCommentPosts.has(post.id)}
              commentsLoading={commentsLoading.has(post.id)}
              isPending={pendingPosts.has(post.id)}
              isOwnPost={post.authorId === userId}
              onToggleLike={() => handleToggleLike(post)}
              onToggleSave={() => handleToggleBookmark(post)}
              onLoadComments={() => handleLoadComments(post.id)}
              onAddComment={(content) => handleAddComment(post, content)}
              onDelete={() => handleDeletePost(post.id)}
              onForkProject={handleForkProject}
            />
          )) : (
            <div className="dashboard-3col__state">
              <h2>{activeFilter === 'following' ? 'Your feed is quiet' : 'No posts yet'}</h2>
              <p>{activeFilter === 'following' ? 'Follow people to see their posts here.' : 'Posts from the community will appear here.'}</p>
            </div>
          )}
        </div>

        <button
          type="button"
          className="dashboard-3col__compose-button"
          aria-label="Create a post"
          title="Create a post"
          onClick={() => setIsComposerOpen(true)}
        >
          <span aria-hidden="true">✎</span>
        </button>
      </main>

      <aside className="dashboard-3col__right">
        {snapshot && <SuggestedFollowList users={snapshot.suggestions} pendingIds={pendingProfiles} onToggleFollow={handleFollow} />}
      </aside>

      {isComposerOpen && (
        <div className="dashboard-3col__composer-overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setIsComposerOpen(false);
        }}>
          <section className="dashboard-3col__composer-dialog" role="dialog" aria-modal="true" aria-labelledby="dashboard-compose-title">
            <div className="dashboard-3col__composer-header">
              <h2 id="dashboard-compose-title">Create a post</h2>
              <button type="button" className="dashboard-3col__composer-close" aria-label="Close post composer" onClick={() => setIsComposerOpen(false)}>×</button>
            </div>
            <PostComposer
              userProjects={projects}
              onAddPost={handleAddPost}
              onCancel={() => setIsComposerOpen(false)}
              initiallyExpanded
            />
          </section>
        </div>
      )}
    </div>
  );
}