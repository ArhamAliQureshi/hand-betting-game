import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import { gameReducer, type GameState } from './reducer'; // GameState needed for type assertion 
// Actually I need GameContextType from types.ts.
import type { GameContextType } from './types';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => {
    // Initial state matching the reducer's type expectation logic
    // We can just call the reducer with an init action or manual default
    return gameReducer({} as GameState, { type: 'EXIT_TO_LANDING' }); 
  });

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
