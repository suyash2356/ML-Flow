import React, { useState } from 'react';
import './CommunityInContext.css';

interface CommunitySolution {
  id: string;
  title: string;
  authorName: string;
  authorAvatar: string;
  accuracy: string;
  algorithm: string;
  tags: string[];
  upvotes: number;
}

interface CommentItem {
  id: string;
  author: string;
  role: string;
  timeAgo: string;
  text: string;
  upvotes: number;
}

interface CommunityInContextProps {
  topicTitle: string;
}

const DEFAULT_SOLUTIONS: CommunitySolution[] = [
  {
    id: 'sol-1',
    title: 'Optimized Random Forest with Hyperband tuning on credit fraud',
    authorName: 'Alex Rivera',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
    accuracy: '0.984 AUC',
    algorithm: 'Random Forest',
    tags: ['Imbalanced Data', 'SMOTE', 'Hyperband'],
    upvotes: 42,
  },
  {
    id: 'sol-2',
    title: 'Residual skip connections with Cosine Annealing scheduler',
    authorName: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
    accuracy: '94.2% Top-1',
    algorithm: 'ResNet Custom',
    tags: ['Vision', 'PyTorch', 'Warmup'],
    upvotes: 35,
  },
  {
    id: 'sol-3',
    title: 'Robust Outlier Handling & Feature Store Pipeline',
    authorName: 'Devon Vance',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=faces',
    accuracy: '0.041 MSE',
    algorithm: 'EDA Pipeline',
    tags: ['Data Cleaning', 'Isolation Forest'],
    upvotes: 28,
  },
];

const DEFAULT_COMMENTS: CommentItem[] = [
  {
    id: 'c-1',
    author: 'Sarah Chen',
    role: 'ML Engineer @ Stripe',
    timeAgo: '2 hours ago',
    text: 'When dealing with heavy class imbalance, always calibrate your probabilities using Platt scaling or isotonic regression before setting decision thresholds!',
    upvotes: 14,
  },
  {
    id: 'c-2',
    author: 'Marcus Brody',
    role: 'Data Scientist',
    timeAgo: '1 day ago',
    text: 'Tip: For high-dimensional sparse matrices, feature importance from tree ensembles can be biased towards high-cardinality features. Use permutation importance instead.',
    upvotes: 8,
  },
];

export const CommunityInContext: React.FC<CommunityInContextProps> = ({ topicTitle }) => {
  const [comments, setComments] = useState<CommentItem[]>(DEFAULT_COMMENTS);
  const [solutions, setSolutions] = useState<CommunitySolution[]>(DEFAULT_SOLUTIONS);
  const [newComment, setNewComment] = useState('');
  const [votedSolutions, setVotedSolutions] = useState<Record<string, boolean>>({});

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const item: CommentItem = {
      id: `c-${Date.now()}`,
      author: 'You (Suyash)',
      role: 'Junior ML Engineer',
      timeAgo: 'Just now',
      text: newComment.trim(),
      upvotes: 1,
    };
    setComments([item, ...comments]);
    setNewComment('');
  };

  const handleVoteSolution = (id: string) => {
    if (votedSolutions[id]) return;
    setVotedSolutions((prev) => ({ ...prev, [id]: true }));
    setSolutions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, upvotes: s.upvotes + 1 } : s))
    );
  };

  return (
    <div className="community-in-context">
      <div className="community-header">
        <div className="community-title-row">
          <h3>👥 Community Hub & Peer Solutions</h3>
          <span className="community-subtitle">Discuss concepts, ask questions, and explore real implementations for {topicTitle}</span>
        </div>
      </div>

      <div className="community-body-grid">
        {/* Discussion comments column */}
        <div className="community-discussion-col">
          <div className="discussion-box-header">
            <h4>💡 Discussions & Tips ({comments.length})</h4>
          </div>

          <form onSubmit={handleAddComment} className="comment-composer">
            <input
              type="text"
              placeholder="Ask a question or share a tip on this topic..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" disabled={!newComment.trim()} className="post-tip-btn">
              Post Tip
            </button>
          </form>

          <div className="comments-feed-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-card">
                <div className="comment-top">
                  <div className="comment-meta">
                    <span className="comment-author">{comment.author}</span>
                    <span className="comment-role">{comment.role}</span>
                  </div>
                  <span className="comment-time">{comment.timeAgo}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
                <div className="comment-actions">
                  <button className="comment-like-btn">
                    ▲ {comment.upvotes}
                  </button>
                  <button className="comment-reply-btn">Reply</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community solutions column */}
        <div className="community-solutions-col">
          <div className="solutions-box-header">
            <h4>🚀 Peer Pipeline Solutions</h4>
            <span className="solutions-count">{solutions.length} shared</span>
          </div>

          <div className="solutions-list">
            {solutions.map((sol) => (
              <div key={sol.id} className="solution-card">
                <div className="solution-card-top">
                  <div className="solution-author-info">
                    <img src={sol.authorAvatar} alt={sol.authorName} className="solution-avatar" />
                    <div>
                      <span className="solution-author-name">{sol.authorName}</span>
                      <span className="solution-algo-badge">{sol.algorithm}</span>
                    </div>
                  </div>
                  <span className="solution-metric-badge">{sol.accuracy}</span>
                </div>

                <h5 className="solution-title">{sol.title}</h5>

                <div className="solution-tags">
                  {sol.tags.map((tag, idx) => (
                    <span key={idx} className="solution-tag">#{tag}</span>
                  ))}
                </div>

                <div className="solution-footer">
                  <button
                    className={`sol-upvote-btn ${votedSolutions[sol.id] ? 'voted' : ''}`}
                    onClick={() => handleVoteSolution(sol.id)}
                  >
                    ▲ {sol.upvotes} {votedSolutions[sol.id] ? 'Upvoted' : 'Upvote'}
                  </button>
                  <button
                    className="sol-inspect-btn"
                    onClick={() => alert(`Inspecting community pipeline: "${sol.title}"`)}
                  >
                    Inspect Flow →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
