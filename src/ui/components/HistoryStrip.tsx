import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../../state/Store';
import { TileFaceUI } from '../tiles/TileFace';
import './HistoryStrip.css';

export const HistoryStrip: React.FC = () => {
  const { engineState } = useGameState();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [engineState?.history.length]);

  if (!engineState) return null;

  return (
    <div className="panel history-panel">
      <h2>History</h2>
      <div className="history-scroll" ref={scrollRef} data-testid="history-strip">
        <AnimatePresence initial={false}>
          {engineState.history.length === 0 ? (
            <p className="history-empty">No history yet.</p>
          ) : (
            engineState.history.map((snapshot, index) => {
              const isNewest = index === engineState.history.length - 1;
              return (
                <motion.div 
                  key={snapshot.round} 
                  className={`history-item ${snapshot.outcome}`}
                  initial={{ opacity: 0, x: -50, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0, 
                    scale: 1,
                    boxShadow: isNewest ? '0 0 15px var(--glow-gold)' : 'none' 
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                >
              <div className="history-tiles">
                {snapshot.hand.map((tile, i) => (
                   <TileFaceUI key={`${tile.id}-${i}`} tile={tile} size="small" />
                ))}
              </div>
              <div className="history-footer">
                <span className="history-total">{snapshot.total}</span>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
