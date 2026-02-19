import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSavedPlayerName, savePlayerName } from '../storage/player';
import { getLeaderboard, clearLeaderboard, LeaderboardEntry } from '../storage/leaderboard';
import { useGameDispatch } from '../state/Store';
import { Button } from '../ui/components/Button';
import './Landing.css';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useGameDispatch();
  const [name, setName] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setName(getSavedPlayerName());
    setLeaderboard(getLeaderboard());
  }, []);

  const isValidName = (n: string) => {
    const trimmed = n.trim();
    if (trimmed.length < 2 || trimmed.length > 16) return false;
    return /^[A-Za-z0-9 _-]+$/.test(trimmed);
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidName(name)) return;
    savePlayerName(name);
    dispatch({ type: 'INIT_GAME', payload: { playerName: name.trim() } });
    navigate('/game');
  };

  const handleClear = () => {
    clearLeaderboard();
    setLeaderboard([]);
    setShowConfirm(false);
  };

  return (
    <div className="landing-page">
      <div className="landing-header">
        <h1 className="neon-title">Hand Betting Game</h1>
        <p className="subtitle">High stakes Mahjong prediction</p>
      </div>

      <div className="landing-grid">
        <div className="panel action-panel">
          <h2>Start Game</h2>
          <form onSubmit={handleStart} className="start-form">
            <div className="input-group">
              <label htmlFor="player-name">Player Name</label>
              <input
                id="player-name"
                data-testid="player-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                autoComplete="off"
              />
              {!isValidName(name) && name.length > 0 && (
                <div className="error-text">2-16 chars, letters, numbers, spaces, _, -</div>
              )}
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={!isValidName(name)}
              data-testid="landing-new-game"
              className="start-btn"
            >
              New Game
            </Button>
          </form>
        </div>

        <div className="panel leaderboard-panel" data-testid="leaderboard">
          <h2>Leaderboard</h2>
          <div className="lb-list">
            {leaderboard.length === 0 ? (
              <p className="lb-empty">No scores yet. Be the first!</p>
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
          {leaderboard.length > 0 && (
            <div className="lb-actions">
              {!showConfirm ? (
                <Button variant="secondary" onClick={() => setShowConfirm(true)} data-testid="leaderboard-clear">
                  Clear
                </Button>
              ) : (
                <div className="confirm-row">
                  <span className="confirm-text">Are you sure?</span>
                  <Button variant="danger" onClick={handleClear} data-testid="leaderboard-clear-confirm">Yes, Clear</Button>
                  <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
