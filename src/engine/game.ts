import { Tile, GameEngineState, GameSnapshot, BetChoice, BetOutcome } from './types';
import { createFreshDeck, shuffle } from './tiles';

export function calculateTotal(hand: Tile[]): number {
  return hand.reduce((sum, tile) => sum + tile.currentValue, 0);
}

export function createInitialState(): GameEngineState {
  const deck = shuffle(createFreshDeck());
  const initialHand = deck.splice(0, 4);

  return {
    drawPile: deck,
    discardPile: [],
    currentHand: initialHand,
    score: 0,
    drawExhaustionCount: 0,
    isGameOver: false,
    history: [],
  };
}

function drawTiles(state: GameEngineState, count: number): { drawn: Tile[]; newState: GameEngineState } {
  const drawn: Tile[] = [];
  const newState = {
    ...state,
    drawPile: [...state.drawPile],
    discardPile: [...state.discardPile],
  };

  while (drawn.length < count) {
    if (newState.drawPile.length === 0) {
      // Reshuffle procedure
      const freshDeck = createFreshDeck();
      newState.drawPile = shuffle([...freshDeck, ...newState.discardPile]);
      newState.discardPile = [];
      newState.drawExhaustionCount += 1;
    }

    const tile = newState.drawPile.pop();
    if (tile) {
      drawn.push(tile);
    }
  }

  return { drawn, newState };
}

export function resolveBet(state: GameEngineState, bet: BetChoice): GameEngineState {
  if (state.isGameOver) {
    return state;
  }

  const currentTotal = calculateTotal(state.currentHand);
  
  // 1. Snapshot the old hand for history (deep copy to make it immutable)
  const historySnapshot: GameSnapshot = {
    round: state.history.length + 1,
    hand: state.currentHand.map((t) => ({ ...t })),
    total: currentTotal,
    betChoice: bet,
  };

  // 2. Put old hand into discard pile
  let nextState = {
    ...state,
    discardPile: [...state.discardPile, ...state.currentHand],
    history: [...state.history], // We will push the snapshot later
  };

  // 3. Draw new hand
  const drawResult = drawTiles(nextState, 4);
  nextState = drawResult.newState;
  nextState.currentHand = drawResult.drawn;

  // 4. Calculate new hand total
  const newTotal = calculateTotal(nextState.currentHand);

  // 5. Determine outcome
  let outcome: BetOutcome = 'lose';
  if (bet === 'higher' && newTotal > currentTotal) {
    outcome = 'win';
  } else if (bet === 'lower' && newTotal < currentTotal) {
    outcome = 'win';
  }

  historySnapshot.outcome = outcome;
  nextState.history.push(historySnapshot);

  // 6. Update score
  if (outcome === 'win') {
    nextState.score += 1;
  }

  // 7. Apply dynamic value updates (+1 win, -1 lose) to new current hand honors
  nextState.currentHand = nextState.currentHand.map((tile) => {
    if (tile.isDynamic) {
      const delta = outcome === 'win' ? 1 : -1;
      return { ...tile, currentValue: tile.currentValue + delta };
    }
    return tile;
  });

  // 8. Check game over conditions
  //  a. Check if any dynamic tile in current hand hit 0 or 10
  const hitValueLimit = nextState.currentHand.some((tile) => tile.isDynamic && (tile.currentValue <= 0 || tile.currentValue >= 10));
  
  //  b. Check if exhaustion reached 3
  const hitExhaustionLimit = nextState.drawExhaustionCount >= 3;

  if (hitValueLimit || hitExhaustionLimit) {
    nextState.isGameOver = true;
  }

  return nextState;
}
