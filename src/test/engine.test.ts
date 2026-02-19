import { describe, it, expect } from 'vitest';
import { createFreshDeck, shuffle, HONOR_STARTING_VALUE } from '../engine/tiles';
import { calculateTotal, createInitialState, resolveBet } from '../engine/game';
import { Tile, GameEngineState } from '../engine/types';

describe('Game Engine', () => {
  it('should initialize game state correctly', () => {
    const state = createInitialState();
    expect(state.drawPile.length).toBe(createFreshDeck().length - 4);
    expect(state.currentHand.length).toBe(4);
    expect(state.score).toBe(0);
    expect(state.history.length).toBe(0);
    expect(state.isGameOver).toBe(false);
  });

  it('numeric tiles should not change on update, but dynamic ones should', () => {
    let state = createInitialState();
    
    // Force currentHand to have 1 numeric and 1 wind
    state.currentHand = [
      { id: '1', face: 'Wan1', suit: 'Wan', baseValue: 1, isDynamic: false, currentValue: 1 },
      { id: '2', face: 'East', suit: 'Wind', baseValue: 5, isDynamic: true, currentValue: 5 },
      { id: '3', face: 'Wan2', suit: 'Wan', baseValue: 2, isDynamic: false, currentValue: 2 },
      { id: '4', face: 'Wan3', suit: 'Wan', baseValue: 3, isDynamic: false, currentValue: 3 },
    ];
    
    // Force draw pile to give a lower hand
    state.drawPile = [
      { id: '5', face: 'Wan1', suit: 'Wan', baseValue: 1, isDynamic: false, currentValue: 1 },
      { id: '6', face: 'Wan1', suit: 'Wan', baseValue: 1, isDynamic: false, currentValue: 1 },
      { id: '7', face: 'Wan1', suit: 'Wan', baseValue: 1, isDynamic: false, currentValue: 1 },
      { id: '8', face: 'Wan1', suit: 'Wan', baseValue: 1, isDynamic: false, currentValue: 1 },
    ];
    
    // total is 11, bet lower, next is 4 -> win
    const nextState = resolveBet(state, 'lower');
    expect(nextState.history[0].outcome).toBe('win');
    expect(nextState.score).toBe(1);

    // The currentHand was replaced by the 4 Wan1 tiles.
    // Let's check those dynamic tiles that updated. They updated +1 but the new hand was all numeric so nothing changes.
    expect(nextState.currentHand[0].currentValue).toBe(1);
    
    // To test dynamic values, we need the new draw pile to contain a Wind:
    state.drawPile = [
      { id: '5', face: 'Wan1', suit: 'Wan', baseValue: 1, isDynamic: false, currentValue: 1 },
      { id: '6', face: 'Wan1', suit: 'Wan', baseValue: 1, isDynamic: false, currentValue: 1 },
      { id: '7', face: 'Wan1', suit: 'Wan', baseValue: 1, isDynamic: false, currentValue: 1 },
      { id: '8', face: 'East', suit: 'Wind', baseValue: 5, isDynamic: true, currentValue: 5 },
    ];
    const nextState2 = resolveBet(state, 'lower');
    // total 11, next hand total is 1+1+1+5 = 8. Outcome 'win'.
    // The newly drawn wind tile should become 6.
    const windTile = nextState2.currentHand.find(t => t.isDynamic);
    expect(windTile?.currentValue).toBe(6);
  });

  it('tie resolves as a loss', () => {
    let state = createInitialState();
    state.currentHand = [
      { id: '1', face: 'Wan2', suit: 'Wan', baseValue: 2, isDynamic: false, currentValue: 2 },
      { id: '2', face: 'Wan2', suit: 'Wan', baseValue: 2, isDynamic: false, currentValue: 2 },
      { id: '3', face: 'Wan2', suit: 'Wan', baseValue: 2, isDynamic: false, currentValue: 2 },
      { id: '4', face: 'Wan2', suit: 'Wan', baseValue: 2, isDynamic: false, currentValue: 2 },
    ];
    state.drawPile = [
      { id: '5', face: 'Wan2', suit: 'Wan', baseValue: 2, isDynamic: false, currentValue: 2 },
      { id: '6', face: 'Wan2', suit: 'Wan', baseValue: 2, isDynamic: false, currentValue: 2 },
      { id: '7', face: 'Wan2', suit: 'Wan', baseValue: 2, isDynamic: false, currentValue: 2 },
      { id: '8', face: 'Wan2', suit: 'Wan', baseValue: 2, isDynamic: false, currentValue: 2 },
    ];
    
    const nextState = resolveBet(state, 'higher'); // bet higher, tie -> lose
    expect(nextState.history[0].outcome).toBe('lose');
    expect(nextState.score).toBe(0);
  });

  it('triggers game over when dynamic value hits 10 or 0', () => {
    let state = createInitialState();
    // Force hand total to be high (e.g. 9*4 = 36)
    state.currentHand = [
      { id: '1', face: 'Wan9', suit: 'Wan', baseValue: 9, isDynamic: false, currentValue: 9 },
      { id: '2', face: 'Wan9', suit: 'Wan', baseValue: 9, isDynamic: false, currentValue: 9 },
      { id: '3', face: 'Wan9', suit: 'Wan', baseValue: 9, isDynamic: false, currentValue: 9 },
      { id: '4', face: 'Wan9', suit: 'Wan', baseValue: 9, isDynamic: false, currentValue: 9 },
    ];
    // deal hand with wind, total will be 9+1+1+1 = 12
    state.drawPile = [
      { id: '5', face: 'East', suit: 'Wind', baseValue: 5, isDynamic: true, currentValue: 9 }, // already 9
      { id: '6', face: 'Wan1', suit: 'Wan', baseValue: 1, isDynamic: false, currentValue: 1 },
      { id: '7', face: 'Wan1', suit: 'Wan', baseValue: 1, isDynamic: false, currentValue: 1 },
      { id: '8', face: 'Wan1', suit: 'Wan', baseValue: 1, isDynamic: false, currentValue: 1 },
    ];
    
    // bet lower. current is 36, next is 12. 12 < 36 -> win. East hits 10.
    const nextState = resolveBet(state, 'lower');
    expect(nextState.history[0].outcome).toBe('win');
    expect(nextState.currentHand.some((t) => t.isDynamic && t.currentValue === 10)).toBe(true);
    expect(nextState.isGameOver).toBe(true);

    // 0 test
    let state2 = createInitialState();
    state2.currentHand = [
      { id: '1', face: 'Wan1', suit: 'Wan', baseValue: 1, isDynamic: false, currentValue: 1 },
      { id: '2', face: 'Wan1', suit: 'Wan', baseValue: 1, isDynamic: false, currentValue: 1 },
      { id: '3', face: 'Wan1', suit: 'Wan', baseValue: 1, isDynamic: false, currentValue: 1 },
      { id: '4', face: 'Wan1', suit: 'Wan', baseValue: 1, isDynamic: false, currentValue: 1 },
    ]; // total 4
    state2.drawPile = [
      { id: '5', face: 'East', suit: 'Wind', baseValue: 5, isDynamic: true, currentValue: 1 }, // 1
      { id: '6', face: 'Wan1', suit: 'Wan', baseValue: 1, isDynamic: false, currentValue: 1 },
      { id: '7', face: 'Wan1', suit: 'Wan', baseValue: 1, isDynamic: false, currentValue: 1 },
      { id: '8', face: 'Wan1', suit: 'Wan', baseValue: 1, isDynamic: false, currentValue: 1 },
    ]; // total 4
    // tie resolves as loss, East value 1 -> 0
    const nextState3 = resolveBet(state2, 'higher');
    expect(nextState3.history[0].outcome).toBe('lose');
    expect(nextState3.isGameOver).toBe(true);
  });

  it('triggers reshuffle when draw pile is empty, increments exhaustion, and game over at 3', () => {
    let state = createInitialState();
    
    // Artificially deplete draw pile to exactly 4 items
    state.drawPile = state.drawPile.slice(0, 4);
    
    state = resolveBet(state, 'higher'); // Uses up the 4 items. drawPile is now 0.
    expect(state.drawPile.length).toBe(0);
    
    // next resolveBet will trigger reshuffle
    state = resolveBet(state, 'higher');
    expect(state.drawExhaustionCount).toBe(1);
    expect(state.drawPile.length).toBeGreaterThan(0);
    
    // Force exhaustion to 2
    state.drawExhaustionCount = 2;
    state.drawPile = state.drawPile.slice(0, 4); // deplete
    state = resolveBet(state, 'higher'); // Uses up
    state = resolveBet(state, 'higher'); // Reshuffles, count hits 3 -> Game Over
    
    expect(state.drawExhaustionCount).toBe(3);
    expect(state.isGameOver).toBe(true);
  });
});
