import { useState } from 'react';
import './WeeklyGoalWidget.css';

interface GoalItem {
  id: string;
  text: string;
  done: boolean;
}

export function WeeklyGoalWidget() {
  const [goals, setGoals] = useState<GoalItem[]>([
    { id: 'g1', text: 'Train 3 XGBoost models', done: true },
    { id: 'g2', text: 'Complete Distribution Analysis module', done: true },
    { id: 'g3', text: 'Achieve >90% Acc on Churn project', done: true },
    { id: 'g4', text: 'Participate in Fraud Detection Challenge', done: false },
    { id: 'g5', text: 'Share 1 project in community feed', done: false },
  ]);

  const completedCount = goals.filter((g) => g.done).length;
  const progressPercent = Math.round((completedCount / goals.length) * 100);

  const toggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g))
    );
  };

  return (
    <div className="weekly-goal-widget">
      <div className="weekly-goal-widget__header">
        <span className="weekly-goal-widget__title">🎯 This Week's Goal</span>
        <span className="weekly-goal-widget__badge">{progressPercent}% Completed</span>
      </div>

      <div className="weekly-goal-widget__progress-bar">
        <div
          className="weekly-goal-widget__progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="weekly-goal-widget__list">
        {goals.map((goal) => (
          <label key={goal.id} className={`weekly-goal-widget__item ${goal.done ? 'weekly-goal-widget__item--done' : ''}`}>
            <input
              type="checkbox"
              checked={goal.done}
              onChange={() => toggleGoal(goal.id)}
            />
            <span>{goal.text}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
