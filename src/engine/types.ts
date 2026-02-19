export type Suit = 'Wan' | 'Sou' | 'Pin' | 'Wind' | 'Dragon';

export type TileFace =
  | 'Wan1' | 'Wan2' | 'Wan3' | 'Wan4' | 'Wan5' | 'Wan6' | 'Wan7' | 'Wan8' | 'Wan9'
  | 'Sou1' | 'Sou2' | 'Sou3' | 'Sou4' | 'Sou5' | 'Sou6' | 'Sou7' | 'Sou8' | 'Sou9'
  | 'Pin1' | 'Pin2' | 'Pin3' | 'Pin4' | 'Pin5' | 'Pin6' | 'Pin7' | 'Pin8' | 'Pin9'
  | 'East' | 'South' | 'West' | 'North'
  | 'Red' | 'Green' | 'White';

export interface Tile {
  id: string; // Unique tileId that never changes
  face: TileFace;
  suit: Suit;
  baseValue: number;
  isDynamic: boolean;
  currentValue: number;
}

export type BetChoice = 'higher' | 'lower';
export type BetOutcome = 'win' | 'lose';

export interface GameSnapshot {
  round: number;
  hand: Tile[];
  total: number;
  betChoice?: BetChoice;
  outcome?: BetOutcome;
}

export interface GameEngineState {
  drawPile: Tile[];
  discardPile: Tile[];
  currentHand: Tile[];
  score: number;
  drawExhaustionCount: number;
  isGameOver: boolean;
  history: GameSnapshot[];
}
