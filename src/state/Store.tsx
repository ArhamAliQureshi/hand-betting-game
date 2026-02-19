import React, { createContext, useReducer, ReactNode, useContext } from 'react';
import { AppGameState, Action, gameReducer, initialAppState } from './gameReducer';

export const GameStateContext = createContext<AppGameState>(initialAppState);
export const GameDispatchContext = createContext<React.Dispatch<Action>>(() => null);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialAppState);
  
  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
};

export const useGameState = () => useContext(GameStateContext);
export const useGameDispatch = () => useContext(GameDispatchContext);
