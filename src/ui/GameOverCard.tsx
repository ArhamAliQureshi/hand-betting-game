import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { GameAction } from '../state/actions';
import './GameOverCard.css';

interface GameOverCardProps {
  score: number;
  dispatch: React.Dispatch<GameAction>;
}

export const GameOverCard: React.FC<GameOverCardProps> = ({ score, dispatch }) => {
  const navigate = useNavigate();

  const handlePlayAgain = () => {
    dispatch({ type: 'INIT_GAME' });
  };

  const handleBackToMenu = () => {
    dispatch({ type: 'EXIT_TO_LANDING' });
    navigate('/');
  };

  return (
    <motion.div
      className="game-over-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="game-over-card"
        initial={{ scale: 0.85, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 40 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <h2 className="game-over-title">Game Over</h2>
        <p className="game-over-subtitle">Your final score</p>
        <div className="game-over-score">{score}</div>
        <div className="game-over-actions">
          <button className="btn-game-over btn-play-again" onClick={handlePlayAgain}>
            New Game
          </button>
          <button className="btn-game-over btn-back-menu" onClick={handleBackToMenu}>
            Back to Menu
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
