import { GameEngineState, BetChoice } from '../engine/types';
import { createInitialState, resolveBet } from '../engine/game';
import { addLeaderboardEntry } from '../storage/leaderboard';

export type GameStatus = 'idle' | 'playing' | 'resolving' | 'gameOver';

export interface AppGameState {
  engineState: GameEngineState | null;
  status: GameStatus;
  playerName: string;
  gameSessionId: string;
}

export type Action =
  | { type: 'INIT_GAME'; payload: { playerName: string } }
  | { type: 'PLACE_BET'; payload: { bet: BetChoice } }
  | { type: 'RESOLVE_ROUND_COMPLETE' }
  | { type: 'QUIT_GAME' };

export const initialAppState: AppGameState = {
  engineState: null,
  status: 'idle',
  playerName: '',
  gameSessionId: '',
};

export function gameReducer(state: AppGameState, action: Action): AppGameState {
  switch (action.type) {
    case 'INIT_GAME':
      return {
        ...state,
        engineState: createInitialState(),
        status: 'playing',
        playerName: action.payload.playerName,
        gameSessionId: crypto.randomUUID(),
      };

    case 'PLACE_BET':
      if (state.status !== 'playing' || !state.engineState) return state;
      
      return {
        ...state,
        status: 'resolving',
        engineState: resolveBet(state.engineState, action.payload.bet),
      };

    case 'RESOLVE_ROUND_COMPLETE':
      if (state.status !== 'resolving' || !state.engineState) return state;
      
      const isGameOver = state.engineState.isGameOver;

      // Save to leaderboard exactly once when transitioning to game over
      if (isGameOver) {
        addLeaderboardEntry({
          name: state.playerName,
          score: state.engineState.score,
          ts: Date.now(),
          gameSessionId: state.gameSessionId,
        });
      }

      return {
        ...state,
        status: isGameOver ? 'gameOver' : 'playing',
      };

    case 'QUIT_GAME':
      return {
        ...state,
        engineState: null,
        status: 'idle',
        playerName: '',
        gameSessionId: '',
      };

    default:
      return state;
  }
}
