import { AnimatePresence } from 'framer-motion';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../state/context';
import { HeaderBar } from '../ui/HeaderBar';
import { TileRow } from '../ui/TileRow';
import { BetControls } from '../ui/BetControls';
import { HistoryStrip } from '../ui/HistoryStrip';
import { LeaderboardWidget } from '../ui/LeaderboardWidget';
import { GameOverCard } from '../ui/GameOverCard';
import './GamePage.css';

export const GamePage: React.FC = () => {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Redirect to landing if accessed directly without init
  useEffect(() => {
    if (state.status === 'idle') {
      navigate('/');
    }
  }, [state.status, navigate]);

  const handleBet = (type: 'BET_HIGHER' | 'BET_LOWER') => {
    if (isProcessing) return;
    setIsProcessing(true);
    dispatch({ type });
    setTimeout(() => setIsProcessing(false), 600);
  };

  const isResolving = state.status === 'resolving' || isProcessing;
  const isGameOver = state.status === 'gameOver';

  return (
    <div className="game-page">
      <HeaderBar 
        dispatch={dispatch} 
        drawCount={state.drawPile.length}
        discardCount={state.discardPile.length} 
      />
      
      <div className="game-body">
        {/* Left column: Current hand + History */}
        <div className="game-left">
          <div className="hand-card">
            <div className="total-display">
              <span className="label-total">Total:</span>
              <span className="value-total">{state.currentHand.total}</span>
            </div>
            
            <TileRow 
              tiles={state.currentHand.tiles} 
              dynamicValues={state.tileValueMap} 
              size="normal" 
            />

            <BetControls 
              dispatch={(action) => {
                if (action.type === 'BET_HIGHER' || action.type === 'BET_LOWER') {
                  handleBet(action.type);
                } else {
                  dispatch(action);
                }
              }}
              disabled={isResolving || isGameOver} 
            />
          </div>

          <HistoryStrip history={state.history} />
        </div>

        {/* Right column: Leaderboard + Scores */}
        <div className="game-right">
          <LeaderboardWidget />

          {/* Scores card showing recent hands with totals */}
          {state.history.length > 0 && (
            <div className="scores-card">
              <h3 className="scores-title">Scores</h3>
              <div className="scores-list">
                {state.history.slice(0, 3).map((hand) => (
                  <div key={hand.id} className="scores-entry">
                    <div className="scores-entry-tiles">
                      <TileRow tiles={hand.tiles} size="small" animateInitial={false} />
                    </div>
                    <span className="scores-entry-total">{hand.total}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isGameOver && (
          <GameOverCard score={state.score} dispatch={dispatch} />
        )}
      </AnimatePresence>
    </div>
  );
};
