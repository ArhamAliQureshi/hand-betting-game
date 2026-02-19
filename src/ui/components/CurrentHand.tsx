import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useGameState, useGameDispatch } from '../../state/Store';
import { calculateTotal } from '../../engine/game';
import { TileFaceUI } from '../tiles/TileFace';
import { Button } from './Button';
import { CountUp } from './CountUp';
import './CurrentHand.css';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const tileVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export const CurrentHand: React.FC = () => {
  const state = useGameState();
  const dispatch = useGameDispatch();

  const [selectedBet, setSelectedBet] = useState<'higher' | 'lower' | null>(null);
  
  // To track previous dynamic values to show +1/-1 popovers
  const [popovers, setPopovers] = useState<Record<string, { delta: number; id: number }>>({});
  const [prevValues, setPrevValues] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!state.engineState) return;
    const newPrev: Record<string, number> = {};
    const newPopovers: Record<string, { delta: number; id: number }> = {};
    let hasPopovers = false;

    state.engineState.currentHand.forEach(tile => {
      newPrev[tile.id] = tile.currentValue;
      if (tile.isDynamic && prevValues[tile.id] !== undefined) {
        const delta = tile.currentValue - prevValues[tile.id];
        if (delta !== 0) {
          newPopovers[tile.id] = { delta, id: Date.now() };
          hasPopovers = true;
        }
      }
    });

    setPrevValues(newPrev);
    if (hasPopovers) {
      setPopovers(newPopovers);
      setTimeout(() => setPopovers({}), 1500);
    }
  }, [state.engineState?.currentHand]); // Only run when currentHand references change

  if (!state.engineState) return null;

  const { currentHand, isGameOver } = state.engineState;
  const total = calculateTotal(currentHand);
  const isResolving = state.status === 'resolving';

  // Clear selected bet on next round
  useEffect(() => {
    if (!isResolving && selectedBet !== null) setSelectedBet(null);
  }, [isResolving]);

  const handleBet = (bet: 'higher' | 'lower') => {
    setSelectedBet(bet);
    dispatch({ type: 'PLACE_BET', payload: { bet } });
    
    // UI resolving delay
    setTimeout(() => {
      dispatch({ type: 'RESOLVE_ROUND_COMPLETE' });
    }, 1200);
  };

  return (
    <div className="panel current-hand-panel">
      <div className="hand-total-header">
        <span className="total-label">TOTAL</span>
        <span className="total-value" style={{ position: 'relative' }}>
          <CountUp value={total} testId="game-total" duration={0.6} />
        </span>
      </div>

      <motion.div 
        className="tiles-container"
        variants={containerVariants}
        // Force re-animation when currentHand references change (by mapping IDs, though hand is stable within 1 round)
        key={currentHand.map(t => t.id).join('-')}
        initial="hidden"
        animate="show"
      >
        {currentHand.map((tile) => (
          <motion.div key={tile.id} className="tile-slot" style={{ width: 72, height: 100, position: 'relative' }} variants={tileVariants}>
            <TileFaceUI tile={tile} />
            <AnimatePresence>
              {popovers[tile.id] && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.5 }}
                  animate={{ opacity: 1, y: -20, scale: 1 }}
                  exit={{ opacity: 0, y: -40 }}
                  className={`popover ${popovers[tile.id].delta > 0 ? 'win' : 'lose'}`}
                  style={{ position: 'absolute', top: -10, right: -10, fontSize: '1.2rem', fontWeight: 'bold', zIndex: 10, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                >
                  {popovers[tile.id].delta > 0 ? '+1' : '-1'}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>

      <div className="bet-actions">
        <motion.div animate={{ opacity: (isResolving || isGameOver) && selectedBet !== 'higher' ? 0.3 : 1 }}>
          <Button 
            variant="bet-higher" 
            onClick={() => handleBet('higher')}
            disabled={isResolving || isGameOver}
            data-testid="bet-higher"
            style={{ filter: selectedBet === 'higher' ? 'brightness(1.2)' : 'none' }}
          >
            BET HIGHER
          </Button>
        </motion.div>
        
        <motion.div animate={{ opacity: (isResolving || isGameOver) && selectedBet !== 'lower' ? 0.3 : 1 }}>
          <Button 
            variant="bet-lower" 
            onClick={() => handleBet('lower')}
            disabled={isResolving || isGameOver}
            data-testid="bet-lower"
            style={{ filter: selectedBet === 'lower' ? 'brightness(1.2)' : 'none' }}
          >
            BET LOWER
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
