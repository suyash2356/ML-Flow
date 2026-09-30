import { useState } from 'react';
import type { PostMode, Project } from '../../types';
import type { DashboardPostDraft } from '../../types/dashboard';
import './PostComposer.css';

interface PostComposerProps {
  userProjects: Project[];
  onAddPost: (draft: DashboardPostDraft) => Promise<void>;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const selectedProject = userProjects.find((project) => project.id === selectedProjectId) || userProjects[0];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!text.trim() || isSubmitting || (activeMode === 'project' && !selectedProject)) return;

    setIsSubmitting(true);
    setSubmitError('');
    try {
      await onAddPost({
        mode: activeMode,
        content: text.trim(),
        tags: tagsInput.split(',').map((tag) => tag.trim()).filter(Boolean),
        codeSnippet: codeSnippet.trim() || undefined,
        resourceUrl: activeMode === 'resource' ? resourceUrl.trim() : undefined,
        resourceTitle: activeMode === 'resource' ? resourceTitle.trim() : undefined,
        projectId: activeMode === 'project' ? selectedProject?.id : undefined,
      });
      setText('');
      setCodeSnippet('');
      setResourceTitle('');
      setResourceUrl('');
      setTagsInput('');
      setIsExpanded(false);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to publish this post.');
    } finally {
      setIsSubmitting(false);
    }
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
            setSubmitError('');
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
            setSubmitError('');
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
            setSubmitError('');
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
            setSubmitError('');
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
          maxLength={5000}
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
                maxLength={12000}
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
                    value={selectedProject?.id || ''}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    required
                    disabled={userProjects.length === 0}
                  >
                    {userProjects.length === 0 && <option value="">No saved projects available</option>}
                    {userProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.type})
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
                        {selectedProject.type} workspace • {selectedProject.status}
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
                    setSubmitError('');
                    setIsExpanded(false);
                    onCancel?.();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="post-composer__submit-btn"
                  disabled={!text.trim() || isSubmitting || (activeMode === 'project' && !selectedProject)}
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Post →'}
                </button>
              </div>
            </div>
          </div>
        )}
        {submitError && <p className="post-composer__error" role="alert">{submitError}</p>}
      </form>
    </div>
  );
}
