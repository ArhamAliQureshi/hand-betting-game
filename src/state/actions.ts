export type GameAction =
  | { type: 'INIT_GAME' }
  | { type: 'BET_HIGHER' }
  | { type: 'BET_LOWER' }
  | { type: 'EXIT_TO_LANDING' };
