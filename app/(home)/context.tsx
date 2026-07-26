'use client';

import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import {
  initialState,
  reducer,
  type HomePageEvent,
  type HomePageState,
} from './reducer';

export interface HomePageContextValue {
  state: HomePageState;
  dispatch: Dispatch<HomePageEvent>;
}

export const HomePageContext = createContext<HomePageContextValue | undefined>(
  undefined
);

export function HomePageProvider({ children }: { children: ReactNode }) {
  // entities
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <HomePageContext.Provider value={{ state, dispatch }}>
      {children}
    </HomePageContext.Provider>
  );
}

export function useHomePageContext(): HomePageContextValue {
  const context = useContext(HomePageContext);
  if (!context) {
    throw new Error(
      'useHomePageContext must be used within a HomePageProvider'
    );
  }
  return context;
}
