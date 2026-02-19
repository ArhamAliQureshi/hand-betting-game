import React from 'react';
import './LeaderboardWidget.css';

// Mock leaderboard data matching the target reference
const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Carolan', score: 45, icon: '🀄' },
  { rank: 2, name: 'Daryl', score: 37, icon: '🔺' },
  { rank: 3, name: 'Fulk', score: 32, icon: '🌸' },
  { rank: 4, name: 'Simpleton', score: 29, icon: '🎲' },
  { rank: 5, name: 'Bright', score: 27, icon: '🐉' },
];

export const LeaderboardWidget: React.FC = () => {
  return (
    <div className="leaderboard-card">
      <h3 className="leaderboard-title">Leaderboard</h3>
      <ul className="leaderboard-list">
        {MOCK_LEADERBOARD.map((entry) => (
          <li key={entry.rank} className="leaderboard-item">
            <span className="leaderboard-rank">{entry.rank}</span>
            <span className="leaderboard-icon">{entry.icon}</span>
            <span className="leaderboard-name">{entry.name}</span>
            <span className="leaderboard-score">{entry.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
