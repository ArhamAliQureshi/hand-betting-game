import React, { useEffect, useState } from 'react';
import { loadLeaderboard, LeaderboardEntry } from '../../storage/leaderboard';
import './LeaderboardPanel.css';

interface Props {
  isGameplay?: boolean;
}

export const LeaderboardPanel: React.FC<Props> = ({ isGameplay }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setLeaderboard(loadLeaderboard());
    
    // Listen for storage changes to keep synced without polling
    const handler = () => setLeaderboard(loadLeaderboard());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <div className={`panel leaderboard-panel ${isGameplay ? 'compact' : ''}`}>
      <h2>Leaderboard</h2>
      <div className="lb-list">
        {leaderboard.length === 0 ? (
          <p className="lb-empty">No scores yet.</p>
        ) : (
          leaderboard.map((entry, idx) => (
            <div key={`${entry.ts}-${idx}`} className="lb-row">
              <span className="lb-rank">#{idx + 1}</span>
              <span className="lb-name">{entry.name}</span>
              <span className="lb-score">{entry.score}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
