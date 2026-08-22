import type { ReactNode } from 'react';
import type { KnowledgeCategory, KnowledgeTopic } from '../../types';
import './KnowledgeLayout.css';

interface KnowledgeLayoutProps {
  category: KnowledgeCategory;
  title: string;
  subtitle: string;
  topics: KnowledgeTopic[];
  activeTopicId: string;
  onTopicSelect: (id: string) => void;
  children: ReactNode;
  onStartProject?: () => void;
}

export function KnowledgeLayout({ 
  category, 
  title, 
  subtitle, 
  topics, 
  activeTopicId, 
  onTopicSelect, 
  children,
  onStartProject
}: KnowledgeLayoutProps) {
  
  const activeTopic = topics.find(t => t.id === activeTopicId) || topics[0];

  return (
    <div className="knowledge-layout">
      {/* Top Header */}
      <div className="knowledge-header">
        <div className="knowledge-header__content">
          <span className="knowledge-header__badge">{category} Knowledge Base</span>
          <h1 className="knowledge-header__title">{title}</h1>
          <p className="knowledge-header__desc">{subtitle}</p>
        </div>
        {onStartProject && (
          <div className="knowledge-header__actions">
             <button className="btn-primary" onClick={onStartProject}>
               Build {category} Project
             </button>
          </div>
        )}
      </div>

      <div className="knowledge-container">
        {/* Left Sidebar: Navigation */}
        <aside className="knowledge-sidebar">
          <h3 className="knowledge-sidebar__title">Topics</h3>
          <ul className="knowledge-nav-list">
            {topics.map(topic => (
              <li key={topic.id}>
                <button 
                  className={`knowledge-nav-btn ${activeTopicId === topic.id ? 'active' : ''}`}
                  onClick={() => onTopicSelect(topic.id)}
                >
                  {topic.title}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Center: Main Content */}
        <main className="knowledge-main">
          {children}
        </main>

        {/* Right Sidebar: Table of Contents & Quick Facts */}
        <aside className="knowledge-toc">
          {activeTopic && (
            <>
              <div className="knowledge-toc__section">
                <h4>Quick Facts</h4>
                <div className="quick-fact">
                  <span className="quick-fact__label">Difficulty</span>
                  <span className="quick-fact__value">{activeTopic.difficulty}</span>
                </div>
                <div className="quick-fact">
                  <span className="quick-fact__label">Best For</span>
                  <span className="quick-fact__value">{activeTopic.bestFor}</span>
                </div>
              </div>
              
              <div className="knowledge-toc__section">
                <h4>On this page</h4>
                <ul className="toc-list">
                  <li><a href="#what-is-it">What is it?</a></li>
                  <li><a href="#when-to-use">When to use it</a></li>
                  <li><a href="#how-it-works">How it works</a></li>
                  <li><a href="#pros-cons">Strengths & Limitations</a></li>
                  <li><a href="#pipeline">Recommended Pipeline</a></li>
                </ul>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
