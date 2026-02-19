import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../state/context';
import { LeaderboardWidget } from '../ui/LeaderboardWidget';
import './LandingPage.css';
import './LandingPageInput.css';

export const LandingPage: React.FC = () => {
  const { dispatch } = useGame();
  const navigate = useNavigate();

  const [playerName, setPlayerName] = React.useState('');

  React.useEffect(() => {
    const savedName = localStorage.getItem('playerName');
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  const handleNewGame = () => {
    if (!playerName.trim()) return;
    localStorage.setItem('playerName', playerName);
    dispatch({ type: 'INIT_GAME' });
    navigate('/game');
  };

  return (
    <div className="landing-page">
      <div className="landing-hero">
        <h1 className="landing-title">Hand Betting Game</h1>
        <p className="landing-subtitle">Predict. Bet. Win.</p>
        
        <input
          type="text"
          className="input-player-name"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          maxLength={20}
        />

        <button 
          className="btn-new-game" 
          onClick={handleNewGame}
          disabled={!playerName.trim()}
        >
          New Game
        </button>
      </div>
      
      <div className="landing-leaderboard">
        <LeaderboardWidget />
      </div>
    </div>
  );
};
