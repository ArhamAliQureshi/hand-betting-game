import type {
  TileDefinition,
  TileId,
  Outcome,
  BetDirection,
  GameOverResult,
} from './types';

/**
 * Resolves the bet based on current total and next total.
 * Tie is a Loss by default per PRD.
 */
export const resolveBet = (
  currentTotal: number,
  nextTotal: number,
  bet: BetDirection
): Outcome => {
  if (bet === 'higher') {
    return nextTotal > currentTotal ? 'win' : 'lose';
  } else {
    // bet === 'lower'
    return nextTotal < currentTotal ? 'win' : 'lose';
  }
};

/**
 * Updates dynamic values for Dragons and Winds based on outcome.
 * - Win: +1
 * - Lose: -1
 * - Number tiles: Unchanged
 *
 * Returns a new Map (immutable update).
 */
export const updateDynamicValues = (
  handTiles: TileDefinition[],
  outcome: Outcome,
  currentMap: Map<TileId, number>
): Map<TileId, number> => {
  const newMap = new Map(currentMap);

  handTiles.forEach((tile) => {
    if (tile.kind === 'dragon' || tile.kind === 'wind') {
      const currentValue = newMap.get(tile.id) ?? tile.baseValue;
      let newValue = currentValue;

      if (outcome === 'win') {
        newValue += 1;
      } else {
        newValue -= 1;
      }

      newMap.set(tile.id, newValue);
    }
  });

  return newMap;
};

/**
 * Checks for Game Over conditions:
 * 1. Any single tile value reaches 0.
 * 2. Any single tile value reaches 10.
 * 3. 3rd Draw Pile exhaustion (checked in deck.ts, but can be passed here if needed).
 *
 * This function only checks value bounds.
 */
export const checkGameOver = (
  dynamicValues: Map<TileId, number>,
  reshuffleCount: number
): GameOverResult => {
  // Check Reshuffle Count first definition?
  // PRD: "Game ends when ... The Draw Pile runs out of tiles for the 3rd time"
  // This is handled in `deck.ts` reshuffle return, but also here for state checks.
  if (reshuffleCount >= 3) {
    return { isGameOver: true, reason: 'thirdExhaustion' };
  }

  for (const value of dynamicValues.values()) {
    if (value <= 0) {
      return { isGameOver: true, reason: 'tileValueMin' };
    }
    if (value >= 10) {
      return { isGameOver: true, reason: 'tileValueMax' };
    }
  }

  return { isGameOver: false };
};
