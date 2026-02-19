import { Tile, TileFace, Suit } from './types';

// Constants
export const HONOR_STARTING_VALUE = 5;

// Mahjong deck composition (1 of each per fresh deck)
// A standard Mahjong deck has 4 of each tile, but the PRD specifies
// "Add a fresh full deck worth of tiles (new tile instances with new tileIds) to the game."
// We assume 4 of each tile type like a standard Mahjong deck.
export const TILE_CATALOG: { face: TileFace; suit: Suit; baseValue: number; isDynamic: boolean }[] = [];

// Populate numeric suits
const suits: { prefix: string; suit: Suit }[] = [
  { prefix: 'Wan', suit: 'Wan' },
  { prefix: 'Sou', suit: 'Sou' },
  { prefix: 'Pin', suit: 'Pin' },
];

for (const { prefix, suit } of suits) {
  for (let i = 1; i <= 9; i++) {
    TILE_CATALOG.push({
      face: `${prefix}${i}` as TileFace,
      suit,
      baseValue: i,
      isDynamic: false,
    });
  }
}

// Populate Winds
const winds: TileFace[] = ['East', 'South', 'West', 'North'];
for (const wind of winds) {
  TILE_CATALOG.push({
    face: wind,
    suit: 'Wind',
    baseValue: HONOR_STARTING_VALUE,
    isDynamic: true,
  });
}

// Populate Dragons
const dragons: TileFace[] = ['Red', 'Green', 'White'];
for (const dragon of dragons) {
  TILE_CATALOG.push({
    face: dragon,
    suit: 'Dragon',
    baseValue: HONOR_STARTING_VALUE,
    isDynamic: true,
  });
}

let nextId = 1;

/**
 * Creates a fresh deck of 136 Mahjong tiles (4 of each of the 34 combinations)
 */
export function createFreshDeck(): Tile[] {
  const deck: Tile[] = [];
  
  // Mahjong has 4 copies of each tile
  for (let copy = 0; copy < 4; copy++) {
    for (const def of TILE_CATALOG) {
      deck.push({
        id: `tile_${nextId++}`,
        face: def.face,
        suit: def.suit,
        baseValue: def.baseValue,
        isDynamic: def.isDynamic,
        currentValue: def.baseValue,
      });
    }
  }

  return deck;
}

/**
 * Fisher-Yates shuffle algorithm (mutates in place and returns)
 */
export function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}
