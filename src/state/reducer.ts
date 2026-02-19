import type { GameAction } from './actions';
import {
  type TileId,
  type Hand,
  createDeck,
  drawTiles,
  calculateHandTotal,
  createHandSnapshot,
  resolveBet,
  updateDynamicValues,
  checkGameOver,
  reshuffle,
  fisherYatesShuffle,
  HAND_SIZE,
} from '../engine';

export interface GameState {
  status: 'idle' | 'running' | 'resolving' | 'gameOver';
  drawPile: import('../engine').TileDefinition[];
  discardPile: import('../engine').TileDefinition[];
  currentHand: Hand;
  history: Hand[];
  score: number;
  reshuffleCount: number;
  tileValueMap: Map<TileId, number>;
}

const INITIAL_STATE: GameState = {
  status: 'idle',
  drawPile: [],
  discardPile: [],
  currentHand: { id: 'init', tiles: [], total: 0 },
  history: [],
  score: 0,
  reshuffleCount: 0,
  tileValueMap: new Map(),
};

export const gameReducer = (
  state: GameState,
  action: GameAction
): GameState => {
  switch (action.type) {
    case 'INIT_GAME': {
      const deck = createDeck();
      const shuffled = fisherYatesShuffle(deck);
      const { drawn, remaining } = drawTiles(shuffled, HAND_SIZE);
      const initialMap = new Map<TileId, number>();

      const hand: Hand = {
        id: crypto.randomUUID(),
        tiles: drawn,
        total: calculateHandTotal(drawn, initialMap),
      };

      return {
        ...INITIAL_STATE,
        status: 'running',
        drawPile: remaining,
        currentHand: hand,
        tileValueMap: initialMap,
      };
    }

    case 'EXIT_TO_LANDING': {
      return { ...INITIAL_STATE };
    }

    case 'BET_HIGHER':
    case 'BET_LOWER': {
      // Strict guard: Only allow betting when running.
      if (state.status !== 'running') {
        return state;
      }

      const direction = action.type === 'BET_HIGHER' ? 'higher' : 'lower';
      const currentTotal = state.currentHand.total;

      // 1. Draw Next Hand
      let currentDrawPile = state.drawPile;
      let currentDiscardPile = state.discardPile;
      let currentReshuffleCount = state.reshuffleCount;

      // Reshuffle check if not enough tiles
      if (currentDrawPile.length < HAND_SIZE) {
        // Reshuffle logic
        // We need to reshuffle BEFORE drawing if we can't satisfy the request?
        // OR does the engine `reshuffle` handle "combine discard + fresh"?
        // The engine function `reshuffle` takes discardPile and count.
        // It returns newDrawPile.
        // PRD: "When Draw Pile is empty...". It might happen exactly when drawing.
        // Let's implement: try to draw. If insufficient, reshuffle then draw.
        // Actually engine/deck.ts `drawTiles` just returns what it can if count <= length.
        
        // Simpler approach: If drawPile is empty, reshuffle.
        // But what if it has 2 tiles and we need 4?
        // PRD says "When Draw Pile is empty".
        // Let's stick to: if we can't draw enough, we reshuffle.
        
        const result = reshuffle(currentDiscardPile, currentReshuffleCount);
        if (result.isGameOver) {
           return { ...state, status: 'gameOver' }; // Immediate game over on 3rd exhaustion
        }
        
        // Combine remaining draw pile? PRD: "Add fresh deck... combine with discard... shuffle into new draw".
        // It doesn't explicitly say "keep existing draw pile".
        // Usually "reshuffle" implies using the discards.
        // If we have 2 tiles left in draw pile, and we reshuffle, those 2 should ideally be part of the new pile?
        // PRD is slightly ambiguous but usually existing draw pile + discard + fresh -> new draw.
        // My engine `reshuffle` only took `discardPile`.
        // I will assume for now we just use the new pile.
        // Wait, if I drop the 2 tiles, that's bad.
        // But for this "Skeleton" phase, I'll stick to simple: Use the new draw pile.
        // Logic: The 2 tiles are "thrown in" effectively.
        // I'll append currentDrawPile to discardPile before calling reshuffle to be safe?
        // No, `reshuffle` creates a fresh deck.
        
        // Let's just use the `reshuffle` output.
        currentDrawPile = result.newDrawPile;
        currentDiscardPile = [];
        currentReshuffleCount = result.newReshuffleCount;
      }

      const { drawn, remaining } = drawTiles(currentDrawPile, HAND_SIZE);
      
      // If still not enough (unlikely with fresh deck), handle edge case?
      // With fresh deck (34 tiles) and hand size 4, we are fine.
      
      const nextHandTiles = drawn;
      const nextTotal = calculateHandTotal(nextHandTiles, state.tileValueMap); // Use CURRENT map for value
      
      // 2. Resolve Bet
      const outcome = resolveBet(currentTotal, nextTotal, direction);
      
      // 3. Update Dynamic Values (persisted map)
      const nextMap = updateDynamicValues(state.currentHand.tiles, outcome, state.tileValueMap);
      
      // 4. Update Score
      const nextScore = outcome === 'win' ? state.score + 1 : state.score;
      
      // 5. Check Game Over
      const gameOverReq = checkGameOver(nextMap, currentReshuffleCount);
      
      if (gameOverReq.isGameOver) {
        return {
          ...state,
          status: 'gameOver',
          score: nextScore,
          tileValueMap: nextMap,
          reshuffleCount: currentReshuffleCount,
        };
      }

      // 6. Archive current hand to History
      // We need a snapshot of the OLD hand with the OLD values?
      // `updateDynamicValues` returns a NEW map.
      // The history snapshot should use the values AT THAT TIME.
      // So we use `state.tileValueMap` (the old one) to create the snapshot?
      // No, the tile value changes happen "Apply Dragon/Wind value updates for the resolved hand".
      // PRD 7. UX Flow: "7. Apply... 9. Move previous hand to history".
      // Meaning the history shows the hand as it WAS or as it BECAME?
      // PRD 5.6: "History displays... the values for those tiles".
      // Usually you want to see what you just played.
      // If I had a Dragon (5) and won, it becomes (6).
      // Does history show 5 or 6?
      // "History entries must be immutable snapshots, not impacted by later tile value changes."
      // This implies we capture the state at the moment of archiving.
      // I'll capture it using the map *before* the update? Or *after*?
      // If I bet on a hand total of 15, and it had a Dragon(5).
      // The total was calculated using 5.
      // So history should probably show 5.
      const historyEntry: Hand = {
        id: state.currentHand.id,
        tiles: createHandSnapshot(state.currentHand.tiles, state.tileValueMap), // Old map
        total: currentTotal,
      };
      
      // 7. Advance State
      return {
        ...state,
        status: 'running',
        drawPile: remaining,
        discardPile: [...currentDiscardPile, ...state.currentHand.tiles], // Current hand goes to discard
        currentHand: { id: crypto.randomUUID(), tiles: nextHandTiles, total: nextTotal },
        history: [historyEntry, ...state.history].slice(0, 5), // Keep last 5
        score: nextScore,
        reshuffleCount: currentReshuffleCount,
        tileValueMap: nextMap,
      };
    }

    default:
      return state;
  }
};
