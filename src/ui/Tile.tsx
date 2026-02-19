import React from 'react';
import { motion } from 'framer-motion';
import { tileItemVariants } from './motion';
import type { TileKind } from '../engine';
import './Tile.css';

import { BambooGraphic, CircleGraphic, CharacterGraphic, HonorGraphic } from './TileGraphics';

interface TileProps {
  tile: {
    id: string;
    kind: TileKind;
    face: string | number;
    suit?: import('../engine').Suit; // Ensure Suit is imported or matched
    valueAtThatTime?: number;
    baseValue?: number;
  };
  currentDynamicValue?: number;
  size?: 'normal' | 'small';
}

const TileComponent: React.FC<TileProps> = ({ tile, currentDynamicValue, size = 'normal' }) => {
  const displayValue = currentDynamicValue ?? tile.valueAtThatTime ?? tile.baseValue;
  
  // Dynamic class for container
  const className = `tile tile-${size}`;

  const renderContent = () => {
    if (tile.kind === 'number') {
      const val = typeof tile.face === 'number' ? tile.face : parseInt(tile.face as string, 10);
      if (tile.suit === 'bamboo') return <BambooGraphic value={val} />;
      if (tile.suit === 'circle') return <CircleGraphic value={val} />;
      if (tile.suit === 'character') return <CharacterGraphic value={val} />;
    }
    
    if (tile.kind === 'dragon') {
      return <HonorGraphic kind="dragon" value={tile.face} />;
    }
    
    if (tile.kind === 'wind') {
      return <HonorGraphic kind="wind" value={tile.face} />;
    }

    return <span className="tile-face-text">{tile.face}</span>;
  };

  return (
    <motion.div 
      className={className}
      variants={tileItemVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      layoutId={size === 'normal' ? tile.id : undefined}
    >
      <div className="tile-content">
        {renderContent()}
      </div>
      <span className="tile-value">{displayValue}</span>
    </motion.div>
  );
};

export const Tile = React.memo(TileComponent, (prev, next) => {
  return (
    prev.tile.id === next.tile.id &&
    prev.tile.face === next.tile.face &&
    prev.currentDynamicValue === next.currentDynamicValue &&
    prev.size === next.size
  );
});
