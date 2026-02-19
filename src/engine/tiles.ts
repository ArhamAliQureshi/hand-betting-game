import type { TileDefinition, TileId } from './types';

export const HAND_SIZE = 4;

export const SUITS = ['bamboo', 'character', 'circle'] as const;
export const DRAGONS = ['red', 'green', 'white'] as const;
export const WINDS = ['east', 'south', 'west', 'north'] as const;

/**
 * Creates a standard set of Mahjong tiles for the game.
 * - Numbers: 1-9 in 3 suits (Value = face value)
 * - Dragons: Red, Green, White (Value = 5)
 * - Winds: East, South, West, North (Value = 5)
 */
export const createDeck = (): TileDefinition[] => {
  const tiles: TileDefinition[] = [];
  let idCounter = 0;
  const generateId = (): TileId => `tile-${++idCounter}`;

  // 1. Number Tiles (1-9 per suit)
  SUITS.forEach((suit) => {
    for (let face = 1; face <= 9; face++) {
      tiles.push({
        id: generateId(),
        kind: 'number',
        suit,
        face,
        baseValue: face,
      });
    }
  });

  // 2. Dragon Tiles
  DRAGONS.forEach((dragon) => {
    tiles.push({
      id: generateId(),
      kind: 'dragon',
      face: dragon,
      baseValue: 5,
    });
  });

  // 3. Wind Tiles
  WINDS.forEach((wind) => {
    tiles.push({
      id: generateId(),
      kind: 'wind',
      face: wind,
      baseValue: 5,
    });
  });

  return tiles;
};
