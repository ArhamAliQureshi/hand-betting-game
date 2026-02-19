import type { TileDefinition } from './types';
import { createDeck } from './tiles';
import { fisherYatesShuffle } from './shuffle';

export interface DrawResult {
  drawn: TileDefinition[];
  remaining: TileDefinition[];
}

export interface ReshuffleResult {
  newDrawPile: TileDefinition[];
  newDiscards: TileDefinition[]; // Should be empty after reshuffle
  newReshuffleCount: number;
  isGameOver: boolean;
}

/**
 * Draws N tiles from the draw pile.
 * Returns drawn tiles and remaining pile.
 * If pile is empty, returns whatever is left.
 */
export const drawTiles = (
  drawPile: TileDefinition[],
  count: number
): DrawResult => {
  if (count <= 0) {
    return { drawn: [], remaining: drawPile };
  }

  const actualCount = Math.min(count, drawPile.length);
  const drawn = drawPile.slice(0, actualCount);
  const remaining = drawPile.slice(actualCount);

  return { drawn, remaining };
};

/**
 * Implements the Reshuffle Rule:
 * 1. Add a fresh deck worth of tiles.
 * 2. Combine with Discard Pile.
 * 3. Shuffle into a new Draw Pile.
 * 4. Increment Reshuffle Count.
 * 5. Check Game Over on 3rd exhaustion (meaning reshuffleCount becomes 3).
 */
export const reshuffle = (
  discardPile: TileDefinition[],
  currentReshuffleCount: number
): ReshuffleResult => {
  const freshDeck = createDeck();
  const multipleDecks = [...discardPile, ...freshDeck];
  const newDrawPile = fisherYatesShuffle(multipleDecks);
  const newReshuffleCount = currentReshuffleCount + 1;

  // Game Over on 3rd exhaustion means we are about to start the 4th cycle?
  // PRD says: "The Draw Pile runs out of tiles for the 3rd time".
  // This means when we hit 0 tiles and trigger this reshuffle, it is the 1st, 2nd, or 3rd time.
  // If it's the 3rd time we run out, the game ends.
  // So if currentReshuffleCount was 2, and we act now, we're hitting the 3rd exhaustion.
  const isGameOver = newReshuffleCount >= 3;

  return {
    newDrawPile,
    newDiscards: [], // Discards are now in the draw pile
    newReshuffleCount,
    isGameOver,
  };
};
