import { useState } from 'react';
import type { PostItem, PostMode, Project } from '../../types';
import './PostComposer.css';

interface PostComposerProps {
  userProjects: Project[];
  onAddPost: (newPost: PostItem) => void;
  onCancel?: () => void;
  initiallyExpanded?: boolean;
}

export function PostComposer({ userProjects, onAddPost, onCancel, initiallyExpanded = false }: PostComposerProps) {
  const [activeMode, setActiveMode] = useState<PostMode>('thought');
  const [text, setText] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(userProjects[0]?.id || '');
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  const selectedProject = userProjects.find((p) => p.id === selectedProjectId) || userProjects[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const parsedTags = tagsInput
      ? tagsInput.split(',').map((t) => t.trim().replace(/^#/, ''))
      : activeMode === 'question'
      ? ['Question', 'HelpNeeded']
      : activeMode === 'resource'
      ? ['Resource', 'Guide']
      : activeMode === 'project'
      ? ['ProjectShowcase', selectedProject?.type || 'ML']
      : ['MLFlowThought'];

    const newPost: PostItem = {
      id: `post-${Date.now()}`,
      authorName: 'Alex Kumar',
      authorHandle: '@alexkumar_ml',
      authorAvatar: 'AK',
      authorRole: 'Senior ML Engineer',
      authorCountry: 'India',
      authorFlag: '🇮🇳',
      timestamp: 'Just now',
      mode: activeMode,
      textContent: text.trim(),
      tags: parsedTags,
      codeSnippet: codeSnippet.trim() || undefined,
      linkPreview:
        activeMode === 'resource' && resourceUrl
          ? {
              title: resourceTitle || resourceUrl,
              domain: new URL(resourceUrl.startsWith('http') ? resourceUrl : `https://${resourceUrl}`).hostname,
              description: 'Shared resource link from ML Flow community practitioner.',
              url: resourceUrl,
              thumbnailUrl: '🔗',
            }
          : undefined,
      attachedProject:
        activeMode === 'project' && selectedProject
          ? {
              id: selectedProject.id,
              name: selectedProject.name,
              datasetName: selectedProject.datasetName,
              taskType:
                selectedProject.type === 'EDA'
                  ? 'EDA'
                  : selectedProject.type === 'DL'
                  ? 'Computer Vision'
                  : 'Classification',
              metricAchieved: selectedProject.accuracy || '88.5% Acc',
              nodesCount: selectedProject.nodesCount,
            }
          : undefined,
      likesCount: 0,
      commentsCount: 0,
      forksCount: activeMode === 'project' ? 0 : undefined,
      comments: [],
    };

    onAddPost(newPost);
    setText('');
    setCodeSnippet('');
    setResourceTitle('');
    setResourceUrl('');
    setTagsInput('');
    setIsExpanded(false);
  };

  return (
    <div className="post-composer">
      <div className="post-composer__modes">
        <button
          type="button"
          className={`post-composer__mode-btn ${activeMode === 'thought' ? 'post-composer__mode-btn--active' : ''}`}
          onClick={() => {
            setActiveMode('thought');
            setIsExpanded(true);
          }}
        >
          💭 Post a Thought
        </button>
        <button
          type="button"
          className={`post-composer__mode-btn ${activeMode === 'resource' ? 'post-composer__mode-btn--active' : ''}`}
          onClick={() => {
            setActiveMode('resource');
            setIsExpanded(true);
          }}
        >
          🔗 Share Resource
        </button>
        <button
          type="button"
          className={`post-composer__mode-btn ${activeMode === 'question' ? 'post-composer__mode-btn--active' : ''}`}
          onClick={() => {
            setActiveMode('question');
            setIsExpanded(true);
          }}
        >
          ❓ Ask Question
        </button>
        <button
          type="button"
          className={`post-composer__mode-btn ${activeMode === 'project' ? 'post-composer__mode-btn--active' : ''}`}
          onClick={() => {
            setActiveMode('project');
            setIsExpanded(true);
          }}
        >
          🚀 Show a Project
        </button>
      </div>

      <form onSubmit={handleSubmit} className="post-composer__form">
        <textarea
          className="post-composer__textarea"
          placeholder={
            activeMode === 'thought'
              ? 'Share an insight, data hygiene tip, or ML model observation...'
              : activeMode === 'resource'
              ? 'Describe this article, paper, dataset, or cheatsheet...'
              : activeMode === 'question'
              ? 'Ask the community about hyperparameters, algorithms, or pipeline errors...'
              : 'Introduce your ML Flow pipeline project and key results achieved...'
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          rows={isExpanded ? 3 : 2}
        />

        {isExpanded && (
          <div className="post-composer__extra-fields">
            {activeMode === 'question' && (
              <textarea
                className="post-composer__input post-composer__code-input"
                placeholder="Paste code snippet or error traceback (optional)..."
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                rows={2}
              />
            )}

            {activeMode === 'resource' && (
              <div className="post-composer__resource-group">
                <input
                  type="url"
                  className="post-composer__input"
                  placeholder="Paste resource URL (e.g. https://arxiv.org/abs/...)"
                  value={resourceUrl}
                  onChange={(e) => setResourceUrl(e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="post-composer__input"
                  placeholder="Resource title (optional)"
                  value={resourceTitle}
                  onChange={(e) => setResourceTitle(e.target.value)}
                />
              </div>
            )}

            {activeMode === 'project' && (
              <div className="post-composer__project-select-box">
                <label className="post-composer__label">
                  Attach Live ML Flow Project:
                  <select
                    className="post-composer__select"
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                  >
                    {userProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.type} • {p.datasetName} • {p.accuracy || 'In Progress'})
                      </option>
                    ))}
                  </select>
                </label>

                {selectedProject && (
                  <div className="post-composer__project-preview">
                    <span className="post-composer__project-badge">{selectedProject.type}</span>
                    <div className="post-composer__project-info">
                      <strong>{selectedProject.name}</strong>
                      <small>
                        Dataset: {selectedProject.datasetName} • {selectedProject.nodesCount} nodes • Metric:{' '}
                        {selectedProject.accuracy || 'Pending'}
                      </small>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="post-composer__footer">
              <input
                type="text"
                className="post-composer__input post-composer__tags-input"
                placeholder="Tags (comma separated, e.g. XGBoost, EDA, PyTorch)..."
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />

              <div className="post-composer__actions">
                <button
                  type="button"
                  className="post-composer__cancel-btn"
                  onClick={() => {
                    setIsExpanded(false);
                    onCancel?.();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="post-composer__submit-btn"
                  disabled={!text.trim()}
                >
                  Publish Post →
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
