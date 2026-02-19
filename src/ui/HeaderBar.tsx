import React from 'react';
import type { GameAction } from '../state/actions';
import { useNavigate } from 'react-router-dom';
import './HeaderBar.css';

interface HeaderBarProps {
  dispatch: React.Dispatch<GameAction>;
  drawCount: number;
  discardCount: number;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ dispatch, drawCount, discardCount }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    dispatch({ type: 'EXIT_TO_LANDING' });
    navigate('/');
  };

  return (
    <header className="header-bar">
      <button className="header-back-btn" onClick={handleBack}>
        ← Back to Landing
      </button>
      <h1 className="header-title">Hand Betting Game</h1>
      <div className="header-piles">
        <span className="pile-count">
          Draw Pile : {drawCount} <span className="pile-dot pile-dot-draw" />
        </span>
        <span className="pile-count">
          Discard Pile : {discardCount} <span className="pile-dot pile-dot-discard" />
        </span>
      </div>
    </header>
  );
};
