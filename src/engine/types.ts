/**
 * Engine Type Definitions
 * Source of truth for domain models.
 */

// Basic Tile Types
export type TileKind = 'number' | 'dragon' | 'wind';

export type Suit = 'bamboo' | 'character' | 'circle';
export type DragonColor = 'red' | 'green' | 'white';
export type WindDirection = 'east' | 'south' | 'west' | 'north';

export type TileId = string;

export interface TileDefinition {
  id: TileId;
  kind: TileKind;
  face: number | DragonColor | WindDirection;
  suit?: Suit; // Only for number tiles
  baseValue: number;
}

// Immutable Snapshot for History
// Immutable Snapshot for History
export interface TileSnapshot {
  id: TileId; // Renamed from tileId for compatibility
  kind: TileKind;
  face: number | DragonColor | WindDirection;
  suit?: Suit;
  baseValue: number; // Added for compatibility
  valueAtThatTime: number;
}

export interface Hand {
  id: string;
  tiles: TileDefinition[];
  total: number;
}

// Betting
export type BetDirection = 'higher' | 'lower';
export type Outcome = 'win' | 'lose';

// Game Over
export type GameOverReason = 'tileValueMin' | 'tileValueMax' | 'thirdExhaustion';

export interface GameOverResult {
  isGameOver: boolean;
  reason?: GameOverReason;
}
