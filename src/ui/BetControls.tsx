import React from 'react';
import { motion } from 'framer-motion';
import { buttonTap, buttonHover } from './motion';
import type { GameAction } from '../state/actions';
import './BetControls.css';

interface BetControlsProps {
  dispatch: React.Dispatch<GameAction>;
  disabled: boolean;
}

export const BetControls: React.FC<BetControlsProps> = ({ dispatch, disabled }) => {
  return (
    <div className="bet-controls">
      <motion.button 
        className="btn-bet btn-higher"
        onClick={() => dispatch({ type: 'BET_HIGHER' })}
        disabled={disabled}
        whileTap={!disabled ? buttonTap : undefined}
        whileHover={!disabled ? buttonHover : undefined}
      >
        Bet Higher ▲
      </motion.button>
      <motion.button 
        className="btn-bet btn-lower"
        onClick={() => dispatch({ type: 'BET_LOWER' })}
        disabled={disabled}
        whileTap={!disabled ? buttonTap : undefined}
        whileHover={!disabled ? buttonHover : undefined}
      >
        Bet Lower ▼
      </motion.button>
    </div>
  );
};
