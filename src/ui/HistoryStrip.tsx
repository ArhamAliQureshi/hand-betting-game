import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { historyItemVariants } from './motion';
import type { Hand } from '../engine';
import { TileRow } from './TileRow';
import './HistoryStrip.css';

interface HistoryStripProps {
  history: Hand[];
}

export const HistoryStrip: React.FC<HistoryStripProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="history-card">
        <h3 className="history-title">History</h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
          No hands played yet. Make a bet!
        </p>
      </div>
    );
  }

  return (
    <div className="history-card">
      <h3 className="history-title">History</h3>
      <div className="history-strip hide-scrollbar">
        <AnimatePresence initial={false}>
          {history.map((hand) => (
            <motion.div
              key={hand.id}
              className="history-entry"
              variants={historyItemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
            >
              <div className="history-entry-tiles">
                <TileRow tiles={hand.tiles} size="small" />
              </div>
              <span className="history-entry-total">{hand.total}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
