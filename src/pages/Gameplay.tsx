import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState, useGameDispatch } from '../state/Store';
import { Button } from '../ui/components/Button';
import { LeaderboardPanel } from '../ui/components/LeaderboardPanel';
import { CurrentHand } from '../ui/components/CurrentHand';
import { HistoryStrip } from '../ui/components/HistoryStrip';
import { ScoresPanel } from '../ui/components/ScoresPanel';
import { GameOverModal } from '../ui/components/GameOverModal';
import { motion, AnimatePresence } from 'framer-motion';
import './Gameplay.css';

export const Gameplay: React.FC = () => {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const navigate = useNavigate();
  
  const [showReshuffle, setShowReshuffle] = useState(false);
  const prevDrawCount = useRef(0);

  useEffect(() => {
    if (state.engineState) {
      if (prevDrawCount.current > 0 && state.engineState.drawPile.length > prevDrawCount.current + 10) {
        setShowReshuffle(true);
        setTimeout(() => setShowReshuffle(false), 2500);
      }
      prevDrawCount.current = state.engineState.drawPile.length;
    }
  }, [state.engineState?.drawPile.length]);

  useEffect(() => {
    if (state.status === 'idle' || !state.engineState) {
      navigate('/');
    }
  }, [state.status, state.engineState, navigate]);

  if (!state.engineState) return null;

  const { drawPile, discardPile, isGameOver } = state.engineState;

  const handleBack = () => {
    dispatch({ type: 'QUIT_GAME' });
    navigate('/');
  };

  return (
    <div className="gameplay-page">
      <header className="game-header">
        <Button variant="secondary" onClick={handleBack} className="back-btn">
          ← Back
        </Button>
        <h2 className="header-title">Hand Betting Game</h2>
        <div className="pile-counts">
          <div className="pile" data-testid="pile-draw-count">
            <span className="pile-icon">🀄</span> Draw: {drawPile.length}
          </div>
          <div className="pile" data-testid="pile-discard-count">
            <span className="pile-icon">🗑</span> Discard: {discardPile.length}
          </div>
          <AnimatePresence>
            {showReshuffle && (
              <motion.div 
                className="reshuffle-toast"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                Deck Reshuffled!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className="game-main-grid">
        <div className="col-left">
          <CurrentHand />
          <HistoryStrip />
        </div>
        <div className="col-right">
          <LeaderboardPanel isGameplay />
          <ScoresPanel />
        </div>
      </main>

      {isGameOver && <GameOverModal />}
    </div>
  );
};
