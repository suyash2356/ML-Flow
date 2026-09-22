import { useState } from 'react';
import type { NavigationPage, Project, DatasetItem, FeedFilter, PostItem } from '../../types';
import { UserProfileCard } from '../../components/Dashboard/UserProfileCard';
import { ContinueWorkingCard } from '../../components/Dashboard/ContinueWorkingCard';
import { WeeklyGoalWidget } from '../../components/Dashboard/WeeklyGoalWidget';
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
  datasets: _datasets,
  onNavigate: _onNavigate,
  onOpenWorkspace,
}: DashboardPageProps) {
  const [posts, setPosts] = useState<PostItem[]>(MOCK_POSTS);
  const [activeFilter, setActiveFilter] = useState<FeedFilter>('for_you');

  const activeProject = projects.find((p) => p.status === 'In Progress') || projects[0];

  const handleAddPost = (newPost: PostItem) => {
    setPosts([newPost, ...posts]);
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
      {/* 1. LEFT COLUMN: Sticky, Profile, Continue Working, Goal */}
      <aside className="dashboard-3col__left">
        <UserProfileCard user={MOCK_USER_PROFILE} streakDays={4} karmaScore={1420} />
        <ContinueWorkingCard project={activeProject} onOpenWorkspace={onOpenWorkspace} />
        <WeeklyGoalWidget />
      </aside>

      {/* 2. CENTER COLUMN: Social Feed, Composer, Filter Tabs, Post Cards */}
      <main className="dashboard-3col__center">
        <PostComposer userProjects={projects} onAddPost={handleAddPost} />
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
      </main>

      {/* 3. RIGHT COLUMN: World Map, Challenge, Mentors, Trending */}
      <aside className="dashboard-3col__right">
        <WorldMapWidget pins={MOCK_COUNTRY_MAP_PINS} />
        <WeeklyChallengeCard challenge={MOCK_WEEKLY_CHALLENGE} onJoinChallenge={handleJoinChallenge} />
        <MentorMatchCard mentors={MOCK_MENTOR_MATCHES} />
        <TrendingMLCard trendingItems={MOCK_TRENDING_ITEMS} />
        <SuggestedFollowList users={MOCK_SUGGESTED_USERS} />
      </aside>
    </div>
  );
}
