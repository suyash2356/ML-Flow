import { useState } from 'react';
import type { PostComment, PostItem } from '../../types';
import './PostCard.css';

interface PostCardProps {
  post: PostItem;
  comments: PostComment[];
  commentsLoaded: boolean;
  commentsLoading: boolean;
  isPending: boolean;
  isOwnPost: boolean;
  onToggleLike: () => Promise<void>;
  onToggleSave: () => Promise<void>;
  onLoadComments: () => Promise<void>;
  onAddComment: (content: string) => Promise<void>;
  onDelete: () => Promise<void>;
  onForkProject?: (showcaseId: string) => Promise<void>;
}

export function PostCard({
  post,
  comments,
  commentsLoaded,
  commentsLoading,
  isPending,
  isOwnPost,
  onToggleLike,
  onToggleSave,
  onLoadComments,
  onAddComment,
  onDelete,
  onForkProject,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [actionError, setActionError] = useState('');

  const handleAction = async (action: () => Promise<void>) => {
    setActionError('');
    try {
      await action();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'This action could not be completed.');
    }
  };

  const toggleComments = () => {
    const open = !showComments;
    setShowComments(open);
    if (open && !commentsLoaded) void handleAction(onLoadComments);
  };

  const handleAddComment = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newCommentText.trim() || isPending) return;
    void handleAction(async () => {
      await onAddComment(newCommentText.trim());
      setNewCommentText('');
    });
  };

  return (
    <div className={`post-card post-card--${post.mode}`}>
      {/* Header */}
      <div className="post-card__header">
        <div className="post-card__avatar">{post.authorAvatar}</div>
        <div className="post-card__user-info">
          <div className="post-card__user-top">
            <strong className="post-card__name">{post.authorName}</strong>
            {post.authorFlag && <span className="post-card__flag">{post.authorFlag}</span>}
            <span className="post-card__handle">{post.authorHandle}</span>
          </div>
          <span className="post-card__role">{[post.authorRole, post.authorLocation, post.timestamp].filter(Boolean).join(' • ')}</span>
        </div>
        <span className={`post-card__mode-badge post-card__mode-badge--${post.mode}`}>
          {post.mode === 'project'
            ? '🚀 Project Showcase'
            : post.mode === 'question'
            ? '❓ Question'
            : post.mode === 'resource'
            ? '🔗 Resource'
            : '💭 Thought'}
        </span>
      </div>

      {/* Main Text Content */}
      <p className="post-card__text">{post.textContent}</p>

      {/* Optional Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="post-card__tags">
          {post.tags.map((tag) => (
            <span key={tag} className="post-card__tag">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Code Snippet for Question / Technical Post */}
      {post.codeSnippet && (
        <div className="post-card__code-block">
          <div className="post-card__code-header">
            <span>Code Snippet / Setup</span>
            <button
              type="button"
              className="post-card__copy-btn"
              onClick={() => navigator.clipboard.writeText(post.codeSnippet || '')}
            >
              Copy
            </button>
          </div>
          <pre><code>{post.codeSnippet}</code></pre>
        </div>
      )}

      {/* LAYOUT TYPE 2: Link Preview Card for Resource Posts */}
      {post.mode === 'resource' && post.linkPreview && (
        <a
          href={post.linkPreview.url}
          target="_blank"
          rel="noreferrer"
          className="post-card__resource-preview"
        >
          <div className="post-card__resource-thumb">{post.linkPreview.thumbnailUrl || '🔗'}</div>
          <div className="post-card__resource-body">
            <span className="post-card__resource-domain">{post.linkPreview.domain}</span>
            <h4 className="post-card__resource-title">{post.linkPreview.title}</h4>
            <p className="post-card__resource-desc">{post.linkPreview.description}</p>
          </div>
        </a>
      )}

      {/* LAYOUT TYPE 3: Project Showcase Card with "Fork this pipeline" Button */}
      {post.mode === 'project' && post.attachedProject && (
        <div className="post-card__project-card">
          <div className="post-card__project-header">
            <div>
              <span className="post-card__project-task">{post.attachedProject.taskType}</span>
              <h4 className="post-card__project-title">{post.attachedProject.name}</h4>
            </div>
            {post.attachedProject.metricAchieved && (
              <div className="post-card__project-metric">
                <small>Top Metric</small>
                <strong>{post.attachedProject.metricAchieved}</strong>
              </div>
            )}
          </div>

          <div className="post-card__project-meta">
            <span>📁 Dataset: <strong>{post.attachedProject.datasetName}</strong></span>
            <span>•</span>
            <span>🧩 {post.attachedProject.nodesCount} Visual Nodes</span>
          </div>

          <button
            type="button"
            className="post-card__fork-btn"
            onClick={() => post.showcaseId && onForkProject && void handleAction(() => onForkProject(post.showcaseId!))}
            disabled={isPending || !post.showcaseId}
          >
            🍴 Fork This Pipeline →
          </button>
        </div>
      )}

      {/* Actions Bar */}
      <div className="post-card__actions">
        <button
          type="button"
          className={`post-card__action-btn ${post.liked ? 'post-card__action-btn--liked' : ''}`}
          onClick={() => void handleAction(onToggleLike)}
          disabled={isPending}
          aria-pressed={post.liked}
        >
          {post.liked ? '❤️' : '🤍'} {post.likesCount}
        </button>

        <button
          type="button"
          className="post-card__action-btn"
          onClick={toggleComments}
          aria-expanded={showComments}
        >
          💬 {post.commentsCount} Comments
        </button>

        <button
          type="button"
          className={`post-card__action-btn post-card__action-btn--bookmark ${
            post.saved ? 'post-card__action-btn--saved' : ''
          }`}
          onClick={() => void handleAction(onToggleSave)}
          disabled={isPending}
          aria-pressed={post.saved}
        >
          {post.saved ? '🔖 Saved' : '📑 Save'}
        </button>
        {isOwnPost && <button type="button" className="post-card__action-btn" disabled={isPending} onClick={() => void handleAction(onDelete)}>Delete</button>}
      </div>

      {actionError && <p className="post-card__error" role="alert">{actionError}</p>}

      {/* Expandable Comments Section */}
      {showComments && (
        <div className="post-card__comments-section">
          <form onSubmit={handleAddComment} className="post-card__comment-form">
            <input
              type="text"
              className="post-card__comment-input"
              placeholder="Write a comment..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              maxLength={2000}
            />
            <button type="submit" className="post-card__comment-submit" disabled={!newCommentText.trim() || isPending}>
              Reply
            </button>
          </form>

          {commentsLoading ? <p className="post-card__comments-loading">Loading comments...</p> : comments.length > 0 && (
            <div className="post-card__comments-list">
              {comments.map((c) => (
                <div key={c.id} className="post-card__comment-row">
                  <div className="post-card__comment-avatar">{c.authorAvatar}</div>
                  <div className="post-card__comment-content">
                    <div className="post-card__comment-header">
                      <strong>{c.authorName}</strong>
                      <span>{c.authorHandle} • {c.timestamp}</span>
                    </div>
                    <p>{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
