import { useState } from 'react';
import type { NavigationPage, Project, DatasetItem, FeedFilter, PostItem } from '../../types';
import { UserProfileCard } from '../../components/Dashboard/UserProfileCard';
import { PostComposer } from '../../components/Dashboard/PostComposer';
import { FeedFilterTabs } from '../../components/Dashboard/FeedFilterTabs';
import { PostCard } from '../../components/Dashboard/PostCard';
import { WorldMapWidget } from '../../components/Dashboard/WorldMapWidget';
import { WeeklyChallengeCard } from '../../components/Dashboard/WeeklyChallengeCard';
import { MentorMatchCard } from '../../components/Dashboard/MentorMatchCard';
import { TrendingMLCard } from '../../components/Dashboard/TrendingMLCard';
import { SuggestedFollowList } from '../../components/Dashboard/SuggestedFollowList';
import {
  MOCK_POSTS,
  MOCK_COUNTRY_MAP_PINS,
  MOCK_WEEKLY_CHALLENGE,
  MOCK_MENTOR_MATCHES,
  MOCK_TRENDING_ITEMS,
  MOCK_SUGGESTED_USERS,
} from '../../config/dashboardCommunityData';
import { MOCK_USER_PROFILE } from '../../config/mockData';
import './DashboardPage.css';

interface DashboardPageProps {
  projects: Project[];
  datasets: DatasetItem[];
  onNavigate: (page: NavigationPage) => void;
  onOpenWorkspace: (project: Project) => void;
}

export function DashboardPage({
  projects,
  onOpenWorkspace,
}: DashboardPageProps) {
  const [posts, setPosts] = useState<PostItem[]>(MOCK_POSTS);
  const [activeFilter, setActiveFilter] = useState<FeedFilter>('for_you');
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  const handleAddPost = (newPost: PostItem) => {
    setPosts([newPost, ...posts]);
    setIsComposerOpen(false);
  };

  const handleForkProject = (attached: NonNullable<PostItem['attachedProject']>) => {
    const forkedProject: Project = {
      id: `proj-fork-${Date.now()}`,
      name: `${attached.name} (Forked)`,
      type: attached.taskType === 'EDA' ? 'EDA' : attached.taskType === 'Computer Vision' ? 'DL' : 'ML',
      description: `Forked community pipeline from ML Flow. Initial benchmark: ${attached.metricAchieved}`,
      datasetName: attached.datasetName,
      lastModified: 'Just now',
      status: 'In Progress',
      nodesCount: attached.nodesCount,
      accuracy: attached.metricAchieved,
    };
    onOpenWorkspace(forkedProject);
  };

  const handleJoinChallenge = (challenge: typeof MOCK_WEEKLY_CHALLENGE) => {
    const challengeProject: Project = {
      id: `proj-challenge-${Date.now()}`,
      name: challenge.title,
      type: 'ML',
      description: challenge.description,
      datasetName: challenge.datasetName,
      lastModified: 'Just now',
      status: 'In Progress',
      nodesCount: 6,
    };
    onOpenWorkspace(challengeProject);
  };

  const filteredPosts = posts.filter((post) => {
    if (activeFilter === 'my_country') return post.authorCountry === 'India';
    if (activeFilter === 'trending') return post.likesCount > 40;
    if (activeFilter === 'following') return post.authorName !== 'Alex Kumar';
    return true; // for_you and global show all posts
  });

  return (
    <div className="dashboard-3col">
      <aside className="dashboard-3col__left">
        <WorldMapWidget pins={MOCK_COUNTRY_MAP_PINS} />
        <WeeklyChallengeCard challenge={MOCK_WEEKLY_CHALLENGE} onJoinChallenge={handleJoinChallenge} />
        <TrendingMLCard trendingItems={MOCK_TRENDING_ITEMS} />
      </aside>

      <main className="dashboard-3col__center">
        <FeedFilterTabs activeFilter={activeFilter} onSelectFilter={setActiveFilter} />

        <div className="dashboard-3col__feed-list">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onForkProject={handleForkProject}
              onOpenWorkspace={onOpenWorkspace}
            />
          ))}
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
        <UserProfileCard user={MOCK_USER_PROFILE} streakDays={4} karmaScore={1420} />
        <MentorMatchCard mentors={MOCK_MENTOR_MATCHES} />
        <SuggestedFollowList users={MOCK_SUGGESTED_USERS} />
      </aside>

      {isComposerOpen && (
        <div
          className="dashboard-3col__composer-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsComposerOpen(false);
          }}
        >
          <section
            className="dashboard-3col__composer-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dashboard-compose-title"
          >
            <div className="dashboard-3col__composer-header">
              <h2 id="dashboard-compose-title">Create a post</h2>
              <button
                type="button"
                className="dashboard-3col__composer-close"
                aria-label="Close post composer"
                onClick={() => setIsComposerOpen(false)}
              >
                ×
              </button>
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
