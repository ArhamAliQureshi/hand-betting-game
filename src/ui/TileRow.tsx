import { motion, AnimatePresence } from 'framer-motion';
import { listContainerVariants } from './motion';
import type { TileDefinition } from '../engine';
import { Tile } from './Tile';
import './TileRow.css';

interface TileRowProps {
  tiles: TileDefinition[];
  dynamicValues?: Map<string, number>;
  size?: 'normal' | 'small';
  animateInitial?: boolean; // New prop to control entry animation
}

export const TileRow: React.FC<TileRowProps> = ({ tiles, dynamicValues, size = 'normal', animateInitial = true }) => {
  return (
    <motion.div 
      className={`tile-row tile-row-${size}`}
      variants={listContainerVariants}
      initial={animateInitial ? "hidden" : false}
      animate="show"
      exit="exit"
    >
      <AnimatePresence mode="popLayout">
        {tiles.map((tile) => (
          <Tile 
            key={tile.id} 
            tile={tile} 
            currentDynamicValue={dynamicValues?.get(tile.id)}
            size={size}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
