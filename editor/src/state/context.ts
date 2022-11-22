/**
 * Electromatic - Web Editor
 * 
 * Copyright 2022 Chris Pikul. Licensed under GNU General Public License 3.0.
 * -----------------------------------------------------------------------------
 * 
 * Application wide state management
 */
import { createContext, useContext } from 'react';

import DefaultAppState from './default';
import type { AppState, AppStateAction, AppStateDispatcher } from './types';

export const AppContext = createContext<AppState|null>(null);
export function useAppState():AppState {
    return useContext(AppContext) ?? DefaultAppState;
}

export const AppDispatchContext = createContext<AppStateDispatcher|null>(null);
const deadDispatcher:AppStateDispatcher = (action:AppStateAction) => console.error(`Application state dispatcher was not ready for action`, action);
export function useAppStateDispatch():AppStateDispatcher {
    return useContext(AppDispatchContext) ?? deadDispatcher;
}

export function useApplicationState():[AppState, AppStateDispatcher] {
    const state = useAppState();
    const dispatch = useAppStateDispatch();

    return [ state, dispatch ];
}
export default useApplicationState;
