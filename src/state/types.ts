import type { GameState } from './reducer';
import type { GameAction } from './actions';

export interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}
