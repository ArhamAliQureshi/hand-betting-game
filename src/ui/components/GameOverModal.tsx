import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameState, useGameDispatch } from '../../state/Store';
import { Button } from './Button';
import './GameOverModal.css';

export const GameOverModal: React.FC = () => {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const navigate = useNavigate();

  if (!state.engineState || state.status !== 'gameOver') return null;

  const handleNewGame = () => {
    dispatch({ type: 'INIT_GAME', payload: { playerName: state.playerName } });
  };

  const handleHome = () => {
    dispatch({ type: 'QUIT_GAME' });
    navigate('/');
  };

  return (
    <motion.div 
      className="modal-overlay" 
      data-testid="game-over-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div 
        className="game-over-modal"
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <h2 className="neon-title">Game Over</h2>
        <div className="final-score">
          <span>Final Score</span>
          <span className="score-value" data-testid="final-score">{state.engineState.score}</span>
        </div>
        <p className="player-name-lbl">Well played, {state.playerName}!</p>
        
        <div className="modal-actions">
          <Button variant="primary" onClick={handleNewGame}>Play Again</Button>
          <Button variant="secondary" onClick={handleHome}>Home</Button>
        </div>
      </motion.div>
    </motion.div>
  );
};
