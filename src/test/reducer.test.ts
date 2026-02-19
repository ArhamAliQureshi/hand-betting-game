import { describe, it, expect } from 'vitest';
import { gameReducer, initialAppState } from '../state/gameReducer';

describe('Game Reducer', () => {
  it('init game', () => {
    const state = gameReducer(initialAppState, { type: 'INIT_GAME', payload: { playerName: 'Test' } });
    expect(state.status).toBe('playing');
    expect(state.engineState).toBeDefined();
    expect(state.playerName).toBe('Test');
  });

  it('place bet locks input and resolves instantly in engine', () => {
    let state = gameReducer(initialAppState, { type: 'INIT_GAME', payload: { playerName: 'Test' } });
    state = gameReducer(state, { type: 'PLACE_BET', payload: { bet: 'higher' } });
    expect(state.status).toBe('resolving');
    expect(state.engineState?.history.length).toBe(1); // resolved

    // Try placing bet while resolving should be blocked
    const snap = state;
    state = gameReducer(state, { type: 'PLACE_BET', payload: { bet: 'lower' } });
    expect(state).toBe(snap); // no change
  });

  it('resolving completes and unlocks or ends game', () => {
    let state = gameReducer(initialAppState, { type: 'INIT_GAME', payload: { playerName: 'Test' } });
    state = gameReducer(state, { type: 'PLACE_BET', payload: { bet: 'higher' } });
    
    // complete
    state = gameReducer(state, { type: 'RESOLVE_ROUND_COMPLETE' });
    expect(['playing', 'gameOver']).toContain(state.status);
    
    // game over block
    if (state.status === 'gameOver') {
      const snap = state;
      state = gameReducer(state, { type: 'PLACE_BET', payload: { bet: 'higher' } });
      expect(state).toBe(snap);
    }
  });

  it('quit game resets state', () => {
    let state = gameReducer(initialAppState, { type: 'INIT_GAME', payload: { playerName: 'Test' } });
    state = gameReducer(state, { type: 'QUIT_GAME' });
    expect(state.status).toBe('idle');
    expect(state.engineState).toBeNull();
  });
});
